import { BaseElement } from "./base-component.js";
import { ZONES, READ_LINE, resolveZoneState } from "../data/zones.js";

// <heart-rate-meter> — plovoucí "tepometr", který se scrollem zrychluje,
// zvětšuje se a mění barvu, a tím ukazuje, v jakém tempu se návštěvník
// právě nachází (jóga → kondiční lekce → jumping).
//
// UMÍSTĚNÍ: instance musí být napsaná v HTML jako PŘÍMÝ POTOMEK <body>,
// za <site-footer>. position: fixed se zasekne uvnitř jakéhokoli předka,
// který má transform, filter nebo contain — a to je reálné riziko, jakmile
// tenhle web obalí WordPress motiv (#page, .site-content). Direct child
// <body> to vylučuje. Zároveň je tím posledním v tab orderu i v pořadí
// čtení, takže neskáče před obsah.
//
// TECHNIKA je rozdělená podle povahy dat:
//   tempo pulzu     Web Animations API + updatePlaybackRate
//   velikost, barva scroll (passive) → jeden rAF → CSS custom properties
//   identita zóny   diskrétní přepnutí data-zone, ~5x za návštěvu
//
// Proč tempo přes WAAPI a ne CSS: animation-duration NENÍ animovatelná
// vlastnost, takže čisté CSS (ani scroll-driven animace) neumí pulz plynule
// zrychlit — každá změna doby by fázi restartovala a pulz by cuknul.
// updatePlaybackRate je specifikovaný jako plynulá změna tempa běžící
// animace, což je přesně to, co klientka chce.
//
// Proč se nikdy nevolá render(): BaseElement.render() přepisuje
// shadowRoot.innerHTML, čímž by zahodil celý subtree včetně běžící WAAPI
// animace a nacachovaných uzlů. Komponenta se vykreslí jednou a pak už jen
// mutuje existující prvky — stejný vzor jako site-nav.js #setOpen.

// Referenční tempo keyframů: 1 tep za sekundu = 60 tepů/min. Díky tomu je
// playbackRate přímo poměr tepů a nikde v kódu není druhý přepočet.
const REFERENCE_BPM = 60;

// Kvantizace zápisů do CSS. Menší změny než tohle jsou vizuálně nerozlišitelné,
// takže by jen zbytečně invalidovaly styl každý frame.
const WRITE_EPSILON = 0.004;

export class HeartRateMeter extends BaseElement {
  #bands = null; // lazy; přeměřuje se při resize a po doplnění obsahu
  #pulse = null;
  #frameRequested = false;
  #lastProgress = null;
  #lastMix = null;
  #lastBpmText = null;
  #lastZone = null;
  #reducedMotion = null;
  #resizeObserver = null;

