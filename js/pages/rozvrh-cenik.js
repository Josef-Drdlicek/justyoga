// Komponenty, které žijí jen na této stránce — registruje je ten skript,
// který je plní daty, ne main.js (viz komentář tam).
import "../components/schedule-widget.js";
import "../components/pricing-cards.js";

import { ACTIVITIES, getActivityById } from "../data/activities.js";
import { SCHEDULE } from "../data/schedule.js";
import { getVenueById, formatVenueLine } from "../data/venues.js";

// Místo se tady rozbaluje z venueId na hotový řádek, takže schedule-widget
// i pricing-cards zůstávají čistě prezentační a nic si nedohledávají.
const withVenue = (activity) => ({
  ...activity,
  venue: getVenueById(activity.venueId),
  location: formatVenueLine(getVenueById(activity.venueId)),
});

const scheduleWidget = document.querySelector("[data-schedule-widget]");
scheduleWidget.lessons = SCHEDULE.map((entry) => ({
  day: entry.day,
  time: entry.time,
  ...withVenue(getActivityById(entry.activityId)),
}));

const pricingCards = document.querySelector("[data-pricing-cards]");
pricingCards.activities = ACTIVITIES.map(withVenue);
