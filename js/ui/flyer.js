/* Leták k tisku. Jeden render, jeden objekt na vstupu.

   Leták je pořád ten samý web, jen na papíře: stejná tónová řada, stejný
   kontrast Fraunces proti Manrope, stejná konstrukce nadpisu ze dvou řezů
   jedné patky. Proto sem nepatří žádná barva ani rodina písma navíc —
   všechno jde z css/tokens.css.

   Rozměry jsou v milimetrech a stupně písma v bodech, ne v tokenech.
   Typografické tokeny jsou `clamp()` závislé na šířce okna, což je na
   obrazovce správně a na papíře nesmysl — A4 má 210 mm bez ohledu na to,
   jak velké je zrovna okno prohlížeče. Hodnoty proto žijí v css/letak.css
   a škálují se jedním násobitelem `--s` (A4 = 1, A5 = 0,71). */

import { el } from "../lib/dom.js";
import { SITE_CONFIG } from "../data/site-config.js";

/** Prázdný řádek se nevykreslí — leták s nadpisem „Kde:" a ničím za ním
    vypadá jako chyba tisku, ne jako záměr. */
function detailRow(label, value) {
  if (!value) return null;
  return el("div", { class: "flyer__row" }, [
    el("span", { class: "flyer__row-label", text: label }),
    el("span", { class: "flyer__row-value", text: value }),
  ]);
}

export function renderFlyer(data) {
  const bullets = (data.bullets ?? []).filter((line) => line.trim() !== "");

  return el("article", { class: `flyer flyer--${data.format ?? "a4"}` }, [
    el("header", { class: "flyer__head" }, [
      el("img", {
        class: "flyer__logo",
        src: SITE_CONFIG.logoSrc,
        alt: SITE_CONFIG.logoAlt,
        width: SITE_CONFIG.logoWidth,
        height: SITE_CONFIG.logoHeight,
      }),
      data.eyebrow && el("span", { class: "flyer__eyebrow", text: data.eyebrow }),
    ]),

    el("h1", { class: "flyer__title" }, [
      data.titleMain && el("span", { class: "flyer__title-main", text: data.titleMain }),
      data.titleAccent && el("span", { class: "flyer__title-accent", text: data.titleAccent }),
    ]),

    data.lede && el("p", { class: "flyer__lede", text: data.lede }),

    data.image &&
      el("figure", { class: "flyer__media" }, [
        // alt je prázdný záměrně: na papíře fotka nic nesděluje navíc
        // a v náhledu by popisek jen soutěžil s textem letáku.
        el("img", { class: "flyer__image", src: data.image, alt: "" }),
      ]),

    bullets.length > 0 &&
      el(
        "ul",
        { class: "flyer__bullets" },
        bullets.map((line) => el("li", { class: "flyer__bullet", text: line }))
      ),

    el("div", { class: "flyer__rows" }, [
      detailRow("Kdy", data.when),
      detailRow("Kde", data.where),
      detailRow("Cena", data.price),
    ]),

    data.footnote && el("p", { class: "flyer__footnote", text: data.footnote }),

    data.showContact &&
      el("footer", { class: "flyer__foot" }, [
        el("span", { class: "flyer__foot-site", text: "justyoga.cz" }),
        el("span", {
          class: "flyer__foot-contact",
          text: `${SITE_CONFIG.phone} · ${SITE_CONFIG.email}`,
        }),
        el("span", { class: "flyer__foot-social", text: "@justyoga_boskovice" }),
      ]),
  ]);
}
