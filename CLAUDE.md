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
zkontrolovat, co z něj je hotové. ⚠️ Část položek se redesignem z 3. 9. 2026
vyřešila jinak, než audit předpokládal (jiná struktura homepage), a část
naopak stále platí (rezervační odkazy, reference, měření).

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

Syntaktická chyba v jednom modulu shodí celý import graf stránky a v prohlížeči
to vypadá jako nevykreslená stránka, ne jako chyba.

### Ověřování layoutu a vzhledu

Není tu interaktivní prohlížeč, ale je headless Chrome
(`/c/Program Files/Google/Chrome/Application/chrome.exe`).

**1. Diagnostická stránka + `--dump-dom`** (`web/diag-*.html`, ignorované
gitem). Stránka si v iframu nastaveném na přesnou šířku načte web, změří,
co potřebuje, a výsledek vypíše do `<div id="out">`. Vhodné pro statická
měření: rozměry, kontrasty, přetečení, ARIA.

⚠️ Screenshot na mobilní šířku přes `--window-size` je nespolehlivý —
jde to jen přes iframe s totožnou originou nastavený na přesnou šířku,
a okno musí být **širší** než iframe, jinak se obsah ořízne.

⚠️ Výstup `<div id="out">` se z dumpu tahá parserem, ne `sed`em — `sed`
najde dřív zdrojový kód skriptu než vykreslený text.

**2. DevTools Protocol** (`cdp.mjs`, bez závislostí — Node 22+ má globální
WebSocket). Nutné pro cokoli, co závisí na `requestAnimationFrame`: pod
`--virtual-time-budget` rAF v iframu **vůbec nefiruje**. CDP navíc umí
`Emulation.setDeviceMetricsOverride` (spolehlivá mobilní šířka)
a `setEmulatedMedia` (`prefers-reduced-motion`).

### Měření barev

Computed value přichází ve **třech** různých formátech podle toho, jak byla
barva zapsaná:

```
rgb(252, 250, 248)           hex a rgb()        0..255
color(srgb 0.98 0.96 0.94)   color-mix()        0..1
oklch(0.55 0.15 165)         oklch(from …)      jiná osa!
```

Ruční parsování proto nestačí a u `oklch` dá naprostý nesmysl. Barvu vždy
převést canvasem: `ctx.fillStyle = computed` a přečíst pixel.

⚠️ **Canvas ale zahodí alfu.** `color(srgb 1 1 1 / 0.7)` přečte jako čistě
bílou a vrátí kontrast, který na stránce neplatí. Průhledný text se musí
dopočítat kompozicí přes skutečné pozadí, ne změřit.

## Architektura (`web/`)

```
web/
  index.html            homepage
  rozvrh-cenik.html, o-mne.html, kontakt.html
  robots.txt            Disallow: / — pro náhled, viz checklist nasazení
  css/tokens.css        design tokeny (tónová řada, typografie, mezery, motion)
  css/fonts.css         @font-face, self-hostovaný Fraunces + Manrope
  css/base.css          reset, typografie, primitiva (btn, card, eyebrow, reveal)
  css/layout.css        rozvržení po sekcích
  js/lib/dom.js         el()/append()/fill()/mount() — stavba uzlů
  js/lib/reveal.js      scroll reveal přes IntersectionObserver
  js/ui/chrome.js       hlavička, navigace, patička
  js/ui/sections.js     render funkce obsahových bloků
  js/pages/             napojení dat na konkrétní stránku
  js/seo.js             strukturovaná data (@graph), skládá se z js/seo/*
  js/data/              veškerý obsah odděleně od zobrazení
  assets/               fonty, obrázky, videa
```

**Data (`js/data/`):** `activities.js`, `venues.js`, `schedule.js`, `faq.js`,
`news.js`, `gallery.js`, `nav.js`, `icons.js`, `site-config.js`.

### Klíčové principy

- **Data odděleně od zobrazení.** `js/data/*.js` je jediný zdroj pravdy pro
  obsah. Render funkce a stránky obsah nikdy nehardcodují. Přidání položky do
  menu = úprava `js/data/nav.js`, nic víc.
- **Žádné Web Components, žádný Shadow DOM.** Zrušeno 3. 9. 2026. V projektu
  nebyl jediný `<slot>`, `::slotted` ani `::part`, takže se za izolaci nic
  nekupovalo, ale platilo se pořád: 880 řádků CSS zavřených ve dvanácti
  komponentách proti 985 v `css/`, takže polovina vzhledu byla pro globální
  stylesheet nedosažitelná. **Neoživovat.**
- **Komponenta = funkce, která vrací uzly.** `js/ui/*.js`. Žádná třída, žádný
  životní cyklus, žádná registrace. Stránka je krátký seznam „sem dej tenhle
  blok" (`mount("[data-week]", renderWeek)`).
