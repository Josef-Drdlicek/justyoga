import { ACTIVITIES } from "../data/activities.js";
import { NEWS } from "../data/news.js";
import { FAQ } from "../data/faq.js";

const grid = document.querySelector("[data-activities-grid]");

for (const activity of ACTIVITIES) {
  const card = document.createElement("activity-card");
  card.activity = activity;
  grid.append(card);
}

// Aktuality a časté otázky jsou obsah, který může být dočasně prázdný.
// Nadpis sekce žije v HTML (jako u ostatních sekcí), takže samotná
// komponenta ho skrýt nedokáže — sekce proto začíná jako `hidden` a odkryje
// ji až tenhle skript, když opravdu má co zobrazit.
function fillSection(sectionSelector, componentSelector, items) {
  if (!items.length) return;
  document.querySelector(componentSelector).items = items;
  document.querySelector(sectionSelector).hidden = false;
}

fillSection("[data-news-section]", "[data-news-board]", NEWS);
fillSection("[data-faq-section]", "[data-faq-list]", FAQ);
