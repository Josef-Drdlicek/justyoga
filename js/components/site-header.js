import { BaseElement } from "./base-component.js";
import { SITE_CONFIG } from "../data/site-config.js";
import "./site-nav.js";

export class SiteHeader extends BaseElement {
  styles() {
    return `
      /* Sticky must sit on the host: inside the shadow root the .bar's
         containing block is the host box, which is exactly as tall as the
         bar itself, so position: sticky there has no room to act (the
         header would simply scroll away). The host's containing block is
         the page, so it genuinely pins to the viewport. Background lives
         here too — .bar is capped at --content-max-width, and the whole
         viewport-wide strip has to stay opaque above scrolling content.
         Estimated rendered height: --header-height-estimate (tokens.css). */
      :host {
        display: block;
        position: sticky;
        top: 0;
        z-index: 10;
        background: var(--color-bg);
      }
      .bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-5);
        max-width: var(--content-max-width);
        margin: 0 auto;
        padding: var(--space-4) var(--space-5);
      }
      .brand { display: flex; align-items: center; }
      .brand img {
        height: 2.75rem;
        width: auto;
        display: block;
      }

      @media (min-width: 768px) {
        .brand img { height: 3.5rem; }
      }
    `;
  }

  template() {
    return `
      <div class="bar">
        <a class="brand" href="index.html">
          <img src="${SITE_CONFIG.logoSrc}" alt="${SITE_CONFIG.logoAlt}" />
        </a>
        <site-nav></site-nav>
      </div>
    `;
  }
}

customElements.define("site-header", SiteHeader);
