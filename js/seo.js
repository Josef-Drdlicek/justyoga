// Vkládá strukturovaná data (JSON-LD) popisující studio. Načítá se na každé
// stránce vedle main.js — vyhledávače podle nich spárují web s reálnou
// firmou (např. s profilem na Googlu) nezávisle na tom, co je na stránce
// vidět. Všechno se čte z js/data/*, takže žádný fakt o studiu tu není
// zapsaný podruhé.
//
// STRUKTURA: jeden @graph, ne několik samostatných bloků.
//   ExerciseGym    firma; má JEDNU adresu (studio na Bílkově)
//   Place          druhé místo, kde se cvičí (posilovna u ZŠ Slovákova)
//   Person         Lenka — kvalifikace, důvěryhodnost autorky obsahu
//   OfferCatalog   ceník, každá nabídka navázaná na své místo
//   FAQPage        jen na stránce, kde jsou časté otázky opravdu vidět
//
// Zamítnuté varianty pro dvě adresy: `location: [Place, Place]` na firmě
// (location není vlastnost LocalBusiness, Google ji ignoruje) a dvě
// rovnocenné ExerciseGym na jedné URL (Google pak nepozná, která je "ta
// pravá", a rozmělní se signál pro firemní profil). Dvě místa se proto
// modelují jako jedna firma plus Place, provázané přes nabídky.
import { SITE_CONFIG } from "./data/site-config.js";
import { FAQ } from "./data/faq.js";
import { VENUES, getVenueById } from "./data/venues.js";
import { openingHoursFor } from "./seo/opening-hours.js";
import { offerCatalog, priceRange } from "./seo/offers.js";

const baseUrl = `${document.location.origin}/`;
const studioId = `${baseUrl}#studio`;
const lenkaId = `${baseUrl}#lenka`;
const venueNodeIds = Object.fromEntries(
  VENUES.map((venue) => [venue.id, venue.id === "studio" ? studioId : `${baseUrl}#${venue.id}`])
);

// Vynechá klíče s prázdnou hodnotou. Neznámé údaje (souřadnice, číslo
// popisné) se tak do výstupu nedostanou jako null — prázdné strukturované
// datum je horší než chybějící.
const compact = (object) =>
  Object.fromEntries(
    Object.entries(object).filter(([, value]) => {
      if (value === null || value === undefined || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
  );

function postalAddress(venue) {
  return compact({
    "@type": "PostalAddress",
    streetAddress: venue.streetAddress,
    addressLocality: venue.addressLocality,
    postalCode: venue.postalCode,
    addressRegion: venue.addressRegion,
    addressCountry: "CZ",
  });
}

function geoCoordinates(venue) {
  if (!venue.geo) return null;
  return {
    "@type": "GeoCoordinates",
    latitude: venue.geo.latitude,
    longitude: venue.geo.longitude,
  };
}

const studio = getVenueById("studio");
const logoUrl = new URL(SITE_CONFIG.logoSrc, document.baseURI).href;
const sameAs = Object.values(SITE_CONFIG.social).filter(Boolean);

const graph = [
  compact({
    "@type": "ExerciseGym",
    "@id": studioId,
    name: SITE_CONFIG.legalName,
    alternateName: SITE_CONFIG.siteName,
    url: baseUrl,
    image: logoUrl,
    logo: logoUrl,
    // Mezinárodní formát, ne "723 466 926" — schema.org ho tak chce
    // a phoneHref už ten tvar obsahuje, takže se číslo nepíše podruhé.
    telephone: SITE_CONFIG.phoneHref.replace("tel:", ""),
    email: SITE_CONFIG.email,
    address: postalAddress(studio),
    geo: geoCoordinates(studio),
    priceRange: priceRange(),
    currenciesAccepted: "CZK",
    // Spádová oblast: Boskovice a okresní Blansko. Lidé z okolí za službou
    // do města dojíždějí, takže má smysl to uvést explicitně.
    areaServed: [
      { "@type": "City", name: "Boskovice" },
      { "@type": "City", name: "Blansko" },
      { "@type": "AdministrativeArea", name: "okres Blansko" },
    ],
    sameAs,
    founder: { "@id": lenkaId },
    employee: { "@id": lenkaId },
    openingHoursSpecification: openingHoursFor("studio"),
    hasOfferCatalog: { "@id": `${baseUrl}#nabidka` },
  }),

  // Ostatní místa jako Place. Studio samo je už uzel výše, proto se přeskočí.
  ...VENUES.filter((venue) => venue.id !== "studio").map((venue) =>
    compact({
      "@type": "Place",
      "@id": venueNodeIds[venue.id],
      name: venue.name,
      address: postalAddress(venue),
      geo: geoCoordinates(venue),
      openingHoursSpecification: openingHoursFor(venue.id),
    })
  ),

  {
    "@type": "Person",
    "@id": lenkaId,
    name: "Lenka Nahodilová",
    jobTitle: "Učitelka jógy III. třídy, lektorka jumpingu, licencovaná trenérka TRX",
    worksFor: { "@id": studioId },
    url: `${baseUrl}o-mne.html`,
    hasCredential: [
      "Učitelka jógy III. třídy",
      "Licencovaná trenérka TRX",
      "Lektorka jumpingu",
    ].map((name) => ({ "@type": "EducationalOccupationalCredential", name })),
  },

  offerCatalog(baseUrl, studioId, venueNodeIds),
];

// FAQPage se vydává JEN tam, kde jsou otázky opravdu na stránce: schéma
// k obsahu, který uživatel nevidí, Google penalizuje — a homepage sekci
// s FAQ sama skrývá, když jsou data prázdná.
if (FAQ.length && document.querySelector("[data-faq-list]")) {
  graph.push({
    "@type": "FAQPage",
    "@id": `${baseUrl}#faq`,
    mainEntity: FAQ.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  });
}

const script = document.createElement("script");
script.type = "application/ld+json";
script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
document.head.append(script);
