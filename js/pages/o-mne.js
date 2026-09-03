/* About page. */

import { mount } from "../lib/dom.js";
import { initReveal } from "../lib/reveal.js";
import { mountChrome } from "../ui/chrome.js";
import { renderGallery, renderVideos } from "../ui/sections.js";
import { GALLERY_PHOTOS, GALLERY_VIDEOS } from "../data/gallery.js";

mountChrome();

mount("[data-gallery]", () => renderGallery(GALLERY_PHOTOS));
mount("[data-videos]", () => renderVideos(GALLERY_VIDEOS));

initReveal();
