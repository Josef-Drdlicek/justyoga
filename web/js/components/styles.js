// Sdílené CSS recepty pro komponenty se Shadow DOM.
//
// Shadow DOM nepustí dovnitř třídy z light-DOM stylesheetu, takže se recept
// nedá "prostě napsat do base.css" — musí ho adoptovat každý shadow root.
// Komponenta si ho vyžádá jedním řádkem:
//
//     static sheets = [FOCUS_RING, ICON];
//
// Exportují se CSS STRINGY, ne hotové CSSStyleSheet objekty: base-component.js
// z každého stringu vyrobí sheet právě jednou a nasdílí ho všem instancím,
// a zároveň má text k dispozici pro fallback ve starších WebView.
//
// Všechna primitiva používají :where(), tedy specificitu 0. Komponenta je
// proto přebije jediným vlastním pravidlem, bez !important a bez toho, aby
// musela zvyšovat specificitu selektorů.

// Dřív ručně opsaný na sedmi místech. Offset je zvlášť proměnnou, protože
// prvky uvnitř overflow: hidden (řádky FAQ) potřebují prstenec dovnitř.
export const FOCUS_RING = `
  :where(a, button, summary, input, textarea, [tabindex]):focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-offset, var(--focus-ring-offset));
  }
`;

// Dřív opsané ve čtyřech komponentách plus v layout.css. Ikony jsou vždy
// inline SVG vložené z js/data/icons.js, které se má vejít do svého boxu.
export const ICON = `
  :where(.icon) { flex-shrink: 0; }
  :where(.icon) svg { width: 100%; height: 100%; display: block; }
`;

// Barva podle typu lekce. Dřív stejná trojice pravidel dvakrát — jednou
// v pricing-cards jako .card--joga/jumping/tabata, jednou v schedule-widget
// jako .lesson--joga/jumping/tabata. Přidání čtvrtého typu lekce tak
// znamenalo úpravu na dvou místech; teď na jednom.
//
// Prvek se přihlásí atributem data-type="<id aktivity>" a dostane dvě
// proměnné: --type-color pro ikonu a --type-bg pro tónování plochy.
export const LESSON_TYPE = `
  :where([data-type="joga"]) {
    --type-color: var(--color-type-joga);
    --type-bg: var(--color-type-joga-bg);
  }
  :where([data-type="jumping"]) {
    --type-color: var(--color-type-jumping);
    --type-bg: var(--color-type-jumping-bg);
  }
  :where([data-type="tabata"]) {
    --type-color: var(--color-type-tabata);
    --type-bg: var(--color-type-tabata-bg);
  }
`;
