// Shared Shadow-DOM boilerplate so every component only has to implement
// styles()/template() — the attach/render plumbing lives in one place.
//
// box-sizing: border-box is set globally in base.css, but that reset is a
// light-DOM stylesheet and does NOT cross into any shadow root (box-sizing
// isn't an inherited CSS property). Without this, every component that
// combines width/height with padding renders wider/taller than intended
// (content-box adds padding on top of the specified size instead of
// including it) — set it once here so no component has to repeat it.
const SHADOW_RESET = `
  :host, *, *::before, *::after {
    box-sizing: border-box;
  }
`;

export class BaseElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `<style>${SHADOW_RESET}${this.styles()}</style>${this.template()}`;
  }

  styles() {
    return "";
  }

  template() {
    return "";
  }
}