  connectedCallback() {
    // Jediné vykreslení za život komponenty.
    super.connectedCallback();

    const zones = document.querySelectorAll("[data-hr-zone]");
    if (!zones.length) {
      // Na stránkách bez scroll-story nemá tepometr co ukazovat. Musí to
      // vydržet bez chyby — komponenta je registrovaná per-page, ale HTML
      // se dá zapomenout kdekoli.
      this.hidden = true;
      return;
    }

    this.#reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.#reducedMotion.addEventListener("change", this.#onMotionPreferenceChange);

    this.#startPulse();

    window.addEventListener("scroll", this.#onScroll, { passive: true });
    window.addEventListener("resize", this.#invalidateBands, { passive: true });
    document.addEventListener("visibilitychange", this.#onVisibilityChange);

    // Zóny se plní obsahem až stránkovým skriptem, tedy PO tomhle okamžiku.
    // Bez pozorovatele by zůstalo naměřené rozložení prázdné stránky
    // a tep by přes zóny přeletěl.
    if ("ResizeObserver" in window) {
      this.#resizeObserver = new ResizeObserver(this.#invalidateBands);
      this.#resizeObserver.observe(document.querySelector("main") ?? document.body);
    }
    document.fonts?.ready.then(this.#invalidateBands);

    this.#sample();
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.#onScroll);
    window.removeEventListener("resize", this.#invalidateBands);
    document.removeEventListener("visibilitychange", this.#onVisibilityChange);
    this.#reducedMotion?.removeEventListener("change", this.#onMotionPreferenceChange);
    this.#resizeObserver?.disconnect();
    this.#pulse?.cancel();
    this.#pulse = null;
  }

  // --- pulz -----------------------------------------------------------

  #startPulse() {
    // Při omezeném pohybu se animace vůbec NEZALOŽÍ. Pozastavená animace
    // pořád drží kompozitní vrstvu; nezaložená nekostuje nic. Informaci
    // v tom režimu nese barva, číslo a statické dílky (viz styles()).
    if (this.#reducedMotion.matches || this.#pulse) return;

    const ring = this.shadowRoot.querySelector(".ring");
    if (!ring?.animate) return;

    // Dvojitý úder (systola a slabší diastola), aby to působilo jako tep
    // a ne jako blikání. Keyframy obsahují VÝHRADNĚ transform — žádný
    // box-shadow (brand je plochý) ani filter, které by srazily výkon na
    // starších mobilech mimo kompozitor.
    this.#pulse = ring.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.14)", offset: 0.12 },
        { transform: "scale(0.99)", offset: 0.26 },
        { transform: "scale(1.06)", offset: 0.4 },
        { transform: "scale(1)" },
      ],
      { duration: (60 / REFERENCE_BPM) * 1000, iterations: Infinity, easing: "ease-in-out" }
    );
  }

  #onMotionPreferenceChange = () => {
    // Nastavení systému se dá přepnout za běhu.
    if (this.#reducedMotion.matches) {
      this.#pulse?.cancel();
      this.#pulse = null;
      this.style.removeProperty("--hrm-progress");
    } else {
      this.#startPulse();
    }
    // Vynulovat i poslední tep, jinak by znovu založený pulz zůstal na
    // výchozím tempu — #apply ho nastavuje až při ZMĚNĚ čísla.
    this.#lastProgress = null;
    this.#lastBpmText = null;
    this.#sample();
  };

  #onVisibilityChange = () => {
    if (document.visibilityState === "hidden") this.#pulse?.pause();
    else this.#pulse?.play();
  };

  // --- měření a vzorkování --------------------------------------------

  #invalidateBands = () => {
    this.#bands = null;
    this.#requestFrame();
  };

  // Geometrie se čte JEN při invalidaci, nikdy ve frame — čtení layoutu po
  // zápisu stylu je klasický layout thrash.
  #measure() {
    this.#bands = [...document.querySelectorAll("[data-hr-zone]")]
      .map((element) => {
        const box = element.getBoundingClientRect();
        return {
          id: element.dataset.hrZone,
          top: box.top + window.scrollY,
          height: Math.max(1, box.height),
        };
      })
      .filter((band) => ZONES.some((zone) => zone.id === band.id))
      .sort((a, b) => a.top - b.top);
  }

  #onScroll = () => this.#requestFrame();

  #requestFrame() {
    // Žádná trvale běžící smyčka: scroll jen naplánuje jeden frame.
    if (this.#frameRequested) return;
    this.#frameRequested = true;
    requestAnimationFrame(() => {
      this.#frameRequested = false;
      this.#sample();
    });
  }

