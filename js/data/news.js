/* Novinky na homepage — jediné místo, kde tenhle obsah žije, takže se dá
   přidat položka bez sahání do HTML.

   Prázdné pole je legitimní stav, ne rozbitá stránka: js/pages/home.js
   celou sekci i s nadpisem skryje, když není co ukázat.

   ── Proč tady nejsou embedy z Instagramu a Facebooku ────────────────
   Klientka je na obou sítích aktivní a nabízelo by se je vysypat na web
   automaticky. Nejde to, a to ze tří důvodů:

   1. Instagram oEmbed vyžaduje od roku 2020 aplikační token Facebooku,
      tedy server, který ho drží a obnovuje. Tenhle web je statický motiv.
      Instagram Basic Display API bylo v prosinci 2024 zrušeno.
   2. Zbývající cesta jsou cizí widgety (`embed.js`, Facebook Page Plugin).
      Ty přinesou vlastní typografii, vlastní barvy a vlastní rám — přesně
      to „cizí", čemu se má web vyhnout. Navíc jde o skript třetí strany
      s cookies, tedy věc do souhlasu podle GDPR, a dnes na webu není ani
      jeden externí požadavek.
   3. Zdroj by přestal být pod kontrolou: cokoli klientka na sítě dá, by
      se objevilo na webu i s hashtagy a rozladěnými fotkami.

   Tady jsou proto novinky **vlastní obsah webu ve vlastním vzhledu**,
   který se může na konkrétní příspěvek odkázat (`url` + `source`).
   Sledování sítí řeší tlačítka v sekci, ne vysypaný feed.

   ⚠️ PŘI NASAZENÍ: pokud bude klientka chtít feed automaticky, na
   produkci to umí plugin (Smash Balloon a spol.) — plní stejné karty
   z WordPressu a vzhled zůstane náš. Rozhodnout se musí kvůli GDPR
   souhlasu a je to samostatná dávka práce.

   Tvar položky:
     badge  – krátký štítek na kartě („Novinka", „Od září")
     date   – ISO datum; vykresluje se česky a jde do <time datetime>
     title  – jednořádkový nadpis
     text   – dvě až tři věty, bez značek
     source – "instagram" | "facebook" | null; jen když položka odkazuje
              na konkrétní příspěvek. Určuje ikonu a popisek odkazu.
     url    – odkaz na ten příspěvek, jinak null
*/
export const NEWS = [
  {
    badge: "Novinka",
    date: "2026-08-20",
    title: "Světelná terapie při závěrečné relaxaci",
    text:
      "Na konci lekcí jógy nad vámi rozsvítím infrapanely s blízkým červeným " +
      "světlem. Prohřeje tělo do hloubky, uvolní unavená záda ze sezení a " +
      "závěrečnou relaxaci posune na úplně jinou úroveň. Nemusíte si na ni nic " +
      "brát ani nic doplácet — je součástí lekce.",
    source: null,
    // [ZJISTIT u klientky: má na Instagramu příspěvek o světelné terapii,
    // na který se dá odkázat? Odkaz se nesmí vymyslet.]
    url: null,
  },
  {
    badge: "Od září",
    date: "2026-09-01",
    title: "Nové termíny v rozvrhu",
    text:
      "Od září přibývají v rozvrhu nové termíny. Najdete je tady i v rozvrhu, " +
      "a dřív než kdekoli jinde.",
    source: null,
    url: null,
    // [ZJISTIT u klientky: které dny a časy přesně přibývají. Do té doby
    // je tahle položka záměrně obecná — vymyslet termín by poslal někoho
    // do studia ve špatnou hodinu.]
  },
];
