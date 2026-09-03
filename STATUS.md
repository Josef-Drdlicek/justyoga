# Just Yoga — Status

## Klient / projekt
Redesign webu **justyoga.cz** (Just Yoga Boskovice, jóga studio).

## Goal
Stávající vzhled webu (šablona `fyoga`) je nevyhovující a nebude se upravovat/restylovat — cílem je **kompletní náhrada šablony** vlastním HTML + čistým (vanilla) JavaScriptem, nahraná jako nový motiv do stávajícího WordPress účtu (stejný hosting, stejná instalace). Cílem je i zjednodušit UX pro potenciální zákazníky (jednodušší cesta k rezervaci). Klíčová podmínka: majitelka needituje HTML, musí si i nadále sama upravovat ceník přes frontend/administraci WordPressu.

Aktuální fáze: **implementace a vizuální ladění** (proveditelnost i přístupy ověřeny, staví se reálný frontend — homepage, rozvrh/ceník; nasazení do WordPressu přijde na řadu později).

## Current status
Od 3. 9. 2026 běží na větvi **`redesign-2026`** kompletně přestavěný web.
Není to iterace verze 4 — je to náhrada. Podnět: web působil lacině a jako
15 let starý, což se po rozboru ukázalo jako měřitelné, ne dojmové.

Rozdíl proti `main`:
- **Typografie:** Fraunces (display patka) proti Manrope; Raleway odchází.
  Nadpis se skládá ze dvou řezů jedné patky. Všechny velikosti jsou `clamp()`,
  přibyly tracking a leading tokeny.
- **Barva:** deset kroků jedné teplé rodiny místo čtyř rovnocenných pastelů.
  Hloubka ze střídání pásů, ne ze stínů.
- **Architektura:** Shadow DOM a 12 Web Components zrušeny, nahrazeny render
  funkcemi v `js/ui/` a jedním stylesheetem. Data v `js/data/` beze změny.
- **Odchází:** scroll-story s tepovými zónami, tepometr, `zones.js`,
  styleguide. Pro zadání „čistý a svěží" to byl nejhlasitější prvek stránky.
- **Homepage** nově odpovídá na „kdy můžu přijít" nad ohybem a má sekci pro
  první návštěvu.

Po první dávce přibylo:
- **Ukazatel tempa je zpět** a je na všech čtyřech stránkách. Nápad
  klientky (e-mail z 28. 8.) — stránka stoupá od klidu k maximu, plovoucí
  panel ukazuje tep, tepovou zónu, dech a námahu, a nese CTA, které se
  mění se zónou. Zastávky si hledá přes `data-zone-stop`, takže je může
  nabídnout kterákoli stránka.
- **Rozvrh přestavěný na čitelnost:** každá lekce je blok s jasnou
  hierarchií a 4px pravítkem v barvě zóny, nad ním legenda.
- **Sekce Novinky** (`#novinky`) plus odkazy na Instagram a Facebook
  v sekci, na kontaktu a v patičce.
- **Průvodce** — plovoucí rozcestník ve tvaru konverzace, bez vstupního
  pole. Na telefonu bottom sheet.
- **Menu má sedm položek** ve dvou skupinách: nabídka lekcí (kotvy na
  homepage) a stránky webu.

`main` drží poslední klientkou schválený stav a nesahá se na něj, dokud
klientka redesign neuvidí.

## Next steps
1. **Ukázat klientce** a získat souhlas se třemi odchylkami od brandbooku:
   Fraunces místo Raleway, dva stínové tokeny proti `"shadows": "none"`,
   degradace mint/žluté na značky.
2. **Rezervační odkazy** — nejdražší tření na webu, na redesignu nezávislé.
   [ZJISTIT u klientky: umí Tymuj veřejný odkaz na kalendář nebo přímo na
   termín? Totéž u chytre-rezervace.] Dnes vedou na pozvánku do týmu.
3. **Fakta, která blokují nasazení:** parkování, kapacita, pravidla
   odhlašování, souřadnice, věková hranice, přenosnost permanentky. Šest
   otázek ve `faq.js` na ně čeká zakomentovaných.
4. **Reference a fotky zevnitř** — sociální důkaz na webu není ani jednou.
5. **Měření prokliků do rezervace.** Bez něj je jakékoli další CRO slepé.
6. Checklist nasazení v `CLAUDE.md` — canonical, 301, Contact Form 7.

## Log
### 2026-09-03 (2. dávka) — tepometr zpět, čitelný rozvrh, novinky, průvodce
Devět commitů na `redesign-2026`, `main` netknutý.

**Tepometr vrácen.** V první dávce jsem ho vyhodil jako příliš hlasitý pro
zadání „čistý a svěží". Klientka ho ale výslovně chce a je to její nápad,
takže je zpátky — přestavěný do nového jazyka: tenký kruhový budík místo
plné pulzující koule, čtyři hodnoty místo jedné (tep, tepová zóna, dech,
námaha), všechny interpolované mezi zónami podle scrollu. 75 → 115 → 165
a ustálení na 96, přesně jak to popsala. Slogany její, převedené do vykání.
⚠️ Panel se čtyřmi čísly vypadá jako měření — proto věta „orientační
hodnoty pro tento typ lekce, ne vaše měření" stojí VIDITELNĚ, ne jen pro
čtečky.

**Rozvrh.** Byl nepřehledný: čas, název a místo ve třech skoro stejných
velikostech a místo zopakované drobným písmem pod každou z devíti lekcí.
Teď blok s hierarchií a barevné pravítko podle tempa. Barva zóny je stejná
v legendě, v rozvrhu i na ukazateli.

**Novinky bez cronu.** Automatické tažení z Instagramu a Facebooku ve
statickém motivu nejde (Basic Display API zrušeno 12/2024, oEmbed chce
aplikační token, zbytek jsou cizí widgety s cookies). Sekce je proto
vlastní obsah ve vlastním vzhledu, který se umí odkázat na konkrétní
příspěvek. Co obnáší napojit to na produkci cronem, je rozepsané
v `CLAUDE.md`.

**Průvodce.** Klikací rozcestník, ne chat — bez vstupního pole a bez
odesílání. Skutečný chat na webu jednoho člověka slibuje obsluhu, která
tam v šest večer není. Strom se skládá z `faq.js`, `venues.js`
a `site-config.js`, takže se odpovědi nikde neopisují.

**Chyby nalezené a opravené v téhle dávce:**
- Loga aktivit byla roztažená z poměru 1,635 na 6,18 (stretch v column
  flexu proti pevné výšce). Karty navíc srovnány subgridem.
- Rezervační odkazy nevedou na termín, ale na pozvánku do týmu — opravit
  nejde bez klientky, ale tlačítko už o tom nelže.
- Aktuální položka v menu se neoznačovala vůbec: `serve` i WP pretty
  permalinks doručí `/rozvrh-cenik`, odkazy mají `.html`.
- Ikony sítí se vykreslovaly jako černé čtverce — jsou tahové, ne
  výplňové, a `fill: currentColor` vyplnilo jejich podkladový obdélník.
- Průvodce nešel zavřít: panel ukotvený dole rostl nad horní hranu i se
  zavíracím křížkem, protože strop se počítal z výšky okna místo
  z volného místa.
- **Prázdné okno průvodce na načtené stránce:** autorský `display: flex`
  přebil prohlížečové `[hidden] { display: none }`. Testy to minuly,
  protože se ptaly na vlastnost `hidden`, ne na vykreslený `display`.

### 2026-09-03 — REDESIGN: nový vizuální jazyk, ven ze Shadow DOM
Na větvi `redesign-2026`, jeden commit, `main` nedotčený.

**Proč.** Web působil lacině. Rozbor šesti specialistů (art direction, UX,
copy, motion, front-end, CRO) proti třem referencím — jana-bayerova,
feelgood-boskovice.cz a myawellbeing.com — pojmenoval příčiny jako měřitelné:
dva humanistické bezpatkové fonty bez vzájemného kontrastu, pevná typografická
škála bez `clamp()`, nulové tracking a leading tokeny, čtyři pastelové akcenty
jako rovnocenné tinty karet, jediné pozadí pro celý web, `text-align: center`
jako výchozí stav, a hover, který kvůli `--shadow-sm: none` posunul prvek
o jeden pixel.

**Klíčové zjištění.** `feelgood-boskovice.cz` má v celém CSS **jeden**
`@keyframes` a dvě animace — prakticky stejně statický jako justyoga, a přesto
působí líp. Pohyb ten rozdíl nedělá. Dělá ho display patka použitá 18× a
desetikroková tónová řada jedné barevné rodiny místo sady akcentů. Motion se
tím z „opravy" přesunul mezi „příjemné navíc".

