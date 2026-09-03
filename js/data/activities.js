// Real content taken from the current justyoga.cz (ceník + rezervace-terminu
// pages, checked 2026-07-07), texts rewritten 2026-08-27 from the client's own
// marketing copy (e-mail klientky ze 14. 8. 2026 — originál je v archivu
// projektu, do repa nepatří). This is the one place activity facts live —
// pricing table, schedule table and homepage cards all read from here
// instead of repeating names/prices/links.
//
// Shape notes:
//   name         – full name (ceník heading, alt text)
//   shortName    – optional, used where space is tight (schedule cards)
//   logoSubtitle – optional, spells out what the logo image can't say
//                  (the "JUST TABATA" logo predates HIIT/kruhový trénink)
//   headline     – one-line hook above the descriptive tagline
//   benefits     – 3 scannable bullets; mobile visitors skim, they don't read
//   note         – optional reassurance shown under the card
//   capacity     – ⚠️ 10 je číslo z příkladu klientky, ne potvrzený počet míst
//                  u každé aktivity; nechat ověřit před nasazením na produkci
export const ACTIVITIES = [
  {
    id: "joga",
    name: "Jóga a světelná terapie",
    shortName: "Jóga",
    logo: "assets/images/logo-just-yoga.png",
    logoSubtitle: "+ světelná terapie",
    headline: "Najděte ztracenou rovnováhu a odhoďte každodenní stres.",
    tagline:
      "Lekce jógy propojí váš dech s vědomým pohybem. Protáhnete ztuhlé tělo, " +
      "posílíte hluboké svaly a odejdete s čistou hlavou. Na závěr relaxace nad " +
      "vámi rozsvítím infrapanely s blízkým červeným světlem, které prohřeje tělo " +
      "do hloubky a uvolní unavená záda.",
    benefits: [
      "Protažení ztuhlého těla a posílení hlubokých svalů",
      "Světelná terapie při závěrečné relaxaci",
      "Klidná hlava a nová energie do dalších dní",
    ],
    ctaLabel: "Chci začít 🧘",
    durationMinutes: 75,
    pricePerLesson: 210,
    passPrice: 1900,
    passLessons: 10,
    capacity: 10,
    location: "Just Yoga a pohybové studio, Bílkova 91, Boskovice",
    bookingUrl:
      "https://app.tymuj.cz/team-invitation?hash=zt0k0DNTUNKIqqvJf1IJgwRqXGnEkH1F3CZbVAzL",
  },
  {
    id: "jumping",
    name: "Jumping",
    logo: "assets/images/logo-jump.png",
    headline: "Naberte čistou energii a vyskočte ze stereotypu!",
    tagline:
      "Skákání na trampolínách je nejzábavnější způsob, jak spálit kalorie, " +
      "zpevnit postavu a vyplavit endorfiny. Zapomeňte na nudné kardio – tohle " +
      "vás bude bavit.",
    benefits: [
      "Efektivní spalování kalorií a zpevnění postavy",
      "Zábava místo nudného kardia",
      "Skvělá parta, která vás potáhne",
    ],
    ctaLabel: "Jdu do toho! 🚀",
    durationMinutes: 60,
    pricePerLesson: 150,
    passPrice: 1400,
    passLessons: 10,
    capacity: 10,
    location: "Posilovna a vzpírárna, ZŠ III Slovákova, Boskovice",
    bookingUrl: "https://justjump.chytra-rezervace.cz/rezervacni-system/",
  },
  {
    id: "tabata",
    name: "Tabata, HIIT a kruhový trénink",
    shortName: "Tabata / HIIT",
    logo: "assets/images/logo-tabata.png",
    logoSubtitle: "+ HIIT a kruhový trénink",
    headline: "Dejte si do těla bez ohledu na kondici – vlastní tempo je klíč!",
    tagline:
      "Dokonalý mix tabaty, HIITu a kruhového tréninku, který vás nabije novou " +
      "energií. Střídání stanovišť a intenzivních intervalů zaručí, že trénink " +
      "bleskově uteče. Cvičíte sami za sebe a podle svých aktuálních možností – " +
      "nemusíte stíhat nikoho jiného.",
    benefits: [
      "Vhodné pro každého – vždy ukážu lehčí i těžší variantu cviku",
      "Maximální pestrost – každé stanoviště přináší novou výzvu",
      "Skvělá parta – společně se podpoříme a nenecháme vás v tom",
    ],
    note:
      "Je to vaše první lekce? Žádný strach. Kruhový trénink i intervaly jsou " +
      "postavené tak, že si zátěž i rychlost dávkujete úplně sami podle chuti.",
    ctaLabel: "Chci to vyzkoušet ⚡",
    durationMinutes: 60,
    pricePerLesson: 170,
    passPrice: 1500,
    passLessons: 10,
    capacity: 10,
    location: "Posilovna a vzpírárna, ZŠ III Slovákova, Boskovice",
    bookingUrl:
      "https://app.tymuj.cz/team-invitation?hash=H66lpnWVfB7trd02IKLM4aEvMc20vZtdW6UVsG4I",
  },
];

export function getActivityById(id) {
  return ACTIVITIES.find((activity) => activity.id === id);
}
