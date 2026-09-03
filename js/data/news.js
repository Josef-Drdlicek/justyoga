// Aktuality on the homepage — the one place this content lives, so the
// client can add/remove an item without touching HTML or components.
//
// An empty array is a legitimate state, not a broken page: js/pages/home.js
// hides the whole section (heading included) when there's nothing to show.
//
// badge – short label on the card (e.g. "Novinka", "Od září")
// title – one-line headline
// text  – two or three sentences, no markup
export const NEWS = [
  {
    badge: "Novinka",
    title: "Světelná terapie při závěrečné relaxaci",
    text:
      "Na konci lekcí jógy nad vámi rozsvítím infrapanely s blízkým červeným " +
      "světlem. Prohřeje tělo do hloubky, uvolní unavená záda ze sezení a " +
      "závěrečnou relaxaci posune na úplně jinou úroveň. Nemusíte si na ni nic " +
      "brát ani nic doplácet – je součástí lekce.",
  },
  {
    badge: "Od září",
    title: "Chystáme novinky v rozvrhu",
    text:
      "Od září se v rozvrhu chystají změny a nové lekce. Jakmile budou termíny " +
      "jasné, najdete je tady i v rozvrhu – a dřív než kdekoliv jinde na " +
      "Facebooku a Instagramu.",
  },
];
