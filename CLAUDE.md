# CLAUDE.md

Pokyny pro Claude Code (claude.ai/code) při práci s tímto repozitářem.

## Projekt

Redesign webu **justyoga.cz** (Just Yoga Boskovice — jóga se světelnou
terapií, jumping, tabata, HIIT, kruhový trénink). Stávající WordPress šablona
`fyoga` se kompletně nahrazuje vlastním HTML + vanilla JS motivem, který se
nasadí do stejného WP účtu (stejný hosting, stejná databáze). Ceník a rozvrh
zůstávají v databázi WordPressu jako nativní Gutenberg tabulky — majitelka je
nadále edituje sama, beze změny workflow; nová šablona je jen jinak vykresluje.

Rezervace jde přes externí systémy (`app.tymuj.cz`,
`justjump.chytra-rezervace.cz`) — šablona řeší jen odkazy a CTA tlačítka, ne
rezervační logiku.

Repo je `Josef-Drdlicek/justyoga`. Historie vývoje do 3. 9. 2026, včetně tagu
`v1-terracotta` (konec verze 1, terakotová paleta), žije v lokálním archivu
`../lenka-web/` — v tomhle repu neexistuje, takže `git checkout v1-terracotta`
je potřeba spustit tam.

Aktuální fázi i historii rozhodnutí drží `STATUS.md` — **vždy ho číst před
navazující prací a aktualizovat po jejím dokončení** (viz skill
`client-status-log`).

## Struktura repa

| Cesta | Co obsahuje |
|---|---|
| `web/` | živý zdroj webu — jediná složka, která se nasazuje |
| `docs/` | analýzy a audity (proveditelnost, rezervační systémy, UX/UI audit, texty po rezervaci) |
| `content/` | `brandbook-lenka-web.json` — jediný platný brandbook, zdroj hodnot pro design tokeny |
| `STATUS.md` | průběžný stavový log |

`docs/04-ux-ui-audit.md` je živý seznam úkolů — před navazující prací
zkontrolovat, co z něj je hotové.

## Příkazy

Web je čisté HTML + ES moduly, žádný build krok, žádný `package.json`.
Prohlížeče blokují ES moduly na `file://`, takže **nejde otevřít dvojklikem**:

```
cd web
npx serve .
```

Pak otevřít adresu, kterou `serve` vypíše (obvykle `http://localhost:3000`).

⚠️ `serve` při přesměrování z `.html` **zahazuje query string**, takže
diagnostické stránky se musí volat bez přípony (`/diag-smoke?page=…`).

### Kontrola syntaxe modulů

Před ověřováním v prohlížeči vždy:

```
for f in $(find web/js -name '*.js'); do node --input-type=module --check < "$f" || echo "CHYBA $f"; done
```

Syntaktická chyba v jednom modulu shodí registraci **všech** komponent
a v prohlížeči to vypadá jako nevykreslená stránka, ne jako chyba.
⚠️ Nejčastější příčina: **zpětný apostrof v komentáři uvnitř `styles()`
nebo `template()`** — celý blok je template literál a apostrof ho ukončí.

### Ověřování layoutu a vzhledu

Není tu interaktivní prohlížeč, ale je headless Chrome. Dvě metody, každá
na něco jiného:

**1. Diagnostická stránka + `--dump-dom`** (`web/diag-*.html`, ignorované
gitem). Stránka si v iframu nastaveném na přesnou šířku načte web, změří,
co potřebuje, a výsledek vypíše do `<div id="out">` mezi značky `###`.
Vhodné pro statická měření: rozměry, kontrasty, přetečení, ARIA.

⚠️ Screenshot na mobilní šířku přes `--window-size` je nespolehlivý
(nerespektuje media queries správně) — jde to jen přes iframe s totožnou
originou nastavený na přesnou šířku.

**2. DevTools Protocol** (`cdp.mjs`, bez závislostí — Node 22+ má globální
WebSocket). Spustí Chrome s remote debuggingem, naviguje a vyhodnotí
testovací soubor **přímo v kontextu stránky**.

