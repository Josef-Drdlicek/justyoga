/* Header, navigation and footer — the parts every page carries.

   These used to be three Web Components with three Shadow DOM stylesheets.
   They are now functions returning light-DOM nodes styled by css/layout.css,
   which is what lets the header share a visual language with the rest of the
   page instead of re-stating it. */

import { el, append, $, $$ } from "../lib/dom.js";
import { SITE_CONFIG } from "../data/site-config.js";
import { NAV_ITEMS } from "../data/nav.js";
import { VENUES, formatVenueAddress } from "../data/venues.js";
import { FACEBOOK_ICON, INSTAGRAM_ICON } from "../data/icons.js";

/* Poslední část cesty bez přípony. Přípona se zahazuje schválně: odkazy
   v datech mají `.html`, ale `serve` i WordPress s pretty permalinky
   doručí stejnou stránku na `/rozvrh-cenik`. Bez normalizace se porovnání
   nikdy netrefí a aktuální položka v menu se nikdy neoznačí — což se
   přesně dělo, dokud se to neproměřilo.

   Nezbavuje to nasazení práce navíc (viz checklist v CLAUDE.md), ale
   znamená to, že motiv nespadne na první pohled. */
function normalisePath(value) {
  const file = value.split("?")[0].split("#")[0].split("/").pop();
  const base = file.replace(/\.html$/, "");
  return base === "" || base === "index" ? "index" : base;
}

function currentPage() {
  return normalisePath(window.location.pathname);
}

function navLink(item, here) {
  // Jen odkazy bez kotvy můžou být „aktuální stránka". Kdyby se
  // porovnával jen soubor, byly by na homepage aktuální všechny tři
  // odkazy na lekce naráz, protože všechny míří na index.html.
  const isCurrent = !item.href.includes("#") && normalisePath(item.href) === here;
  return el("li", { class: "nav__item" }, [
    el("a", {
      class: "nav__link" + (isCurrent ? " is-current" : ""),
      href: item.href,
      text: item.label,
      // aria-current marks the page for screen readers; the class only
      // paints it. Both, or a sighted-only cue is all anyone gets.
      "aria-current": isCurrent ? "page" : null,
    }),
  ]);
}

export function renderHeader() {
  const here = currentPage();

  const logo = el("a", { class: "brand", href: "index.html" }, [
    el("img", {
      class: "brand__logo",
      src: SITE_CONFIG.logoSrc,
      alt: SITE_CONFIG.logoAlt,
      // width/height are required here specifically: the logo takes its
      // height from CSS and leaves width auto, so without them the nav
      // beside it jumps once the image lands.
      width: SITE_CONFIG.logoWidth,
      height: SITE_CONFIG.logoHeight,
    }),
  ]);

  // Dvě skupiny v jednom seznamu: nabídka lekcí a stránky webu. Oddělené
  // vizuálně (viz .nav__item--divide), ale pořád jeden <ul>, aby čtečka
  // ohlásila jednu navigaci a ne dvě.
  const items = NAV_ITEMS.map((item, index) => {
    const link = navLink(item, here);
    const previous = NAV_ITEMS[index - 1];
    if (previous && previous.group !== item.group) link.classList.add("nav__item--divide");
    return link;
  });

  const list = el("ul", { class: "nav__list" }, items);

  const panel = el("div", { class: "nav__panel", id: "site-nav-panel" }, [
    list,
    el("a", {
      class: "btn btn--accent nav__cta",
      href: "rozvrh-cenik.html#rozvrh",
      text: "Rezervovat",
    }),
  ]);

  const toggle = el("button", {
    class: "nav__toggle",
    type: "button",
    "aria-expanded": "false",
    "aria-controls": "site-nav-panel",
    "aria-label": "Otevřít menu",
  }, [
    el("span", { class: "nav__toggle-bar", "aria-hidden": "true" }),
    el("span", { class: "nav__toggle-bar", "aria-hidden": "true" }),
  ]);

  const nav = el("nav", { class: "nav", "aria-label": "Hlavní navigace" }, [toggle, panel]);
  const header = el("header", { class: "header" }, [
    el("div", { class: "header__inner shell shell--wide" }, [logo, nav]),
  ]);

  // Opening/closing mutates the existing nodes rather than re-rendering:
  // a re-render would throw away the button the user is standing on.
  const setOpen = (open) => {
    header.classList.toggle("is-nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Escape closes and returns focus to the toggle, otherwise focus is left
  // inside a panel that is no longer visible.
  header.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    setOpen(false);
    toggle.focus();
  });

  /* Klepnutí mimo panel zavírá. Bez toho se z otevřeného menu na telefonu
     nedá odejít jinak než výběrem odkazu: Escape tam není a křížek je
     jediný terč, na který se dá klepnout. Poslouchá se `pointerdown`, ne
     `click` — iOS Safari `click` z prvků bez kurzoru na dokument
     nepropustí a zavírání by na iPhonu mlčelo. */
  document.addEventListener("pointerdown", (event) => {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    if (nav.contains(event.target)) return;
    setOpen(false);
  });

  // Following a link inside the panel navigates; closing first keeps the
  // state clean for browsers that restore the page from bfcache.
  $$("a", panel).forEach((link) => link.addEventListener("click", () => setOpen(false)));

  return header;
}

