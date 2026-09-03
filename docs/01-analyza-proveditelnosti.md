# Just Yoga (justyoga.cz) — Analýza proveditelnosti

## Zadání (upřesněno)
1. Stávající vzhled webu je nevyhovující — **nejde o úpravu/restyling stávající šablony**, ale o její **kompletní náhradu**.
2. Nahrát zcela nový web postavený na vlastním HTML + čistém (vanilla) JavaScriptu jako novou šablonu do **stávajícího WordPress účtu** (stejný hosting, stejná instalace WP).
3. Zjednodušit UX pro potenciální zákazníky (jednodušší cesta k rezervaci/objednání lekce).
4. Majitelka (needitovala by HTML) musí i nadále umět sama upravovat ceník přes frontend/administraci WordPressu.

## Zjištěné technické zázemí (z živého webu, 2026-07-07)

| Prvek | Zjištění |
|---|---|
| CMS | WordPress (generator tag hlásí "WordPress 7.0") |
| Téma | `fyoga` (placené téma od tishonator.com) — **není** postavené na Elementoru ani jiném page builderu |
| Editor obsahu | Nativní Gutenberg block editor (nalezeny třídy `wp-block-group`, `wp-block-buttons`, `wp-block-spacer` atd.) |
| Pluginy | Contact Form 7 (formuláře), Popup Maker (modální okno, spouští se na klik, ne automaticky), Site Kit by Google (analytika) |
| Ceník | Samostatná stránka `/cenik/`, obsah je **1 nativní tabulka** (Gutenberg Table block) — 3 typy lekcí, cena/lekce, permanentka, místo konání |
| Rozvrh | Samostatná stránka `/rozvrh/`, také obsahuje **1 nativní tabulku** |
| Hlavní menu | 7 položek: Rezervace termínu, Fotky a videa, Aktuality, Rozvrh, Ceník, O mně, Kontakt |
| Homepage | Obrázkový slider (min. 5 fotek), 10 obrázků celkem na stránce, minimum textu |
| Mobilní zobrazení | `viewport` meta tag přítomen, ale bez `initial-scale` — chce se ověřit reálné chování na mobilu |

## Klíčové zjištění pro proveditelnost

**Dobrá zpráva:** Ceník i rozvrh jsou nativní WordPress tabulky (Gutenberg Table block), ne obrázek a ne externí plugin (např. TablePress). To znamená, že majitelka **už teď** může tyto tabulky upravovat přímo ve vizuálním editoru WordPressu bez znalosti HTML — a tuto schopnost lze zachovat i po redesignu.

**Proveditelný přístup (kompletní náhrada šablony):** Protože web nepoužívá page builder (Elementor apod.) a obsah je uložený standardně v databázi WP (Gutenberg bloky), je **obsah nezávislý na šabloně** — to je zásadní pro tento typ zásahu:
- Postavíme úplně nový, vlastní WordPress motiv (theme) — čisté HTML/CSS/vanilla JS, žádný page builder, žádné závislosti na `fyoga` šabloně.
- Nový motiv nahradí ten současný v Appearance → Themes ve stávajícím WP účtu (stejný hosting, stejná URL, stejná databáze). Staré téma lze po ověření smazat nebo jen deaktivovat.
- Stránky **Ceník** a **Rozvrh** zůstanou v databázi WP tak, jak jsou (obsah je nezávislý na tématu) — nová šablona je jen jinak vyrenderuje přes `the_content()`. Majitelka je bude nadále upravovat úplně stejně jako dnes, ve standardní WP administraci, beze změny workflow.
- Ostatní stránky (homepage, O mně, Kontakt, Fotky a videa, Aktuality) — obsah lze buď převzít ze stávajících WP stránek (needitovat) a jen nově naformátovat vlastní šablonou, nebo nahradit novým textem/fotkami zadanými do WP administrace. V obou případech princip stejný: obsah v WP, vzhled ve vlastním kódu.

