# Just Yoga — Rezervační systémy: současný stav a možnosti sloučení

> Poznámka: toto je podkladový materiál pro rozhodnutí, které padne až s klientkou (Lenkou). Nic z níže uvedeného není odsouhlasené ani rozpracované — jde o zápis zjištění a srovnání, ke kterému se dá vrátit.

## Současný stav — kam vedou rezervační tlačítka

Na stránce Rozvrh a ceník jsou tři rezervační tlačítka, každé vede na externí systém:

| Aktivita | Cíl | Systém |
|---|---|---|
| Jóga | `app.tymuj.cz/team-invitation?hash=...` | Tymuj |
| Tabata | `app.tymuj.cz/team-invitation?hash=...` (jiný hash) | Tymuj |
| Jumping | `justjump.chytra-rezervace.cz/rezervacni-system/` | Chytrá rezervace |

Jde ve skutečnosti o **2 nezávislé systémy, ne 3**:

- **Tymuj.cz** — platforma na organizaci sportovních týmů/skupin (nejen jóga/fitness, cílí obecně na sport). Jóga a Tabata jsou v Tymuj vedené jako dva samostatné „týmy", proto dva různé hashované pozvánkové odkazy. Jedním Tymuj účtem lze být členem libovolného počtu týmů, takže zákazník potřebuje **jeden Tymuj účet**, jen musí zvlášť přijmout pozvánku do týmu Jóga a zvlášť do týmu Tabata.
- **Chytrá rezervace** (`justjump.chytra-rezervace.cz`) — samostatný produkt jiného dodavatele, používá se jen pro Jumping. Vlastní registrace/přihlášení („Registrace klienta", „Zákaznická zóna"), s Tymuj nijak nesouvisí.

**Průběh rezervace u obou dnes:** zákazník musí projít registraci/vytvoření účtu u daného systému → přihlásit se → teprve pak vidí rozvrh a může rezervovat. Ani jeden systém dnes nenabízí rezervaci bez účtu.

## Je možné sloučit do jednoho tlačítka?

Technicky ne beze zbytku — Tymuj a Chytrá rezervace jsou dva nezávislé komerční systémy od dvou různých firem, každý s vlastní databází uživatelů. Bez API/SSO spolupráce mezi nimi (u malých studiových tarifů nepravděpodobné) nejde postavit jedno tlačítko/přihlášení, které by fungovalo do obou zároveň.

Reálná cesta k jednomu tlačítku je **přejít na jeden sjednocený rezervační systém pro všechny tři aktivity** (Jóga, Jumping, Tabata) — buď formou pluginu přímo ve WordPressu, nebo formou jedné SaaS platformy místo dnešních dvou. Cíl klientky: aby šlo vybírat termín přímo z kalendáře na webu, ne přes redirect na cizí systém.

## Srovnání možností

| | Reservio | SimplyBook.me | Amelia (WP plugin) | Bookly (WP plugin) |
|---|---|---|---|---|
| Typ | česká SaaS platforma | mezinárodní SaaS | žije přímo ve WordPress instalaci | žije přímo ve WordPress instalaci |
| Cena | zdarma do 40 rezervací/měsíc, pak od ~€7,5/měsíc | zdarma do 50 rezervací/měsíc, pak od $13,9/měsíc | $49–199/rok (vyšší tarify nutné pro skupiny/opakování) | od $49/rok + add-ony (opakování +$13, skupiny +$39) — reálně $100+/rok |
| Kalendář přímo na webu | ano, embed widget | ano, embed widget | ano, přes shortcode | ano, přes shortcode |
| Skupinové lekce s kapacitou | ano | ano, dedikovaná funkce „Classes" | ano | ano (placený add-on) |
| Permanentky/členství (6měsíční platnost) | ano, vestavěné | částečně (přes add-on) | ano (packages) | omezeně |
| Jazyk/podpora | čeština, česká firma | anglicky, komunitní podpora | mezinárodní, dokumentace anglicky | mezinárodní, dokumentace anglicky |
| Kde žijí data | u Reservio (cloud) | u SimplyBook (cloud) | na vlastním hostingu | na vlastním hostingu |
| Riziko/nevýhoda | měsíční poplatek navždy | měsíční poplatek navždy | prosinec 2025: verze 9.0 měla dočasně chyby v kalendáři | skryté náklady na add-ony, dražší než vypadá na první pohled |

### Doporučení (předběžné, k diskuzi s klientkou)

Pro tento provoz (permanentky na 6 měsíců, česky mluvící klientela, majitelka bez technického backgroundu) vychází nejlépe **Reservio** — česká firma s podporou v češtině, vestavěné permanentky/členství odpovídající dnešnímu modelu, start zdarma. Hlavní kompromis oproti WP pluginu: data zůstávají u externí firmy a platí se měsíčně navždy; u WP pluginu (Amelia/Bookly) je to jednorázová/roční licence a data zůstávají u klientky na jejím hostingu, ale ta pak sama nese odpovědnost za nastavení a údržbu.

## Otevřené otázky pro klientku
- Chce zůstat u modelu „platím měsíčně externí firmě" (Reservio/SimplyBook.me), nebo dát přednost „mám to ve vlastním WordPressu" (Amelia/Bookly)?
- Je ochotná přenést historii/rozvrh/kapacity z Tymuj a Chytré rezervace ručně do nového systému?
- Potřebuje online platby v rámci rezervace, nebo se platí na místě (permanentky se zatím řeší jinak)?

## Stav
Nerozhodnuto — čeká se na rozhodnutí s klientkou. Do té doby zůstávají v provozu současná tři tlačítka vedoucí na Tymuj/Chytrá rezervace beze změny (viz `STATUS.md`).