⚠️ **Nutné pro cokoli, co závisí na `requestAnimationFrame`**: pod
`--virtual-time-budget` rAF v iframu **vůbec nefiruje** (ověřeno). Tepometr
na něm stojí, takže první metodou vypadá zamrzlý a test by prošel rozbitý.
CDP navíc umí `Emulation.setDeviceMetricsOverride` (spolehlivá mobilní
šířka) a `setEmulatedMedia` (`prefers-reduced-motion`).

### Měření barev

Computed value přichází ve **třech** různých formátech podle toho, jak byla
barva zapsaná:

```
rgb(252, 250, 248)           hex a rgb()        0..255
color(srgb 0.98 0.96 0.94)   color-mix()        0..1
oklch(0.55 0.15 165)         oklch(from …)      jiná osa!
```

Ruční parsování proto nestačí a u `oklch` dá naprostý nesmysl (0,55 se
přečte jako složka R). Barvu vždy převést canvasem: `ctx.fillStyle = computed`
a přečíst pixel — `fillStyle` přijme kterýkoli z těch zápisů.

## Architektura (`web/`)

```
web/
  index.html            scroll-story homepage (pět tepových zón)
  rozvrh-cenik.html, o-mne.html, kontakt.html
  lenka-web-styleguide.html   skrytá stránka se vzorníkem (noindex)
  robots.txt            Disallow: / — pro náhled, viz checklist nasazení
  css/tokens.css        design tokeny (barvy, mezery, typografie, breakpoint)
  css/fonts.css         12 @font-face, self-hostovaný Raleway + Manrope
  css/base.css          reset a základní styly
  css/layout.css        rozvržení stránek, rozdělené na pojmenované sekce
  js/main.js            registrace chrome komponent (hlavička, patička, cta)
  js/seo.js             strukturovaná data (@graph), skládá se z js/seo/*
  js/seo/               opening-hours.js, offers.js
  js/data/              veškerý obsah odděleně od zobrazení
  js/components/        vanilla Web Components (Shadow DOM)
  js/pages/             napojení dat na konkrétní stránku
  assets/               fonty, obrázky, videa
```

**Komponenty (12):** `site-header`, `site-nav`, `site-footer`, `cta-button`,
`activity-card`, `schedule-widget`, `pricing-cards`, `news-board`, `faq-list`,
`media-gallery`, `studio-venues`, `heart-rate-meter`.

**Data (`js/data/`):** `activities.js`, `venues.js`, `zones.js`, `schedule.js`,
`faq.js`, `news.js`, `gallery.js`, `nav.js`, `icons.js`, `site-config.js`.

### Klíčové principy

- **Data odděleně od zobrazení.** `js/data/*.js` je jediný zdroj pravdy pro
  obsah. Komponenty a stránky obsah nikdy nehardcodují. Přidání položky do
  menu = úprava `js/data/nav.js`, nic víc.
- **`js/main.js` registruje jen chrome komponenty** (hlavička, patička,
  `cta-button`) — ty jsou na každé stránce, takže se ten seznam nemění nikdy.
  Komponenty specifické pro stránku registruje `js/pages/<stránka>.js`
  statickým importem. Dynamický `import()` ne: vytvořil by waterfall
  a odložil obsah nad ohybem o jeden round-trip.
- **`js/pages/*.js`** je napojení dat na konkrétní stránku — vytváří instance
  komponent a plní je daty.
- **Web Components dědí `BaseElement`** (`js/components/base-component.js`).
- **Design tokeny** (`css/tokens.css`) jsou jediné místo pro barvy, mezery,
  typografii a breakpoint. Hodnoty pocházejí z reálného brandbooku klientky
  (`content/brandbook-lenka-web.json`, export z Figmy). Nic nehardcoduje
  barvu, mezeru ani radius jinde — **a žádný literál v `transition`**: token
  se při `prefers-reduced-motion` nuluje, zapsaná hodnota ne.
- **Jediný breakpoint 768px, dvě nezaměnitelná znění.** `min-width: 768px`
  pro desktop a výš, `width < 768px` pro nižší. `max-width: 768px` se
  nepoužívá — přesahoval by s prvním a na šířce přesně 768px platily oba.
- **Obsah je reálný**, stažený z justyoga.cz. Jediný neověřený údaj je
  `capacity: 10` v `activities.js` — číslo z příkladu klientky, ne potvrzený
  počet míst; ověřit před ostrým nasazením.

