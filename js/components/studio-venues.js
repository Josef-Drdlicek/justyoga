import { BaseElement } from "./base-component.js";
import "./cta-button.js";
import { PIN_ICON } from "../data/icons.js";
import { formatVenueAddress } from "../data/venues.js";

// <studio-venues>: set `.venues = [{ venue, activities }, …]`
//
// Vypíše karty všech míst, kde se cvičí, a u každého uvede, které lekce
// tam probíhají. Existuje proto, že studio má DVĚ adresy a dosud to web
// neříkal nikde kromě řádku v rozvrhu — kdo šel přímo na Kontakt, dostal
// jen jógové studio a na jumping mohl dojet na špatné místo.
//
// Seznam míst se odvozuje z aktivit (viz js/pages/*.js), takže přidání
// aktivity v novém místě přidá kartu samo.
export class StudioVenues extends BaseElement {
  #venues = [];

  set venues(value) {
    this.#venues = value || [];
    this.render();
  }

  styles() {
    return `
      :host { display: block; }
      .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--space-5);
      }
      .venue {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-2xl);
        padding: var(--space-5);
      }
      .lessons {
        margin: 0;
        font-weight: 600;
        font-family: var(--font-heading);
      }
      .address {
        display: flex;
        align-items: flex-start;
        gap: var(--space-2);
        margin: 0;
      }
      .icon { width: 1.25rem; height: 1.25rem; flex-shrink: 0; margin-top: 0.1em; }
      .icon svg { width: 100%; height: 100%; display: block; color: var(--color-primary); }
      .address__text { display: flex; flex-direction: column; }
      .address__name { font-weight: 600; }
      .note {
        margin: 0;
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
      }
      .directions { margin: 0; }
      .directions dt {
        font-weight: 600;
        font-size: var(--font-size-sm);
        color: var(--color-text-muted);
      }
      .directions dd { margin: 0 0 var(--space-3); }
      .actions { margin-top: auto; padding-top: var(--space-2); }

      @media (min-width: 768px) {
        .grid { grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); }
      }
    `;
  }

  template() {
    if (!this.#venues.length) return "";
    const cards = this.#venues
      .map(({ venue, activities, navigationUrl }) => {
        // Praktické pokyny se vykreslí jen tehdy, když je opravdu známe.
        // Dokud je klientka nedodá, je lepší je neuvádět než si je vymyslet
        // — špatný údaj o parkování je horší než žádný.
        const details = [
          ["Jak najdete vchod", venue.directions],
          ["Kde zaparkujete", venue.parking],
          ["Orientační bod", venue.landmark],
        ].filter(([, value]) => value);

        return `
          <article class="venue">
            <p class="lessons">${activities.map((a) => a.shortName ?? a.name).join(" · ")}</p>
            <p class="address">
              <span class="icon">${PIN_ICON}</span>
              <span class="address__text">
                <span class="address__name">${venue.name}</span>
                <span>${formatVenueAddress(venue)}</span>
              </span>
            </p>
            ${venue.note ? `<p class="note">${venue.note}</p>` : ""}
            ${
              details.length
                ? `<dl class="directions">${details
                    .map(([term, value]) => `<dt>${term}</dt><dd>${value}</dd>`)
                    .join("")}</dl>`
                : ""
            }
            <div class="actions">
              <cta-button href="${navigationUrl}" label="Navigovat"></cta-button>
            </div>
          </article>
        `;
      })
      .join("");
    return `<div class="grid">${cards}</div>`;
  }
}

customElements.define("studio-venues", StudioVenues);
