/* About page. */

import { mount } from "../lib/dom.js";
import { initReveal } from "../lib/reveal.js";
import { mountChrome } from "../ui/chrome.js";
import { mountHeartRateMeter } from "../ui/heart-rate-meter.js";
import { mountAssistant } from "../ui/assistant.js";
import { renderGallery, renderVideos } from "../ui/sections.js";
import { GALLERY_PHOTOS, GALLERY_VIDEOS } from "../data/gallery.js";

mountChrome();

mount("[data-gallery]", () => renderGallery(GALLERY_PHOTOS));
mount("[data-videos]", () => renderVideos(GALLERY_VIDEOS));

// Až po vykreslení obsahu: ukazatel si při startu hledá své zastávky
// v DOMu, a kdyby běžel dřív, nenašel by je a spadl by do klidového stavu.
mountHeartRateMeter();
mountAssistant();

initReveal();
