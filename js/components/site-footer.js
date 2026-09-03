import { BaseElement } from "./base-component.js";
import { SITE_CONFIG } from "../data/site-config.js";
import { PIN_ICON, PHONE_ICON, MAIL_ICON, FACEBOOK_ICON, INSTAGRAM_ICON } from "../data/icons.js";
import { getVenueById, formatVenueAddress } from "../data/venues.js";

export class SiteFooter extends BaseElement {
  styles() {
    return `
      :host {
        display: block;
        border-top: 1px solid var(--color-border);
      }
      .inner {
        max-width: var(--content-max-width);
        margin: 0 auto;
        padding: var(--space-7) var(--space-5);
        text-align: center;
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
      }
      .brand-name {
        color: var(--color-text);
        font-weight: 600;
        font-size: var(--font-size-lg);
        margin: 0 0 var(--space-5);
      }
      .info {
        list-style: none;
        margin: 0 0 var(--space-5);
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-2);
      }
      .info li {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
      }
      .info .icon {
        width: 1rem;
        height: 1rem;
        color: var(--color-primary);
        flex-shrink: 0;
      }
      .info .icon svg { width: 100%; height: 100%; display: block; }
      a { color: var(--color-text-muted); }
      a:hover, a:focus-visible { color: var(--color-text); }
      .social {
        display: flex;
        justify-content: center;
        gap: var(--space-4);
        margin: 0;
      }
      .social a { display: inline-flex; align-items: center; gap: var(--space-2); }
      .social svg { width: 1.25rem; height: 1.25rem; display: block; }

      @media (min-width: 768px) {
        .info { flex-direction: row; justify-content: center; gap: var(--space-5); }
      }
    `;
  }

  template() {
    const { facebook, instagram } = SITE_CONFIG.social;
    const socialLinks =
      (facebook
        ? `<a href="${facebook}" target="_blank" rel="noopener noreferrer">${FACEBOOK_ICON}<span>Facebook</span></a>`
        : "") +
      (instagram
        ? `<a href="${instagram}" target="_blank" rel="noopener noreferrer">${INSTAGRAM_ICON}<span>Instagram</span></a>`
        : "");
    return `
      <div class="inner">
        <p class="brand-name">${SITE_CONFIG.legalName}</p>
        <ul class="info">
          <!-- Adresa studia. Kondiční lekce a jumping jsou na druhé adrese;
               patička je na to moc těsná, takže obě místa vypisuje
               <studio-venues> na kontaktu a v závěrečném CTA homepage. -->
          <li><span class="icon">${PIN_ICON}</span>${formatVenueAddress(getVenueById("studio"))}</li>
          <li><span class="icon">${PHONE_ICON}</span><a href="${SITE_CONFIG.phoneHref}">${SITE_CONFIG.phone}</a></li>
          <li><span class="icon">${MAIL_ICON}</span><a href="${SITE_CONFIG.emailHref}">${SITE_CONFIG.email}</a></li>
        </ul>
        ${socialLinks ? `<p class="social">${socialLinks}</p>` : ""}
      </div>
    `;
  }
}

customElements.define("site-footer", SiteFooter);
