/* Plovoucí ukazatel tempa — nápad klientky.

   Malý přístrojový panel, který po celou dobu prohlídky ukazuje, v jakém
   tempu se návštěvník na stránce nachází: kruhový budík s tepem, pod ním
   tři doplňkové hodnoty, a všechno se plynule přelévá, jak stránka stoupá
   od klidu k maximu a zase se ustálí.

   Proč čtyři hodnoty a ne jedna: samotné číslo tepu je hezké, ale nic
   nevysvětluje. Dech 10 proti 30 za minutu řekne o rozdílu mezi jógou
   a jumpingem víc než odstavec textu, a tepová zóna 1 proti 4 to zasadí
   do měřítka, které lidé znají z hodinek.

   ⚠️ Panel se čtyřmi čísly a kruhovým budíkem vypadá jako měření. Není.
   Jsou to orientační hodnoty typické pro daný typ lekce. Proto to stojí
   i viditelně pod panelem, ne jen ve skryté větě pro čtečky — a proto tu
   není `aria-live`: hodnoty se mění desítkykrát za scroll a čtečka by
   mluvila přes všechno ostatní.

   ⚠️ Do 1280 px je z panelu vodorovný proužek u spodní hrany. Ten je
   z principu přes obsah, takže platí dvě pravidla: musí být co nejnižší
   (proto v něm není budík ani tlačítko) a musí si dole vyhradit místo,
   aby na konci stránky nic nezakrýval — viz reserveBottomSpace().

   ⚠️ Proužek je v CSS ZÁKLADNÍ podoba a panel ji přebíjí až od 1280 px.
   Není to detail zápisu: dokud to bylo naopak, dostal telefon, který
   `@media (width < N)` neumí, panel 168×436 px přes obsah. Viz invariant
   na začátku css/layout.css.

   Tři věci, které z toho dělají přístroj a ne hračku:

   1. Hodnoty se interpolují mezi zónami podle scrollu, neskáčou po
      sekcích. Skokové přepnutí čte jako přepínač, plynulý přechod jako tep.
   2. Pulz i naplnění budíku běží z CSS — animace s délkou
      `calc(60s / var(--hrm-bpm))` a `transition` na `stroke-dashoffset`.
      Žádné kreslení po snímcích, scroll o to nezakopne.
   3. Grafika je `aria-hidden`, čísla jsou skutečný text. */

import { el, $ } from "../lib/dom.js";
import { ZONES, REST_ZONE } from "../data/zones.js";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;

/* Rozsah, na který se mapuje naplnění budíku. Nezačíná na nule: prstenec
   prázdný na většině obvodu už při nejklidnější lekci vypadá jako porucha. */
const GAUGE_MIN = 60;
const GAUGE_MAX = 180;

/* Odstup proužku od spodní hrany, tedy `--space-3` v tokenech. Vejde se
   do rezervovaného místa, aby obsah pod proužkem nekončil přesně na jeho
   horní hraně — viz reserveBottomSpace(). */
const STRIP_GAP = 12;

/** Které hodnoty se interpolují. */
export const METRICS = ["bpm", "hrZone", "breaths", "effort"];

/* Disclaimer platí vždy. Věta o změně jen tam, kde se ukazatel opravdu
   mění — stránka bez zón (kontakt, o mně) by jinak tvrdila něco, co se
   na ní nedá vyzkoušet. */
const DISCLAIMER = "Orientační hodnoty pro tento typ lekce, ne vaše měření.";
const SCROLL_HINT =
  "Mění se podle toho, kde na stránce jste — od klidné jógy k tréninkům.";

/**
 * Čistá část výpočtu, oddělená od DOMu, aby se dala otestovat bez
 * prohlížeče — headless Chrome pod `--virtual-time-budget` na fragment
 * v URL neskáče, takže scroll se v něm ověřit nedá, matematika ano.
 *
 * @param {number[]} offsets  vzdálenost středu každé zóny od středu
 *                            obrazovky; klesá, jak se scrolluje dolů
 *                            (nad středem záporná, pod ním kladná)
 * @param {object[]} zones    zóny ve stejném pořadí jako offsets
 * @returns {{values:Record<string,number>, index:number}}
 *          index je zóna, ke které jsme blíž
 */
