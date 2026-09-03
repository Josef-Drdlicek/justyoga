/* Tepové zóny — nápad klientky (e-mail z 28. 8. 2026).

   Stránka se scrolluje od klidu k maximu a plovoucí tepometr ukazuje, kde
   se návštěvník právě nachází. Zóna není dekorace: každá drží jednu skupinu
   lekcí, takže „co u vás najdu" se dá přečíst bez jediného odstavce.

   Klientka psala slogany v tykání. Celý web vyká (viz CLAUDE.md → Tón
   textů), takže jsou převedené — obsah i rytmus zůstávají její.

   Metriky (bpm, hrZone, breaths, effort) jsou ORIENTAČNÍ hodnoty typické
   pro daný typ lekce, ne měření návštěvníka. Panel se čtyřmi čísly vypadá
   jako přístroj, takže to musí být napsané i viditelně, ne jen pro čtečky —
   jinak si někdo přečte 165 jako svůj vlastní tep.

   bpm         – tep za minutu
   hrZone      – tepová zóna 1–5 podle běžného pětizónového modelu
                 (1 = regenerace, 3 = aerobní, 4 = anaerobní)
   breaths     – nádechů za minutu. U jógy je to ta nejvýmluvnější hodnota
                 celého panelu: 6 proti 35 řekne o rozdílu mezi lekcemi víc
                 než odstavec textu.
   effort      – vnímaná námaha na běžné škále 1–10 (RPE)
   slug        – kotva sekce v URL. Čitelná (#joga), ne technická
                 (#zona-calm) — chodí se na ni z menu a lidi si ji posílají.
                 Id sekce je slug, tempo nese `data-zone-stop`, takže se
                 ta dvě pojmenování nepletou.
   short       – jednoslovný název pro legendu rozvrhu. Vlastní pole, ne
                 ořezaný `eyebrow`: „Zóna klidu" minus „Zóna " dá „klidu",
                 tedy druhý pád, který sám o sobě nedává smysl.
   cta         – co nabídne tlačítko v ukazateli, když je návštěvník právě
                 v téhle zóně. Popisek říká, co se po kliknutí stane, ne co
                 si návštěvník myslí — „Zkusit jumping", ne „Jdu do toho".
   activityIds – které lekce do zóny patří. Vazba jde odsud k aktivitám,
                 takže přidání lekce do zóny je jeden řádek tady.
*/
export const ZONES = [
  {
    id: "calm",
    slug: "joga",
    eyebrow: "Zóna klidu",
    short: "Klid",
    bpm: 75,
    hrZone: 1,
    breaths: 6,
    effort: 2,
    heading: "Nadechněte se a zklidněte mysl",
    slogan: "Váš prostor pro hluboký nádech.",
    text:
      "Protažení, zdravá záda a relaxace. Tempo, u kterého se dá po práci " +
      "vydechnout a u kterého nezáleží na tom, kolik je vám let ani jestli " +
      "jste někdy cvičili.",
    cta: { label: "Zkusit jógu", href: "rozvrh-cenik.html#rozvrh" },
    activityIds: ["joga"],
  },
  {
    id: "move",
    slug: "tabata",
    eyebrow: "Zóna rytmu",
    short: "Rytmus",
    bpm: 115,
    hrZone: 3,
    breaths: 20,
    effort: 6,
    heading: "Najděte svůj rytmus",
    slogan: "Rozpohybujte tělo.",
    text:
      "Dynamičtější cvičení pro běžný den. Střídání stanovišť a intervalů, " +
      "u každého cviku lehčí i těžší varianta — zátěž i rychlost si dávkujete " +
      "sami.",
    cta: { label: "Zkusit kruhový trénink", href: "rozvrh-cenik.html#rozvrh" },
    activityIds: ["tabata"],
  },
  {
    id: "burn",
    slug: "jumping",
    eyebrow: "Zóna maxima",
    short: "Maximum",
    bpm: 165,
    hrZone: 4,
    breaths: 35,
    effort: 9,
    heading: "Nakopněte tep na maximum",
    slogan: "Vyskočte ze stereotypu a budujte sílu.",
    text:
      "Skákání na trampolínách. Spalování, zpevnění a endorfiny — nejzábavnější " +
      "způsob, jak si dát do těla.",
    cta: { label: "Zkusit jumping", href: "rozvrh-cenik.html#rozvrh" },
    activityIds: ["jumping"],
  },
];

/* Zóna, kde se tep ustálí. Nemá vlastní lekce — je to konec cesty a výzva
   k akci, přesně jak to klientka popsala („kolečko se ustálí na příjemné,
   stabilní hodnotě"). */
export const REST_ZONE = {
  id: "rest",
  short: "Restart",
  bpm: 96,
  hrZone: 2,
  breaths: 12,
  effort: 3,
  cta: { label: "Vybrat si lekci", href: "rozvrh-cenik.html#rozvrh" },
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
