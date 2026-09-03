/* Homepage: wires data to the slots in index.html.

   A page script does nothing but pick blocks and fill slots — no markup, no
   styling decisions. Adding a section is a slot in the HTML plus one line
   here. */

import { mount } from "../lib/dom.js";
import { initReveal } from "../lib/reveal.js";
import { mountChrome } from "../ui/chrome.js";
import {
  renderWeek,
  renderActivities,
  renderFaq,
  renderVenues,
  renderSteps,
  FIRST_VISIT_STEPS,
} from "../ui/sections.js";
import { ACTIVITIES } from "../data/activities.js";
import { FAQ } from "../data/faq.js";

mountChrome();

mount("[data-week]", renderWeek);
mount("[data-activities]", () => renderActivities(ACTIVITIES));
mount("[data-steps]", () => renderSteps(FIRST_VISIT_STEPS));
mount("[data-venues]", renderVenues);

// The homepage shows the questions a first-time visitor asks; the full list
// lives on the schedule page, where someone comparing details will look.
mount("[data-faq]", () => renderFaq(FAQ.slice(0, 6)));

initReveal();
