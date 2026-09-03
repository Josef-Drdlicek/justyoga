import { BaseElement } from "./base-component.js";
import { PIN_ICON, ACTIVITY_TYPE_ICONS } from "../data/icons.js";

const WEEKDAYS = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];
// Aligned with Date#getDay(): 0 = Sunday.
const JS_DAY_INDEX_TO_WEEKDAY = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
const DAY_ABBREVIATIONS = {
  Pondělí: "Po",
  Úterý: "Út",
  Středa: "St",
  Čtvrtek: "Čt",
  Pátek: "Pá",
  Sobota: "So",
  Neděle: "Ne",
};

// Today if it has a lesson, otherwise the next day (wrapping across the
// week) that does.
function pickDefaultDay(daysWithLessons) {
  const todayIndex = WEEKDAYS.indexOf(JS_DAY_INDEX_TO_WEEKDAY[new Date().getDay()]);
  for (let offset = 0; offset < 7; offset++) {
    const candidate = WEEKDAYS[(todayIndex + offset) % 7];
    if (daysWithLessons.includes(candidate)) return candidate;
  }
  return daysWithLessons[0];
}

// <schedule-widget>: set `.lessons = [{ day, time, id, name, shortName,
// location, pricePerLesson, bookingUrl }, …]` — one row per schedule slot.
// Lesson cards sit two-per-row beside a time, so they show `shortName` when
// the activity has one ("Tabata / HIIT") and fall back to the full name.
// Activity fields are already resolved by js/pages/rozvrh-cenik.js, so this
// component only renders — it doesn't look anything up.
export class ScheduleWidget extends BaseElement {
  #lessons = [];
  #selectedDay = null;

  set lessons(value) {
    this.#lessons = value || [];
    const days = this.#days;
    if (!this.#selectedDay || !days.includes(this.#selectedDay)) {
      this.#selectedDay = pickDefaultDay(days);
    }
    this.render();
  }

  connectedCallback() {
    super.connectedCallback();
    // Delegated on the shadow root (not per-button) so it keeps working
    // across re-renders without re-attaching a listener each time.
    this.shadowRoot.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-day]");
      if (!tab) return;
      this.#selectedDay = tab.dataset.day;
      this.render();
    });
  }

  get #days() {
    return WEEKDAYS.filter((day) => this.#lessons.some((lesson) => lesson.day === day));
  }

  styles() {
    return `
      :host { display: block; }
      .tabs {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-2);
        margin-bottom: var(--space-5);
      }
      .tab {
        border: 1px solid var(--color-border);
        background: var(--color-surface);
        color: var(--color-text-muted);
        font-weight: 600;
        font-family: var(--font-body);
        font-size: var(--font-size-sm);
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: background var(--transition-fast), color var(--transition-fast);
      }
      .tab:hover { color: var(--color-text); }
      .tab:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
      .tab[aria-selected="true"] {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: var(--color-primary-contrast);
      }
      .lessons {
        display: grid;
        gap: var(--space-4);
      }
      .lesson {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-2xl);
        padding: var(--space-5);
      }
      .lesson--joga { background: var(--color-type-joga-bg); }
      .lesson--jumping { background: var(--color-type-jumping-bg); }
      .lesson--tabata { background: var(--color-type-tabata-bg); }
      .lesson__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .lesson__name {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--font-size-lg);
        font-weight: 600;
        margin: 0;
      }
      .lesson__time {
        font-size: var(--font-size-xl);
        font-weight: 700;
        color: var(--color-text);
        white-space: nowrap;
      }
      .lesson__location {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
        margin: 0;
      }
      .icon { width: 1.5rem; height: 1.5rem; flex-shrink: 0; }
      .lesson__location .icon { width: 1rem; height: 1rem; color: var(--color-text-muted); }
      .icon svg { width: 100%; height: 100%; display: block; }
      .lesson--joga .lesson__name .icon { color: var(--color-type-joga); }
      .lesson--jumping .lesson__name .icon { color: var(--color-type-jumping); }
      .lesson--tabata .lesson__name .icon { color: var(--color-type-tabata); }
      .lesson__foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        margin-top: auto;
      }
      .lesson__price { font-weight: 600; }
      .lesson__foot cta-button { flex-shrink: 0; }
      .text-full { display: none; }
      .text-short { display: inline; }

      /* Narrow cards (mobile) don't reliably fit "150 Kč / lekce" beside a
         "Rezervovat" button on one line — stack them instead of risking an
         awkward mid-price wrap. */
      @media (width < 768px) {
        .lesson__foot { flex-direction: column; align-items: stretch; gap: var(--space-4); }
        .tabs { width: 100%; }
        .tab { flex: 1; text-align: center; }
      }

      @media (min-width: 768px) {
        .lessons { grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr)); }
        .text-full { display: inline; }
        .text-short { display: none; }
      }
    `;
  }

  template() {
    if (!this.#lessons.length) return "";
    const days = this.#days;
    const tabs = days
      .map(
        (day) => `
          <button type="button" class="tab" id="tab-${day}" role="tab" data-day="${day}"
            aria-selected="${day === this.#selectedDay}" aria-controls="panel-${day}">
            <span class="text-full">${day}</span><span class="text-short">${DAY_ABBREVIATIONS[day]}</span>
          </button>
        `
      )
      .join("");

    const dayLessons = this.#lessons.filter((lesson) => lesson.day === this.#selectedDay);
    const cards = dayLessons
      .map(
        (lesson) => `
          <article class="lesson lesson--${lesson.id}">
            <div class="lesson__head">
              <h3 class="lesson__name"><span class="icon">${ACTIVITY_TYPE_ICONS[lesson.id] ?? ""}</span>${lesson.shortName ?? lesson.name}</h3>
              <span class="lesson__time">${lesson.time}</span>
            </div>
            <p class="lesson__location">
              <span class="icon">${PIN_ICON}</span>
              ${lesson.location}
            </p>
            <div class="lesson__foot">
              <span class="lesson__price">${lesson.pricePerLesson} Kč / lekce</span>
              <cta-button href="${lesson.bookingUrl}" label="Rezervovat" variant="accent"></cta-button>
            </div>
          </article>
        `
      )
      .join("");

    return `
      <div class="tabs" role="tablist" aria-label="Den v týdnu">${tabs}</div>
      <div class="lessons" role="tabpanel" id="panel-${this.#selectedDay}" aria-labelledby="tab-${this.#selectedDay}">
        ${cards}
      </div>
    `;
  }
}

customElements.define("schedule-widget", ScheduleWidget);
