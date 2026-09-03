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

/** Which nav item is the current page. Filename-based — see the WordPress
 *  deployment checklist: pretty permalinks will need this remapped. */
function currentPage() {
  const file = window.location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

function navLink(item, here) {
  const isCurrent = item.href === here;
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

  const list = el(
    "ul",
    { class: "nav__list" },
    NAV_ITEMS.map((item) => navLink(item, here))
  );

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