**Brandbook to podpořil.** Sám označuje mint a žlutou za „complementary
**pops**" — předchozí verze z nich udělala tři stejně silné tinty karet.
Tónová řada je tedy věrnější zadání než to, co bylo v kódu.

**Měřeno, ne odhadnuto.** Tlumený text posunut z `ramp-600` na `700`, protože
600 dává na nejtmavší ploše řady 4,39 (padá). 700 dává 6,48. Berry unese bílý
popisek na 5,67, korálová má 3,12 a smí jen kreslit tvary. Bílá 70 % na plum
= 7,23 (dopočítáno kompozicí — canvas alfu zahodí, to je nová past v
`CLAUDE.md`). Na 390 px nic nepřetéká.

**Smazáno:** 12 komponent, `BaseElement`, `styles.js`, `main.js`, `zones.js`,
`heart-rate-meter.js`, styleguide, 12 souborů Raleway. Celkem 25 souborů.

**Nová past nalezená při stavbě:** `[data-reveal]` se startovní `opacity: 0`
by nechal obsah navždy neviditelný všude, kde IntersectionObserver nedoběhne.
Skrytý stav je proto podmíněný třídou `.js`, kterou nasazuje `reveal.js`.

### 2026-09-03 — VERZE 4: nové repo, tepometr a scroll-story homepage
Velká dávka: úklid repa, přesun na vlastní repozitář, oprava chyb
a přístupnosti, výkon, hlavní nová feature a přepsaná dokumentace.
Rozdělené do 13 samostatně vratných commitů.

**Nové repo.** `Josef-Drdlicek/justyoga`, čistý `git init` (historie se
nepřenášela — 21 MB packu, z toho ~19 MB videa zdvojená subtree historií).
Zjistilo se, že **verze 3 nikdy nebyla pushnutá**, takže klientka na náhledu
nikdy neviděla stav, který v srpnu schválila e-mailem. Na staré repo navíc
nejsou práva (`push: false`, `admin: false`), takže ho nelze ani aktualizovat,
ani zprivátnit — to musí vlastník organizace.
Struktura: `web/` beze změny, analýzy do `docs/`, `content/` zredukován na
jediný platný brandbook. Vyřazeno do archivu: nezávazný náčrt UX, mrtvý
`index-nástřel.html`, dokumentace v paletě verze 1, podklad pro grafika,
osobní korespondence, PDF výběru loga, diktovaná zpětná vazba klientky
a 6 hash-identických duplikátů fotek a log.

**Opravené chyby.** Rozjetá galerie videí (mrtvý token `--color-charcoal`
po rebrandu, kvůli kterému byla videa do načtení prvního snímku průhledná;
připojeny postery, které v assetech ležely od začátku). Favicony, které
v repu byly, ale nic na ně neodkazovalo. Chybějící meta description na
kontaktu. Kolize breakpointů — `min-width` a `max-width` na 768px platily
na té šířce oba zároveň, nejhůř v `schedule-widget`, který obsahuje oba.

**Přístupnost, všechno měřené.** Tlumený text propadal WCAG AA na sedmi
plochách (3,08 na kartě Tabata) → mix 45 % na 30 %, teď 4,98. Hero text
propadal na **všech třech** řádcích (kicker 1,64) a měření percentilů
ukázalo, proč nestačí zesílit scrim: fotka je pod textem téměř bílá, medián
jasu #e8e8e8. Text dostal vlastní podklad, kicker je teď 5,37. Focus prstenec
sjednocen do tokenů — a přitom se ukázalo, že `cta-button` a `.btn`,
nejpoužívanější tlačítka webu, neměly focus indikátor vůbec. Skip-link.
Rozvrh: `aria-controls` ukazovalo na neexistující id a klik na tab zahazoval
fokusovaný button; opraveno renderováním všech panelů a mutací atributů
místo `render()`, včetně roving tabindexu a obsluhy šipek.

**Výkon.** Audit tvrdil, že layout shift mají hero a bio fotky — měření to
vyvrátilo (mají velikost z CSS). Skutečný shift měla jen dvě loga s
`width: auto`. Preload Raleway 300 (LCP text) posunul jeho start z 49 a 76 ms
na 24 ms. `main.js` registroval všech devět komponent na každé stránce;
per-page registrace snížila počet JS modulů — kontakt z 17 na 11.

**Tepometr a scroll-story homepage.** Hlavní nová feature podle nápadu
klientky. Homepage má pět pásem (klid → most → rytmus → maximum → CTA),
tep jde 75 → 88 → 110 → 154 → 102 a pulz se **skutečně zrychluje**.
Zásadní technické zjištění: `animation-duration` není animovatelná, takže
čisté CSS ani scroll-driven animace neumí pulz plynule zrychlit — jde to
jen přes Web Animations API a `updatePlaybackRate`. Zóny, tempa, barvy
i texty žijí v novém `js/data/zones.js`; aktivity se k zónám hlásí polem
`zone`, takže nová aktivita se zařadí jedním řádkem.
Barvy typů lekcí přemapované, aby tepometr svítil barvou karty: jumping →
korál, tabata → oranžová (brandbookový peach dotlačený na plnou saturaci,
protože oranžovou brandbook nemá).
⚠️ Tři chyby našlo až měření, ne čtení kódu: `updatePlaybackRate` se vůbec
nevolal (pulz se nezrychloval, tedy celá pointa feature nefungovala),
`contain: paint` ořezával zvětšené kolečko do podoby plochého štítu,
a kolečko lezlo na text pod sebou.

**Dvě adresy.** Nejvážnější obsahové riziko: jóga je na Bílkově, jumping
a kondiční lekce v posilovně u ZŠ Slovákova, ale kontakt znal jen Bílkovu —
kdo šel přímo tam, mohl dojet na špatné místo. Nový `js/data/venues.js`
s adresami rozloženými na složky, komponenta `<studio-venues>` na kontaktu
i v CTA homepage, navigační odkaz místo odkazu na hledání. Ceníkové karty
přestaly být slepou uličkou (dostaly místo konání a dvě akce).

**SEO.** Strukturovaná data přepsána na `@graph` (firma + Place pro druhé
místo + Person + OfferCatalog + FAQPage), s otevíracími hodinami
generovanými z reálného rozvrhu zvlášť pro každé místo. Doplněny náhledy
pro sdílení včetně vygenerovaného obrázku 1200×630 — dosud každé sdílení
na Facebook vypadalo jako holý odkaz. FAQ přepsáno na 8 otázek, alt texty
galerie popisují, co je na fotkách skutečně vidět.

**Refaktor.** `BaseElement` adoptuje stylesheety místo vkládání do
`innerHTML` (parsování jednou pro třídu, ne pro instanci — na rozvrhu
15 adopcí, 8 unikátních objektů), sdílené recepty ve `styles.js`,
atributová mechanika v základní třídě, `layout.css` po sekcích. Vypadl
mrtvý CSS, včetně tří tříd, které osiřely mou vlastní změnou o dvě dávky
dřív.

**Nová metodika ověřování.** Ukázalo se, že `--virtual-time-budget`
**vůbec nefiruje `requestAnimationFrame` v iframu**, takže tepometr
standardní metodou vypadá zamrzlý a rozbitá feature by testem prošla.
Vznikl proto ovladač přes DevTools Protocol (bez závislostí), který
vyhodnocuje testy přímo v kontextu stránky a umí emulovat mobilní šířku
i `prefers-reduced-motion`. Podrobnosti v `CLAUDE.md`.

**Dokumentace.** `CLAUDE.md` přepsán — popisoval komponentu `<data-table>`
smazanou 19. 7. a `content/brandbook.md` jako zdroj pravdy. Nově obsahuje
i invarianty přístupnosti s naměřenými hodnotami, pasti v datech, checklist
nasazení a pravidlo „refaktor a vizuální změna nikdy v jednom commitu".

