import { BaseElement } from "./base-component.js";

// <faq-list>: set `.items = FAQ` (see js/data/faq.js) — an accordion of
// questions built on native <details>/<summary>, so open/close, keyboard
// operation and in-page search work without a line of JavaScript.
export class FaqList extends BaseElement {
  #items = [];

  set items(value) {
    this.#items = value || [];
    this.render();
  }

  styles() {
    return `
      :host { display: block; }
      .list {
        max-width: 44rem;
        margin: 0 auto;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-2xl);
        background: var(--color-surface);
        /* The first/last rows' own corners are square; clipping at the
           wrapper keeps the rounded outline in one place instead of
           special-casing :first-child/:last-child radii. */
        overflow: hidden;
      }
      .item + .item { border-top: 1px solid var(--color-border); }
      summary {
        /* The default disclosure triangle is replaced by the chevron below —
           two markers would read as a rendering bug. Safari needs the
           -webkit- pseudo-element as well as list-style. */
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        padding: var(--space-4) var(--space-5);
        cursor: pointer;
        font-family: var(--font-heading);
        font-weight: 600;
      }
      summary::-webkit-details-marker { display: none; }
      summary:hover { color: var(--color-accent); }
      summary:focus-visible { outline: 2px solid var(--color-primary); outline-offset: -2px; }
      /* Chevron drawn from two borders rather than an SVG icon: it has to
         rotate on open, and a CSS-only mark keeps this component free of
         the shared icon set. */
      .chevron {
        flex-shrink: 0;
        width: 0.5rem;
        height: 0.5rem;
        border-right: 2px solid var(--color-accent);
        border-bottom: 2px solid var(--color-accent);
        transform: rotate(45deg);
        transform-origin: center;
        transition: transform var(--transition-fast);
      }
      details[open] .chevron { transform: rotate(-135deg); }
      .answer {
        margin: 0;
        padding: 0 var(--space-5) var(--space-4);
        color: var(--color-text-muted);
      }
    `;
  }

  template() {
    if (!this.#items.length) return "";
    const items = this.#items
      .map(
        (item) => `
          <details class="item">
            <summary>${item.question}<span class="chevron" aria-hidden="true"></span></summary>
            <p class="answer">${item.answer}</p>
          </details>
        `
      )
      .join("");
    return `<div class="list">${items}</div>`;
  }
}

customElements.define("faq-list", FaqList);
