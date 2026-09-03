/* Renderers for the content blocks a page assembles.

   Each function takes data and returns nodes. They know nothing about which
   page they land on and nothing about each other, so a page is a short list
   of "put this block here". */

import { el, append } from "../lib/dom.js";
import { SCHEDULE } from "../data/schedule.js";
import { getActivityById } from "../data/activities.js";
import { getVenueById, formatVenueAddress, venueNavigationUrl } from "../data/venues.js";
import { ACTIVITY_TYPE_ICONS, PIN_ICON } from "../data/icons.js";

/* --- Week strip ------------------------------------------------------
   The question every visitor arrives with is "when can I come?", and the
   old homepage answered it nowhere — it sent people to a separate page to
   find out. This block puts the actual week above the fold. */

const DAY_ORDER = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];

function groupByDay(rows) {
  const byDay = new Map();
  for (const row of rows) {
    if (!byDay.has(row.day)) byDay.set(row.day, []);
    byDay.get(row.day).push(row);
  }
  return [...byDay.entries()].sort(
    ([a], [b]) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
  );
}

function lessonRow(row) {
  const activity = getActivityById(row.activityId);
  const venue = getVenueById(activity.venueId);

  return el("li", { class: "week__lesson" }, [
    el("span", { class: "week__time", text: row.time }),
    el("span", { class: "week__lesson-body" }, [
      el("span", { class: "week__name" }, [
        el("span", {
          class: "week__icon",
          "aria-hidden": "true",
          html: ACTIVITY_TYPE_ICONS[activity.id] ?? "",
        }),
        el("span", { text: activity.shortName ?? activity.name }),
      ]),
      // Two venues, and mixing them up costs someone their lesson. The
      // place is never implied here, it is always written out.
      el("span", { class: "week__venue muted", text: venue.label }),
    ]),
  ]);
}

export function renderWeek() {
  return el(
    "ol",
    { class: "week" },
    groupByDay(SCHEDULE).map(([day, rows], index) =>
      el("li", { class: "week__day", dataset: { reveal: "" }, style: `--reveal-index:${index}` }, [
        el("h3", { class: "week__day-name", text: day }),
        el("ul", { class: "week__lessons" }, rows.map(lessonRow)),
      ])
    )
  );
}

/* --- Activity cards --------------------------------------------------
   One card recipe, one surface, no per-activity background tint. The old
   build tinted each card with a different pastel, which is what made three
   lessons read as three unrelated brands. The activity is now identified
   by its own logo and its icon, not by painting the whole box. */

export function renderActivityCard(activity, index = 0) {
  const venue = getVenueById(activity.venueId);

  const meta = el("dl", { class: "activity__meta" }, [
    el("dt", { class: "visually-hidden", text: "Délka lekce" }),
    el("dd", { text: `${activity.durationMinutes} minut` }),
    el("dt", { class: "visually-hidden", text: "Cena" }),
    el("dd", { text: `${activity.pricePerLesson} Kč za lekci` }),
    el("dt", { class: "visually-hidden", text: "Místo" }),
    el("dd", { text: venue.label }),
  ]);

  return el(
    "article",
    {
      class: "card card--raise activity",
      dataset: { reveal: "" },
      style: `--reveal-index:${index}`,
    },
    [
      el("img", {
        class: "activity__logo",
        src: activity.logo.src,
        alt: activity.name,
        width: activity.logo.width,
        height: activity.logo.height,
        loading: "lazy",
      }),
      el("h3", { class: "activity__name", text: activity.name }),
      el("p", { class: "activity__headline", text: activity.headline }),
      el("p", { class: "activity__tagline muted", text: activity.tagline }),
      el(
        "ul",
        { class: "activity__benefits" },
        activity.benefits.map((benefit) => el("li", { text: benefit }))
      ),
      meta,
      el("a", {
        class: "btn btn--ghost btn--block activity__cta",
        href: "rozvrh-cenik.html#rozvrh",
        text: "Zobrazit termíny",
      }),
    ]
  );
}

export function renderActivities(activities) {
  return el(
    "div",
    { class: "activities" },
    activities.map((activity, index) => renderActivityCard(activity, index))
  );
}

/* --- FAQ -------------------------------------------------------------
   Native <details>: it is keyboard accessible, screen-reader announced and
   works with JavaScript switched off, none of which a hand-built accordion
   gets for free. */

export function renderFaq(items) {
  return el(
    "div",
    { class: "faq" },
    items.map((item, index) =>
      el(
        "details",
        { class: "faq__item", dataset: { reveal: "" }, style: `--reveal-index:${index}` },
        [
          el("summary", { class: "faq__question" }, [el("span", { text: item.question })]),
          el("div", { class: "faq__answer" }, [el("p", { text: item.answer })]),
        ]
      )
    )
  );
}

/* --- Booking ---------------------------------------------------------
   Every one of these leaves the site for someone else's system, so the
   label says so. The old build wrote "Rezervovat" on a link that lands on
   a team invitation, i.e. a sign-up screen — a button that promises a slot
   and delivers a registration form is where visitors give up.

   ⚠️ The destinations themselves are still wrong; see the note in
   js/data/activities.js. This block only stops the label from lying. */

export function renderBooking(activities) {
  return el(
    "ul",
    { class: "booking" },
    activities.map((activity, index) =>
      el("li", { class: "booking__item", dataset: { reveal: "" }, style: `--reveal-index:${index}` }, [
        el("span", { class: "booking__name", text: activity.name }),
        el("a", {
          class: "btn btn--accent",
          href: activity.bookingUrl,
          target: "_blank",
          rel: "noopener",
          text: "Otevřít rezervace",
        }),
        el("span", {
          class: "booking__note muted",
          text: "Otevře se v novém okně, mimo tento web.",
        }),
      ])
    )
  );
}