### 2026-08-27 (2) — Podklad pro Facebook bannery (jeden soubor pro Figmu)
- Klient chtěl **jeden soubor s HTML + CSS pro Figmu**, aby si mohl nechat vyrobit bannery na Facebook ve stejné identitě. Vzniklo `bannery-facebook-figma.html` v kořeni repa (1,25 MB, mimo `web/` — není to část webu, je to podklad pro grafika).
- **Soubor je samostatný**: fonty (12× woff2), loga i dvě fotky jsou zapečené jako data URI, takže funguje offline a jde otevřít dvojklikem (žádné ES moduly, tedy ani problém s `file://`). Import do Figmy přes plugin `html.to.design` (záložka Code/File), fallback je tisk do PDF.
- **Identita se needituje na dvou místech**: hodnoty jsou převzaté z `web/css/tokens.css`. Barvy, které web počítá za běhu (`color-mix`, `oklch(from …)`), jsou v podkladu **dopočítané na hex**, protože Figma CSS funkce neumí — u každé je v komentáři původní vzorec (`--text-muted #8a8284`, `--border #e3e0df`, `--primary-dark #302026`, `--accent-dark #8b3758`, typy lekcí `#008961` / `#916a00` / `#af4970` + pastely).
- **11 hotových rámců** v přesných FB rozměrech: cover stránky 1640×624 (+ prázdná šablona s bezpečnými zónami pro mobilní ořez a pro místo krytého profilovkou), cover události 1920×1005, 3× příspěvek 1:1 pro jógu/jumping/tabatu, ceník 1:1, rozvrh 1200×630, story 1080×1920 a 2× profilovka 500×500 s vodítkem kruhového ořezu. Obsah je reálný (ceny, rozvrh, adresy i texty z `js/data/*.js`, včetně klientčiných CTA s emoji), ne placeholder.
- **Stavebnice místo layoutu na míru**: každý rámec má jediný měřítkový knoflík `--scale` (velikost fontu rámce) a vnitřek je celý v `em`, takže stejná sada tříd (`.pill`, `.chip`, `.card`, `.bullets`, `.sched`, `.logo--*`) obslouží banner 500 px i 1920 px. Přidat nový formát = jeden řádek s `--w/--h/--scale`.
- **Zjištění k logu:** barevné PNG logo nejde použít na tmavé ploše — švestkový nápis „JUST YOGA" na švestkové zmizí. Podklad proto nabízí tři varianty pro tmavé pozadí (textový logotyp v Raleway 400, logo v bílé pilulce, vážka na švestkovém podkladu z `favicon-512.png`) a je to zapsané i v pravidlech „co ne".
- Součástí je **stručný styleguide**: paleta s měřenými kontrasty, vzorník vah písma s pravidlem „Raleway 300 jen od 28 px", díly banneru a seznam „co ano / co ne" (korálová `#e86667` nikdy jako text ani tlačítko — 3,2:1).
- Ověřeno headless Chromem: všech 11 rámců má **přesné rozměry, nikde nic nepřetéká** (`scrollWidth == clientWidth`), načte se všech **12 řezů fontů** (`document.fonts.check` pro Raleway 300/400/500/600 a Manrope 400/700), žádná chyba v konzoli. Výřezy fotek doladěny podle skutečného měření (`background-position` se počítá z plochy fotky, ne z celého rámce — první verze coveru měla motiv schovaný pod textovým panelem).
### 2026-08-27 — VERZE 3: zapracovaná zpětná vazba klientky (e-mail 14. 8.)
Klientka poslala texty a seznam úprav (diktované do mikrofonu, originál i mapování požadavek → místo v kódu je v `content/feedback-klientka-2026-08-14.md`). Zapracováno všech 10 webových bodů:
- **Hero fotka**: vyzkoušena záměna za fotku studia (`gallery/foto-06.jpg` jako `studio-hero.jpg`, `object-position: center 60%`), ale **vráceno na původní `lenka-hero.jpg`** — jediná dostupná fotka sálu je z telefonu na výšku (768×1024), takže se v širokém pásu roztahuje a je viditelně měkká, zatímco portrét je 2560×1707. Klientčin požadavek tím **není splněný**: čeká se na fotku studia v použitelném rozlišení, ideálně nafocenou na šířku, pak je to záměna dvou řádků v `index.html` + `layout.css`.
- **Hero text**: vypuštěna věta „vyberte si termín…", tagline teď vyjmenovává i světelnou terapii, HIIT a kruhový trénink. Stejně doplněny `<meta description>` na homepage, rozvrhu a „O mně".
- **Karty aktivit přepsané na marketingové texty klientky** — `js/data/activities.js` je pořád jediný zdroj: nová pole `headline` (hook), `benefits` (3 odrážky s fajfkou), `note` (vzkaz pro začátečníky), `ctaLabel` (její texty tlačítek včetně emoji), `capacity`, `shortName`, `logoSubtitle`.
  - Jóga → **„Jóga a světelná terapie"**, text rozšířen o infrapanely při závěrečné relaxaci.
  - Tabata → **„Tabata, HIIT a kruhový trénink"**. Logo „JUST TABATA" novinky pojmenovat neumí a nepřekresluje se, proto `logoSubtitle` („+ HIIT a kruhový trénink") pod logem na kartě; v rozvrhu, kde je karta úzká, se používá `shortName` („Tabata / HIIT").
  - **Kapacita** pod tlačítkem („Kapacita lekce je omezena na 10 míst, rezervujte včas.") + jednou `.section-note` pod rozvrhem. ⚠️ 10 je číslo z příkladu klientky, ne potvrzená kapacita — ověřit před produkcí.
  - `note` je záměrně **uvnitř** `.content` nad cenou, ne na konci karty: cenu tlačí na dno karty `margin: auto`, takže cokoliv pod ní rozhodí linku ceny a tlačítek proti sousedním kartám (ověřeno měřením — `price.top` i `cta.top` jsou u všech tří karet shodné).
- **Nová sekce Aktuality** (homepage, nad lekcemi): `js/data/news.js` + `js/components/news-board.js`. Prázdné pole je legitimní stav — `js/pages/home.js` skryje celou sekci včetně nadpisu (sekce je v HTML `hidden` a odkrývá ji až skript), takže po vyprázdnění dat nezůstane osamocený nadpis. První aktualita = světelná terapie, druhá = obecné „od září chystáme novinky" (⚠️ konkrétní novinky klientka neuvedla).
- **Nová sekce Časté otázky** (homepage, pod lekcemi): `js/data/faq.js` + `js/components/faq-list.js` (accordion na nativních `<details>/<summary>`, takže klávesnice i hledání ve stránce fungují bez JS). ⚠️ Klientka slíbila vlastní FAQ texty, ale v e-mailu nedorazily (možná byly v příloze `image0.png`) — odpovědi jsou proto poskládané z jejích formulací v potvrzovacím e-mailu, aby web i potvrzení říkaly totéž. Adresy ani ceny se ve FAQ záměrně neopakují (žijí v `activities.js`).
- **„O mně" přepsané** podle jejího textu (nový H1 „Provázím vás pohybem…", úvodní odstavec + 3 odstavce s tučnými lead-iny). Její „Vás/Vaše" s velkým V sjednoceno na malé „vás" — zbytek webu (i její vlastní texty k lekcím) používá malé v, míchat obojí by bylo vidět. Pokud to chce naopak s velkým, je to jedna náhrada v `o-mne.html`.
- **Texty potvrzení po rezervaci** (e-mail + SMS) uloženy do `content/texty-po-rezervaci.md` — **nepatří na web**, jsou to šablony do Tymuj / Chytré rezervace. Rozdělené na variantu pro jógu (se světelnou terapií) a pro jumping/tabatu (s čistou obuví), protože jedna šablona na obojí nefunguje, plus SMS varianty do 160 znaků.
- Ověřeno v headless Chromu na 1440 px i 390 px (mobil přes iframe, viz metoda níže): žádná chyba v konzoli na žádné ze 4 stránek, žádný vodorovný přesah (`scrollWidth == clientWidth`), cena i tlačítko v jedné linii napříč kartami.
- Odpověď pro klientku (plain text k odeslání) je v `odpovedi/odpoved-klientce-2026-08-27.txt`.

