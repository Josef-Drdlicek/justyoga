// Sdílený Shadow-DOM boilerplate: komponenta implementuje jen
// styles()/template(), zapojení stylů a vykreslení žije tady.
//
// KLÍČOVÉ: styly se NEVKLÁDAJÍ do innerHTML, ale adoptují jako
// CSSStyleSheet. Má to dva důsledky, oba podstatné:
//
//   1. Stylesheet se parsuje JEDNOU PRO TŘÍDU, ne pro každou instanci.
//      Na stránce rozvrhu je devět tlačítek <cta-button>, tedy dřív devět
//      parsování téhož CSS a devět kopií v paměti.
//   2. render() přestal na styly sahat. Přepis innerHTML tedy nemůže
//      shodit vzhled a komponenta smí mezi rendery mutovat vlastní DOM
//      (vzor, na kterém stojí site-nav a schedule-widget).
//
// box-sizing: border-box je globálně v base.css, ale to je light-DOM
// stylesheet a hranici Shadow DOM NEPŘEKROČÍ (box-sizing není dědičná
// vlastnost). Bez tohohle resetu by se každá komponenta, která kombinuje
// width/height s paddingem, vykreslila širší, než má.
const SHADOW_RESET_CSS = ":host,*,*::before,*::after{box-sizing:border-box}";

// Chrome 73+, Safari 16.4+, Firefox 101+ (baseline od 3/2023). Pojistka je
// tady kvůli starším WebView na Androidu, kde by jinak komponenta zůstala
// úplně bez stylů — jedna větev v základní třídě, nikde jinde.
const SUPPORTS_ADOPTED = "replaceSync" in (globalThis.CSSStyleSheet?.prototype ?? {});

function makeSheet(css) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  return sheet;
}

// Stylesheet každé třídy se vytvoří při první instanci a pak se sdílí.
// Klíčem je konstruktor, takže potomci se navzájem neovlivňují.
const sheetsByClass = new WeakMap();

// Sdílená primitiva ze styles.js se předávají jako CSS STRINGY, ne hotové
// CSSStyleSheet objekty. Důvod: string se dá použít i ve fallbacku (kde se
// styly vkládají zpět do markupu), zatímco z CSSStyleSheet se text zpátky
// nedostane. Sheet se z každého stringu vyrobí právě jednou.
const sheetsByCss = new Map();

function sharedSheet(css) {
  if (!sheetsByCss.has(css)) sheetsByCss.set(css, makeSheet(css));
  return sheetsByCss.get(css);
}

const RESET_SHEET = SUPPORTS_ADOPTED ? makeSheet(SHADOW_RESET_CSS) : null;

export class BaseElement extends HTMLElement {
  // Sdílená primitiva ze styles.js. Potomek si je vyžádá přepsáním:
  //   static sheets = [FOCUS_RING, ICON];
  static sheets = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    if (SUPPORTS_ADOPTED) {
      this.shadowRoot.adoptedStyleSheets = [
        RESET_SHEET,
        // Sdílená primitiva jdou PŘED vlastní stylesheet třídy, aby je
        // komponenta mohla přebít bez zvyšování specificity (primitiva
        // používají :where(), tedy specificitu 0).
        ...this.constructor.sheets.map(sharedSheet),
        this.#classSheet(),
      ];
    }
  }

  #classSheet() {
    const cls = this.constructor;
    if (!sheetsByClass.has(cls)) sheetsByClass.set(cls, makeSheet(this.styles()));
    return sheetsByClass.get(cls);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (SUPPORTS_ADOPTED) {
      this.shadowRoot.innerHTML = this.template();
      return;
    }
    // Fallback: styly zpět do markupu, včetně sdílených primitiv.
    this.shadowRoot.innerHTML =
      `<style>${SHADOW_RESET_CSS}${this.constructor.sheets.join("")}${this.styles()}</style>` +
      this.template();
  }

  // Zkratky pro práci s vlastním shadow rootem. Bez nich je každý přístup
  // k uzlu `this.shadowRoot.querySelector(...)`, což se v komponentách,
  // které mutují DOM místo re-renderu, opakuje pořád.
  $(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  $$(selector) {
    return [...this.shadowRoot.querySelectorAll(selector)];
  }

  styles() {
    return "";
  }

  template() {
    return "";
  }
}