/* --- Pricing ---------------------------------------------------------
   The pass maths is done here rather than left to the visitor. The old
   build printed "1900 Kč / 10 vstupů" next to "210 Kč za lekci" and left
   the reader to work out whether that was a saving. */

const czk = new Intl.NumberFormat("cs-CZ");

export function renderPricing(activities, passValidityMonths) {
  return el(
    "div",
    { class: "pricing" },
    activities.map((activity, index) => {
      const perLessonInPass = Math.round(activity.passPrice / activity.passLessons);
      const saving = (activity.pricePerLesson - perLessonInPass) * activity.passLessons;

      return el(
        "article",
        { class: "card pricing__item", dataset: { reveal: "" }, style: `--reveal-index:${index}` },
        [
          el("h3", { class: "pricing__name", text: activity.name }),
          el("p", { class: "pricing__single" }, [
            el("span", { class: "pricing__amount", text: `${czk.format(activity.pricePerLesson)} Kč` }),
            el("span", { class: "pricing__unit muted", text: "jednotlivá lekce" }),
          ]),
          el("div", { class: "pricing__pass" }, [
            el("p", { class: "pricing__pass-head" }, [
              el("span", {
                class: "pricing__amount",
                text: `${czk.format(activity.passPrice)} Kč`,
              }),
              el("span", {
                class: "pricing__unit muted",
                text: `permanentka na ${activity.passLessons} vstupů`,
              }),
            ]),
            el("p", {
              class: "pricing__math",
              text:
                `Vychází na ${czk.format(perLessonInPass)} Kč za lekci, ` +
                `ušetříte ${czk.format(saving)} Kč.`,
            }),
            el("p", {
              class: "pricing__validity muted",
              text: `Platí ${passValidityMonths} měsíců od zakoupení.`,
            }),
          ]),
        ]
      );
    })
  );
}

/* --- Venues ---------------------------------------------------------- */

export function renderVenues() {
  return el(
    "div",
    { class: "venues" },
    [
      getVenueById("studio"),
      getVenueById("hala"),
    ].map((venue, index) =>
      el("article", { class: "card venue", dataset: { reveal: "" }, style: `--reveal-index:${index}` }, [
        el("span", { class: "venue__icon", "aria-hidden": "true", html: PIN_ICON }),
        el("h3", { class: "venue__label", text: venue.label }),
        el("p", { class: "venue__name muted", text: venue.name }),
        el("p", { class: "venue__address", text: formatVenueAddress(venue) }),
        venue.note ? el("p", { class: "venue__note", text: venue.note }) : null,
        el("a", {
          class: "venue__link",
          href: venueNavigationUrl(venue),
          rel: "noopener",
          target: "_blank",
          text: "Navigovat",
        }),
      ])
    )
  );
}

/* --- Gallery ---------------------------------------------------------
   A plain grid. The old build wrapped this in a component with its own
   stylesheet to draw nine images in a grid, which is a component that
   earns nothing. Videos stay behind their posters and are never set to
   autoplay: a page that starts moving on arrival is the opposite of calm. */

export function renderGallery(photos) {
  return el(
    "ul",
    { class: "gallery" },
    photos.map((photo, index) =>
      el("li", { class: "gallery__item", dataset: { reveal: "" }, style: `--reveal-index:${index % 3}` }, [
        el("img", {
          src: photo.src,
          alt: photo.alt,
          loading: "lazy",
          decoding: "async",
        }),
      ])
    )
  );
}

export function renderVideos(videos) {
  return el(
    "ul",
    { class: "gallery gallery--video" },
    videos.map((video, index) =>
      el("li", { class: "gallery__item", dataset: { reveal: "" }, style: `--reveal-index:${index}` }, [
        el("video", {
          src: video.src,
          poster: video.poster,
          width: video.width,
          height: video.height,
          controls: true,
          preload: "none",
          playsInline: true,
          "aria-label": video.label,
        }),
      ])
    )
  );
}

/* --- First visit -----------------------------------------------------
   The strongest barrier for a beginner is not price, it is not knowing what
   happens. Steps stay free of facts nobody has confirmed: parking, how many
   minutes early to arrive and the cancellation window are still unknown and
   are deliberately absent rather than invented. */

export const FIRST_VISIT_STEPS = [
  {
    title: "Vyberte si lekci",
    text: "V rozvrhu najdete, co se kdy cvičí. Když si nejste jistí, začněte jógou nebo kruhovým tréninkem — u obou si tempo určujete sami.",
  },
  {
    title: "Rezervujte si místo",
    text: "Rezervace běží v samostatném systému, otevře se v novém okně. Bez rezervace nemám jistotu, že na vás vyjde místo.",
  },
  {
    title: "Přijďte v čem je vám dobře",
    text: "Stačí pohodlné oblečení a lahev s vodou. Podložky a pomůcky máte na místě.",
  },
  {
    title: "Cvičíte sami za sebe",
    text: "U každého cviku ukážu lehčí i těžší variantu. Kdyby vám cokoli nesedělo, řekněte mi to během lekce.",
  },
];

export function renderSteps(steps) {
  return el(
    "ol",
    { class: "steps" },
    steps.map((step, index) =>
      el("li", { class: "steps__item", dataset: { reveal: "" }, style: `--reveal-index:${index}` }, [
        el("span", { class: "steps__number", "aria-hidden": "true", text: String(index + 1).padStart(2, "0") }),
        el("h3", { class: "steps__title", text: step.title }),
        el("p", { class: "steps__text muted", text: step.text }),
      ])
    )
  );
}