export function zoneStateAt(offsets, zones) {
  const pick = (i) => ({
    values: Object.fromEntries(METRICS.map((key) => [key, zones[i][key]])),
    index: i,
  });

  if (offsets.length === 0) return { values: {}, index: 0 };
  if (offsets.length === 1) return pick(0);

  const last = offsets.length - 1;
  // Ještě nad první zónou, nebo už pod poslední — drží se krajní hodnoty.
  if (offsets[0] >= 0) return pick(0);
  if (offsets[last] <= 0) return pick(last);

  // Poslední minutá zastávka a první, která teprve přijde.
  let i = 0;
  while (i < last - 1 && offsets[i + 1] <= 0) i += 1;

  const passed = offsets[i]; // ≤ 0, kus cesty za námi
  const ahead = offsets[i + 1]; // > 0, kus cesty před námi
  const total = ahead - passed;
  const t = total === 0 ? 0 : clamp(-passed / total, 0, 1);

  return {
    values: Object.fromEntries(
      METRICS.map((key) => [key, lerp(zones[i][key], zones[i + 1][key], t)])
    ),
    // Popisek patří té zóně, ke které jsme blíž — půl cesty je předěl.
    index: t < 0.5 ? i : i + 1,
  };
}

/** Naplnění budíku 0–1 podle tepu. */
export function gaugeFill(bpm) {
  return clamp((bpm - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN), 0, 1);
}

/* Řádky pod budíkem. `format` dostane interpolovanou hodnotu, takže mezi
   zónami neukazuje nesmyslné desetiny. */
const READOUTS = [
  { key: "hrZone", label: "Tepová zóna", format: (v) => `${Math.round(v)} / 5` },
  { key: "breaths", label: "Dech", format: (v) => `${Math.round(v)}/min` },
  { key: "effort", label: "Námaha", format: (v) => `${Math.round(v)} / 10` },
];

/* pathLength="100" na <circle> znamená, že stroke-dasharray se dá psát
   rovnou v procentech obvodu a nemusí se počítat 2πr — obvod tak přežije
   změnu poloměru v CSS. */
const RING_RADIUS = 44;

function ringSvg() {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("class", "hrm__gauge");
  svg.setAttribute("aria-hidden", "true");

  for (const [cls, extra] of [
    ["hrm__gauge-track", {}],
    ["hrm__gauge-fill", { pathLength: "100", "stroke-dasharray": "100" }],
  ]) {
    const circle = document.createElementNS(NS, "circle");
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", String(RING_RADIUS));
    circle.setAttribute("class", cls);
    for (const [name, value] of Object.entries(extra)) circle.setAttribute(name, value);
    svg.append(circle);
  }
  return svg;
}

export function renderHeartRateMeter() {
  const first = ZONES[0];

  const dial = el("div", { class: "hrm__dial" }, [
    ringSvg(),
    el("span", { class: "hrm__pulse", "aria-hidden": "true" }),
    el("span", { class: "hrm__reading" }, [
      el("span", { class: "hrm__bpm", "data-hrm-bpm": "", text: String(first.bpm) }),
      el("span", { class: "hrm__bpm-unit", text: "tepů/min" }),
    ]),
  ]);

  const readouts = el(
    "dl",
    { class: "hrm__readouts" },
    READOUTS.flatMap((readout) => [
      el("dt", { text: readout.label }),
      el("dd", {
        "data-hrm-readout": readout.key,
        text: readout.format(first[readout.key]),
      }),
    ])
  );

  return el("aside", { class: "hrm", "data-hrm": "", "aria-labelledby": "hrm-title" }, [
    el("p", { class: "hrm__zone", id: "hrm-title", "data-hrm-zone": "", text: first.short }),
    dial,
    readouts,
    // Tlačítko nabízí přesně tu lekci, jejíž tempo je právě vidět, takže
    // se mění spolu se zónou. Panel jinak kliknutí nechytá (pointer-events
    // v CSS) — chytá je jen tohle tlačítko.
    el("a", {
      class: "btn btn--accent hrm__cta",
      "data-hrm-cta": "",
      href: first.cta.href,
      text: first.cta.label,
    }),
    /* Dvě věty v jednom odstavci, obě povinné:

       1. CO to je. Klientka (7. 9. 2026) chtěla popis „někde u toho, kde
          je ten tep" — dřív stál v hero na homepage, což je jediná
          stránka ze čtyř a jediná obrazovka z dvaceti, kde ho někdo
          uvidí. Panel jezdí po celém webu, takže vysvětlení patří do něj.
       2. Že to NENÍ měření návštěvníka. Viditelně, ne jen pro čtečky:
          čtyři čísla v kroužku vypadají jako přístroj a někdo by 165
          mohl číst jako svůj vlastní tep.

       Jeden odstavec, ne dva: dva bloky drobného textu pod sebou v panelu
       širokém 168 px čtou jako patička, a na mobilním proužku by si vzaly
       řádek každý. */
    el("p", { class: "hrm__note", text: `${SCROLL_HINT} ${DISCLAIMER}` }),
  ]);
}

