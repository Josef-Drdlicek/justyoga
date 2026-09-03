// Komponenty, které žijí jen na této stránce — registruje je ten skript,
// který je plní daty, ne main.js (viz komentář tam).
import "../components/studio-venues.js";

import { SITE_CONFIG } from "../data/site-config.js";
import { ACTIVITIES } from "../data/activities.js";
import { venuesWithActivities } from "../data/venues.js";
import { PHONE_ICON, MAIL_ICON } from "../data/icons.js";

document.querySelector('[data-icon="phone"]').innerHTML = PHONE_ICON;
document.querySelector('[data-icon="mail"]').innerHTML = MAIL_ICON;

// Místa se odvozují z aktivit, takže adresy nejsou nikde opsané podruhé
// a nová aktivita v novém místě přidá kartu sama.
document.querySelector("[data-studio-venues]").venues = venuesWithActivities(ACTIVITIES);

const phoneLink = document.querySelector("[data-contact-phone]");
phoneLink.textContent = SITE_CONFIG.phone;
phoneLink.href = SITE_CONFIG.phoneHref;

const emailLink = document.querySelector("[data-contact-email]");
emailLink.textContent = SITE_CONFIG.email;
emailLink.href = SITE_CONFIG.emailHref;

// Not wired to anything yet (see TODO in kontakt.html) — prevented so a
// stray click doesn't reload the page with the field values as a query
// string before Contact Form 7 is wired up at WordPress deployment.
document.querySelector("[data-contact-form]").addEventListener("submit", (event) => {
  event.preventDefault();
});
