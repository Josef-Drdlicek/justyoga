import { BaseElement } from "./base-component.js";
import { NAV_ITEMS } from "../data/nav.js";

const OPEN_ICON = "☰";
const CLOSE_ICON = "✕";

export class SiteNav extends BaseElement {
  #isOpen = false;

  connectedCallback() {
    super.connectedCallback();
    this.#toggle.addEventListener("click", () => this.#setOpen(!this.#isOpen));
    this.#list.addEventListener("click", (event) => {
      if (event.target.closest("a")) this.#setOpen(false);
    });
    document.addEventListener("keydown", this.#onKeydown);
    document.addEventListener("click", this.#onOutsideClick);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.#onKeydown);
    document.removeEventListener("click", this.#onOutsideClick);
  }

  get #toggle() {
    return this.shadowRoot.querySelector(".nav-toggle");
  }

  get #list() {
    return this.shadowRoot.querySelector(".nav-list");
  }

  #onKeydown = (event) => {
    if (event.key === "Escape" && this.#isOpen) this.#setOpen(false);
  };

  #onOutsideClick = (event) => {
    if (this.#isOpen && !event.composedPath().includes(this)) this.#setOpen(false);
  };

  #setOpen(open) {
    this.#isOpen = open;
    this.#list.classList.toggle("is-open", open);
    this.#toggle.setAttribute("aria-expanded", String(open));
    this.#toggle.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
    this.shadowRoot.querySelector(".nav-toggle-icon").textContent = open ? CLOSE_ICON : OPEN_ICON;
  }

  styles() {
    return `
      :host { display: block; }
      nav { display: flex; align-items: center; position: relative; }
      .nav-toggle {
        display: none;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        min-width: 2.75rem;
        min-height: 2.75rem;
        background: none;
        border: none;
        font-size: var(--font-size-xl);
        color: var(--color-text);
        cursor: pointer;
        border-radius: var(--radius-sm);
      }
      .nav-toggle-label {
        font-size: var(--font-size-sm);
        font-weight: 600;
        letter-spacing: 0.05em;
      }
      .nav-toggle:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
      .nav-list {
        display: flex;
        gap: var(--space-5);
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .nav-list a {
        display: inline-block;
        text-decoration: none;
        color: var(--color-text);
        font-weight: 500;
        padding: var(--space-2) 0;
        border-bottom: 2px solid transparent;
      }
      /* Accent (berry), not primary: the primary plum is nearly the same
         tone as the resting link color, so the active/hover state would be
         almost invisible. */
      .nav-list a:hover,
      .nav-list a:focus-visible,
      .nav-list a.is-current {
        border-bottom-color: var(--color-accent);
        color: var(--color-accent);
      }
      .nav-list a:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      /* Single project breakpoint, see tokens.css comment */
      @media (width < 768px) {
        .nav-toggle { display: flex; }

        .nav-list {
          position: absolute;
          top: calc(100% + var(--space-2));
          right: 0;
          z-index: 20;
          flex-direction: column;
          gap: 0;
          min-width: 14rem;
          background: var(--color-surface);
          border-radius: var(--radius-md);
          /* The brand is flat (--shadow-* are all none), but this panel
             genuinely floats over page content, so it needs its own edge to
             read as an overlay rather than as part of the page. A solid
             border does that job without reintroducing elevation. */
          border: 1px solid var(--color-text-muted);
          /* Closed by default: invisible AND out of tab order, not just
             visually clipped — visibility (unlike overflow/max-height)
             also removes focusable descendants from the tab sequence. */
          visibility: hidden;
          opacity: 0;
          transform: translateY(-0.25rem);
          transition: opacity var(--transition-base), transform var(--transition-base),
            visibility 0s linear var(--transition-base);
        }
        .nav-list.is-open {
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
          transition: opacity var(--transition-base), transform var(--transition-base);
        }
        .nav-list a {
          padding: var(--space-4) var(--space-5);
          width: 100%;
          border-bottom: 1px solid var(--color-border);
        }
      }
    `;
  }

  template() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const items = NAV_ITEMS.map((item) => {
      const isCurrent = item.href === currentPath;
      return `<li><a href="${item.href}" class="${isCurrent ? "is-current" : ""}"${
        isCurrent ? ' aria-current="page"' : ""
      }>${item.label}</a></li>`;
    }).join("");

    return `
      <nav>
        <button class="nav-toggle" aria-label="Otevřít menu" aria-expanded="false" aria-controls="nav-list">
          <span class="nav-toggle-label">MENU</span><span class="nav-toggle-icon">${OPEN_ICON}</span>
        </button>
        <ul class="nav-list" id="nav-list">${items}</ul>
      </nav>
    `;
  }
}

customElements.define("site-nav", SiteNav);