  #sample() {
    if (this.hidden) return;
    if (!this.#bands) this.#measure();
    if (!this.#bands.length) return;

    // Postup se měří PROTI ZÓNÁM, ne proti délce dokumentu. Délka homepage
    // se mění (prázdné Aktuality nebo FAQ, cookie lišta ve WordPressu) a
    // s ní by se u stejného obsahu měnil tep. Klientka svázala tep
    // s tématem, ne s pixely.
    const line = window.scrollY + window.innerHeight * READ_LINE;
    let index = 0;
    for (let i = 0; i < this.#bands.length; i++) {
      if (line >= this.#bands[i].top) index = i;
    }
    const band = this.#bands[index];
    const t = (line - band.top) / band.height;

    const zoneIndex = ZONES.findIndex((zone) => zone.id === band.id);
    this.#apply(resolveZoneState(zoneIndex < 0 ? index : zoneIndex, t));
  }

  // --- zápis do CSS ----------------------------------------------------

  #apply(state) {
    // Plynulé hodnoty se zapisují na HOSTITELE, ne na :root. Zápis na :root
    // invaliduje styl celého dokumentu, protože z něj všechno dědí; host
    // má contain: layout paint style, takže invalidace zůstane v tepometru.
    if (!this.#reducedMotion.matches) {
      // Velikost vázaná na scroll je přesně ten vestibulární podnět, kvůli
      // kterému si člověk omezení pohybu zapíná — v tom režimu se nezapisuje
      // a CSS spadne na initial-value z @property.
      if (this.#lastProgress === null || Math.abs(state.progress - this.#lastProgress) > WRITE_EPSILON) {
        this.style.setProperty("--hrm-progress", state.progress.toFixed(4));
        this.#lastProgress = state.progress;
      }
    }

    if (this.#lastMix === null || Math.abs(state.mix - this.#lastMix) > WRITE_EPSILON) {
      this.style.setProperty("--hrm-mix", state.mix.toFixed(4));
      this.#lastMix = state.mix;
    }

    // Barvy se propisují jako NÁZVY tokenů obalené do var(), takže se
    // hodnota substituuje až při použití v CSS. Komponenta proto nikdy
    // nezná žádný hex a paleta zůstává výhradně v tokens.css.
    if (state.zoneId !== this.#lastZone) {
      this.style.setProperty("--hrm-color-from", `var(${state.colorFrom})`);
      this.style.setProperty("--hrm-color-to", `var(${state.colorTo})`);
      this.dataset.zone = state.zoneId;
      this.shadowRoot.querySelector(".label").textContent = state.label;
      this.#lastZone = state.zoneId;
    }

    // Text i tempo pulzu se aktualizují jen při změně zaokrouhleného čísla
    // — tedy zhruba stokrát za celý scroll místo tisíců zápisů.
    const bpmText = String(Math.round(state.bpm));
    if (bpmText !== this.#lastBpmText) {
      this.shadowRoot.querySelector(".value").textContent = bpmText;
      this.#lastBpmText = bpmText;
      // Tohle je jádro celé feature: keyframy jsou napsané na referenčních
      // 60 tepech (1 tep = 1 s), takže playbackRate JE přímo poměr tepů
      // a jiný přepočet nikde neexistuje. updatePlaybackRate mění tempo
      // běžící animace plynule a bez restartu fáze — přenastavení
      // animation-duration by pulz při každé změně cuknulo.
      this.#pulse?.updatePlaybackRate(state.bpm / REFERENCE_BPM);
    }
  }

  styles() {
    return `
      :host {
        position: fixed;
        z-index: 9;
        /* Hlavička má z-index 10 a panel mobilního menu se stackuje jejími
           10, takže cokoli pod 10 je vždy pod nimi. pointer-events: none
           zajistí, že tepometr nikdy nesebere klik. */
        pointer-events: none;
        /* Drží invalidaci layoutu a stylu uvnitř komponenty. Záměrně BEZ
           "paint": ten ořezává kreslení na hranici hostitelského boxu,
           a protože se kolečko zvětšuje vlastností scale (která layout
           nemění), zvětšená část by se odřízla — kolečko pak vypadalo
           hranatě, jako plochý štít. */
        contain: layout style;

        /* Aktuální barva zóny. Pojmenované tokeny sem zapisuje JS, mix mezi
           nimi řídí --hrm-mix. Interpolace v oklab, ne v srgb — přechod
           mezi mint a oranžovou by přes srgb prošel kalnou šedí. */
        --hrm-color: color-mix(
          in oklab,
          var(--hrm-color-from, var(--color-mint)),
          var(--hrm-color-to, var(--color-mint)) calc(var(--hrm-mix) * 100%)
        );
        /* Výplň i obrys se derivují ze stejné barvy stejnou formulí, jakou
           používají karty lekcí — jedna pravda o tom, jak z odstínu vznikne
           čitelný tón. Surová barva zóny má na off-white pozadí jen kolem
           2:1, takže obrys MUSÍ být ta ztmavená varianta, jinak by kolečko
           nesplnilo 3:1 pro grafické prvky. */
        --hrm-tint: color-mix(in srgb, var(--hrm-color) 16%, var(--color-surface));
        --hrm-ink: oklch(from var(--hrm-color) var(--type-icon-lightness) c h);

        /* Mobil je výchozí stav (mobile-first), desktop ho přebíjí níž. */
        --hrm-size: 3.25rem;
        left: var(--space-3);
        /* env() s fallbackem: v iframu ověřovacího nástroje je safe-area
           nedefinovaná a bez fallbacku by celá hodnota byla neplatná. */
        bottom: calc(var(--space-3) + env(safe-area-inset-bottom, 0px));
      }

      .dial {
        position: relative;
        width: var(--hrm-size);
        height: var(--hrm-size);
        display: grid;
        place-items: center;
        /* Velikost jde přes scale, NE přes width/height: to jsou layoutové
           vlastnosti a jejich změna by znamenala reflow každý frame.
           Rozsah 0,82–1,18 podle postupu příběhem. */
        scale: calc(0.82 + 0.36 * var(--hrm-progress));
      }

      .ring {
        position: absolute;
        inset: 0;
        border-radius: var(--radius-full);
        background: var(--hrm-tint);
        border: 2px solid var(--hrm-ink);
        /* Pulz je WAAPI animace na transform, zvětšování scrollem je
           vlastnost scale na .dial — jsou to různé vlastnosti, které se
           skládají násobením, takže na to není potřeba obalový prvek. */
        will-change: transform;
      }

      .value {
        position: relative;
        font-family: var(--font-heading);
        font-weight: 600;
        font-size: var(--font-size-sm);
        color: var(--color-text);
        /* Číslice nesmí poskakovat na šířku, jak tep roste. */
        font-variant-numeric: tabular-nums;
        line-height: 1;
      }

      .readout {
        /* Odstup musí pokrýt i to, o co kolečko vyčnívá ze svého layoutového
           boxu, když je na maximum zvětšené: scale jde až na 1,18, takže při
           7rem přesahuje dolů asi 10 px. S menší mezerou by zvětšené kolečko
           lezlo na text. */
        margin: var(--space-4) 0 0;
        font-size: var(--font-size-sm);
        color: var(--color-text-muted);
        text-align: center;
      }
      .unit, .label, .hint { display: block; }
      /* Na mobilu nesou informaci barva a číslo; text by v rohu displeje
         jen překrýval obsah. Pro čtečku zůstává. */
      .unit, .label, .hint,
      .ticks {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }

      @media (min-width: 768px) {
        :host {
          --hrm-size: 7rem;
          left: auto;
          right: clamp(var(--space-3), 3vw, var(--space-6));
          /* Svisle na střed, takže nikdy nekoliduje s lepivou hlavičkou
             ani se závěrečnými CTA tlačítky. */
          top: 50%;
          bottom: auto;
          translate: 0 -50%;
        }
        .value { font-size: var(--font-size-xl); }
        .unit, .label {
          position: static;
          width: auto;
          height: auto;
          overflow: visible;
          clip-path: none;
          white-space: normal;
        }
        .unit { font-size: var(--font-size-sm); }
        .label { font-weight: 600; color: var(--color-text); }
      }

      @media (prefers-reduced-motion: reduce) {
        /* Media query platí i uvnitř shadow rootu (vyhodnocuje se proti
           hlavnímu dokumentu), takže :host-context() není potřeba. */
        .ring { animation: none; }
        /* Statická náhrada pulzu: řada dílků, jejíž délka roste s postupem.
           Informace se tedy neztratí, jen ji nenese pohyb. Šířka je vázaná
           na --hrm-progress, což je jediná hodnota, kterou JS v tomhle
           režimu nezapisuje — drží proto initial-value z @property, dokud
           uživatel nepřepne nastavení zpět. */
        .ticks {
          position: absolute;
          bottom: -0.55rem;
          left: 50%;
          translate: -50% 0;
          width: calc(var(--hrm-size) * 0.8);
          height: 0.25rem;
          overflow: visible;
          clip-path: none;
          border-radius: var(--radius-full);
          background: linear-gradient(
            to right,
            var(--hrm-ink) 0 calc(var(--hrm-progress) * 100%),
            var(--hrm-tint) calc(var(--hrm-progress) * 100%) 100%
          );
          border: 1px solid var(--hrm-ink);
        }
      }
    `;
  }

  template() {
    // Grafika je aria-hidden, text je skutečný obsah. Žádné aria-live,
    // a to vědomě: hodnota se při scrollu mění desítkykrát za sekundu
    // a tutéž informaci uživatel čtečky dostane z nadpisu zóny, ke které
    // právě došel. role="meter" také ne — vyžaduje aria-valuenow, jehož
    // aktualizace je přesně ten šum.
    //
    // Věta v .hint není kosmetika: bez ní může někdo číst "170" jako
    // změřený VLASTNÍ tep, což je u prvku zvaného tepometr reálné riziko
    // dezinformace.
    return `
      <div class="dial">
        <span class="ring" aria-hidden="true"><span class="ticks"></span></span>
        <span class="value">${ZONES[0].bpmFrom}</span>
      </div>
      <p class="readout">
        <span class="unit">tepů/min</span>
        <span class="label">${ZONES[0].label}</span>
        <span class="hint">orientační tep při tomto typu lekce, ne váš vlastní</span>
      </p>
    `;
  }
}

customElements.define("heart-rate-meter", HeartRateMeter);
