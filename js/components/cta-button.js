import { BaseElement } from "./base-component.js";

// <cta-button href="…" label="…" variant="primary|accent"></cta-button>
export class CtaButton extends BaseElement {
  static get observedAttributes() {
    return ["href", "label", "variant"];
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  styles() {
    return `
      :host { display: inline-block; }
      a {
        /* block + width: 100% instead of inline-block: lets the host box
           (not just the label content) dictate the button's width, so a
           page can stretch <cta-button> to a fixed size (see .cta-row
           cta-button in layout.css) and the label centers inside it. When
           nothing constrains the host wider than its content — the default
           everywhere else this component is used — this renders identically
           to the old inline-block sizing. */
        display: block;
        box-sizing: border-box;
        width: 100%;
        text-align: center;
        padding: calc(var(--space-2) + var(--space-1)) var(--space-5);
        border-radius: var(--radius-full);
        text-decoration: none;
        /* Brandbook: buttons are Raleway SemiBold 600 (the weight it
           reserves for emphasis — CTAs, prices, statistics). */
        font-family: var(--font-heading);
        font-weight: 600;
        transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
      }
      a:hover, a:focus-visible { transform: translateY(-1px); box-shadow: var(--shadow-sm); }
      .primary { background: var(--color-primary); color: var(--color-primary-contrast); }
      .primary:hover, .primary:focus-visible { background: var(--color-primary-dark); }
      .accent { background: var(--color-accent); color: var(--color-primary-contrast); }
      .accent:hover, .accent:focus-visible { background: var(--color-accent-dark); }
    `;
  }

  template() {
    const href = this.getAttribute("href") || "#";
    const label = this.getAttribute("label") || "";
    const variant = this.getAttribute("variant") === "accent" ? "accent" : "primary";
    const isExternal = /^https?:\/\//.test(href);
    const relAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a class="${variant}" href="${href}"${relAttr}>${label}</a>`;
  }
}

customElements.define("cta-button", CtaButton);
