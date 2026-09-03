import { BaseElement } from "./base-component.js";
// Karty mají vlastní akční tlačítko, takže si cta-button musí naimportovat
// samy — spoléhat na registraci odjinud je skrytá závislost.
import "./cta-button.js";
import { SITE_CONFIG } from "../data/site-config.js";
import { CALENDAR_TIME_ICON, ACTIVITY_TYPE_ICONS, PIN_ICON } from "../data/icons.js";
import { formatVenueLine } from "../data/venues.js";

// <pricing-cards>: set `.activities = ACTIVITIES` — one card per lesson
// type. Ids can't live on the cards themselves: an id inside a Shadow DOM
// isn't reachable by a URL fragment (confirmed — the browser never scrolls
// to it), so the page anchor for external links lives on the wrapping
// light-DOM <section id="cenik"> in rozvrh-cenik.html instead.
export class PricingCards extends BaseElement {
  #activities = [];

  set activities(value) {
    this.#activities = value || [];
    this.render();
  }

  styles() {
    return `
      :host { display: block; }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        gap: var(--space-5);
      }
      .card {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-2xl);
        padding: var(--space-6);
      }
      .card--joga { background: var(--color-type-joga-bg); }
      .card--jumping { background: var(--color-type-jumping-bg); }
      .card--tabata { background: var(--color-type-tabata-bg); }
      .name {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--font-size-xl);
        font-weight: 600;
        margin: 0 0 var(--space-2);
      }
      .icon { width: 2.25rem; height: 2.25rem; flex-shrink: 0; }
      .icon svg { width: 100%; height: 100%; display: block; }
      .card--joga .icon { color: var(--color-type-joga); }
      .card--jumping .icon { color: var(--color-type-jumping); }
      .card--tabata .icon { color: var(--color-type-tabata); }
      .duration { color: var(--color-text-muted); margin: 0; }
      .price { font-size: var(--font-size-xl); font-weight: 600; margin: 0; }
      .pass { color: var(--color-text-muted); margin: 0; }
      .savings { font-weight: 600; color: var(--color-accent-dark); margin: var(--space-1) 0 0; }
      /* Místo konání přímo na kartě: ceník je stránka, kde se člověk
         rozhoduje, a studio má dvě adresy — záměna ho stojí lekci. */
      .venue {
        display: flex;
        align-items: flex-start;
        gap: var(--space-2);
        margin: var(--space-3) 0 0;
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
      }
      .venue .icon { width: 1rem; height: 1rem; margin-top: 0.15em; }
      .venue .icon svg { color: var(--color-text-muted); }
      /* Akce dolů a přilepené ke spodní hraně, aby karty s různě dlouhým
         textem měly tlačítka v jedné lince. Dřív karta žádnou akci
         neměla — člověk si přečetl cenu a neměl kam kliknout. */
      .actions {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        margin-top: auto;
        padding-top: var(--space-4);
      }
      .legend {
        margin: var(--space-5) 0 0;
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
      }
      .legend svg { width: 0.9em; height: 0.9em; vertical-align: -0.05em; }
    `;
  }

  template() {
    if (!this.#activities.length) return "";
    const cards = this.#activities
      .map((activity) => {
        const savings = activity.pricePerLesson * activity.passLessons - activity.passPrice;
        return `
          <article class="card card--${activity.id}">
            <h3 class="name"><span class="icon">${ACTIVITY_TYPE_ICONS[activity.id] ?? ""}</span>${activity.name}</h3>
            <p class="duration">${activity.durationMinutes} minut</p>
            <p class="price">${activity.pricePerLesson} Kč / lekce</p>
            <p class="pass">Permanentka: ${activity.passPrice} Kč / ${activity.passLessons} vstupů</p>
            ${savings > 0 ? `<p class="savings">Ušetříte ${savings} Kč</p>` : ""}
            ${
              activity.venue
                ? `<p class="venue"><span class="icon">${PIN_ICON}</span>${formatVenueLine(activity.venue)}</p>`
                : ""
            }
            <div class="actions">
              <!-- Primární akce vede do rozvrhu, ne rovnou do externího
                   rezervačního systému: člověk, který si právě přečetl cenu,
                   ještě neviděl jediný termín. Rezervovat jde hned pod tím. -->
              <cta-button href="#rozvrh" label="Zobrazit termíny"></cta-button>
              <cta-button href="${activity.bookingUrl}" label="Rezervovat" variant="accent"></cta-button>
            </div>
          </article>
        `;
      })
      .join("");
    return `
      <div class="grid">${cards}</div>
      <p class="legend">${CALENDAR_TIME_ICON} Permanentka platí ${SITE_CONFIG.passValidityMonths} měsíců od zakoupení.</p>
    `;
  }
}

customElements.define("pricing-cards", PricingCards);