### `BaseElement`

Centralizuje Shadow DOM boilerplate. Komponenta implementuje jen `styles()`
a `template()`.

- **Styly se adoptují jako `CSSStyleSheet`, nevkládají do `innerHTML`.**
  Stylesheet se parsuje jednou pro třídu (ne pro instanci) a `render()` na
  styly nesahá, takže přepis `innerHTML` nemůže shodit vzhled.
- **Sdílené recepty** ze `js/components/styles.js` si komponenta vyžádá
  `static sheets = [FOCUS_RING, ICON]`. Exportují se CSS **stringy**, ne
  hotové sheety: z hotového sheetu se text zpátky nedostane a je potřeba pro
  fallback ve starších WebView.
- **`render()` je destruktivní** — přepíše celý shadow root. Je to správné
  pro změnu dat (`set lessons`, `set activity`), ale **ne pro interakci**:
  zahodí i právě fokusovaný prvek. Interakce proto mutuje existující uzly
  (vzor `site-nav #setOpen`, `schedule-widget #select`).
- **`$(sel)` a `$$(sel)`** jsou zkratky nad vlastním shadow rootem.
- **`static observedAttributes`** stačí vyjmenovat, překreslení řeší
  základní třída.

### Datový kontrakt komponent

Dvojkolejnost je záměrná a vyplývá z hranice HTML/JS, ne z nedůslednosti:

- **HTML atributy** pro listové komponenty se skalárními hodnotami, které se
  vyskytují ve statickém HTML nebo v `template()` jiné komponenty
  (`<cta-button>`). Do HTML stringu se JS property předat nedá.
- **JS property settery** pro komponenty přijímající strukturovaná data
  (pole, objekty), která atributem přenést nejde — `schedule-widget.lessons`,
  `pricing-cards.activities`, `activity-card.activity`, `news-board.items`,
  `faq-list.items`, `media-gallery.photos/videos`, `studio-venues.venues`.

### Ceník a rozvrh jsou záměrně DVĚ komponenty

Mají různý interakční model (taby s panely vs. statický grid s legendou).
Generický `<data-table>` byl zkoušen a **19. 7. 2026 smazán jako mrtvý kód** —
neoživovat. Sdílí se stylesheet (`LESSON_TYPE` ve `styles.js`), ne komponenta.

### Invarianty přístupnosti

Tohle jsou měřené hodnoty, ne odhady. Když se mění, **přeměřit**.

- **`--color-text-muted` musí držet ≥ 4,5:1 na nejtemnějším pozadí, kde se
  používá.** Nese reálný obsah — taglines lekcí, místa konání, ceny
  permanentek, popisky formuláře, celou patičku. Dnes mix 30 % dává 4,98
  proti kartě Tabata. Měří se proti sedmi plochám, ne jedné.
