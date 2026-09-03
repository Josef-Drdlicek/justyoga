// Fotky a videa z galerie stávajícího webu (justyoga.cz/fotky-a-videa/),
// stažené 2026-07-15 do assets/. U fotek jsou záměrně menší WordPress
// rendity (~768 px na šířku), ne plné rozlišení — v mřížce se zobrazují
// malé a klientka sama uvádí, že kvalita fotek není špičková.
const GALLERY_IMAGE_DIR = "assets/images/gallery";
const GALLERY_VIDEO_DIR = "assets/videos";

const PHOTO_FILES = [
  "foto-01.jpg",
  "foto-02.jpg",
  "foto-03.jpg",
  "foto-04.jpg",
  "foto-05.jpg",
  "foto-06.jpg",
  "foto-07.jpg",
  "foto-08.jpg",
  "foto-09.jpg",
  "foto-10.jpg",
];

const VIDEO_FILES = ["video-1.mp4", "video-2.mp4", "video-3.mp4"];

export const GALLERY_PHOTOS = PHOTO_FILES.map((file, index) => ({
  src: `${GALLERY_IMAGE_DIR}/${file}`,
  alt: `Momentka z lekcí Just Yoga (${index + 1} z ${PHOTO_FILES.length})`,
}));

export const GALLERY_VIDEOS = VIDEO_FILES.map((file, index) => ({
  src: `${GALLERY_VIDEO_DIR}/${file}`,
  label: `Video z lekcí Just Yoga (${index + 1} z ${VIDEO_FILES.length})`,
}));