**Rizika / co je třeba ověřit před závazným odhadem:**
- Přístup do administrace WordPressu (Appearance → Themes) a k hostingu (FTP/SFTP nebo správce souborů), abychom mohli nahrát a aktivovat nový motiv.
- Zda existují pluginy, na kterých je vzhled současné šablony závislý (nebylo možné ověřit bez přihlášení do administrace) — nový motiv by je neměl potřebovat, ale je dobré vědět, co se dá bezpečně vypnout.
- Reálné chování rezervačního systému („Rezervace termínu") — není jasné, jde-li o externí rezervační nástroj (widget/embed) nebo interní formulář/plugin; nový motiv musí tento prvek správně zobrazit.
- Popup Maker modál (slug „test") — vypadá jako nedokončený/testovací popup, spouští se na klik. Ověřit s majitelkou, zda je stále v provozu a k čemu slouží.
- Zálohu celého webu (soubory + databázi) před nahráním a aktivací nového motivu — standardní bezpečnostní krok, umožní snadný návrat, pokud by něco nesedělo.

## Návrh zjednodušení UX (k odsouhlasení s klientkou)
- Sloučit navigaci ze 7 položek na méně skupin (např. Rozvrh & Ceník do jedné sekce/stránky vedle sebe, Fotky/Aktuality do vedlejšího menu), aby hlavní CTA „Rezervovat" bylo nejvýraznější.
- Na homepage přidat stručný, jasný text nad/vedle slideru (co to je, pro koho, jak se přihlásit) — aktuálně dominují jen fotky.
- Jedno viditelné CTA tlačítko „Rezervovat lekci" opakovaně u ceníku i rozvrhu, ne jen v menu.
- Zjednodušit cestu zákazníka: Rozvrh → Ceník → Rezervace by měly být 1-2 kliky od sebe, ideálně provázané odkazy.

## Závěr k proveditelnosti
**Projekt je proveditelný**, nyní i s ověřením přímo v administraci, nikoli jen z veřejně dostupných stránek. Rizika se zjištěním z wp-adminu dále snížila:
- Žádný page builder, žádné vázané pluginy na vzhled — jen standardní pluginy (formulář, popup, analytika, sitemapa), které s novou šablonou nekolidují.
- Rezervace jde přes externí systémy (tymuj.cz, chytra-rezervace.cz) — nová šablona řeší jen odkazy/tlačítka, nemusí se stavět rezervační logika.
- Ceník i rozvrh jsou nezávislé na šabloně (obsah v databázi), takže náhrada motivu editovatelnost nijak neomezí.

Zbývá jen: přístup k souborům hostingu pro nahrání šablony, a pár rozhodnutí s klientkou (rozsah obsahu, osud popup okna a starých neaktivních šablon).

## Ověřeno přímo v administraci (2026-07-07)
Přístup do wp-admin byl získán a ověřen (přihlášení proběhlo úspěšně). Zjištěno:

**Nainstalované šablony:** aktivní je pouze `fyoga` v1.3.9 (autor tishonator, update dostupný). Dále jsou nainstalované, ale neaktivní: `yoga-coach`, `yogasana-lite`, `yoga-studio` (zřejmě dřívější pokusy o jinou šablonu) a výchozí WP šablony (`twentytwenty` až `twentytwentyfive`). Žádná z nich není page builder ani rodičovské téma vázané na `fyoga` — nahrání zcela nové vlastní šablony vedle nich a její aktivace je bez komplikací.

**Aktivní pluginy:**
- Contact Form 7 — kontaktní formulář
- Popup Maker — modální okno (spouští se na klik, viz níže)
- Site Kit by Google — analytika (Google Analytics/Search Console)
- WordPress Importer — obvykle jen pro jednorázový import, netřeba řešit
- XML Sitemaps (google-sitemap-generator) — generuje sitemapu pro vyhledávače

**Neaktivní pluginy:** Akismet, GA Google Analytics (samostatný, nahrazen Site Kitem), Hello Dolly (ukázkový plugin), Klasický editor (potvrzuje, že se reálně používá blokový/Gutenberg editor).

**Rezervační systém — vyřešeno:** Stránka „Rezervace termínu" nepoužívá formulář ani plugin na webu. Vede přes tlačítka „Chci vybrat termín" na **externí rezervační systémy**:
- Just Yoga a Tabata → `app.tymuj.cz`
- Just Jump → `justjump.chytra-rezervace.cz`
Nová šablona tedy jen potřebuje viditelná CTA tlačítka odkazující na tyto externí odkazy — nejde o nic, co bychom museli sami vyvíjet nebo do čeho zasahovat.

**Bezpečnostní poznámka:** přístupové údaje do wp-adminu byly použity jen k jednorázovému ověření (přihlášení, čtení seznamu pluginů/šablon) a nejsou uloženy v žádném souboru projektu ani jinde v čitelné podobě. Doporučuji uchovávat je do budoucna ve správci hesel, ne v textovém souboru.

## Otevřené otázky pro klientku
1. ~~Máme/dostaneme přístup do wp-admin a k hostingu?~~ **Vyřešeno** — přístup do wp-admin ověřen. Ještě bude potřeba přístup k souborům (FTP/SFTP nebo správce souborů hostingu) pro nahrání nové šablony jako složky do `wp-content/themes/`.
2. ~~Je „Rezervace termínu" externí systém?~~ **Vyřešeno** — ano, dva externí systémy (tymuj.cz, chytra-rezervace.cz), řeší se odkazy/tlačítky.
3. Přebírá se obsah stávajících stránek (texty, fotky) do nového designu, nebo se má nahradit novým obsahem?
4. Je popup "test" (Popup Maker) aktivně používaný, má se v novém webu zachovat?
5. Smí se po ověření nového webu smazat neaktivní staré šablony (`yoga-coach`, `yogasana-lite`, `yoga-studio` aj.), nebo je nechat ležet?
