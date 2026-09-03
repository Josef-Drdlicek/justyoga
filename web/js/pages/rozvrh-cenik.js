/* Schedule and pricing page. */

import { mount } from "../lib/dom.js";
import { initReveal } from "../lib/reveal.js";
import { mountChrome } from "../ui/chrome.js";
import { renderWeek, renderBooking, renderPricing, renderFaq } from "../ui/sections.js";
import { ACTIVITIES } from "../data/activities.js";
import { FAQ } from "../data/faq.js";
import { SITE_CONFIG } from "../data/site-config.js";

mountChrome();

mount("[data-week]", renderWeek);
mount("[data-booking]", () => renderBooking(ACTIVITIES));
mount("[data-pricing]", () => renderPricing(ACTIVITIES, SITE_CONFIG.passValidityMonths));

// The full list here, not the shortened homepage one: someone on the pricing
// page is comparing details and wants the answers about passes and cancelling.
mount("[data-faq]", () => renderFaq(FAQ));

initReveal();
