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
   přejmenovat i tady.

   „Rozvrh", ne „Rozvrh a ceník": se sedmi položkami se delší popisek do
   řádku nevešel (změřeno) a cílová stránka má obojí v nadpisu.

   Popisky jsou plné, včetně „Tabata, HIIT a kruhový trénink". Sedm položek
   s tímhle názvem potřebuje vedle loga 1108 px (změřeno), takže se do
   vodorovného řádku vejdou až od 1180 px. Pod tím menu drží tlačítko —
   viz komentář u breakpointu navigace v layout.css. Zkracovat popisek
   kvůli řádku se zkoušelo a klientka to odmítla.

   Odkazy na Instagram a Facebook v menu NEJSOU. Odkaz ven mezi sedmi
   odkazy dovnitř webu je nabídka, aby návštěvník odešel dřív, než najde
   rozvrh. Sítě žijí v sekci Novinky, na kontaktu a v patičce. */
export const NAV_ITEMS = [
  { label: "Jóga", href: "index.html#joga", group: "lessons" },
  { label: "Tabata, HIIT a kruhový trénink", href: "index.html#tabata", group: "lessons" },
  { label: "Jumping", href: "index.html#jumping", group: "lessons" },
  { label: "Rozvrh", href: "rozvrh-cenik.html", group: "pages" },
  { label: "Novinky", href: "index.html#novinky", group: "pages" },
  { label: "O mně", href: "o-mne.html", group: "pages" },
  { label: "Kontakt", href: "kontakt.html", group: "pages" },
];
