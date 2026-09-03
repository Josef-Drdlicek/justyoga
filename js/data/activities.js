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
//   logo         – { src, width, height }; rozměry jsou v datech proto, že
//                  karta určuje výšku loga a šířku nechává na "auto", takže
//                  bez nich by po dorazu obrázku poskočil obsah karty. Loga
//                  se navíc liší poměrem stran (tabata je 848x482, ostatní
//                  788x482), takže jednotná hodnota v CSS by je deformovala.
//   logoSubtitle – optional, spells out what the logo image can't say
//                  (the "JUST TABATA" logo predates HIIT/kruhový trénink)
//   headline     – one-line hook above the descriptive tagline
//   benefits     – 3 scannable bullets; mobile visitors skim, they don't read
//   note         – optional reassurance shown under the card
//   venueId      – kde lekce probíhá; odkaz do js/data/venues.js. Studio má
//                  DVĚ adresy (jóga na Bílkově, kondiční lekce a jumping
//                  v posilovně u ZŠ), takže adresa nesmí být volný text —
//                  strukturovaná data i navigační odkazy potřebují složky.
//   capacity     – ⚠️ 10 je číslo z příkladu klientky, ne potvrzený počet míst
//                  u každé aktivity; nechat ověřit před nasazením na produkci
//   bookingUrl   – ⚠️ ŽÁDNÁ z těchto adres nevede na konkrétní termín.
//                  Jóga i kondiční lekce míří na app.tymuj.cz/team-invitation,
//                  tedy na POZVÁNKU DO TÝMU (registrační obrazovka), jumping
//                  na kořen rezervačního systému. Návštěvník klikne u úterní
//                  lekce a dostane rozcestník — je to nejdražší tření na celém
//                  webu a s redesignem nesouvisí.
//                  [ZJISTIT u klientky: umí Tymuj vygenerovat veřejný odkaz
//                  na kalendář nebo přímo na termín? Totéž u chytre-rezervace.]
//                  Do té doby tlačítko alespoň nelže — viz renderBooking()
//                  v js/ui/sections.js, které je popisuje jako odchod ze webu.
export const ACTIVITIES = [
  {
    id: "joga",
    name: "Jóga a světelná terapie",
    shortName: "Jóga",
    logo: { src: "assets/images/logo-just-yoga.png", width: 788, height: 482 },
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
    durationMinutes: 75,
    pricePerLesson: 210,
    passPrice: 1900,
    passLessons: 10,
    capacity: 10,
    venueId: "studio",
    bookingUrl:
      "https://app.tymuj.cz/team-invitation?hash=zt0k0DNTUNKIqqvJf1IJgwRqXGnEkH1F3CZbVAzL",
  },
  {
    id: "jumping",
    name: "Jumping",
    logo: { src: "assets/images/logo-jump.png", width: 788, height: 482 },
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
    durationMinutes: 60,
    pricePerLesson: 150,
    passPrice: 1400,
    passLessons: 10,
    capacity: 10,
    venueId: "hala",
    bookingUrl: "https://justjump.chytra-rezervace.cz/rezervacni-system/",
  },
  {
    id: "tabata",
    name: "Tabata, HIIT a kruhový trénink",
    shortName: "Tabata / HIIT",
    logo: { src: "assets/images/logo-tabata.png", width: 848, height: 482 },
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
    durationMinutes: 60,
    pricePerLesson: 170,
    passPrice: 1500,
    passLessons: 10,
    capacity: 10,
    venueId: "hala",
    bookingUrl:
      "https://app.tymuj.cz/team-invitation?hash=H66lpnWVfB7trd02IKLM4aEvMc20vZtdW6UVsG4I",
  },
];

export function getActivityById(id) {
  return ACTIVITIES.find((activity) => activity.id === id);
}
