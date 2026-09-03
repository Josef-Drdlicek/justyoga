import { ACTIVITIES } from "../data/activities.js";
import { SITE_CONFIG } from "../data/site-config.js";

// Nabídka lekcí pro strukturovaná data. Ceny se berou z activities.js,
// takže nikde nevznikne druhá kopie ceníku.
//
// Každá aktivita dává dvě nabídky — jednotlivou lekci a permanentku —
// a každá se přes availableAtOrFrom váže na to místo, kde se lekce
// opravdu koná. Tím se do strukturovaných dat dostane fakt, že studio
// cvičí na dvou adresách.

export function offerCatalog(baseUrl, studioId, venueNodeIds) {
  const offers = ACTIVITIES.flatMap((activity) => {
    const atVenue = { "@id": venueNodeIds[activity.venueId] };
    return [
      {
        "@type": "Offer",
        name: `${activity.name} – jednotlivá lekce (${activity.durationMinutes} min)`,
        price: String(activity.pricePerLesson),
        priceCurrency: "CZK",
        availableAtOrFrom: atVenue,
        url: `${baseUrl}rozvrh-cenik.html`,
        itemOffered: {
          "@type": "Service",
          name: activity.name,
          serviceType: "Lekce pohybového studia",
          description: activity.tagline,
          provider: { "@id": studioId },
        },
      },
      {
        "@type": "Offer",
        name:
          `${activity.name} – permanentka na ${activity.passLessons} lekcí ` +
          `(platnost ${SITE_CONFIG.passValidityMonths} měsíců)`,
        price: String(activity.passPrice),
        priceCurrency: "CZK",
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          value: activity.passLessons,
          unitText: "vstupů",
        },
        availableAtOrFrom: atVenue,
        url: `${baseUrl}rozvrh-cenik.html`,
      },
    ];
  });

  return {
    "@type": "OfferCatalog",
    "@id": `${baseUrl}#nabidka`,
    name: "Lekce Just Yoga Boskovice",
    itemListElement: offers,
  };
}

// Rozsah cen za jednotlivou lekci, dopočítaný z dat — ne zapsaný podruhé.
export function priceRange() {
  const prices = ACTIVITIES.map((activity) => activity.pricePerLesson);
  return `${Math.min(...prices)}–${Math.max(...prices)} Kč`;
}
