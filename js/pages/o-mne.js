import { GALLERY_PHOTOS, GALLERY_VIDEOS } from "../data/gallery.js";

const gallery = document.querySelector("[data-media-gallery]");
gallery.photos = GALLERY_PHOTOS;
gallery.videos = GALLERY_VIDEOS;
