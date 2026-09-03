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
      /* "Přeskočit na obsah" — bez něj musí klávesnicový uživatel na každé
         stránce protabovat logo a celé menu. Skrytý clip-rect trikem (ne
         display:none ani visibility:hidden, které by ho vyřadily z tab
         orderu), a při fokusu se vykreslí jako plnohodnotné tlačítko.
         Vlastní kopie pravidla je tu proto, že .visually-hidden z base.css
         je light-DOM stylesheet a hranici Shadow DOM nepřekročí. */
      .skip-link {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
        background: var(--color-primary);
        color: var(--color-primary-contrast);
        font-family: var(--font-heading);
        font-weight: 600;
        text-decoration: none;
        border-radius: var(--radius-full);
      }
      /* :focus, ne :focus-visible — na skip-link se jinak než klávesnicí
         nedá dostat, takže rozlišovat způsob fokusu tu nemá co odlišit,
         a takhle se dá odkrytí i programově ověřit. */
      .skip-link:focus {
        position: static;
        width: auto;
        height: auto;
        overflow: visible;
        clip-path: none;
        margin: var(--space-3) 0 0 var(--space-5);
        padding: var(--space-2) var(--space-4);
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: calc(-1 * var(--focus-ring-offset));
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
    // Skip-link musí být první fokusovatelný prvek stránky, proto je
    // před .bar. Cíl #main je v light DOM každé stránky (<main id="main"
    // tabindex="-1">) — fragment odkaz hranici Shadow DOM překročí bez
    // problému, na rozdíl od CSS.
    return `
      <a class="skip-link" href="#main">Přeskočit na obsah</a>
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
