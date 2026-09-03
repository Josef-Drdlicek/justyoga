// Komponenty, které žijí jen na této stránce — registruje je ten skript,
// který je plní daty, ne main.js (viz komentář tam).
import "../components/media-gallery.js";

import { GALLERY_PHOTOS, GALLERY_VIDEOS } from "../data/gallery.js";

const gallery = document.querySelector("[data-media-gallery]");
gallery.photos = GALLERY_PHOTOS;
gallery.videos = GALLERY_VIDEOS;
