import { SCHEDULE } from "../data/schedule.js";
import { getActivityById } from "../data/activities.js";

// Otevírací hodiny pro strukturovaná data, spočítané z reálného rozvrhu —
// aby nevznikl druhý seznam časů, který by se rozešel s tím, co je na webu.
//
// Počítá se ZVLÁŠŤ PRO KAŽDÉ MÍSTO: studio a posilovna mají jiné dny,
// a jeden den může mít lekce na obou adresách (pondělí i středa).
//
// Sémantická poznámka: openingHoursSpecification znamená "kdy je otevřeno",
// ne "kdy je lekce". Rozsah od první do poslední lekce v daném dni je pro
// provozovnu pravdivá aproximace a Google ji používá do panelu firmy.

const DAY_URLS = {
  Pondělí: "https://schema.org/Monday",
  Úterý: "https://schema.org/Tuesday",
  Středa: "https://schema.org/Wednesday",
  Čtvrtek: "https://schema.org/Thursday",
  Pátek: "https://schema.org/Friday",
  Sobota: "https://schema.org/Saturday",
  Neděle: "https://schema.org/Sunday",
};

// POZOR: časy v schedule.js jsou zapsané s typografickou pomlčkou (–),
// ne s obyčejným spojovníkem. Split na "-" by tady tiše vrátil celý řetězec
// jako čas začátku a undefined jako konec.
const TIME_SEPARATOR = "–";

export function openingHoursFor(venueId) {
  const byDay = new Map();

  for (const entry of SCHEDULE) {
    const activity = getActivityById(entry.activityId);
    if (!activity || activity.venueId !== venueId) continue;

    const [opens, closes] = entry.time.split(TIME_SEPARATOR).map((part) => part.trim());
    if (!opens || !closes) continue;

    const current = byDay.get(entry.day);
    byDay.set(entry.day, {
      opens: current && current.opens < opens ? current.opens : opens,
      closes: current && current.closes > closes ? current.closes : closes,
    });
  }

  return [...byDay.entries()].map(([day, hours]) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: DAY_URLS[day],
    opens: hours.opens,
    closes: hours.closes,
  }));
}