/* Registrace kvůli calc() v animation-duration: bez @property je custom
   property jen řetězec a `calc(60s / var(--hrm-bpm))` se nevyhodnotí.
   Uvnitř init(), ne na úrovni modulu — import sám o sobě nesmí nic dělat,
   jinak se soubor nedá načíst v testu, který window nemá. */
function registerBpmProperty() {
  if (!window.CSS?.registerProperty) return;
  try {
    CSS.registerProperty({
      name: "--hrm-bpm",
      syntax: "<number>",
      inherits: true,
      initialValue: String(ZONES[0].bpm),
    });
  } catch {
    // Už zaregistrované — nevadí.
  }
}

/** Nastaví na panelu všechno, co závisí jen na zóně (ne na scrollu). */
function applyZone(meter, zone) {
  meter.dataset.zone = zone.id;
  meter.style.setProperty("--hrm-bpm", String(zone.bpm));
  $("[data-hrm-zone]", meter).textContent = zone.short;
  const cta = $("[data-hrm-cta]", meter);
  cta.textContent = zone.cta.label;
  cta.href = zone.cta.href;
  const fill = $(".hrm__gauge-fill", meter);
  fill.style.strokeDashoffset = String(100 - gaugeFill(zone.bpm) * 100);
  for (const readout of READOUTS) {
    $(`[data-hrm-readout="${readout.key}"]`, meter).textContent = readout.format(zone[readout.key]);
  }
}

/* Ukazatel v podobě proužku leží přes obsah, a místo pro sebe nikdo
   nedržel: ležel na patičce a na posledním obsahu stránky trvale, na
   každé stránce. Připomínka klientky ze 7. 9. 2026 („na mobilu zabírá
   obrazovku a nejde web proklikávat") mířila přesně sem.

   Výška se MĚŘÍ, ne hádá — proužek zalomí popisky na jiný počet řádků
   podle šířky a podle toho, jak dlouhý název zóny právě drží. Stejný
   postup jako keepClearOfMeter() v js/ui/assistant.js.

   Publikuje se JEDNA hodnota: `--meter-clear` na <html> = kolik místa si
   ukazatel u spodní hrany bere, včetně svého odstupu od ní. CSS ji bere
   surovou (odsazení patičky, scroll-padding pro kotvy), takže žádná
   media query na straně CSS není potřeba — o tom, jestli se rezervuje,
   rozhoduje samotná změřená výška.

   Proto se tu netestuje breakpoint, ale výška: svislý panel u pravého
   okraje ani skrytý ukazatel (stránka bez zón) žádné místo dole neberou
   a offsetHeight je v obou případech ten správný zdroj pravdy. */
function reserveBottomSpace(meter) {
  const root = document.documentElement;
  const panel = window.matchMedia("(min-width: 1280px)");

  const sync = () => {
    // Svislý panel stojí ve vyhrazeném pruhu vedle obsahu, ne nad ním.
    const height = panel.matches ? 0 : meter.offsetHeight;
    if (height === 0) {
      root.style.removeProperty("--meter-clear");
      return;
    }
    root.style.setProperty("--meter-clear", `${height + STRIP_GAP}px`);
  };

  new ResizeObserver(sync).observe(meter);
  panel.addEventListener("change", sync);
  sync();
}

/** Střed prvku vůči viewportu, 0 = střed obrazovky. */
function centerOffset(node) {
  const rect = node.getBoundingClientRect();
  return rect.top + rect.height / 2 - window.innerHeight / 2;
}

