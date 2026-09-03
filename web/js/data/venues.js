// Místa, kde se cvičí. Studio má DVĚ adresy a to je věc, na které se dá
// reálně ztratit zákazník: jóga je ve studiu na Bílkově, kondiční lekce
// a jumping v posilovně u základní školy o několik minut dál. Kdo přijde
// na jumping na Bílkovu, lekci nestihne.
//
// Adresa je proto rozložená na složky, ne slepená do jednoho řetězce:
// schema.org chce streetAddress / postalCode / addressLocality zvlášť
// a Google podle nich páruje web s firemním profilem spolehlivěji.
// Aktivity se na místo odkazují přes venueId (viz activities.js), takže
// přidání aktivity v novém místě znamená přidat záznam sem a jeden řádek
// tam — nikde jinde.

export const VENUES = [
  {
    id: "studio",
    // label = krátké pojmenování pro UI, name = plný název pro strukturovaná data
    label: "Jógové studio",
    name: "Just Yoga a pohybové studio",
    streetAddress: "Bílkova 91",
    addressLocality: "Boskovice",
    // ⚠️ site-config.js dosud uváděl 680 00, což jako doručovací PSČ
    // neexistuje — Boskovice mají 680 01. Změněno, ale nechat potvrdit
    // klientkou: chybné PSČ kazí párování s Google Business Profile.
    postalCode: "680 01",
    addressRegion: "Jihomoravský kraj",
    // ⚠️ [ZJISTIT u klientky] Praktické věci, na které se prvonávštěvník
    // ptá nejčastěji a web o nich dosud neřekl ani slovo. Dokud jsou null,
    // sekce "jak se k nám dostanete" se nevykreslí — vymýšlet si parkování
    // by bylo horší než ho neuvést.
    directions: null, // kterým vchodem, je na dveřích cedule, zvoní se?
    parking: null, // kde se stojí, kolik míst, zdarma nebo zóna?
    landmark: null, // orientační bod
    // ⚠️ [ZJISTIT u klientky] Souřadnice z Google Maps (dlouhý stisk na
    // místo → dvě čísla). Nutné pro geo v strukturovaných datech.
    geo: null,
  },
  {
    id: "hala",
    label: "Posilovna a vzpírárna",
    name: "Posilovna a vzpírárna, ZŠ III Slovákova",
    // ⚠️ [ZJISTIT u klientky] Ulice s číslem popisným. Živý web ani podklady
    // ji neuvádějí a "Slovákova" bez čísla by byla zároveň nedostatečná
    // a duplicitní s názvem výše (kde už "Slovákova" je) — v kartě by to
    // vypadalo jako chyba. Dokud je null, vypíše se jen město a navigace
    // se opře o název místa, který Google pozná.
    streetAddress: null,
    addressLocality: "Boskovice",
    postalCode: "680 01",
    addressRegion: "Jihomoravský kraj",
    directions: null,
    parking: null,
    landmark: null,
    geo: null,
    // Poznámka, kterou vidí návštěvník u tohoto místa — tady je záměrně
    // vždycky, protože záměna adres je ta chyba, která ho stojí lekci.
    note: "Není to jógové studio na Bílkově. Zkontrolujte si prosím před první lekcí, kam jdete.",
  },
];

export function getVenueById(id) {
  return VENUES.find((venue) => venue.id === id);
}

// Jednořádková adresa pro místa, kde není prostor na víc (karty rozvrhu).
// Ulice se vynechá, když není známá — viz streetAddress u haly.
export function formatVenueLine(venue) {
  return [venue.name, venue.streetAddress, venue.addressLocality].filter(Boolean).join(", ");
}

// Adresní řádek pod názvem místa (karty v <studio-venues>): ulice, PSČ
// a město. Bez známé ulice zbyde PSČ s městem, což je pořád pravdivé.
export function formatVenueAddress(venue) {
  const town = `${venue.postalCode} ${venue.addressLocality}`;
  return venue.streetAddress ? `${venue.streetAddress}, ${town}` : town;
}

// Sestaví podklad pro <studio-venues>: každé místo, kde se opravdu cvičí,
// spolu s lekcemi, které tam probíhají. Odvozuje se z aktivit, takže nová
// aktivita v novém místě přidá kartu sama a nikde se neudržuje druhý
// seznam. Místa bez aktivit se vypustí — prázdná karta nikomu nepomůže.
export function venuesWithActivities(activities) {
  const byVenue = new Map();
  for (const activity of activities) {
    if (!byVenue.has(activity.venueId)) byVenue.set(activity.venueId, []);
    byVenue.get(activity.venueId).push(activity);
  }
  return VENUES.filter((venue) => byVenue.has(venue.id)).map((venue) => ({
    venue,
    activities: byVenue.get(venue.id),
    navigationUrl: venueNavigationUrl(venue),
  }));
}

// Odkaz vede rovnou na NAVIGACI, ne na vyhledávání: klientka si výslovně
// přála "tlačítko na navigaci". Když jsou souřadnice známé, použijí se —
// jsou přesnější než textová adresa, hlavně u haly bez čísla popisného.
export function venueNavigationUrl(venue) {
  let destination;
  if (venue.geo) {
    destination = `${venue.geo.latitude},${venue.geo.longitude}`;
  } else if (venue.streetAddress) {
    destination = `${venue.streetAddress}, ${venue.postalCode} ${venue.addressLocality}`;
  } else {
    // Bez známé ulice se opřeme o název místa — "Posilovna a vzpírárna,
    // ZŠ III Slovákova, Boskovice" Google najde, samotné PSČ s městem by
    // dovedlo jen doprostřed obce.
    destination = `${venue.name}, ${venue.addressLocality}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