- **Hero text má vlastní podklad, ne jen scrim.** Fotka je pod textem téměř
  bílá (medián #e8e8e8), takže bílý text na ní propadal na všech třech
  řádcích. Zesílení scrimu by muselo jít na alfu ~0,7 a zabilo by světlou
  náladu fotky. Při změně fotky nebo textu přeměřit.
- **Focus prstenec jen z `var(--focus-ring-*)`**, nikdy opsaný
  `outline: 2px solid`. Prvky uvnitř `overflow: hidden` nastaví
  `--focus-offset` na zápornou hodnotu.
- **`schedule-widget`:** taby nesmí přepínat přes `render()` (zahodí
  fokusovaný button) a všechny panely musí být v DOM, jinak `aria-controls`
  ukazuje na neexistující id. Roving tabindex a obsluha šipek jdou vždy
  spolu — bez šipek by se ke zbytku týdne klávesnicí nešlo dostat.
- **Každá stránka:** `<meta name="description">`, skip-link,
  `<main id="main" tabindex="-1">`.
- **`<img>` s `width: auto`** potřebuje `width`/`height` atributy (loga).
  Obrázky, které mají velikost z CSS (`aspect-ratio`, absolutní pozicování),
  je nepotřebují — nic by neopravily.
- **Tepometr:** grafika `aria-hidden`, text skutečný obsah, žádné `aria-live`
  (hodnota se mění desítkykrát za sekundu). K číslu patří skrytá věta
  „orientační tep při tomto typu lekce, ne váš vlastní" — bez ní může někdo
  číst 170 jako změřený vlastní tep.

### Tón textů

- **Vykání** na celém webu. Klientčiny slogany tykají, ale její vlastní text
  „mostu" vyká a celý web vyká — slogany se převádějí do vykání.
- **První osoba jednotného čísla („já"), ne „my".** Studio vede jedna
  lektorka: „Napište mi", ne „Napište nám".
- Rozhodl webdesignér; klientka se na to nemá ptát.

### Pasti v datech

- **`schedule.js` používá typografickou pomlčku** (`–`, U+2013), ne
  spojovník. Split na `"-"` tiše vrátí celý řetězec a `undefined`.
- **Adresy nejsou v `site-config.js`.** Studio cvičí na dvou místech, takže
  žijí rozložené na složky ve `venues.js` — strukturovaná data i navigační
  odkazy potřebují ulici, PSČ a město zvlášť. Jóga je na Bílkově, jumping
  a kondiční lekce v posilovně u ZŠ Slovákova; **záměna adres stojí zákazníka
  lekci**, takže se to nesmí zjednodušovat na jednu adresu.
- **Neznámý fakt se nevymýšlí.** Parkování, souřadnice, kapacita, lhůta pro
  odhlášení ani věková hranice nejsou známé. V datech jsou jako `null` nebo
  zakomentované s `[ZJISTIT u klientky]` a UI je prostě nevykreslí. Nesprávný
  údaj o parkování je horší než chybějící — člověk podle něj jedná.

## Nasazení do WordPressu (checklist)

1. **`web/robots.txt` obsahuje `Disallow: /`** pro náhled. Jako motiv skončí
   ve `wp-content/themes/…`, kde ho roboti nečtou (neškodí). Kdyby se `web/`
   nasazovalo jako **kořen domény, MUSÍ se smazat** — jinak zablokuje
   indexaci ostrého webu.
2. **Doplnit `canonical` a `og:url`.** Schválně tam nejsou: finální slugy
   nejsou známé (živý web má `/rozvrh` a `/ceník` jako dvě stránky) a špatný
   canonical dokáže stránku vyřadit z indexu. Spolu s tím nastavit **301
   přesměrování ze starých URL**, jinak se zahodí historická autorita.
3. **`og:image` je absolutní URL** na `justyoga.cz/assets/images/…` — po
   nasazení se cesta změní (motiv, nebo Media Library).
4. **Interní odkazy mají `.html` přípony** a `site-nav` detekuje aktuální
   stránku přes `pathname.split("/").pop()`. Pod pretty permalinky přestane
   fungovat obojí — přemapovat.
5. **Kontaktní formulář napojit na Contact Form 7** (plugin je na produkci
   aktivní). Názvy polí už odpovídají reálnému formuláři, stačí nahradit
   shortcodem.
6. **`<heart-rate-meter>` musí zůstat přímým potomkem `<body>`.**
   `position: fixed` se zasekne uvnitř předka s `transform`, `filter` nebo
   `contain`, což WP motivy běžně mají.
7. **Ověřit `capacity`** v `activities.js` a PSČ ve `venues.js`.
8. **Sitemap** — na produkci je aktivní plugin XML Sitemaps; nedělat statický
   soubor, byly by dvě konkurenční sitemapy.

## Co se nemění bez souhlasu klientky

Verze 3 je klientkou schválený stav. **22. 7. 2026 byl pokus zavést celý
UX audit v jedné dávce zamítnut a `web/` se vracelo přes `git checkout`.**
Proto:

- Vizuální změny **jen po jedné**, každá jako samostatný commit.
- **Refaktor bez vizuálního dopadu a vizuální změna nikdy v jednom commitu.**
- U vizuální změny udělat screenshot před i po.

## Skilly a workflow

- `client-status-log`: `STATUS.md` je průběžný stavový dokument — udržovat
  aktuální (log, next steps) při každé smysluplné dávce práce.
- `clean-code-standards`: udržitelný kód bez hardcoded jednorázových vzorů.
- Komunikace s uživatelem probíhá česky.