- **Nikdy neskládat obsah do HTML stringu.** `js/lib/dom.js` staví uzly a
  nastavuje `textContent`. `html:` v `el()` se používá jen pro ikony z
  `js/data/icons.js`, které píšeme my. Až obsah poteče z WordPressu, tohle je
  jediná věc, která stojí mezi ním a XSS.
- **Design tokeny** (`css/tokens.css`) jsou jediné místo pro barvy, mezery,
  typografii, tvar a motion. Nic nehardcoduje barvu, mezeru ani radius jinde —
  **a žádný literál v `transition`**: token se při `prefers-reduced-motion`
  nuluje, zapsaná hodnota ne.
- **Jediný breakpoint layoutu 768px, dvě nezaměnitelná znění.**
  `min-width: 768px` pro desktop a výš, `width < 768px` pro nižší.
  `max-width: 768px` se nepoužívá — přesahoval by s prvním a na šířce
  přesně 768px platily oba.
  Výjimka: **1280px u ukazatele tempa.** Není to breakpoint layoutu, ale
  odpověď na otázku „vejde se vedle obsahu svislý panel?". Pod ním se
  ukazatel překlopí do vodorovného proužku dole. Druhou výjimkou je 480px
  uvnitř toho proužku. Jinam se breakpoint nepřidává.
- **Obsah je reálný**, stažený z justyoga.cz. Neověřené údaje jsou označené
  (viz Pasti v datech).

### Vizuální jazyk

Popsaný v komentářích v `tokens.css`; tohle je shrnutí, proč to tak je.

- **Tónová řada, ne sada akcentů.** Deset kroků jedné teplé rodiny
  (`--ramp-50` … `--ramp-900`), od off-white po hodnotu textu z brandbooku.
  Každý povrch i každá barva textu je krok téhle řady — proto stránka čte
  jako jeden materiál. Brandbook sám označuje mint a žlutou za „complementary
  **pops**"; jsou to 6px značky, ne výplně karet. Předchozí verze z nich
  udělala tři stejně silné tinty a to byl hlavní zdroj dojmu „omalovánky".
- **Kontrast písem nese celý web.** Fraunces (display patka) proti Manrope.
  Nadpis se skládá ze **dvou řezů jedné patky** — kurziva 400 nese frázi,
  roman 600 v berry ji dosadí (`.hero__title-main` + `.hero__title-accent`).
  Tohle je ta konstrukce, kvůli které jeden nadpis unese stránku.
  ⚠️ Fraunces je odchylka od brandbooku, který jmenuje Raleway. Důvod: jako
  třetí humanistický sans vedle Manrope nenesl žádný kontrast a jeho řez 300
  ve velkých velikostech byl nejsilnější signál „šablona z roku 2010".
  **Potřebuje souhlas klientky.**
- **Hloubka ze střídání pásů, ne ze stínů.** `.band--alt` a `.band--dark`
  střídají pozadí sekcí; karty na nich jsou bílé. Brandbook říká
  `"shadows": "none"` a je to záměr. Dva stínové tokeny existují jen pro dvě
  věci, které skutečně opouštějí stránku (mobilní panel, karta při hoveru),
  jsou tónované nejtmavší hodnotou značky, ne černou — **taky odchylka od
  brandbooku, taky potřebuje souhlas.**
- **Těsné radiusy (3–14 px) a žádná plně kulatá tlačítka.** Zaoblené pastelové
  boxy byly druhá půlka toho „dětského" dojmu.
- **Pohyb je málo a je levný.** Bloky se odkryjí jednou při vstupu do
  viewportu a přestanou být sledované. Žádný parallax, žádné scroll-linked
  transformy, žádné nekonečné smyčky. Referenční web feelgood-boskovice.cz má
  jediný `@keyframes` a působí líp než předchozí verze tohohle webu — pohyb
  ten rozdíl nedělá, typografie a barva ano.

### Invarianty přístupnosti

Tohle jsou měřené hodnoty, ne odhady. Když se mění, **přeměřit**.

