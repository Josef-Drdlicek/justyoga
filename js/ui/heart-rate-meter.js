/* Plovoucí tepometr — nápad klientky.

   Ukazuje, v jakém tempu se návštěvník na stránce právě nachází: pomalu
   a mintově v klidové zóně, rychleji a broskvově uprostřed, rychle
   a korálově dole, a nakonec se ustálí.

   Tři věci, které z toho dělají prvek a ne hračku:

   1. Hodnota se interpoluje mezi zónami podle scrollu, neskáče po sekcích.
      Skokové přepnutí čte jako přepínač, plynulý přechod jako tep.
   2. Pulz běží z CSS animace, jejíž délka je `calc(60s / var(--hrm-bpm))`.
      Žádný rAF, který by kreslil každý snímek — prohlížeč si animaci veze
      na kompozitoru a scroll o ni nezakopne.
   3. Grafika je `aria-hidden`, text je skutečný obsah a nikde není
      `aria-live` — hodnota se mění příliš často, čtečka by mluvila přes
      všechno ostatní.

   ⚠️ Ke číslu patří skrytá věta, že jde o orientační tep pro daný typ lekce,
   ne o změřený tep návštěvníka. Bez ní může někdo číst 170 jako svoje. */

import { el, $ } from "../lib/dom.js";
import { ZONES, REST_ZONE } from "../data/zones.js";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Čistá část výpočtu, oddělená od DOMu, aby se dala otestovat bez
 * prohlížeče — headless Chrome pod `--virtual-time-budget` na fragment
 * v URL neskáče, takže scroll se v něm ověřit nedá.
 *
 * @param {number[]} offsets  vzdálenost středu každé zóny od středu
 *                            obrazovky; klesá, jak se scrolluje dolů
 *                            (nad středem záporná, pod ním kladná)
 * @param {{bpm:number}[]} zones  zóny ve stejném pořadí jako offsets
 * @returns {{bpm:number, index:number}} index je zóna, ke které jsme blíž
 */
export function bpmAt(offsets, zones) {
  if (offsets.length === 0) return { bpm: 0, index: 0 };
  if (offsets.length === 1) return { bpm: zones[0].bpm, index: 0 };

  // Ještě nad první zónou, nebo už pod poslední — drží se krajní hodnoty.
  if (offsets[0] >= 0) return { bpm: zones[0].bpm, index: 0 };
  const last = offsets.length - 1;
  if (offsets[last] <= 0) return { bpm: zones[last].bpm, index: last };

  // Poslední minutá zastávka a první, která teprve přijde.
  let i = 0;
  while (i < last - 1 && offsets[i + 1] <= 0) i += 1;

  const passed = offsets[i]; // ≤ 0, kus cesty za námi
  const ahead = offsets[i + 1]; // > 0, kus cesty před námi
  const total = ahead - passed;
  const t = total === 0 ? 0 : clamp(-passed / total, 0, 1);

  return {
    bpm: lerp(zones[i].bpm, zones[i + 1].bpm, t),
    // Popisek patří té zóně, ke které jsme blíž — půl cesty je předěl.
    index: t < 0.5 ? i : i + 1,
  };
}

export function renderHeartRateMeter() {
  const dial = el("div", { class: "hrm__dial", "aria-hidden": "true" }, [
    el("span", { class: "hrm__ring" }),
    el("span", { class: "hrm__value", "data-hrm-value": "" , text: String(ZONES[0].bpm) }),
  ]);

  const label = el("p", { class: "hrm__label", "data-hrm-label": "" }, [
    el("span", { class: "hrm__zone", text: ZONES[0].eyebrow }),
  ]);

  return el("aside", { class: "hrm", "data-hrm": "" }, [
    dial,
    label,
    el("p", {
      class: "visually-hidden",
      text:
        "Orientační tep při tomto typu lekce, ne váš vlastní. Ukazatel se mění " +
        "podle toho, ke které části stránky jste doscrollovali.",
    }),
  ]);
}

/** Střed prvku vůči viewportu, 0 = střed obrazovky. */
function centerOffset(node) {
  const rect = node.getBoundingClientRect();
  return rect.top + rect.height / 2 - window.innerHeight / 2;
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

export function initHeartRateMeter() {
  const meter = $("[data-hrm]");
  if (!meter) return;

  registerBpmProperty();

  // Sekce, mezi kterými se interpoluje. Chybějící zóna nevadí — stránka,
  // která je nemá, tepometr prostě nespustí.
  const stops = [...ZONES, REST_ZONE]
    .map((zone) => ({ zone, node: document.getElementById(`zona-${zone.id}`) }))
    .filter((stop) => stop.node);

  if (stops.length === 0) {
    meter.remove();
    return;
  }

  const valueNode = $("[data-hrm-value]", meter);
  const zoneNode = $(".hrm__zone", meter);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  let ticking = false;
  let lastShown = -1;
  let lastZoneId = null;

  function update() {
    ticking = false;

    // Kde mezi zastávkami jsme: najdi dvě nejbližší a interpoluj.
    const offsets = stops.map((stop) => centerOffset(stop.node));

    const { bpm, index } = bpmAt(offsets, stops.map((stop) => stop.zone));
    const zone = stops[index].zone;

    meter.style.setProperty("--hrm-bpm", bpm.toFixed(1));

    // Text se přepisuje jen když se opravdu změnil: přepis textContentu
    // každý snímek by čtečkám a DevTools dělal zbytečný šum.
    const shown = Math.round(bpm);
    if (shown !== lastShown) {
      valueNode.textContent = String(shown);
      lastShown = shown;
    }
    if (zone.id !== lastZoneId) {
      meter.dataset.zone = zone.id;
      zoneNode.textContent = zone.eyebrow ?? "Vaše tempo";
      lastZoneId = zone.id;
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  reduced.addEventListener("change", update);

  // Přímo, ne přes rAF: obrázky doskáčou až po `load` a posunou layout,
  // a prohlížeč teprve tehdy doroluje na fragment v URL (#zona-burn).
  // Bez tohohle by tepometr po otevření odkazu na zónu ukazoval hodnotu
  // z místa, kde stránka byla před skokem.
  window.addEventListener("load", update);
  update();
}
