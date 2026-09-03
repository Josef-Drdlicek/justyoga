/* Plovoucí ukazatel tempa — nápad klientky.

   Malý přístrojový panel, který po celou dobu prohlídky ukazuje, v jakém
   tempu se návštěvník na stránce nachází: kruhový budík s tepem, pod ním
   tři doplňkové hodnoty, a všechno se plynule přelévá, jak stránka stoupá
   od klidu k maximu a zase se ustálí.

   Proč čtyři hodnoty a ne jedna: samotné číslo tepu je hezké, ale nic
   nevysvětluje. Dech 6 proti 35 za minutu řekne o rozdílu mezi jógou
   a jumpingem víc než odstavec textu, a tepová zóna 1 proti 4 to zasadí
   do měřítka, které lidé znají z hodinek.

   ⚠️ Panel se čtyřmi čísly a kruhovým budíkem vypadá jako měření. Není.
   Jsou to orientační hodnoty typické pro daný typ lekce. Proto to stojí
   i viditelně pod panelem, ne jen ve skryté větě pro čtečky — a proto tu
   není `aria-live`: hodnoty se mění desítkykrát za scroll a čtečka by
   mluvila přes všechno ostatní.

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

/** Které hodnoty se interpolují. */
export const METRICS = ["bpm", "hrZone", "breaths", "effort"];

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
    // Viditelně, ne jen pro čtečky: čtyři čísla v kroužku vypadají jako
    // měření a někdo by 165 mohl číst jako svůj vlastní tep.
    el("p", {
      class: "hrm__disclaimer",
      text: "Orientační hodnoty pro tento typ lekce, ne vaše měření.",
    }),
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

  // Sekce, mezi kterými se interpoluje. Chybějící zóna nevadí — stránka,
  // která je nemá, ukazatel prostě nespustí.
  const stops = [...ZONES, REST_ZONE]
    .map((zone) => ({ zone, node: document.getElementById(`zona-${zone.id}`) }))
    .filter((stop) => stop.node);

  if (stops.length === 0) {
    meter.remove();
    return;
  }

  const zones = stops.map((stop) => stop.zone);
  const bpmNode = $("[data-hrm-bpm]", meter);
  const zoneNode = $("[data-hrm-zone]", meter);
  const fillNode = $(".hrm__gauge-fill", meter);
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
