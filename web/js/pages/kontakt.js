import { SITE_CONFIG } from "../data/site-config.js";
import { PIN_ICON, PHONE_ICON, MAIL_ICON } from "../data/icons.js";

document.querySelector('[data-icon="pin"]').innerHTML = PIN_ICON;
document.querySelector('[data-icon="phone"]').innerHTML = PHONE_ICON;
document.querySelector('[data-icon="mail"]').innerHTML = MAIL_ICON;

document.querySelector("[data-contact-address]").textContent = SITE_CONFIG.address;

const phoneLink = document.querySelector("[data-contact-phone]");
phoneLink.textContent = SITE_CONFIG.phone;
phoneLink.href = SITE_CONFIG.phoneHref;

const emailLink = document.querySelector("[data-contact-email]");
emailLink.textContent = SITE_CONFIG.email;
emailLink.href = SITE_CONFIG.emailHref;

// Plain Google Maps search link (no API key needed), built from the same
// address SITE_CONFIG already provides — no second hardcoded copy of it.
const mapLink = document.querySelector("[data-contact-map-link]");
mapLink.setAttribute(
  "href",
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_CONFIG.address)}`
);

// Not wired to anything yet (see TODO in kontakt.html) — prevented so a
// stray click doesn't reload the page with the field values as a query
// string before Contact Form 7 is wired up at WordPress deployment.
document.querySelector("[data-contact-form]").addEventListener("submit", (event) => {
  event.preventDefault();
});