- **`--color-text-muted` je `--ramp-700` (#6b4245), ne 600.** Nese reálný
  obsah — popisky lekcí, místa konání, ceny, popisky formuláře, patičku —
  takže musí čistit AA (4,5:1) na **každé** ploše, kam může padnout:

  ```
  krok            bg     bg-alt  sunk    bílá
  600 #8a5a57     5.53   5.11    4.39 ✗  5.71
  700 #6b4245     8.17   7.56    6.48 ✓  8.43   <- zvolené
  ```

  600 vypadá měkčeji, ale padá na `--color-surface-sunk`. Token, který je
  bezpečný jen na některých plochách, je past, do které tenhle projekt už
  jednou spadl.
- **Korálová `#e86667` má 3,12:1 a smí jen kreslit tvary** — linky, tečky,
  značku aktivní položky v navigaci, číslice kroků (ty jsou ≥24 px, takže jim
  stačí 3:1, a jsou `aria-hidden`). Nikdy jako text pod 24 px, nikdy jako
  vyplněné tlačítko s bílým popiskem.
- **Berry `#a9436b`** unese bílý popisek (5,67:1) i text na světlých plochách
  (5,50 / 5,08). Je to interaktivní barva webu.
- **Průhledný text na `.band--dark`:** bílá 70 % = 7,23:1, 82 % = 9,33:1.
  Dopočítáno kompozicí, ne změřeno canvasem (ten alfu zahodí).
- **Hero nemá scrim ani podkladový obdélník.** Text sedí na pozadí stránky
  a fotka vedle něj, takže se nic nemusí ztmavovat. Předchozí verze měla pod
  textem tónovaný zaoblený obdélník — nevracet.
- **Focus prstenec jen z `:focus-visible` v `base.css`**, nikdy opsaný
  `outline: 2px solid`. Prvky uvnitř `overflow: hidden` nastaví
  `--focus-offset` na zápornou hodnotu.
- **`.js [data-reveal]`, ne `[data-reveal]`.** Skrytý výchozí stav je
  podmíněný třídou, kterou nasazuje `reveal.js`. Bez toho by obsah zůstal
  navždy neviditelný všude, kde observer nedoběhne — crawler, headless render,
  chyba dřív v import grafu.
- **FAQ je nativní `<details>`.** Klávesnice, čtečky i stav bez JS zadarmo.
  Nenahrazovat ručním akordeonem.
- **Každá stránka:** `<meta name="description">`, skip-link,
  `<main id="main" tabindex="-1">`.
- **`<img>` s `width: auto`** potřebuje `width`/`height` atributy (loga).
  Obrázky, které mají velikost z CSS (`aspect-ratio`), je nepotřebují.

### Tón textů

- **Vykání** na celém webu. Klientčiny slogany tykají, ale její vlastní text
  vyká a celý web vyká — slogany se převádějí do vykání.
- **První osoba jednotného čísla („já"), ne „my".** Studio vede jedna
  lektorka: „Napište mi", ne „Napište nám".
- **Žádné emoji v CTA, žádná falešná urgence, žádné mluvení za návštěvníka.**
  Tlačítko říká, co se stane po kliknutí („Zobrazit termíny", „Otevřít
  rezervace"), ne co si návštěvník myslí („Chci začít 🧘").
- Rozhodl webdesignér; klientka se na to nemá ptát.

### Pasti v datech

- **`schedule.js` používá typografickou pomlčku** (`–`, U+2013), ne
  spojovník. Split na `"-"` tiše vrátí celý řetězec a `undefined`.
- **Adresy nejsou v `site-config.js`.** Studio cvičí na dvou místech, takže
  žijí rozložené na složky ve `venues.js`. Jóga je na Bílkově, jumping
  a kondiční lekce v posilovně u ZŠ Slovákova; **záměna adres stojí zákazníka
  lekci**, takže se to nesmí zjednodušovat na jednu adresu.
- **`bookingUrl` nevede na termín.** Jóga i kondiční lekce míří na
  `app.tymuj.cz/team-invitation`, tedy na pozvánku do týmu (registrační
  obrazovka), jumping na kořen rezervačního systému. Tlačítko proto říká
  „Otevřít rezervace" a přiznává odchod ze webu. **Je to nejdražší tření na
  webu a s redesignem nesouvisí** — [ZJISTIT u klientky, jestli Tymuj umí
  veřejný odkaz na kalendář nebo přímo na termín].
- **Neznámý fakt se nevymýšlí.** Parkování, souřadnice, kapacita, lhůta pro
  odhlášení ani věková hranice nejsou známé. V datech jsou jako `null` nebo
  zakomentované s `[ZJISTIT u klientky]` a UI je prostě nevykreslí. Nesprávný
  údaj o parkování je horší než chybějící — člověk podle něj jedná. Proto má
  `FAQ` osm položek, ne čtrnáct: šest jich čeká na odpověď klientky.
- **`capacity: 10`** je číslo z příkladu klientky, ne potvrzený počet míst.
  Dnes se nikde nevykresluje; před oživením ověřit.

## Nasazení do WordPressu (checklist)

1. **`web/robots.txt` obsahuje `Disallow: /`** pro náhled. Jako motiv skončí
   ve `wp-content/themes/…`, kde ho roboti nečtou (neškodí). Kdyby se `web/`
   nasazovalo jako **kořen domény, MUSÍ se smazat**.
2. **Doplnit `canonical` a `og:url`.** Schválně tam nejsou: finální slugy
   nejsou známé (živý web má `/rozvrh` a `/ceník` jako dvě stránky) a špatný
   canonical dokáže stránku vyřadit z indexu. Spolu s tím nastavit **301
   přesměrování ze starých URL**.
3. **`og:image` je absolutní URL** na `justyoga.cz/assets/images/…` — po
   nasazení se cesta změní.
4. **Interní odkazy mají `.html` přípony** a `js/ui/chrome.js` detekuje
   aktuální stránku přes `pathname.split("/").pop()`. Pod pretty permalinky
   přestane fungovat obojí — přemapovat.
5. **Kontaktní formulář napojit na Contact Form 7** (plugin je na produkci
   aktivní). Názvy polí už odpovídají reálnému formuláři, stačí nahradit
   shortcodem. Do té doby `js/pages/kontakt.js` odeslání zablokuje a řekne to
   návštěvníkovi.
6. **Gutenberg tabulky pro rozvrh a ceník.** Vzhled nesmí být navázaný na tvar,
   který dnes generuje `activities.js` — parsovaný `<table>` z WP nebude mít
   `venueId` ani `bookingUrl`. Nutné mapování a fallback.
7. **Sitemap** — na produkci je aktivní plugin XML Sitemaps; nedělat statický
   soubor, byly by dvě konkurenční sitemapy.
8. **Novinky ze sítí (volitelné).** Sekce `#novinky` je dnes ručně plněná
   z `js/data/news.js` a karta se umí odkázat na konkrétní příspěvek
   (`source` + `url`). Automatické tažení z Instagramu a Facebooku ve
   statickém motivu **nejde** — potřebuje server, který drží a obnovuje
   token. Na WordPressu to jde, viz „Novinky ze sítí" níž.

## Novinky ze sítí (co to obnáší)

Sekce `#novinky` je připravená tak, aby ji šlo plnit automaticky, ale
samotné tažení příspěvků je samostatná dávka práce a **nejde ve statickém
motivu**. Fakta, aby se to nemuselo zjišťovat znovu:

- **Instagram Basic Display API bylo 4. 12. 2024 zrušeno.** Nástupce je
  Instagram API with Instagram Login (`/me/media`, scope
  `instagram_business_basic`), který **vyžaduje účet typu Business nebo
  Creator**. Token platí 60 dní a musí se obnovovat.
- **Facebook Page** se čte přes Graph API `/{page-id}/posts` s Page Access
  Tokenem; ten se odvozuje z dlouhodobého uživatelského tokenu, který
  klientka musí schválit, a Meta k tomu chce projít App Review.
- **URL obrázků z Instagramu jsou podepsané a vyprší.** Cron je proto musí
  stáhnout a uložit lokálně, jinak se novinky za pár dní rozsypou na
  chybějící obrázky.
- **Cron:** WP-Cron se spouští návštěvou stránky, takže „ráno a večer"
  negarantuje. Správně je systémový cron na hostingu, který dvakrát denně
  volá `wp-cron.php` (a `DISABLE_WP_CRON` v `wp-config.php`).
- **GDPR:** tahle cesta je na souhlas *lepší* než embed widgety — data se
  stahují serverem, návštěvníkovi se nic třetí strany nenačte a nepadají
  žádné cizí cookies. Embed (`embed.js`, Page Plugin) by naopak souhlas
  vyžadoval a přinesl by cizí vzhled.
- **Doporučení:** nepsat vlastní klienta. Obnovu tokenů by pak někdo musel
  hlídat navždy, a u jednoho jóga studia je to špatný poměr. Plugin
  (Smash Balloon a spol.) to řeší včetně cache obrázků; jeho výchozí
  vzhled je cizí, ale dá se přebít šablonami tak, aby plnil **naše** karty
  (`.news__item`). Vzhled tak zůstane náš a údržba cizí.

## Co potřebuje souhlas klientky

Redesign z 3. 9. 2026 je **návrh, ne schválený stav**. Žije na větvi
`redesign-2026`; poslední klientkou schválená verze je na `main`.

Tři body jdou nad rámec brandbooku a musí se s ní probrat:

1. **Fraunces místo Raleway** jako písmo nadpisů.
2. **Dva stínové tokeny** proti `"shadows": "none"`.
3. **Mint a žlutá degradované na značky**, korálová jen na tvary.

⚠️ **22. 7. 2026 byl pokus zavést celý UX audit v jedné dávce zamítnut
a `web/` se vracelo přes `git checkout`.** Proto: dokud klientka redesign
neschválí, nemíchat ho do `main` a další vizuální změny dělat po jedné,
každou jako samostatný commit se screenshotem před a po.

## Skilly a workflow

- `client-status-log`: `STATUS.md` je průběžný stavový dokument — udržovat
  aktuální (log, next steps) při každé smysluplné dávce práce.
- `clean-code-standards`: udržitelný kód bez hardcoded jednorázových vzorů.
- Komunikace s uživatelem probíhá česky.
