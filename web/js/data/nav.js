/* Navigace. Přidání nebo přejmenování položky se dělá jen tady — žádná
   stránka si svoje menu nekreslí sama.

   Dvě skupiny, ne jeden seznam. Důvod: z menu nebylo na první pohled
   poznat, co studio vlastně nabízí — návštěvník se to dozvěděl, až když
   se začetl, a lidi nečtou. Nabídka lekcí proto stojí první a odděleně
   od stránek webu.

   „Domů" v seznamu není: domů vede logo v hlavičce, což je zavedená
   konvence, a sedm položek už se do řádku nevejde.

   Odkazy na lekce míří na kotvy homepage (`index.html#joga`). Slugy
   pocházejí z js/data/zones.js — když se tam kotva přejmenuje, musí se
   přejmenovat i tady. */
export const NAV_ITEMS = [
  { label: "Jóga", href: "index.html#joga", group: "lessons" },
  { label: "Tabata a HIIT", href: "index.html#tabata", group: "lessons" },
  { label: "Jumping", href: "index.html#jumping", group: "lessons" },
  { label: "Rozvrh a ceník", href: "rozvrh-cenik.html", group: "pages" },
  { label: "O mně", href: "o-mne.html", group: "pages" },
  { label: "Kontakt", href: "kontakt.html", group: "pages" },
];
