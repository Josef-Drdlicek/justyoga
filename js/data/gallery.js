// Fotky a videa z galerie stávajícího webu (justyoga.cz/fotky-a-videa/),
// stažené 2026-07-15 do assets/. U fotek jsou záměrně menší WordPress
// rendity (~768 px na šířku), ne plné rozlišení — v mřížce se zobrazují
// malé a klientka sama uvádí, že kvalita fotek není špičková.
//
// Alt texty popisují, co je na snímku SKUTEČNĚ vidět (prohlédnuto jeden po
// druhém), ne "Momentka z lekcí (3 z 10)" jako dřív. Pro čtečku je to jediná
// informace o obsahu a pro vyhledávače jedno z mála míst, kde smí padnout
// slovo trampolína nebo posilovna, aniž by to znělo natlačeně.
const GALLERY_IMAGE_DIR = "assets/images/gallery";
const GALLERY_VIDEO_DIR = "assets/videos";

// foto-01.jpg se ZÁMĚRNĚ nepoužívá: má přes sebe nalepený screenshot Google
// Maps s adresou, takže v galerii působí jako omyl. Soubor zůstává v assets
// — až bude čím ho oříznout, dá se vrátit, případně použít na kontaktu jako
// vizuální navigace, kde ta mapa naopak smysl má.
const PHOTO_FILES = [
  { file: "foto-02.jpg", alt: "Kondiční lekce v sále – cvičení na gymnastických míčích a v pozici prkna" },
  { file: "foto-03.jpg", alt: "Jógový sál připravený na lekci: podložky, bloky a kostky v modrém osvětlení" },
  { file: "foto-04.jpg", alt: "Kruhový trénink s jednoručkami, osou a gymnastickými míči u žebřin" },
  { file: "foto-05.jpg", alt: "Dvě cvičenky v pozici prkna s jednoručkami, v pozadí složené trampolíny na jumping" },
  { file: "foto-06.jpg", alt: "Jógové studio Just Yoga s logem vážky na stěně a podložkami připravenými na lekci" },
  { file: "foto-07.jpg", alt: "Lekce jumpingu na trampolínách pod barevnými světly" },
  { file: "foto-08.jpg", alt: "Kondiční lekce v sále – cvičení s vybavením rozestavěným po stanovištích" },
  // ⚠️ [ZJISTIT u klientky] Co to bylo za akci. Na snímku je skupina
  // v maskách za trampolínou, vypadá to na tematickou lekci (mikulášskou?).
  // Alt text zatím popisuje jen to, co je vidět.
  { file: "foto-09.jpg", alt: "Tematická lekce jumpingu – skupina v maskách za trampolínou" },
  // ⚠️ [ZJISTIT u klientky] Rovněž příležitost. Vypadá to na společné
  // posezení po lekci pod modrým světlem.
  { file: "foto-10.jpg", alt: "Skupina účastníků v sále pod modrým osvětlením" },
];

// Videa se — na rozdíl od fotek — nesmí ořezávat do pevného rámce (viz
// media-gallery.js), takže si každé drží svůj vlastní poměr stran. Bez
// rozměrů prohlížeč do načtení metadat nezná výšku prvku a stránka po
// jejich doručení poskočí. Rozměry jsou proto u každého souboru zvlášť
// (změřeno z posterů) — video-3 je jediné na šířku, jednotná hodnota by
// u něj byla nepravdivá.
const VIDEO_FILES = [
  {
    file: "video-1.mp4",
    width: 720,
    height: 1280,
    label: "Video z lekce jumpingu – skákání na trampolíně v modrém osvětlení",
  },
  {
    file: "video-2.mp4",
    width: 720,
    height: 1280,
    label: "Video z lekce jumpingu – skupina na trampolínách pod barevnými světly",
  },
  {
    file: "video-3.mp4",
    width: 848,
    height: 480,
    label: "Video z lekce jumpingu – řada trampolín v sále během lekce",
  },
];

export const GALLERY_PHOTOS = PHOTO_FILES.map(({ file, alt }) => ({
  src: `${GALLERY_IMAGE_DIR}/${file}`,
  alt,
}));

export const GALLERY_VIDEOS = VIDEO_FILES.map(({ file, width, height, label }) => ({
  src: `${GALLERY_VIDEO_DIR}/${file}`,
  // Náhledový snímek se jmenuje vždy jako video, jen s příponou
  // "-poster.jpg" — derivuje se, aby název souboru nebyl v datech dvakrát.
  poster: `${GALLERY_VIDEO_DIR}/${file.replace(".mp4", "-poster.jpg")}`,
  width,
  height,
  label,
}));
