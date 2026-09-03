import { ACTIVITIES, getActivityById } from "../data/activities.js";
import { SCHEDULE } from "../data/schedule.js";

const scheduleWidget = document.querySelector("[data-schedule-widget]");
scheduleWidget.lessons = SCHEDULE.map((entry) => ({
  day: entry.day,
  time: entry.time,
  ...getActivityById(entry.activityId),
}));

const pricingCards = document.querySelector("[data-pricing-cards]");
pricingCards.activities = ACTIVITIES;
