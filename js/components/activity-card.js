import { BaseElement } from "./base-component.js";
import "./cta-button.js";

// <activity-card> — set `.activity = {...}` from JS (see activities.js shape).
export class ActivityCard extends BaseElement {
  #activity = null;

  set activity(value) {
    this.#activity = value;
    this.render();
  }

  styles() {
    return `
      /* Grid items also default to min-width:auto — without min-width:0 a
         card can refuse to shrink below its longest word and force the
         whole page to scroll horizontally on narrow viewports. */
      :host { display: block; height: 100%; min-width: 0; }
      .card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-xl);
        padding: var(--space-6);
        box-shadow: var(--shadow-sm);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        height: 100%;
      }
      .logo { margin: 0; }
      .logo img {
        height: 3rem;
        width: auto;
        display: block;
        margin: 0 auto;
      }
      /* Spells out lesson types the logo image itself can't carry (the
         "JUST TABATA" logo predates HIIT/kruhový trénink) — so the card
         still names everything the lesson covers without a reprint. */
      .logo-subtitle {
        margin: var(--space-2) 0 0;
        font-family: var(--font-heading);
        font-weight: 600;
        font-size: var(--font-size-sm);
        letter-spacing: 0.04em;
        color: var(--color-accent);
      }
      /* Cards in a row stretch to equal height; anchoring the text to the
         top and the price to the bottom of the flexible middle keeps the
         price and button rows aligned across cards even when the texts
         wrap to a different number of lines. */
      .content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: calc(var(--space-2) + var(--space-1));
        margin-top: var(--space-4);
      }
      .headline {
        font-family: var(--font-heading);
        font-weight: 600;
        font-size: var(--font-size-lg);
        line-height: 1.3;
        margin: 0;
      }
      .tagline { color: var(--color-text-muted); margin: 0; }
      /* Scannable benefits — mobile visitors skim the card rather than read
         it, so the three payoffs get their own left-aligned checklist
         instead of hiding inside the paragraph above. */
      .benefits {
        list-style: none;
        margin: var(--space-2) 0 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        text-align: left;
        font-size: var(--font-size-sm);
      }
      .benefits li {
        display: grid;
        grid-template-columns: 1.25rem 1fr;
        gap: var(--space-2);
      }
      /* Checkmark as CSS content, not a character in the data: activities.js
         stays plain text (reusable in the schedule, e-mails, anywhere) and
         this component decides how a benefit is marked. */
      .benefits li::before {
        content: "✓";
        color: var(--color-accent);
        font-weight: 700;
      }
      .price { font-weight: 600; margin: auto 0 0; }
      cta-button { margin-top: calc(var(--space-4) + var(--space-1)); }
      /* Limited-capacity line directly under the button — the client asked
         for it there deliberately, as the nudge to book now rather than later. */
      .capacity {
        margin: var(--space-2) 0 0;
        font-size: var(--font-size-sm);
        color: var(--color-text-muted);
      }
      /* Sits inside .content, above the price, rather than at the very bottom
         of the card: the price is pushed to the bottom of .content by an auto
         margin, so anything below it would shift this card's price and button
         out of line with the neighbouring cards' (which have no note). */
      .note {
        margin: var(--space-2) 0 0;
        padding: var(--space-3);
        border-radius: var(--radius-md);
        background: color-mix(in srgb, var(--color-accent) 7%, var(--color-surface));
        font-size: var(--font-size-sm);
        text-align: left;
      }

      @media (width < 768px) {
        .card { padding: var(--space-5); }
      }
    `;
  }

  template() {
    const activity = this.#activity;
    if (!activity) return "";
    const benefits = (activity.benefits ?? [])
      .map((benefit) => `<li>${benefit}</li>`)
      .join("");
    return `
      <article class="card">
        <h3 class="logo"><img src="${activity.logo.src}" alt="${activity.name}"
          width="${activity.logo.width}" height="${activity.logo.height}" loading="lazy" /></h3>
        ${activity.logoSubtitle ? `<p class="logo-subtitle">${activity.logoSubtitle}</p>` : ""}
        <div class="content">
          ${activity.headline ? `<p class="headline">${activity.headline}</p>` : ""}
          <p class="tagline">${activity.tagline}</p>
          ${benefits ? `<ul class="benefits">${benefits}</ul>` : ""}
          ${activity.note ? `<p class="note">${activity.note}</p>` : ""}
          <p class="price">${activity.pricePerLesson} Kč / lekce</p>
        </div>
        <cta-button
          href="${activity.bookingUrl}"
          label="${activity.ctaLabel ?? "Rezervovat"}"
          variant="accent"
        ></cta-button>
        ${
          activity.capacity
            ? `<p class="capacity">Kapacita lekce je omezena na ${activity.capacity} míst, rezervujte včas.</p>`
            : ""
        }
      </article>
    `;
  }
}

customElements.define("activity-card", ActivityCard);
