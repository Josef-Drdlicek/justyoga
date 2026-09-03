/* Contact page. */

import { mount, $ } from "../lib/dom.js";
import { initReveal } from "../lib/reveal.js";
import { mountChrome } from "../ui/chrome.js";
import { mountHeartRateMeter } from "../ui/heart-rate-meter.js";
import { renderVenues } from "../ui/sections.js";
import { SITE_CONFIG } from "../data/site-config.js";
import { PHONE_ICON, MAIL_ICON } from "../data/icons.js";

mountChrome();

mount("[data-venues]", renderVenues);

const phone = $("[data-contact-phone]");
phone.textContent = SITE_CONFIG.phone;
phone.href = SITE_CONFIG.phoneHref;

const email = $("[data-contact-email]");
email.textContent = SITE_CONFIG.email;
email.href = SITE_CONFIG.emailHref;

$('[data-icon="phone"]').innerHTML = PHONE_ICON;
$('[data-icon="mail"]').innerHTML = MAIL_ICON;

// Not wired to anything yet (see the TODO in kontakt.html). Submitting is
// prevented so a stray click cannot reload the page with the visitor's
// answers pasted into the query string, and the visitor is told plainly
// rather than being left to think the message went somewhere.
const status = $("[data-form-status]");
$("[data-contact-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  status.textContent =
    `Formulář zatím není propojený — napište mi prosím přímo na ${SITE_CONFIG.email} ` +
    `nebo zavolejte na ${SITE_CONFIG.phone}.`;
});

// Až po vykreslení obsahu: ukazatel si při startu hledá své zastávky
// v DOMu, a kdyby běžel dřív, nenašel by je a spadl by do klidového stavu.
mountHeartRateMeter();

initReveal();
