# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

Redesign webu **justyoga.cz** (Just Yoga Boskovice, jóga/jumping/tabata studio). Stávající WordPress šablona `fyoga` se kompletně nahrazuje vlastním HTML + vanilla JS motivem, který se nasadí do stejného WP účtu (stejný hosting, stejná databáze). Ceník a rozvrh zůstávají v databázi WordPressu jako nativní Gutenberg tabulky — majitelka je nadále edituje sama, beze změny workflow; nová šablona je jen jinak vykresluje. Aktuální fáze i historie rozhodnutí jsou v `STATUS.md` — vždy ho číst před navazující prací a aktualizovat po jejím dokončení (viz skill `client-status-log`).

Rezervace jde přes externí systémy (`app.tymuj.cz`, `justjump.chytra-rezervace.cz`) — šablona řeší jen odkazy/CTA tlačítka, ne rezervační logiku.

## Příkazy

Web je čisté HTML + ES moduly, žádný build krok, žádný `package.json`. Prohlížeče blokují ES moduly na `file://`, takže **nejde otevřít dvojklikem** — je potřeba lokální server:

```
cd web
npx serve .
```

Pak otevřít adresu, kterou `serve` vypíše (obvykle `http://localhost:3000`).

### Ověřování layoutu/vzhledu
V tomto prostředí není interaktivní prohlížeč, ale je k dispozici headless Chrome pro screenshoty a přesné měření (`getBoundingClientRect`, `scrollWidth`). Přímý screenshot na mobilní šířku přes `--window-size` je nespolehlivý (nerespektuje media queries správně) — funguje jen přes iframe se stejnou originou nastavený na přesnou šířku. V projektu se tomu neformálně říká „diag.html" — dočasný soubor, který se po ověření zase smaže.

## Architektura (`web/`)

```
web/
  index.html, rozvrh-cenik.html, o-mne.html, kontakt.html
  css/tokens.css      – design tokeny (barvy/mezery/typografie), jediné místo pro úpravu vzhledu
  css/base.css        – reset a základní styly
  css/layout.css      – rozvržení stránek (grid, hero, sekce)
  js/data/            – veškerý obsah (aktivity, rozvrh, kontakt, navigace) odděleně od zobrazení
  js/components/      – vanilla Web Components (Shadow DOM)
  js/pages/           – napojení dat na konkrétní stránku
  assets/images/      – reálné logo a fotky od klientky
```

Klíčové principy, ze kterých vychází struktura kódu:

- **Data odděleně od zobrazení.** `js/data/*.js` je jediný zdroj pravdy pro obsah (aktivity, ceny, rozvrh, kontakt, navigační položky, `SITE_CONFIG`). Komponenty a stránky obsah nikdy nehardcodují — čtou ho odsud. Např. přidání/odebrání stránky v menu = úprava `js/data/nav.js`, nic víc.
- **`js/main.js`** pouze registruje web komponenty (importy `js/components/*`) — bez obsahové logiky, aby se neměnil při každé změně obsahu stránky.
- **`js/pages/*.js`** je napojení dat na konkrétní stránku (per-page skript, načtený vedle `main.js` v `<head>` dané HTML stránky) — vytváří instance komponent a plní je daty (`card.activity = …`, `table.rows = …`).
- **Web Components dědí `BaseElement`** (`js/components/base-component.js`), která centralizuje Shadow DOM boilerplate: `attachShadow`, `render()` cyklus, injektáž `box-sizing: border-box` resetu do každého shadow rootu (globální reset v `base.css` nekříží hranici Shadow DOM). Nová komponenta implementuje jen `styles()` a `template()`.
- **`<data-table>`** je generický, řízený daty (`columns`/`rows` jako JS property, ne HTML atributy) — jedna implementace pro ceník i rozvrh, žádná stránka neduplikuje `<table>` markup ručně.
- **Design tokeny** (`css/tokens.css`) jsou jediné místo pro barvy/mezery/typografii/breakpoint — hodnoty pocházejí z reálného brandbooku klientky (`content/brandbook.md`). Komponenty čtou `var(--...)`, nic nehardcoduje barvy/mezery/rádius jinde. Projekt má **jeden dokumentovaný breakpoint** (768px) — v `@media` dotazech se má používat opakovaně, ne vymýšlet nové.
- **Obsah je reálný**, stažený z justyoga.cz (ceník, rozvrh, kontakt), ne placeholder — výjimka je text „O mně" (zatím placeholder, viz `web/o-mne.html`) a sociální sítě v `SITE_CONFIG.social` (zatím `null`).

## Skilly a workflow

- `client-status-log`: `STATUS.md` v kořeni je průběžný stavový dokument projektu — udržovat ho aktuální (log, next steps) při každé smysluplné dávce práce.
- `clean-code-standards`: udržitelný kód bez hardcoded jednorázových vzorů, platí napříč projektem.
- Komunikace s uživatelem probíhá česky.
