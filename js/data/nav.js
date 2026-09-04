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

   `shortLabel` je z toho samého důvodu. Plný název „Tabata, HIIT
   a kruhový trénink" chce klientka vidět v menu, ale ve vodorovném řádku
   utáhne seznam na 789 px a hlavička začne přetékat do šířky všude pod
   1440 px (změřeno na 768 / 900 / 1024 / 1280). V rozbaleném panelu na
   telefonu, kde položky stojí pod sebou, se plný název vejde bez potíží,
   takže tam jde plný a v řádku zkrácený — viz .nav__label v layout.css.

   Odkazy na Instagram a Facebook v menu NEJSOU. Odkaz ven mezi sedmi
   odkazy dovnitř webu je nabídka, aby návštěvník odešel dřív, než najde
   rozvrh. Sítě žijí v sekci Novinky, na kontaktu a v patičce. */
export const NAV_ITEMS = [
  { label: "Jóga", href: "index.html#joga", group: "lessons" },
  {
    label: "Tabata, HIIT a kruhový trénink",
    shortLabel: "Tabata a HIIT",
    href: "index.html#tabata",
    group: "lessons",
  },
  { label: "Jumping", href: "index.html#jumping", group: "lessons" },
  { label: "Rozvrh", href: "rozvrh-cenik.html", group: "pages" },
  { label: "Novinky", href: "index.html#novinky", group: "pages" },
  { label: "O mně", href: "o-mne.html", group: "pages" },
  { label: "Kontakt", href: "kontakt.html", group: "pages" },
];
