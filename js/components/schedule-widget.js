import { BaseElement } from "./base-component.js";
// Tahle komponenta staví <cta-button> ve svém template(), takže si ho musí
// naimportovat sama. Dosud fungovala jen díky tomu, že ho main.js registruje
// na každé stránce — jakmile se registrace rozdělí per-page, byla by to
// skrytá závislost, která rozvrh rozbije.
import "./cta-button.js";
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
      if (tab) this.#select(tab.dataset.day, { moveFocus: false });
    });
    this.shadowRoot.addEventListener("keydown", this.#onKeydown);
  }

  // Přepnutí dne NENÍ změna dat, takže nesmí projít render(). Ten přepisuje
  // celý shadow root, tedy i právě rozkliknuté tlačítko — fokus by se
  // ztratil a klávesnicové ovládání tabů by po prvním přepnutí skončilo.
  // Mutují se proto jen atributy existujících uzlů (stejný vzor jako
  // site-nav.js #setOpen).
  #select(day, { moveFocus }) {
    if (!this.#days.includes(day)) return;
    this.#selectedDay = day;
    for (const tab of this.shadowRoot.querySelectorAll("[data-day]")) {
      const isSelected = tab.dataset.day === day;
      tab.setAttribute("aria-selected", String(isSelected));
      // Roving tabindex: z celé skupiny tabů je v tab orderu jen ten
      // vybraný, mezi nimi se přechází šipkami (ARIA vzor pro tablist).
      tab.tabIndex = isSelected ? 0 : -1;
      if (isSelected && moveFocus) tab.focus();
    }
    for (const panel of this.shadowRoot.querySelectorAll("[data-panel]")) {
      panel.hidden = panel.dataset.panel !== day;
    }
  }

  // Šipky jsou povinné, ne bonus: jakmile neaktivní taby dostanou
  // tabindex="-1", přestanou být dosažitelné Tabem, a bez téhle obsluhy
  // by se ke zbytku týdne klávesnicí nešlo dostat vůbec.
  #onKeydown = (event) => {
    const tab = event.target.closest?.("[data-day]");
    if (!tab) return;
    const days = this.#days;
    const current = days.indexOf(tab.dataset.day);
    const next = {
      ArrowRight: days[(current + 1) % days.length],
      ArrowLeft: days[(current - 1 + days.length) % days.length],
      Home: days[0],
      End: days[days.length - 1],
    }[event.key];
    if (!next) return;
    event.preventDefault();
    this.#select(next, { moveFocus: true });
  };

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
      .tab:focus-visible { outline: var(--focus-ring-width) solid var(--focus-ring-color); outline-offset: var(--focus-ring-offset); }
      .tab[aria-selected="true"] {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: var(--color-primary-contrast);
      }
      .lessons {
        display: grid;
        gap: var(--space-4);
      }
      /* Nutné explicitně: globální [hidden] { display: none } má nižší
         specificitu než .lessons { display: grid } výše, takže by samotný
         atribut hidden panel neskryl. */
      .lessons[hidden] { display: none; }
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
            aria-selected="${day === this.#selectedDay}" aria-controls="panel-${day}"
            tabindex="${day === this.#selectedDay ? 0 : -1}">
            <span class="text-full">${day}</span><span class="text-short">${DAY_ABBREVIATIONS[day]}</span>
          </button>
        `
      )
      .join("");

    const card = (lesson) => `
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
        `;

    // Panel se renderuje pro KAŽDÝ den, neaktivní jen s atributem hidden.
    // Dřív existoval v DOM jen panel vybraného dne, takže aria-controls
    // na ostatních tabech ukazovalo na neexistující id — čtečka ohlásí
    // rozbitou vazbu tab↔panel. Devět karet ve čtyřech dnech je navíc
    // zanedbatelný obsah (žádné obrázky, žádná media).
    // tabindex na panelu záměrně není: panel obsahuje fokusovatelné prvky
    // (tlačítka Rezervovat), takže by byl jen tab stop navíc.
    const panels = days
      .map(
        (day) => `
          <div class="lessons" role="tabpanel" data-panel="${day}" id="panel-${day}"
            aria-labelledby="tab-${day}"${day === this.#selectedDay ? "" : " hidden"}>
            ${this.#lessons
              .filter((lesson) => lesson.day === day)
              .map(card)
              .join("")}
          </div>
        `
      )
      .join("");

    return `
      <div class="tabs" role="tablist" aria-label="Den v týdnu">${tabs}</div>
      ${panels}
    `;
  }
}

customElements.define("schedule-widget", ScheduleWidget);
