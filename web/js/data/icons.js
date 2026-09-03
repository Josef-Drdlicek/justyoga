// Shared inline SVG icon markup — single source so no page copy-pastes an
// icon's <svg> a second time. Icons are plain HTML strings (not components)
// because they're embedded inside other strings (table legends) or assigned
// via innerHTML next to plain text, not used as standalone elements.

// Tabler Icons "map-pin" (MIT), same stroke style as the icons below —
// emoji pins render too inconsistently across platforms for this shape, so
// it's an inline SVG, kept in the same stroke family as the rest of the set
// (this used to be a lone fill-style icon, the one visual outlier on the site).
export const PIN_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" />' +
  '<path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />' +
  '<path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />' +
  "</svg>";

// Tabler Icons "calendar-time" (MIT), inlined so there's no icon-font/CDN
// dependency at runtime.
export const CALENDAR_TIME_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" />' +
  '<path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" />' +
  '<path d="M14 18a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />' +
  '<path d="M15 3v4" />' +
  '<path d="M7 3v4" />' +
  '<path d="M3 11h16" />' +
  '<path d="M18 16.496v1.504l1 1" />' +
  "</svg>";

// Tabler Icons "phone" (MIT), same stroke style as calendar-time above.
export const PHONE_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" />' +
  '<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />' +
  "</svg>";

// Tabler Icons "mail" (MIT), same stroke style as calendar-time above.
export const MAIL_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" />' +
  '<path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />' +
  '<path d="M3 7l9 6l9 -6" />' +
  "</svg>";

// Tabler Icons "brand-facebook" (MIT), same stroke style as calendar-time above.
export const FACEBOOK_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" />' +
  '<path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />' +
  "</svg>";

// Tabler Icons "brand-instagram" (MIT), same stroke style as calendar-time above.
export const INSTAGRAM_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" />' +
  '<path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4l0 -8" />' +
  '<path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />' +
  '<path d="M16.5 7.5v.01" />' +
  "</svg>";

// No matching Tabler Icons glyph exists for yoga/jumping/tabata specifically —
// these three are hand-drawn in the same 24x24 stroke style as the set above,
// so they read as one consistent icon family rather than a mismatched import.

// Seated figure with arms raised in a V and legs crossed — yoga.
export const YOGA_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<circle cx="12" cy="4.5" r="1.5" />' +
  '<path d="M12 6.5v4" />' +
  '<path d="M12 8.5c-2.5 1.5 -4 2 -6.5 1.5" />' +
  '<path d="M12 8.5c2.5 1.5 4 2 6.5 1.5" />' +
  '<path d="M12 10.5v4.5" />' +
  '<path d="M12 15c-1.5 2 -3 2.5 -5 2.5" />' +
  '<path d="M12 15c1.5 2 3 2.5 5 2.5" />' +
  "</svg>";

// Double chevron bouncing upward off a springy trampoline line — jumping.
// Deliberately not another seated/standing figure like YOGA_ICON above:
// two similar humanoid glyphs only differing by color read as near-identical
// at 24px, defeating the "recognize the type before reading the label" goal.
export const JUMPING_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M6 13l6 -6l6 6" />' +
  '<path d="M6 19l6 -6l6 6" />' +
  "</svg>";

// Stopwatch — interval training / Tabata.
export const TABATA_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M10 2h4" />' +
  '<path d="M12 2v2" />' +
  '<circle cx="12" cy="13" r="7" />' +
  '<path d="M12 10v3l2 2" />' +
  "</svg>";

// Lookup so components map an activity's id straight to its icon/color
// without each one re-declaring the same joga/jumping/tabata switch.
export const ACTIVITY_TYPE_ICONS = {
  joga: YOGA_ICON,
  jumping: JUMPING_ICON,
  tabata: TABATA_ICON,
};