function socialLink(href, label, icon) {
  return el("a", {
    class: "social__link",
    href,
    rel: "noopener",
    target: "_blank",
    "aria-label": label,
    html: icon,
  });
}

export function renderFooter() {
  const contact = el("div", { class: "footer__block" }, [
    el("h2", { class: "footer__heading", text: "Ozvěte se" }),
    el("p", {}, [
      el("a", { href: SITE_CONFIG.phoneHref, text: SITE_CONFIG.phone }),
      el("br"),
      el("a", { href: SITE_CONFIG.emailHref, text: SITE_CONFIG.email }),
    ]),
    el("div", { class: "social" }, [
      socialLink(SITE_CONFIG.social.facebook, "Facebook", FACEBOOK_ICON),
      socialLink(SITE_CONFIG.social.instagram, "Instagram", INSTAGRAM_ICON),
    ]),
  ]);

  // Both addresses, always. Mixing them up costs a visitor their lesson,
  // so the footer never collapses them into one.
  const places = el("div", { class: "footer__block" }, [
    el("h2", { class: "footer__heading", text: "Kde cvičíme" }),
    el(
      "ul",
      { class: "footer__venues" },
      VENUES.map((venue) =>
        el("li", {}, [
          el("strong", { text: venue.label }),
          el("br"),
          el("span", { class: "muted", text: venue.name }),
          el("br"),
          el("span", { class: "muted", text: formatVenueAddress(venue) }),
        ])
      )
    ),
  ]);

  const links = el("div", { class: "footer__block" }, [
    el("h2", { class: "footer__heading", text: "Na webu" }),
    el(
      "ul",
      { class: "footer__links" },
      NAV_ITEMS.map((item) => el("li", {}, [el("a", { href: item.href, text: item.label })]))
    ),
  ]);

  return el("footer", { class: "footer band--dark" }, [
    el("div", { class: "shell shell--wide" }, [
      el("div", { class: "footer__grid" }, [contact, places, links]),
      el("p", {
        class: "footer__legal muted",
        text: `© ${new Date().getFullYear()} ${SITE_CONFIG.legalName}`,
      }),
    ]),
  ]);
}

/** Mount the chrome every page shares. */
export function mountChrome() {
  const headerSlot = $("[data-site-header]");
  if (headerSlot) headerSlot.replaceWith(renderHeader());

  const footerSlot = $("[data-site-footer]");
  if (footerSlot) footerSlot.replaceWith(renderFooter());
}
