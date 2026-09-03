/* Tepové zóny — nápad klientky (e-mail z 28. 8. 2026).

   Stránka se scrolluje od klidu k maximu a plovoucí tepometr ukazuje, kde
   se návštěvník právě nachází. Zóna není dekorace: každá drží jednu skupinu
   lekcí, takže „co u vás najdu" se dá přečíst bez jediného odstavce.

   Klientka psala slogany v tykání. Celý web vyká (viz CLAUDE.md → Tón
   textů), takže jsou převedené — obsah i rytmus zůstávají její.

   bpm         – orientační tep pro daný typ lekce. NENÍ to změřená hodnota
                 návštěvníka; tepometr proto nese skrytou větu, která to
                 říká nahlas, jinak může někdo číst 170 jako svůj vlastní tep.
   short       – jednoslovný název pro legendu rozvrhu. Vlastní pole, ne
                 ořezaný `eyebrow`: „Zóna klidu" minus „Zóna " dá „klidu",
                 tedy druhý pád, který sám o sobě nedává smysl.
   activityIds – které lekce do zóny patří. Vazba jde odsud k aktivitám,
                 takže přidání lekce do zóny je jeden řádek tady.
*/
export const ZONES = [
  {
    id: "calm",
    eyebrow: "Zóna klidu",
    short: "Klid",
    bpm: 75,
    heading: "Nadechněte se a zklidněte mysl",
    slogan: "Váš prostor pro hluboký nádech.",
    text:
      "Protažení, zdravá záda a relaxace. Tempo, u kterého se dá po práci " +
      "vydechnout a u kterého nezáleží na tom, kolik je vám let ani jestli " +
      "jste někdy cvičili.",
    activityIds: ["joga"],
  },
  {
    id: "move",
    eyebrow: "Zóna rytmu",
    short: "Rytmus",
    bpm: 115,
    heading: "Najděte svůj rytmus",
    slogan: "Rozpohybujte tělo.",
    text:
      "Dynamičtější cvičení pro běžný den. Střídání stanovišť a intervalů, " +
      "u každého cviku lehčí i těžší varianta — zátěž i rychlost si dávkujete " +
      "sami.",
    activityIds: ["tabata"],
  },
  {
    id: "burn",
    eyebrow: "Zóna maxima",
    short: "Maximum",
    bpm: 165,
    heading: "Nakopněte tep na maximum",
    slogan: "Vyskočte ze stereotypu a budujte sílu.",
    text:
      "Skákání na trampolínách. Spalování, zpevnění a endorfiny — nejzábavnější " +
      "způsob, jak si dát do těla.",
    activityIds: ["jumping"],
  },
];

/* Zóna, kde se tep ustálí. Nemá vlastní lekce — je to konec cesty a výzva
   k akci, přesně jak to klientka popsala („kolečko se ustálí na příjemné,
   stabilní hodnotě"). */
export const REST_ZONE = {
  id: "rest",
  bpm: 96,
  heading: "Váš dech, váš tep, váš restart",
  text: "Vyberte si tempo, které dnes potřebujete.",
};

/* „Most" — vysvětlení, proč se tepometr vlastně dal do pohybu. Klientka ho
   chtěla přesně sem: hned za klidovou zónou, ve chvíli, kdy se kolečko
   poprvé zrychlí. */
export const BRIDGE_TEXT =
  "Většina studií má jen jedno tempo. Já věřím, že tělo potřebuje klid " +
  "i výkon — jen ne vždycky ve stejný den. Zpomalte dech na józe, nebo " +
  "zvyšte tepovku na jumpingu a HIITu. Najděte svůj balanc v jakémkoli rytmu.";

/** Do které zóny lekce patří. Vazba je jen tady, aktivity o zónách nevědí. */
export function zoneForActivity(activityId) {
  return ZONES.find((zone) => zone.activityIds.includes(activityId)) ?? null;
}
