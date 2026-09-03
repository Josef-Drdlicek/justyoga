// Komponenty, které žijí jen na této stránce — registruje je ten skript,
// který je plní daty, ne main.js (viz komentář tam).
import "../components/activity-card.js";
import "../components/news-board.js";
import "../components/faq-list.js";
import "../components/heart-rate-meter.js";
import "../components/studio-venues.js";

import { ACTIVITIES } from "../data/activities.js";
import { NEWS } from "../data/news.js";
import { FAQ } from "../data/faq.js";
import { SITE_CONFIG } from "../data/site-config.js";
import { ZONES, BRIDGE_ROOT_MARGIN } from "../data/zones.js";
import { venuesWithActivities } from "../data/venues.js";

// --- scroll-story: texty a karty do jednotlivých tepových zón ----------
//
// Kostra zón je v index.html, obsah v js/data/zones.js. Tenhle soubor je
// jen napojení jednoho na druhé, takže přidání zóny je úprava dat plus
// jedna sekce v HTML — tady se nemění nic.

// Vazba jde od aktivit k zónám (activity.zone), takže nová aktivita se
// zařadí sama jedním řádkem v datech.
const activitiesByZone = new Map();
for (const activity of ACTIVITIES) {
  if (!activitiesByZone.has(activity.zone)) activitiesByZone.set(activity.zone, []);
  activitiesByZone.get(activity.zone).push(activity);
}

// Vyplní prvek textem, a když text není, prvek ze stránky odstraní —
// prázdný <p> nebo <h2> by jinak dělal mezeru v rytmu sekce.
function fillOrRemove(root, selector, text) {
  const element = root.querySelector(selector);
  if (!element) return;
  if (text) element.textContent = text;
  else element.remove();
}

for (const zone of ZONES) {
  const section = document.querySelector(`[data-hr-zone="${zone.id}"]`);
  if (!section) continue;

  fillOrRemove(section, "[data-zone-heading]", zone.heading);
  fillOrRemove(section, "[data-zone-intro]", zone.intro);
  fillOrRemove(section, "[data-zone-slogan]", zone.slogan);
  fillOrRemove(section, "[data-zone-body]", zone.body);

  const grid = section.querySelector("[data-zone-grid]");
  if (!grid) continue;
  const activities = activitiesByZone.get(zone.id) ?? [];
  if (!activities.length) {
    grid.remove();
    continue;
  }
  for (const activity of activities) {
    const card = document.createElement("activity-card");
    card.activity = activity;
    grid.append(card);
  }
}

// --- most: text se odkryje v okamžiku prvního zrychlení ----------------
//
// Odkrytí je progresivní vylepšení, ne skrývání obsahu: třídu, na kterou
// CSS reaguje, přidává až JS. Bez JS je text normálně vidět.
const bridgeZone = document.querySelector('[data-hr-zone="bridge"]');
if (bridgeZone && "IntersectionObserver" in window) {
  bridgeZone.classList.add("is-revealable");
  new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    },
    // Stejná čtecí linka, jakou používá tepometr (READ_LINE v zones.js),
    // takže se odkrytí textu a zrychlení tepu nemohou rozejít.
    { rootMargin: BRIDGE_ROOT_MARGIN }
  ).observe(bridgeZone);
}

// --- závěrečné CTA -----------------------------------------------------

const phoneButton = document.querySelector("[data-cta-phone]");
if (phoneButton) {
  phoneButton.setAttribute("href", SITE_CONFIG.phoneHref);
  phoneButton.setAttribute("label", `Zavolat ${SITE_CONFIG.phone}`);
}

const venuesElement = document.querySelector("[data-studio-venues]");
if (venuesElement) venuesElement.venues = venuesWithActivities(ACTIVITIES);

const ctaNote = document.querySelector("[data-cta-note]");
if (ctaNote) {
  ctaNote.textContent =
    "Kapacita lekcí je omezená, místo si rezervujte předem. " +
    `Permanentka platí ${SITE_CONFIG.passValidityMonths} měsíců od zakoupení.`;
}

// --- sekce, které mohou být dočasně bez obsahu -------------------------
//
// Aktuality a časté otázky jsou obsah, který může být dočasně prázdný.
// Nadpis sekce žije v HTML (jako u ostatních sekcí), takže samotná
// komponenta ho skrýt nedokáže — sekce proto začíná jako `hidden` a odkryje
// ji až tenhle skript, když opravdu má co zobrazit.
function fillSection(sectionSelector, componentSelector, items) {
  if (!items.length) return;
  document.querySelector(componentSelector).items = items;
  document.querySelector(sectionSelector).hidden = false;
}

fillSection("[data-news-section]", "[data-news-board]", NEWS);
fillSection("[data-faq-section]", "[data-faq-list]", FAQ);
