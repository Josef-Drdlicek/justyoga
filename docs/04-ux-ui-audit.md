# 04 — UX/UI audit a návrhy na zlepšení

Datum: 2026-07-22 · Verze webu: 2 (rebrand „Lenka Web", commit `284e21d`)

Audit vychází z přečtení celého kódu ve `web/` a z reálného vykreslení všech
4 stránek v headless Chromu (desktop 1440 px + mobil 390 px). Kontrasty jsou
**změřené** přes canvas, ne odhadnuté. Věci označené „změřeno" jsou fakt,
zbytek je doporučení k posouzení.

---

## Co je dobře (aby se to omylem nerozbilo)

- Žádné vodorovné přetečení ani JS chyby na žádné ze 4 stránek, desktop i mobil.
- Data jsou skutečně oddělená od zobrazení — změna ceny/rozvrhu je úprava
  jednoho pole, ne hledání po komponentách.
- Rozvrh na mobilu (segmented control Po/Út/St/Čt + karty) je čitelný a rychlý.
- Kontrast hlavního textu 15,17:1, tlačítek 13,05 / 5,67:1 — všechno s rezervou AA.
- Žádný požadavek na třetí stranu (fonty self-hostované) — rychlé a bez GDPR otázky.

---

## A. Skutečné chyby — opravit jako první

### A1. Galerie videí je rozbitá kvůli neexistujícímu tokenu ⚠️
`media-gallery.js:62` používá `background: var(--color-charcoal)`, jenže
**`--color-charcoal` po rebrandu na verzi 2 v `tokens.css` už neexistuje**
(změřeno: token je prázdný, výsledné pozadí `rgba(0,0,0,0)`, tedy průhledné).

Videa jsou na výšku (720×1280) a na desktopu se vykreslí **616 px vysoká**.
Dokud se nenačte první snímek, je celá ta plocha průhledná a vidět je jen
černý proužek ovládání dole — přesně ten „rozjetý grid s prázdnými mezerami",
který je evidovaný v `STATUS.md` jako otevřená věc. **Tohle je jeho příčina.**

*Oprava:* nahradit za existující token (`var(--color-text)` nebo
`var(--color-surface-alt)`) a doplnit `poster` s náhledovým snímkem.
Zároveň by šlo videům dát `aspect-ratio: 9/16` a rozumný `max-height`,
aby jedno video nezabíralo půl obrazovky.

### A2. Videa váží 18,4 MB
`video-1.mp4` samotné má 9,6 MB. `preload="metadata"` sice zabrání stažení
předem, ale po přehrání jde o velký objem dat — na mobilních datech nepříjemný.
*Návrh:* překomprimovat na ~1–2 MB/kus (H.264, CRF ~28, šířka 720 px), nebo
videa nahrát na YouTube/Instagram a odkázat.

### A3. Chybí favicon
Změřeno: 404 na homepage. Web má v záložce prohlížeče prázdnou ikonu.

### A4. Překlep ve formuláři
`kontakt.html:59` — „Vaše zpráva (volitelný)" → **„(volitelné)"**.

---

## B. Přístupnost (WCAG)

### B1. Tlumený text propadá AA ⚠️ (nejzávažnější nález)
`--color-text-muted` se po rebrandu odvozuje jako mix textu a pozadí (45 %).
Změřené kontrasty:

| Kde | Kontrast | AA (4,5:1) |
|---|---|---|
| na stránkovém pozadí | **3,60** | ✗ |
| na bílé kartě | **3,75** | ✗ |
| na kartě Jóga | **3,43** | ✗ |
| na kartě Jumping | **3,57** | ✗ |
| na kartě Tabata | **3,07** | ✗ |

Netýká se to drobnosti — tímto odstínem je psané: **taglines lekcí na homepage**
(hlavní popisný text webu), místo konání v rozvrhu, „75 minut" a „Permanentka: …"
v ceníku, popisky polí formuláře a **celá patička**.

*Oprava:* snížit podíl pozadí v `color-mix` ze 45 % zhruba na 25–30 % —
jednořádková změna v `tokens.css`, doladit měřením proti nejtmavší kartě
(Tabata je nejhorší případ).

### B2. Hero „kicker" je prakticky nečitelný
„JUST YOGA A POHYBOVÉ STUDIO BOSKOVICE" je bílá na 85 % krytí, ale sedí
v horní části fotky, kde má ztmavovací gradient jen 20 %. Fotka je tam navíc
velmi světlá (změřený pixel `rgb(217,207,205)`) — výsledný kontrast vychází
**kolem 2:1** (AA chce 4,5:1). Na screenshotu je to vidět pouhým okem.

*Oprava:* zesílit horní zarážku gradientu (20 % → ~45 %), nebo dát kickeru
plné bílé krytí a stínítko za text.

### B3. Taby rozvrhu nemají klávesnicovou obsluhu
`schedule-widget.js` používá `role="tablist"`/`role="tab"`, ale nereaguje na
šipky ← → (ARIA vzor to vyžaduje) a `tabpanel` nemá `tabindex="0"`.
Buď doplnit šipky, nebo role zrušit a nechat je jako obyčejná tlačítka —
oboje je v pořádku, současný polovičatý stav ne.

### B4. Animace obcházejí `prefers-reduced-motion`
`cta-button.js:35` a `base.css:146` mají `transition: … 0.15s ease` natvrdo,
místo `var(--transition-fast)`. Token se při „omezit pohyb" nuluje, tyhle dva
zápisy ale ne — a zároveň je to jediné místo, kde se obchází design tokeny.

### B5. Chybí „přeskočit na obsah"
Uživatel klávesnice musí na každé stránce protabovat hlavičku a celé menu.

### B6. Formulář nedává zpětnou vazbu
Odeslání zatím nikam nevede (záměrně, čeká na CF7), ale i po napojení bude
potřeba viditelná hláška o úspěchu/chybě v `aria-live` oblasti.

---

## C. UX — cesta k rezervaci (hlavní obchodní cíl)

### C1. Rozvrh na desktopu ukazuje jen 1 den ze 4 ⚠️
Nejdůležitější otázka návštěvníka je „kdy tam můžu přijít?". Na monitoru
1440 px se zobrazí jeden den a zbytek týdne je schovaný za taby — odpověď
stojí 4 kliknutí a zapamatování si toho, co bylo předtím. Přitom v rozvrhu
je celkem 9 lekcí ve 4 dnech, což se na desktop vejde celé najednou.

*Návrh:* na desktopu zobrazit **celý týden** (4 sloupce = dny, karty pod sebou),
taby nechat **jen na mobilu**, kde dávají smysl. Jeden `@media` blok, komponenta
už všechna data má.

### C2. Ceník je slepá ulička
Karty ceníku nemají žádné tlačítko. Člověk si přečte cenu — a nemá kam
kliknout, musí scrollovat zpět nahoru k rozvrhu. Karty rozvrhu přitom
„Rezervovat" mají, takže je to i nekonzistentní.
*Návrh:* přidat do ceníkových karet CTA (buď rovnou „Rezervovat" na
`bookingUrl`, nebo „Zobrazit termíny" s odskokem na rozvrh).

### C3. Karty na homepage vedou rovnou ven z webu
Tlačítko „Rezervovat" na homepage otevře externí rezervační systém v novém
okně dřív, než uživatel viděl jediný termín. Karta neukazuje, kdy se lekce
koná. Pro člověka, který web otevřel poprvé, je to skok o dva kroky napřed.
*Návrh:* na kartě uvést dny konání („Út a Čt") a jako hlavní akci nabídnout
„Zobrazit termíny", rezervaci až v rozvrhu — nebo obě akce vedle sebe.

### C4. Chybí obsah pro nováčky
Web nikde neodpovídá na to, co brzdí většinu prvních návštěv: *Musím se
objednat předem? Co si mám vzít? Kdy mám přijít? Půjčíte mi podložku?
Zvládnu to jako úplný začátečník?* Bio na „O mně" jednu z těch obav
(začátečníci) zmiňuje, ale schované v odstavci.
*Návrh:* sekce „Jdete k nám poprvé?" na homepage nebo samostatná stránka
s 5–6 body. Je to nejlevnější zásah s nejvyšším dopadem na počet rezervací.

### C5. Druhá adresa chybí na Kontaktu ⚠️
Jumping a Tabata se konají v **posilovně na ZŠ Slovákova**, ne ve studiu na
Bílkově. Stránka Kontakt ale ukazuje jen Bílkovu 91 — včetně tlačítka do
Google Maps. Kdo si otevře Kontakt, může skončit před špatnou budovou.
*Návrh:* dvě adresní karty (Jógové studio / Posilovna ZŠ Slovákova), u obou
odkaz na mapu. Data už v `activities.js` jsou.

### C6. Není kde říct, že lekce odpadá
Rozvrh je natvrdo týdenní. Chybí místo pro „o prázdninách necvičíme" nebo
„12. 8. lekce odpadá" — u pohybového studia věc, která se řeší pořád.
*Návrh:* volitelné pole pro krátké oznámení nad rozvrhem, tažené z dat
(prázdné = nic se nezobrazí).

### C7. V hlavičce není rezervační CTA
Hlavička nese jen logo a menu. Na každé stránce by se hodilo stálé tlačítko
„Rezervovat" — u studia je to standardní a levný konverzní prvek.

### C8. Homepage je obsahově tenká
Hero + 3 karty + patička (1613 px na desktopu). Chybí to, co lidé
u lokální služby hledají: ukázka rozvrhu, kdo lekce vede, kde to je,
reference/recenze. Zároveň je to slabé pro SEO na „jóga Boskovice".

---

## D. UI / vizuál

### D1. Hero fotka je vybledlá a text jde přes obličej
Fotka má světlé pozadí (závěsy) a přes ni jde ještě zesvětlující scrim —
celý hero působí šedě a bez kontrastu, přestože je to největší plocha webu.
Nadpis navíc padá přímo přes hlavu cvičící.
*Návrh:* posunout `object-position` tak, aby text seděl vedle postavy, ne přes
ni, a zesílit gradient (řeší i B2).

### D2. Karty aktivit mají místo názvu jen logo
Tři velmi podobná loga (JUST YOGA / JUST JUMP / JUST TABATA se stejnou vážkou)
vedle sebe se špatně skenují a mají různou optickou velikost. Chybí textový
nadpis „Jóga / Jumping / Tabata", který by šlo přečíst na první pohled.

### D3. Nevyvážené prázdné plochy
- Mezi „Rozvrh" a „Ceník" je mezera až 8 rem (`--space-8`), při 3 kartách
  v řadě to vypadá jako chybějící obsah.
- Ceníkové karty jsou vysoké, obsah nahoře, dole prázdno.
- Na Kontaktu je levá karta krátká a pravá (formulář) vysoká — pod kontaktní
  kartou zbývá velká díra. Nabízí se tam mapa nebo otevírací doba.

### D4. Centrované víceřádkové odstavce
Taglines na kartách jsou 3–4 řádky na střed. Vlevo zarovnané se čtou lépe;
na střed nechat jen jednořádkové věci.

### D5. Nejednotný tón textů
Web střídá „O **mně**" (já) — „Napište **nám**" (my) — „**Naše** lekce" (my).
Studio vede jedna lektorka, takže by mělo být důsledně buď „já", nebo „my".

---

## E. SEO a technické standardy

- **`kontakt.html` nemá `meta description`** (ostatní tři stránky ji mají).
- **Chybí `og:title`, `og:description`, `og:image` a `canonical`.** Je jen
  `og:site_name`. Sdílení odkazu na Facebook/Instagram — kde klientka aktivně
  je — teď vypadá jako holý odkaz bez obrázku.
- **JSON-LD (`seo.js`) jde vylepšit:** adresa je jeden slepený řetězec
  v `streetAddress`, místo rozdělení na `streetAddress` / `postalCode` /
  `addressLocality` (Google to takhle páruje s firmou spolehlivěji). Chybí
  `openingHoursSpecification` (dá se dopočítat z rozvrhu), `geo`, `priceRange`
  a druhá provozovna.
- **Obrázky nemají `width`/`height`** → poskakování layoutu při načítání (CLS).
  Bio fotky na „O mně" nemají `loading="lazy"`, hero nemá `fetchpriority="high"`.
- **Chybí stránka se zásadami ochrany osobních údajů.** Formulář sbírá jméno
  a e-mail a na produkci běží Google Site Kit (Analytics) — po nasazení bude
  potřeba i cookie lišta a odkaz na zásady z patičky.
- **Chybí 404 stránka.**

---

## Doporučené pořadí prací

1. **Opravy chyb** — A1 (rozbitá videa), A3 favicon, A4 překlep.
2. **Přístupnost** — B1 (tlumený text) a B2 (hero kicker); obojí je změna
   několika řádků v `tokens.css`/`layout.css` s velkým dopadem.
3. **Konverze** — C1 (celý týden na desktopu), C2 (CTA v ceníku), C5 (druhá
   adresa). Přímý dopad na to, kolik lidí dojde k rezervaci.
4. **Obsah** — C4 („poprvé u nás"), C8 (obohatit homepage). Vyžaduje texty
   od klientky, takže se vyplatí zeptat brzy.
5. **SEO/technika** — E jako celek, nejlépe najednou před nasazením do WordPressu.
6. **Vizuální ladění** — D, podle toho, co klientka odsouhlasí.
