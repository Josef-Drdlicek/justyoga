import { BaseElement } from "./base-component.js";

// <news-board>: set `.items = NEWS` (see js/data/news.js) — one card per
// announcement. Renders nothing when the list is empty; the page decides
// whether the surrounding section (with its heading) is shown at all.
export class NewsBoard extends BaseElement {
  #items = [];

  set items(value) {
    this.#items = value || [];
    this.render();
  }

  styles() {
    return `
      :host { display: block; }
      /* Same auto-fit recipe as the activities grid, one step narrower:
         news items are short, so two of them shouldn't stretch to the full
         page width on desktop. */
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
        gap: var(--space-5);
      }
      .item {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-2xl);
        padding: var(--space-5);
      }
      /* Pill label, same shape language as the CTA buttons. Linen (a
         secondary brand tint) rather than a filled accent: the badge labels
         the news, it isn't a second thing to click. */
      .badge {
        align-self: flex-start;
        background: var(--color-linen);
        color: var(--color-text);
        border-radius: var(--radius-full);
        padding: var(--space-1) var(--space-3);
        font-family: var(--font-heading);
        font-weight: 600;
        font-size: var(--font-size-sm);
        letter-spacing: 0.04em;
      }
      .title { font-size: var(--font-size-lg); margin: 0; }
      .text { color: var(--color-text-muted); margin: 0; }
    `;
  }

  template() {
    if (!this.#items.length) return "";
    const items = this.#items
      .map(
        (item) => `
          <article class="item">
            ${item.badge ? `<span class="badge">${item.badge}</span>` : ""}
            <h3 class="title">${item.title}</h3>
            <p class="text">${item.text}</p>
          </article>
        `
      )
      .join("");
    return `<div class="grid">${items}</div>`;
  }
}

customElements.define("news-board", NewsBoard);