export function initHeartRateMeter() {
  const meter = $("[data-hrm]");
  if (!meter) return;

  registerBpmProperty();

  // Stránka musí panelu vyhradit místo, jinak by na širokých obrazovkách
  // ležel na obsahu (změřeno: 36 prvků, přesah až 66 px do karet lekcí).
  // Třída, ne :has() — panel vkládá JS, takže tohle je deterministické
  // a nezávisí na podpoře selektoru.
  document.documentElement.classList.add("has-meter");

  reserveBottomSpace(meter);

  const bpmNodeEarly = $("[data-hrm-bpm]", meter);

  // Zastávky, mezi kterými se interpoluje. Zastávku umí nabídnout cokoli
  // označené `data-zone-stop="<id zóny>"` — na homepage sekce zón, na
  // stránce rozvrhu jednotlivé položky rezervace. Pořadí je pořadí
  // v dokumentu, ne pořadí v datech: ukazatel jde po stránce, ne po tabulce.
  const byId = new Map([...ZONES, REST_ZONE].map((zone) => [zone.id, zone]));
  const stops = [...document.querySelectorAll("[data-zone-stop]")]
    .map((node) => ({ zone: byId.get(node.dataset.zoneStop), node }))
    .filter((stop) => stop.zone);

  /* Stránka bez zastávek (kontakt, o mně) ukazatel nemaže — v podobě
     panelu ho nechá v klidovém stavu. Je to pořád platná informace
     („tohle studio jede od 75 do 165"), pořád to nese výzvu k akci
     a stojí to ve vyhrazeném pruhu vedle obsahu, takže nic nestíní.

     V podobě proužku je to jiný obchod: leží PŘES obsah, tlačítko v něm
     není a hodnoty se nemají podle čeho měnit, takže by si vzal ~100 px
     obrazovky za nic. `data-static` ho tam schová (viz CSS) a
     ResizeObserver v reserveBottomSpace() pak srovná rezervaci na nulu. */
  if (stops.length === 0) {
    applyZone(meter, REST_ZONE);
    bpmNodeEarly.textContent = String(REST_ZONE.bpm);
    meter.dataset.static = "true";
    $(".hrm__note", meter).textContent = DISCLAIMER;
    return;
  }

  const zones = stops.map((stop) => stop.zone);
  const bpmNode = $("[data-hrm-bpm]", meter);
  const zoneNode = $("[data-hrm-zone]", meter);
  const fillNode = $(".hrm__gauge-fill", meter);
  const ctaNode = $("[data-hrm-cta]", meter);
  const readoutNodes = READOUTS.map((readout) => [
    readout,
    $(`[data-hrm-readout="${readout.key}"]`, meter),
  ]);

  let ticking = false;
  const shown = new Map();

  /** Přepiš text jen když se opravdu změnil — jinak by se textContent
   *  přepisoval každý snímek scrollu a dělal čtečkám i DevTools šum. */
  function setText(node, key, value) {
    if (shown.get(key) === value) return;
    node.textContent = value;
    shown.set(key, value);
  }

  function update() {
    ticking = false;

    const offsets = stops.map((stop) => centerOffset(stop.node));
    const { values, index } = zoneStateAt(offsets, zones);
    const zone = zones[index];

    meter.style.setProperty("--hrm-bpm", values.bpm.toFixed(1));
    // dasharray je 100 (pathLength), takže offset je rovnou „kolik procent
    // obvodu zůstane prázdných".
    fillNode.style.strokeDashoffset = String(100 - gaugeFill(values.bpm) * 100);

    setText(bpmNode, "bpm", String(Math.round(values.bpm)));
    for (const [readout, node] of readoutNodes) {
      setText(node, readout.key, readout.format(values[readout.key]));
    }

    if (shown.get("zone") !== zone.id) {
      meter.dataset.zone = zone.id;
      zoneNode.textContent = zone.short;
      ctaNode.textContent = zone.cta.label;
      ctaNode.href = zone.cta.href;
      shown.set("zone", zone.id);
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  // Přímo, ne přes rAF: obrázky doskáčou až po `load` a posunou layout,
  // a prohlížeč teprve tehdy doroluje na fragment v URL (#zona-burn).
  window.addEventListener("load", update);
  update();
}

/** Vloží ukazatel do slotu a spustí ho. Jedno volání na stránku. */
export function mountHeartRateMeter() {
  const slot = $("[data-heart-rate-meter]");
  if (!slot) return;
  slot.replaceWith(renderHeartRateMeter());
  initHeartRateMeter();
}
