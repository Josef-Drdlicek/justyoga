import { BaseElement } from "./base-component.js";

// <media-gallery> — set `.photos = [...]` and `.videos = [...]` from JS
// (see gallery.js for the item shapes). Renders two grids with deliberately
// different tile sizes: a dense grid of small photo tiles and a row of
// noticeably larger video players — the client asked for exactly this
// contrast (photos small, videos bigger), so the size difference is the
// component's core layout decision, not an accident of content.
export class MediaGallery extends BaseElement {
  #photos = [];
  #videos = [];

  set photos(value) {
    this.#photos = value || [];
    this.render();
  }

  set videos(value) {
    this.#videos = value || [];
    this.render();
  }

  styles() {
    return `
      :host { display: block; }

      .photos {
        display: grid;
        /* As many small tiles per row as fit — square cover-crops keep the
           grid tidy even though the source photos mix portrait/landscape
           (same cover-inside-a-fixed-frame technique as .hero__image). */
        grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
        gap: var(--space-3);
      }
      .photos img {
        display: block;
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
      }

      .videos {
        display: grid;
        /* Video cells are ~2× the photo tile width. The clips mix portrait
           and landscape, and unlike photos a video must not be cover-cropped
           (it would cut off the recorded action), so each keeps its natural
           aspect ratio and the row aligns to the top. */
        grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
        gap: var(--space-4);
        align-items: start;
        margin-top: var(--space-5);
      }
      video {
        display: block;
        width: 100%;
        height: auto;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        /* Podklad, dokud se nenačte poster. Dřív tu byl --color-charcoal,
           token z palety verze 1, který po rebrandu na verzi 2 přestal
           existovat — background se pak nenastavil vůbec a videa byla
           průhledná (viditelný byl jen černý pruh ovládání). */
        background: var(--color-primary);
      }

      /* Single project breakpoint, see tokens.css comment */
      @media (width < 768px) {
        .photos {
          grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
          gap: var(--space-2);
        }
      }
    `;
  }

  template() {
    const photos = this.#photos
      .map((photo) => `<img src="${photo.src}" alt="${photo.alt}" loading="lazy" />`)
      .join("");
    // width/height drží místo prvku ještě před načtením metadat (bez nich
    // stránka po jejich doručení poskočí), poster ho do té doby zaplní
    // náhledovým snímkem místo prázdné plochy.
    const videos = this.#videos
      .map(
        (video) =>
          `<video src="${video.src}" poster="${video.poster}" width="${video.width}" height="${video.height}" controls preload="metadata" playsinline aria-label="${video.label}"></video>`
      )
      .join("");
    return `
      <div class="photos">${photos}</div>
      <div class="videos">${videos}</div>
    `;
  }
}

customElements.define("media-gallery", MediaGallery);