### 2026-07-22 (3) — UX/UI audit verze 2
- Proveden **kompletní UX/UI audit** stávajícího stavu (verze 2), zapsán do nového `04-ux-ui-audit.md` (navazuje na číslovanou řadu 01–03). Vychází z přečtení celého kódu ve `web/` + reálného vykreslení všech 4 stránek v headless Chromu (desktop 1440 px, mobil 390 px); kontrasty **změřené** přes canvas, ne odhadnuté.
- **Nalezena příčina dosud otevřené položky „galerie videí se rozjíždí"**: `media-gallery.js:62` používá `var(--color-charcoal)`, jenže tento token byl při rebrandu na verzi 2 z `tokens.css` odstraněn. Změřeno: token je prázdný → pozadí videa `rgba(0,0,0,0)` (průhledné). Videa jsou na výšku 720×1280, na desktopu vysoká 616 px, bez `poster` → do načtení prvního snímku je vidět jen černý proužek ovládání v jinak průhledné ploše. Není to tedy chyba mřížky, ale mrtvý odkaz na token.
- **Nový vážný nález přístupnosti:** `--color-text-muted` (po rebrandu odvozený `color-mix`em, 45 % pozadí) propadá WCAG AA pro běžný text — změřeno 3,60 na stránkovém pozadí, 3,75 na bílé kartě, **3,07 na kartě Tabata** (AA vyžaduje 4,5). Týká se taglinů na homepage, míst konání v rozvrhu, popisků v ceníku, popisků formuláře a celé patičky. Při rebrandu se měřil jen hlavní text (15,17), tlumená varianta ne.
- **Druhý nález přístupnosti:** hero „kicker" má kontrast ~2:1 — bílá na 85 % krytí sedí v horní části fotky, kde má gradient jen 20 %, a fotka je tam velmi světlá (změřený pixel `rgb(217,207,205)`).
- **Hlavní UX nález:** rozvrh na desktopu ukazuje jen 1 den ze 4 za taby, přestože všech 9 lekcí by se na 1440 px vešlo najednou — odpověď na nejdůležitější otázku („kdy můžu přijít?") stojí 4 kliknutí. Ceník nemá žádné CTA (slepá ulička), a stránka Kontakt uvádí jen adresu studia, ačkoli jumping i tabata jsou v jiné budově (ZŠ Slovákova).
- Ověřeno zároveň, že web nemá **žádné vodorovné přetečení ani JS chyby** na žádné ze 4 stránek na desktopu i mobilu (jediný 404 = chybějící favicon).
- **Pokus o implementaci celého auditu najednou byl zavržen a vrácen.** Rozpracovaná dávka (celý týden v rozvrhu na desktopu, sekce „Co vám která lekce dá" a „Jdete k nám poprvé?" na homepage, druhá provozovna na Kontaktu, položka „Rezervovat" v menu, skip-link, 404 stránka, přepsaná `seo.js`) se klientce nelíbila a `web/` byl vrácen na commit `284e21d` (`git checkout -- web/`). **Poučení pro příště: neimplementovat celý audit v jedné dávce — brát bod po bodu a nechat odsouhlasit.**
- Web tedy zůstává beze změny; platí **jen analýza** v `04-ux-ui-audit.md`, pořadí prací je v jejím závěru.
- V repu zůstaly **vygenerované, zatím nepoužité soubory** (nic na ně neodkazuje, protože odkazující kód byl vrácen):
  - `web/assets/images/favicon-32.png`, `favicon-512.png`, `apple-touch-icon.png` — vyrobené z vážky v logu (barevná detekce + maskování, plum podklad), řeší bod A3.
  - `web/assets/videos/video-{1,2,3}-poster.jpg` — poster snímky vytažené z videí přes headless Chrome (ffmpeg v tomto prostředí není), pro bod A1/A2.
  - Zjištění za běhu: videa jsou **smíšená** — `video-1` a `video-2` jsou na výšku 720×1280, `video-3` na šířku 848×480.

### 2026-07-22 (2) — VERZE 2: rebrand podle nového brandbooku „Lenka Web"
- **Klientka dodala nový brandbook** (JSON export z Figmy) a chtěla podle něj novou verzi webu — ne skrytou ukázku, ale skutečně přeoblečený web. Upřesněno, že jde o **stejné studio** (stejné aktivity/ceny/rozvrh/kontakt), mění se **jen vizuál**.
- **Verze 1 zajištěna v gitu** místo ruční zálohy: commit + tag **`v1-terracotta`**, obojí pushnuto na GitHub. Návrat k původnímu vzhledu = `git -C ../lenka-web checkout v1-terracotta` (tag zůstal v archivu, v novém repu neexistuje).
- **Brandbook uložen do repa** jako `content/brandbook-lenka-web.json` (dřív existoval jen ve zprávě v chatu). Starý `content/brandbook.md` ponechán jako historie rozhodnutí, jen doplněna hlavička, že ho nový JSON nahrazuje.
- **Fonty Raleway + Manrope, self-hostované** (`web/css/fonts.css`, `web/assets/fonts/`, 12 souborů woff2, ~236 kB). Google Fonts CDN je z tohoto prostředí nedostupný (`curl` → 000), takže staženo z npm balíčků `@fontsource/raleway` a `@fontsource/manrope` (v5.3.0). Self-hosting je zároveň lepší varianta než CDN — zachovává dosavadní „žádný third-party request" vlastnost projektu, žádná GDPR otázka, přežije nasazení do WordPressu. **Subsety `latin` i `latin-ext`** — česká diakritika je v latin-ext, bez něj by ř/ě/ů/č/š/ž tiše spadly na systémový font.
- **`css/tokens.css` přepsán** na novou paletu. Mění se jen barvy a typografie — mezery, rádiusy, motion a layout tokeny zůstaly (klientka si rádiusy i pilulková tlačítka nedávno sama odladila).
  - `--color-primary` = švestková `#402b32` (hero CTA, Odeslat, mapa), `--color-accent` = berry `#a9436b` (tlačítka Rezervovat + odkazy).
  - **Coral `#e86667` je záměrně jen dekorativní** (logo) — na bílý text má jen ~3,3:1, jako výplň tlačítka by propadl WCAG AA.
  - **Vedlejší oprava přístupnosti:** stará tlačítka „Rezervovat" (šalvěj + bílý text) měla kontrast ~2,7:1, tedy propadala AA. Nově změřeno: primární **13,05**, accent **5,67**, běžný text **15,17**.
  - `--color-text-muted` a `--color-border` se teď **odvozují** z text/bg přes `color-mix` místo samostatných šedých hexů — zůstávají v teplé rodině palety.
- **Barvy typů lekcí** vzaty přímo z palety brandbooku: jóga = mint, jumping = žlutá, tabata = berry (zelená/žlutá/fialová dle přání klientky). Tím padl i můj dřívější vymyšlený `#d9a53a` — otevřená otázka z minula je vyřešená.
  - **Nález za běhu:** pastelové odstíny fungují jako podbarvení karty, ale jako **barva ikony** jsou nečitelné (žlutá `#ffd47d` na bílé ~1,3:1). Jednotné procento ztmavení nejde použít, protože zdrojové odstíny mají extrémně různou světlost. Vyřešeno **relativní barevnou syntaxí** `oklch(from var(--barva) 0.55 c h)` — jeden vzorec pin­uje všechny tři na stejnou perceptuální světlost, hue zůstane. Změřeno: 4,05 / 4,69 / 4,29 (práh pro grafické prvky je 3,0).
- **Ploché stíny** — brandbook má `"shadows": "none"`, všechny `--shadow-*` tokeny nastaveny na `none` (jedno místo místo šití přes 8 souborů). Karty drží definici bílou plochou na teplém pozadí + 1px okrajem. Jediná výjimka: mobilní rozbalovací menu skutečně pluje nad obsahem → dostalo **vlastní výraznější okraj** místo stínu, ne výjimku z pravidla.
- **Váhy písma podle pravidel brandbooku** (`base.css`): Raleway 300 jen pro velké nadpisy (brandbook říká „28px a výš"), takže H1/H2 = 300, ale **H3 = 500** (20px, tenký řez by byl křehký). Tlačítka = Raleway 600.
- **Úklid:** `.hero__scrim` v `layout.css` měl natvrdo zapsanou starou charcoal barvu (druhá kopie mimo tokeny) — přepsán na `color-mix` z `--color-text`.
- **Odkazy doladěny po měření:** `--color-primary-dark` vyšla skoro totožná s barvou textu, takže odkazy by se lišily jen podtržením. Přehozeny na berry (`--color-accent`) — stejná interaktivní barva jako tlačítka Rezervovat, ~5,7:1. Totéž pro aktivní/hover stav v navigaci.
- **`lenka-web-styleguide.html` přestavěna na živou dokumentaci** — dřív duplikovala celou paletu ve vlastním `<style>` bloku; teď načítá `css/tokens.css` a vzorkovníky vykresluje přímo z živých tokenů, takže nemůže tiše odejít od skutečného webu. Zůstává `noindex, nofollow` a mimo `nav.js`.
- Ověřeno headless Chromem: fonty se skutečně načetly (`document.fonts.check` pro všechny 4 řezy, 12 face v dokumentu), diakritika jede přes webfont (změřená šířka se liší od fallbacku), kontrasty změřené přes canvas (kvůli `oklch`/`color(srgb)` v computed style nešlo parsovat řetězec), rezervační odkazy i mobilní menu beze změny, žádné console chyby.

### 2026-07-22
- **Další dávka zpětné vazby od klientky** — vizuální/textové doladění + nový samostatný "Lenka Web" brandbook (JSON z Figmy) pro skrytou stránku. Plán schválen a proveden celý v jedné dávce, viz `C:\Users\andre\.claude\plans\staged-popping-tome.md` pro plné znění plánu s odůvodněním.
- **Dvě otevřené UX otázky zodpovězeny analýzou** (klientka chtěla doporučení, ne rovnou řešení):
  - Sloučit rozvrh+ceník do jedné karty? → **Ne** — obě sekce už jsou na jedné stránce (`rozvrh-cenik.html`), plné sloučení by smazalo kalendářní procházení dnů a odporovalo by klientčiným vlastním itemizovaným požadavkům na úpravu obou widgetů zvlášť.
  - Zkrácené adresy na mobilu (Bílkova 91 / ZŠ Slovákova)? → **Zkracování úplně zrušeno.** Bylo to pozůstatek staré husté `<data-table>`; karty rozvrhu mají po přestavbě 2026-07-19 dost místa na plnou adresu vždy. Smazáno mrtvé pole `locationShort` z `activities.js` a `.text-full`/`.text-short` toggle na adrese ve `schedule-widget.js` (zůstal jen pro zkratky dnů PO/ÚT/ST/ČT v tabech).
- **Barvy typů lekcí přebarveny**: jóga = zelená (znovupoužit `--color-sage`, DRY), jumping = žlutá (nový hex `#d9a53a`), tabata = fialová (přebrán starý hex jógy `#9b7fae`) — `tokens.css`.
- **Ikony sjednoceny**: `PIN_ICON` (`icons.js`) byl jediná plná/fill ikona v jinak stroke-style sadě — nahrazen Tabler `map-pin` stroke verzí, promítlo se automaticky do patičky, kontaktní karty i karet rozvrhu.
- **Homepage „Naše lekce"**: tlačítko na kartě aktivity teď vede přímo na `activity.bookingUrl` (rezervace dané lekce), label „Rozvrh a ceník" → „Rezervovat", odstraněno „od " před cenou.
- **Mobilní menu**: přidán viditelný label „MENU" před hamburger ikonou (`site-nav.js`), jen na mobilu — ověřeno funkčně (otevření/zavření, ikona ✕/☰ dál funguje).
- **Rozvrh (`schedule-widget.js`)**: taby PO/ÚT/ST/ČT vycentrované na obou breakpointech, na mobilu roztažené na celou šířku (segmented-control vzhled); čas lekce zvětšen a zvýrazněn (`font-size-xl`, `font-weight:700`, plná barva textu); mobilní mezera mezi cenou a tlačítkem zvětšena (`space-2` → `space-4`).
- **Ceník (`pricing-cards.js`)**: zvětšena ikona (1.75rem → 2.25rem) a název lekce (`font-size-lg` → `xl`) na obou breakpointech.
- **Nadpisy**: nový sdílený utility styl `.page-heading` (`base.css`) vycentroval H1 na `rozvrh-cenik.html`, `o-mne.html`, `kontakt.html`. Nový `.lede` styl zvětšil/vycentroval úvodní odstavec pod H1 na `rozvrh-cenik.html` (zůstal `<p>`, ne nový `<h2>`, aby nekolidoval se sémantikou sekcí Rozvrh/Ceník pod ním).
- **Textové opravy**: em-dash `—` nahrazen en-dashem `–` ve viditelném textu (title tagy, hero tagline, meta description, `logoAlt`); příjmení opraveno `Náhodilová` → **`Nahodilová`** ve všech výskytech (klientka to výslovně potvrdila jako opravu, ne překlep). Čas `19:00–20:00` ověřen jako už správně formátovaný — beze změny.
- **Nová skrytá stránka `web/lenka-web-styleguide.html`** — samostatný, zcela izolovaný design-systém pro nově dodaný brand "Lenka Web" (jiné barvy/fonty než justyoga.cz — Raleway/Manrope, paleta salmon/peach/yellow/mint/berry). Vlastní `<style>` blok s CSS custom properties 1:1 z dodaného Figma JSON, `<meta name="robots" content="noindex,nofollow">`, žádný odkaz z `nav.js` ani odjinud — dostupná jen přímou URL. Nesdílí `tokens.css`/`base.css`/komponenty justyoga.cz (jiná identita, `tokens.css` zůstává jediné místo pravdy pro *justyoga* brand).
- Ověřeno end-to-end přes `puppeteer-core` (dočasně nainstalováno do scratchpadu, headless Chrome z `C:\Program Files\Google\Chrome\Application\chrome.exe`): screenshoty všech stránek na desktopu i mobilu, funkční test mobilního menu (toggle/ikona), ověření že tlačítka na homepage kartách i kartách rozvrhu vedou na správné `bookingUrl` každé aktivity. Žádné console/page chyby.

### 2026-07-07
- Založena struktura práce: STATUS.md + globální skilly `client-status-log` a `clean-code-standards`.
- Upřesněn cíl projektu: WordPress zůstává, frontend → vlastní HTML/vanilla JS, zjednodušení UX, ceník musí zůstat editovatelný majitelkou bez HTML.
- Provedena technická analýza justyoga.cz (homepage, ceník, rozvrh) — zjištěno téma `fyoga`, žádný page builder, ceník i rozvrh jsou nativní Gutenberg tabulky (dobrá zpráva pro proveditelnost). Detaily viz `01-analyza-proveditelnosti.md`.
- Identifikovány otevřené otázky pro klientku (přístupy do wp-admin/hostingu, typ rezervačního systému, rozsah redesignu, aktivita popup okna).
- Doplněn pouze ilustrativní náčrt zjednodušení UX (`02-navrh-zjednoduseni-ux.md`) na podporu závěru o proveditelnosti — klient zatím řeší jen otázku proveditelnosti, ne finální design.
- Upřesnění zadání: nejde o úpravu stávající šablony (ta se hodnotí jako nevyhovující), ale o **kompletní náhradu motivu** vlastním HTML/vanilla JS ve stejném WP účtu. Analýza i náčrt přepsány podle toho — závěr o proveditelnosti se nemění, náhrada motivu je z technického hlediska standardní a nezávislá na obsahu v databázi.
- Klient potvrdil: důvod pro kompletní nový build je, že současné UX i UI jsou nevyhovující — nejde jen o technickou volbu, ale o vědomé rozhodnutí stavět znovu od nuly (design i strukturu stránek), s výjimkou obsahu, který má zůstat editovatelný (ceník, případně rozvrh).
- Klient poskytl přístupy do wp-admin (justyoga.cz). Ověřeno přihlášením: jediná aktivní šablona je `fyoga` v1.3.9, žádný page builder; aktivní pluginy Contact Form 7, Popup Maker, Site Kit by Google, WordPress Importer, XML Sitemaps. Rezervace jde přes externí systémy `app.tymuj.cz` a `justjump.chytra-rezervace.cz` (tlačítka, ne formulář na webu) — nová šablona tedy nemusí řešit rezervační logiku, jen odkazy. Detaily viz `01-analyza-proveditelnosti.md`.
- Bezpečnost: přístupové údaje byly použity jen jednorázově k ověření a nejsou uložené v žádném souboru projektu. Doporučeno je do budoucna posílat/uchovávat přes správce hesel, ne v čistém textu.

- Integrován reálný brandbook a podklady z `content/` (logo, 2 fotky, barvy) — nahradily prozatímní placeholder verzi. Fonty zůstaly záměrně systémové (klientčino rozhodnutí, ne z brandbooku).
- Doplněno responzivní mobilní menu (hamburger ↔ ✕, zavírání klikem mimo/Escape/na odkaz, správné chování s klávesnicí), položka „Rezervace cvičení" v menu.
- Karty aktivit: přidána loga (Just Yoga/Tabata/Jump), viditelný okraj, odsazení od krajů obrazovky na mobilu, obsah karty vystředěný (logo/text/cena/tlačítko).
- Nalezeny a opraveny 3 skutečné layoutové chyby při doladění mobilní verze (ověřeno měřením v headless Chromu, ne odhadem): (1) pevná velikost hero nadpisu způsobovala vodorovné přetečení — opraveno na plynulé škálování (`clamp`); (2) `box-sizing: border-box` z globálního resetu se nedědí do Shadow DOM komponent, což zvětšovalo jejich reálnou šířku o padding navíc — opraveno jednou v `BaseElement`, dědí všechny komponenty; (3) `.section` a `.page-shell` obě nastavovaly CSS zkratku `padding` na stejném prvku, což rušilo boční odsazení — opraveno přechodem `.section` na `padding-block`.
- Vytvořena `dokumentace-postupu.pdf` (+ zdrojové `.html`) — laický výklad celého postupu od analýzy proveditelnosti až po dnešní stav, pro klientku.

### 2026-07-13
- Vytvořen `CLAUDE.md` v kořeni projektu (příkaz `/init`) — návod pro budoucí instance Claude Code: jak spustit web lokálně, princip oddělení dat/zobrazení, role `BaseElement`/`data-table`/design tokenů, odkaz na `STATUS.md` a skilly.
- Ověřen aktuální stav homepage: spuštěn lokální server (`npx serve .` ve `web/`), homepage zkontrolována přes headless Chrome screenshot i otevřením v reálném Chromu — vykresluje se podle posledního stavu (hero, karty lekcí, patička), beze změn oproti poslednímu zápisu výše.

### 2026-07-14
- **Karty aktivit (`activity-card.js`)**: přeskupeny do 3 vizuálních skupin (logo / tagline+cena blízko sebe / tlačítko odsazené jako akce) — doladěno iterativně na základě zpětné vazby (mezera text–cena `space-2 + space-1`, odsazení tlačítka `space-4 + space-1`). Padding karty na mobilu snížen o třetinu (`space-6` → `space-5` v `@media max-width:768px`).
- **Zaoblení sjednoceno napříč webem**: přidán token `--radius-xl` (1,25rem) do `tokens.css` pro karty, tlačítka (`cta-button`) zůstala na `--radius-lg` (1rem) jako "stejná rodina" o stupeň méně zaoblená. Vyzkoušen i pilulkový tvar tlačítka (`--radius-full`), nakonec zavržen ve prospěch 1rem — token proto zase odstraněn (žádný mrtvý kód v `tokens.css`).
- **Logo v hlavičce** (`site-header.js`): zvětšeno na desktopu (`min-width:768px`) na 3,5rem, mobil zůstává 2,75rem.
- **Hero sekce** (`index.html`, `css/layout.css`): zdrojová fotka je landscape 2560×1707 px, zatímco hero pás na desktopu je mnohem širší a nižší — `object-fit: cover` proto ukazoval jen tenký vodorovný pruh (na širokých monitorech prakticky jen hlavu s useknutýma rukama). Opraveno zvýšením `.hero` `min-height` na desktopu z 32rem na 40rem (víc z fotky se vejde do rámu, bez zásahu do assetu). Doladěn i `line-height: 1.1` nadpisu na desktopu.
- **Rozvrh a ceník (`data-table.js`, `rozvrh-cenik.js`, `activities.js`)** — rozsáhlejší úprava tabulek podle 9bodového zadání:
  - `data-table` nově podporuje obecné vlastnosti sloupce: `group` (rowspan opakujících se hodnot, teď použito pro sloupec Den), `width` (šířka sloupce) a volitelnou `legend` (text/HTML pod tabulkou, jednou za celou tabulku, s `legendMobileOnly` pro legendy platné jen na mobilu).
  - Responzivní zkracování textu v buňkách přes obecný pár `.text-full`/`.text-short` (dny jako Po/Út/St/Čt s `<abbr title="...">` na mobilu, plné názvy na desktopu; místo konání zkráceně "Bílkova 91"/"ZŠ Slovákova" na mobilu, plná adresa na desktopu).
  - Doplněno pole `locationShort` do `activities.js` — objeveno, že jde o **dvě různé provozovny** (Just Yoga studio na Bílkově 91, posilovna na ZŠ Slovákova), ne jednu budovu, jak se původně předpokládalo.
  - Legenda pod rozvrhem (mapový špendlík jako inline SVG — přesný tvar "kolečko + hrot dolů", emoji na to nestačí) vysvětluje zkratky míst, viditelná jen na mobilu (na desktopu je adresa už plně v tabulce). Legenda pod ceníkem (ikona Tabler Icons `calendar-time`, staženo a vloženo inline, bez závislosti na icon-fontu) vysvětluje, že permanentka platí 6 měsíců.
  - Ze sloupců ceníku odstraněno "Místo konání" (duplicita s rozvrhem).
  - Oprava: šířky sloupců (`column.width`) se měly týkat jen mobilu, ale `<col style="width:...">` fungoval jako nápověda i pro desktopové `table-layout: auto` a rozjížděl sloupce mezi rozvrhem a ceníkem. Opraveno přes CSS proměnnou (`--col-width`), která se čte jen uvnitř `@media max-width:768px` — desktop je teď čistě content-driven.
  - Radius tabulky sjednocen na `--radius-lg` (byl `--radius-md`).

### 2026-07-15
- **Karty aktivit (homepage)**: oprava zarovnání napříč kartami na užších desktopových šířkách — `.content` (tagline+cena) se dřív centroval nezávisle v každé kartě (`justify-content: center`), takže při různém počtu řádků taglinu netvořily tagline/cena napříč kartami rovnou linii. Opraveno ukotvením taglinu nahoru a ceny dolů (`margin: auto 0 0`), logo/tagline/cena/tlačítko teď svírají čtyři rovné linie napříč kartami bez ohledu na délku textu.
- **Rozvrh a ceník — druhé kolo úprav** podle zpětné vazby klientky:
  - Obě tabulky (`data-table.js`) teď mají vlastní ohraničenou "kartu" (border+shadow+radius kolem caption/tabulky/legendy), takže vizuálně čitelně jde o dva oddělené bloky, ne pokračování jedné tabulky. Zaoblení řeší padding, ne `overflow:hidden` (to by rozbilo sticky header, viz níže).
  - Dny v rozvrhu (Úterý/Čtvrtek…) teď dostávají celoplošné podbarvení bloku (`tbody tr.group-alt`, token `--color-surface-alt`), implementováno obecně přes libovolný `column.group`, ne hardcoded na "Den" — ceník (bez grouped column) beze změny. Barva pruhu byla na žádost klientky doladěna: místo samostatně vymyšlené barvy teď `color-mix(in srgb, var(--color-surface), var(--color-charcoal) 4%)` — jemný tón odvozený přímo z barvy karty ceníku, ne jiný odstín.
  - Hlavička sloupců (DEN/ČAS/LEKCE/MÍSTO) je při scrollu sticky, s offsetem pod hlavičkou webu (nový token `--header-height-estimate`, tokens.css, sdílený i s `.anchor-target`).
  - **Vedlejší nález a oprava**: sticky hlavička webu (`site-header.js`) ve skutečnosti nikdy nefungovala (containing block byl na `.bar` místo na `:host`) — teď opravdu drží nahoře po scrollu, na celém webu, ne jen na této stránce.
  - Sjednocena šířka rezervačních tlačítek ("Rezervovat – Jóga/Jumping/Tabata") — `cta-button`'s vnitřní `<a>` teď umí vyplnit šířku hostitele (`display:block; width:100%`), `.cta-row cta-button { min-width: 14rem }` (změřeno headless Chromem podle nejdelšího labelu). Ostatní použití `cta-button` (hero, karty aktivit) beze změny.
- **O mně**: nahrazen placeholder text reálným bio (4 odstavce od klientky) + 2 reálné fotky (`content/lenka-nahodilova-yoga.jpg` a `-yoga-4.jpg`, zkopírované jako `lenka-o-mne-protazeni.jpg`/`lenka-o-mne-meditace.jpg`). Přidána nová sekce "Fotky a videa" — nová komponenta `<media-gallery>` (`js/components/media-gallery.js`) zobrazuje 10 reálných fotek + 3 reálná videa stažená z `justyoga.cz/fotky-a-videa/` (fotky jako malé dlaždice, videa výrazně větší, dle přání klientky — zdrojový materiál není v top kvalitě). Data v `js/data/gallery.js`. Stránka je datově těžší kvůli videím (~19 MB galerie celkem).
- **Kontakt — kompletní přestavba**: dvě karty (`.contact-grid`) — kontaktní údaje vlevo/nahoře (jméno "Lenka Náhodilová", adresa s popiskem "Jógové studio", klikatelný telefon i e-mail, tlačítko na Google Maps), formulář v samostatné kartě vpravo/dole. Zjištěn a doplněn reálný e-mail `info@justyoga.cz` do `SITE_CONFIG` (zjištěno přímo z živého `justyoga.cz/kontakt/`). Formulář používá stejná jména polí jako produkční Contact Form 7 (`your-name`/`your-email`/`your-subject`/`your-message`) — připraveno na budoucí napojení, odeslání zatím záměrně nikam nevede (`preventDefault`, viz TODO v `kontakt.html`). Embed Google Maps (`output=embed` iframe) se v tomto prostředí nevykresloval spolehlivě → nahrazeno odkazem na Google Maps místo rizika prázdného rámečku. Ikona pinu sjednocena do sdíleného `js/data/icons.js` (dřív duplicitně jen v `rozvrh-cenik.js`), doplněny ikony telefonu a obálky (Tabler Icons, MIT).
- Celá tato dávka práce byla provedena přes model Claude Fable 5 (subagenti) na výslovné přání klientky.

### 2026-07-16
- **Vyjasněna otázka footeru a WordPressu** (dotaz klientky, zda WP do patičky něco povinně vkládá a jestli by nedošlo k duplicitě s kontaktem). Ověřeno na živém `justyoga.cz`: současná patička šablony `fyoga` zobrazuje „(c) Just Joga", adresu + telefon a odkaz „Powered by WordPress" na autora šablony (tishonator.com) — to vše je ale obsah `footer.php` konkrétní šablony `fyoga`, ne nic, co vynucuje WordPress jádro. WP samotný do patičky nevkládá nic povinně. Jediná skutečná technická nutnost při napojení do WP je zavolat háčky `wp_footer()`/`wp_head()` v šabloně — neviditelné, slouží pluginům (Contact Form 7, Site Kit/GA, Popup Maker) k vložení vlastních skriptů, ne obsahu.
- Závěr: žádné riziko duplicity. Náš `site-footer.js` už teď zobrazuje název/adresu/telefon z `SITE_CONFIG` (obsahově pokrývá starou patičku), „Powered by WordPress" credit řešit nemusíme (patřil ke staré šabloně zdarma, ne k WP jako takovému).
- **Zmapována všechna tlačítka/odkazy na webu** (dotaz klientky „kam míří všechny tlačítka") — kompletní přehled napříč hlavičkou/patičkou/menu a všemi 4 stránkami, žádné překvapení, vše sedí na `activities.js`/`site-config.js` jako jediný zdroj pravdy.
- **Prozkoumány rezervační systémy (Tymuj, Chytrá rezervace)** a možnost sloučení do jednoho systému s kalendářem přímo na webu — zjištění, srovnání (Reservio/SimplyBook.me/Amelia/Bookly) a předběžné doporučení zapsáno do nového dokumentu `03-rezervacni-systemy-srovnani.md`. Rozhodnutí, kterým směrem jít, se řeší přímo s klientkou — zatím nerozhodnuto, současná 3 tlačítka (Tymuj ×2, Chytrá rezervace ×1) zůstávají beze změny.

### 2026-07-19
- **Oficiální název firmy upřesněn klientkou**: studio se právně/oficiálně jmenuje "Just Yoga a pohybové studio Boskovice" (odlišné od kratší značky "Just Yoga Boskovice" používané v hlavičce/logu/titulcích stránek). Doplněno jako `SITE_CONFIG.legalName`, `siteName` zůstává beze změny jako vizuální značka.
- **SEO**: přidán nový sdílený modul `js/seo.js` (načten na všech 4 stránkách vedle `main.js`) — vkládá do `<head>` strukturovaná data JSON-LD (`schema.org/ExerciseGym`) s `legalName`, adresou, telefonem, e-mailem a odkazy na Facebook/Instagram (`sameAs`) — to je místo, které vyhledávače reálně používají k párování webu s firmou (např. Google Business Profile). Doplněn i `og:site_name` meta tag (plný název) do hlavičky všech stránek.
- **Patička (`site-footer.js`) přestavěna**: nově zobrazuje krátkou značku i plný oficiální název, adresu/telefon/e-mail s ikonami (sjednoceno se stylem kontaktní karty), odkazy na Facebook/Instagram (ty už byly v `SITE_CONFIG.social` vyplněné z předchozí práce, jen se nikde nezobrazovaly takto viditelně).
- **Homepage**: přidán "kicker" řádek s plným názvem studia nad hero nadpis (`hero__kicker`, `index.html` + `css/layout.css`) — první experimentální umístění, ověřeno na desktopu i mobilu (headless Chrome), barva doladěna z `--color-sand` (nízký kontrast na světlejší části fotky) na poloprůhlednou bílou kvůli čitelnosti.
- Next steps aktualizovány: odstraněna položka o doplnění fb/instagram odkazů (hotovo, viz výše).
- **Patička doladěna podle zpětné vazby**: odstraněn duplicitní krátký název (zůstává jen "Just Yoga a pohybové studio Boskovice"), odkazy na Facebook/Instagram teď mají vedle ikony i viditelný text ("Facebook"/"Instagram"), ne jen ikonu s `aria-label`.
- **Hlavní logo v hlavičce vyměněno** za širokou variantu z `content/just yoga - vyber loga - sirka text.pdf` (JUST YOGA + libela + "POHYBOVÉ STUDIO"), místo dřívějšího staženého loga z živého webu. Ověřeno, že PDF je skutečně vektorová kresba na průhledném pozadí (Illustrator export, transparency group, žádná podkladová výplň) — v tomto prostředí nejsou k dispozici PDF/grafické nástroje (Poppler/ImageMagick/Ghostscript), proto vyrenderováno přes `pdf-to-img`/`pdfjs` a průhlednost dopočítána tzv. difference-mattingem (render na bílém i černém pozadí → přesná alfa i barva), protože přímé headless renderování vždy vynucuje neprůhledný podklad. Uloženo jako nový soubor `assets/images/logo-just-yoga-wide.png` (`SITE_CONFIG.logoSrc`) — původní `logo-just-yoga.png` (svislá varianta) zůstal beze změny, protože ho pořád používá karta aktivity "Jóga" na homepage (`activities.js`), kde má jiné, čtvercovější proporce sedící vedle log Jump/Tabata.
- **Rozvrh a ceník kompletně přestavěny** ze statických tabulek (`<data-table>`) na kartové UI podle podrobného zadání klientky (viz konverzace — dny jako taby, karty lekcí barevně podle typu, rezervace přímo v každé kartě). Nové komponenty `js/components/schedule-widget.js` (taby Po/Út/St/Čt, výchozí den = dnešek nebo nejbližší další s lekcí, karta lekce = název/čas/místo/cena/tlačítko "Rezervovat" napojené na stávající `activity.bookingUrl`) a `js/components/pricing-cards.js` (3 karty typu lekce s dopočítanou úsporou permanentky). Barevné odlišení podle typu (jóga=fialová, jumping=korálová/oranžová, tabata=modrá) jako nové tokeny v `tokens.css` (`--color-type-*`, jen light varianta — projekt nemá dark mode) + 3 nové ručně kreslené ikony v `icons.js` (žádný odpovídající Tabler glyph). Generický `<data-table>` (`js/components/data-table.js`) smazán jako mrtvý kód — po přestavbě už nikde jinde použitý nebyl.
  - **Rozhodnutí s klientkou**: samostatná sekce/nav položka "Rezervace cvičení" zrušena — rezervace je teď přímo u každé karty, ne v oddělené sekci dole.
  - **Nález za běhu (ne odhad, ověřeno v headless Chromu)**: `id` uvnitř Shadow DOM není dosažitelný přes URL fragment (`#tabata` z homepage karet by přestalo fungovat, prohlížeč se vůbec nescrolluje — ověřeno přes `document.getElementById` i reálné kliknutí). Opraveno přesunem anchor bodu do light DOM: `rozvrh-cenik.html` má `<section id="cenik" class="anchor-target">` kolem `<pricing-cards>`, `activity-card.js` teď linkuje na `rozvrh-cenik.html#cenik` (dřív `#${activity.id}` na konkrétní tlačítko) — o něco méně přesné (skočí na celou sekci Ceník, ne na konkrétní kartu), ale spolehlivě funkční a barvy/ikony u karet dělají tu správnou kartu snadno k nalezení i tak.
  - Ověřeno end-to-end v headless Chromu (přes `pdf-to-img`/puppeteer-core, nainstalováno dočasně do scratchpadu): přepínání dnů funguje, kliknutí na "Rozvrh a ceník" na homepage kartě doskočí na Ceník sekci se správným scrollem, žádné JS chyby (jen předexistující 404 na chybějící favicon, nesouvisí).
- **Projekt nahrán na GitHub**: založen repozitář `andreadamaskova-ops/Lenka-web` (pozn. 2026-07-22: repo je ve skutečnosti **veřejné**, ne soukromé, jak tvrdil původní zápis — ověřeno přes `gh repo view`; obsahuje i fotky/videa klientky a `content/` podklady) (přihlášení přes `gh auth login`, nainstalován GitHub CLI). `.claude/` (lokální nastavení) přidáno do `.gitignore`, jinak nahráno vše včetně `content/` podkladů. Jeden úvodní commit se vším dosavadním stavem.
- **Vizuální experiment podle reference klientky** (yogamovement.cz/cenik) — líbily se jí tam pilulková tlačítka a zvlněný/zaoblený horní okraj kartiček. Vyzkoušeno a doladěno na základě zpětné vazby:
  - Pilulkové tlačítko (`cta-button.js`, `--radius-full` token znovu zaveden do `tokens.css`) — pozor, tohle už jednou bylo vyzkoušené a zavržené (viz log 2026-07-14), teď vědomě znovu otevřeno s konkrétní inspirací a klientka ho tentokrát chce ponechat. Svislý padding zúžen (`--space-3` → `--space-2 + --space-1`) na její žádost.
  - Zaoblení karet rozvrhu/ceníku: zkoušen asymetrický "obloukovitý" tvar (velký rádius jen nahoře, jako na referenci) — klientka nakonec chtěla stejný jednotný styl rohů jako karty aktivit na homepage (`activity-card.js`, `--radius-xl`), jen o něco kulatější → nový token `--radius-2xl: 1.5rem`, aplikován na `schedule-widget.js` i `pricing-cards.js`.
  - Poznámka: karty aktivit na homepage zůstávají na `--radius-xl` (nezměněny) — případná sjednocení je otevřená otázka, klientka zatím neřekla, jestli to chce sjednotit i tam.

## Next steps

### Blokuje ostré nasazení — potřebujeme od klientky
Tyhle údaje se **nedají odhadnout** a v datech jsou proto jako `null` nebo
zakomentované s `[ZJISTIT]`; UI je zatím prostě nevykreslí. Nesprávný údaj
o parkování nebo lhůtě je horší než chybějící, protože podle něj člověk jedná.
- **Parkování u obou míst** — kde se stojí, kolik míst, zdarma nebo zóna.
  Podle auditu bariéra číslo jedna u první návštěvy a na webu o ní není
  ani slovo. (`venues.js` → `parking`)
- **Jak najít vchod** u obou míst, orientační bod. (`venues.js` → `directions`,
  `landmark`)
- **Reálná kapacita** lekcí — dnes je u všech tří `capacity: 10`, což je
  číslo z příkladu klientky, ne potvrzený počet míst.
- **Pravidla rezervace a odhlašování** — jak dlouho předem, jde přijít bez
  rezervace, do kdy se dá odhlásit, aby nepropadl vstup z permanentky.
  Dnešní odpověď „odhlaste se prosím včas" je zdvořilá prosba, ne pravidlo.
- **GPS souřadnice obou míst** a potvrzení PSČ — bylo uvedené 680 00, což
  jako doručovací PSČ neexistuje; změněno na 680 01, ale nechat potvrdit.
  Chybné PSČ kazí párování s firemním profilem na Googlu.
  (`venues.js` → `geo`, `postalCode`)
- **Číslo popisné posilovny** — bez něj se vypisuje jen město a navigace se
  opírá o název místa. (`venues.js` → `streetAddress`)
- **Věta pro akutní bolest zad / stav po operaci** do FAQ. Je to zdravotní
  tvrzení, takže ho nemůže formulovat nikdo jiný než ona.
- **Věková hranice** a jestli je permanentka přenosná na jinou osobu.

### Obsah, který zlepší web, ale neblokuje
- **Fotka studia na šířku ve velkém rozlišení.** Klientčin vlastní požadavek
  č. 1 ze 14. 8. je pořád nesplněný a je to zároveň řešení kompromisu v hero:
  text tam má vlastní tmavý podklad, který leží přes lektorku. Nejlepší, co
  máme, je 768×1024 na výšku.
- **Fotka světelné terapie** — hlavní novinka, kterou klientka tlačí na webu,
  v ceníku i v potvrzovacím e-mailu, a nemáme z ní jediný snímek.
- **Recenze od 4–5 klientek** — web nemá ani jednu referenci, a u pohybového
  studia je to to, co rozhoduje. Ideálně i hodnocení na Google Maps.
- **Konkrétní novinky „od září"** do aktualit; dnešní zpráva je obecná
  a bez data po pár týdnech působí spíš špatně než dobře.
- **Co bylo za akci** na `foto-09` (skupina v maskách) a `foto-10` — alt texty
  teď popisují jen viditelné.
- `foto-01.jpg` je vyřazená z galerie, protože má přes sebe nalepený
  screenshot Google Maps. Až bude čím ji oříznout, dá se vrátit — případně
  se hodí na kontakt jako vizuální navigace, kde ta mapa smysl má.

### Otevřená rozhodnutí
- **Rezervační systém** — viz `docs/03-rezervacni-systemy-srovnani.md`
  (sloučit Tymuj + Chytrá rezervace do jednoho systému s kalendářem přímo
  na webu, nebo zůstat u dvou externích). Beze změny, dokud nepadne
  rozhodnutí.
- **Přemapované barvy typů lekcí** (jumping → korál, tabata → oranžová) jsou
  vizuální změna na ceníku i v rozvrhu. Nechat klientku posoudit; je to
  jediná dávka, kterou lze samostatně vrátit (`13445ef`).
- **Poprosit vlastníka organizace o archivaci starého repa**
  `andreadamaskova-ops/Lenka-web`. Je veřejné, obsahuje fotky a videa
  klientky, a z tohoto účtu s ním nelze nic dělat. Až po zavedení nového
  odkazu na náhled, ať se klientce nerozpadne odkaz z e-mailu.
- **Osud popupu „test"** (Popup Maker) a starých neaktivních šablon
  (yoga-coach, yogasana-lite, yoga-studio) — řeší se až u nasazení.

### Technický dluh
- **Videa váží 19,3 MB** (`video-1.mp4` samo 10,1 MB). Překomprimovat na
  ~1–2 MB/kus. **Zablokováno: v prostředí není ffmpeg.**
- **`cta-button` interpoluje `href` a `label` do `innerHTML` bez escapování.**
  Dnes to není vektor (data jsou naše), ale hlídat při napojení na obsah
  z WordPressu.
- **Ikony typů lekcí** jsou kvůli čitelnosti ztmavené oproti pastelům
  z palety. Odstín řídí jedno číslo `--type-icon-lightness` v `tokens.css` —
  změna je jednořádková, za cenu kontrastu.
- **Zbytek `docs/04-ux-ui-audit.md`** — nálezy A1–A4, B1–B7 a C2 jsou
  hotové. Zbývá projít, co z UX části (C1, C3–C8) má ještě smysl, a probrat
  to s klientkou po jedné dávce.
- **Nasazení do WordPressu** — checklist je v `CLAUDE.md`. K přihlášení do
  wp-adminu je potřeba, aby klientka přístupové údaje poskytla znovu;
  z bezpečnostních důvodů se nikde neukládají.

## Náhled pro klientku (GitHub Pages)

Web je publikovaný na **<https://josef-drdlicek.github.io/justyoga/>** —
tohle je odkaz, který dostává klientka. Není to ostrý web, justyoga.cz
zůstává beze změny. `web/robots.txt` s `Disallow: /` brání indexaci náhledu.

Aktualizace náhledu (běží z větve `gh-pages`, obsah je podstrom `web/`):

```
git subtree push --prefix web origin gh-pages
```

⚠️ Trvá i několik minut a snadno narazí na timeout — pouštět zvlášť, ne
v jednom příkazu s `git push`. Stav buildu:
`gh api repos/Josef-Drdlicek/justyoga/pages --jq .status`.

⚠️ **Starý odkaz `andreadamaskova-ops.github.io/Lenka-web/` je zamrzlý na
verzi 2** a z tohoto účtu ho aktualizovat nelze — repo hlásí `push: false`
a `admin: false`. Klientka ho může mít v e-mailu; až bude nový odkaz
zavedený, poprosit vlastníka organizace o archivaci starého repa (je
veřejné a obsahuje fotky i videa klientky).

## Jak si web prohlédnout (lokálně, bez nasazení)
Soubory jsou v `web/`. Používá se čistý HTML + ES moduly JavaScriptu — **nejde jen otevřít dvojklikem** (prohlížeče blokují moduly na `file://`), je potřeba lokální server, např.:
```
cd web
npx serve .
```
a pak otevřít adresu, kterou `serve` vypíše (obvykle `http://localhost:3000`).

## Struktura kódu a ověřování

Obojí se popisuje na jednom místě, a to v **`CLAUDE.md`** — architektura
`web/`, klíčové principy, datový kontrakt komponent, invarianty přístupnosti
s naměřenými hodnotami, pasti v datech a checklist pro nasazení do
WordPressu. Dřív to bylo popsané tady i tam a obě verze se rozešly
(`STATUS.md` i `CLAUDE.md` ještě v srpnu odkazovaly na komponentu
`<data-table>` smazanou 19. 7. a na `content/brandbook.md` nahrazený JSON
exportem).

Stručně: obsah žije v `web/js/data/*.js`, vzhled v `web/css/tokens.css`,
komponenty jsou vanilla Web Components se Shadow DOM v `web/js/components/`.
Web nemá build krok — lokálně se spouští `cd web && npx serve .`.

Vzhled se ověřuje headless Chromem dvěma způsoby: diagnostickou stránkou
v iframu (statická měření) a přes DevTools Protocol (cokoli závislého na
`requestAnimationFrame` — pod `--virtual-time-budget` v iframu nefiruje).
Detaily i pasti měření barev jsou v `CLAUDE.md`.
