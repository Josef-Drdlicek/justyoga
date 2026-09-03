/* Homepage: wires data to the slots in index.html.

   A page script does nothing but pick blocks and fill slots — no markup, no
   styling decisions. Adding a section is a slot in the HTML plus one line
   here. */

import { mount, $ } from "../lib/dom.js";
import { initReveal } from "../lib/reveal.js";
import { mountChrome } from "../ui/chrome.js";
import {
  renderWeek,
  renderWeekLegend,
  renderFaq,
  renderVenues,
  renderSteps,
  renderZone,
  renderBridge,
  renderRestZone,
  FIRST_VISIT_STEPS,
} from "../ui/sections.js";
import { renderHeartRateMeter, initHeartRateMeter } from "../ui/heart-rate-meter.js";
import { ACTIVITIES } from "../data/activities.js";
import { FAQ } from "../data/faq.js";
import { ZONES, REST_ZONE, BRIDGE_TEXT } from "../data/zones.js";

mountChrome();

mount("[data-week-legend]", renderWeekLegend);
mount("[data-week]", renderWeek);

// Each zone replaces its placeholder rather than filling it: the meter
// measures the section elements themselves, so an extra wrapper div would
// put the measured box in the wrong place.
for (const zone of ZONES) {
  const slot = $(`[data-zone-${zone.id}]`);
  if (slot) slot.replaceWith(renderZone(zone, ACTIVITIES));
}

mount("[data-bridge]", () => renderBridge(BRIDGE_TEXT));

const restSlot = $("[data-zone-rest]");
if (restSlot) restSlot.replaceWith(renderRestZone(REST_ZONE));

mount("[data-steps]", () => renderSteps(FIRST_VISIT_STEPS));
mount("[data-venues]", renderVenues);

// The homepage shows the questions a first-time visitor asks; the full list
// lives on the schedule page, where someone comparing details will look.
mount("[data-faq]", () => renderFaq(FAQ.slice(0, 6)));

const meterSlot = $("[data-heart-rate-meter]");
if (meterSlot) meterSlot.replaceWith(renderHeartRateMeter());
initHeartRateMeter();

initReveal();
