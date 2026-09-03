# Just Yoga Boskovice — web

Vlastní HTML + vanilla JS motiv pro **justyoga.cz** (Just Yoga a pohybové studio
Boskovice — jóga se světelnou terapií, jumping, tabata, HIIT, kruhový trénink).
Nahrazuje stávající WordPress šablonu `fyoga` a nasadí se jako nový motiv do téže
WordPress instalace (stejný hosting, stejná databáze).

Žádný build krok, žádný `package.json`, žádný požadavek na třetí stranu — fonty jsou
self-hostované, mapy jsou statické obrázky.

## Jak to spustit lokálně

Prohlížeče blokují ES moduly na `file://`, takže **dvojklik na `index.html` nefunguje.**
Je potřeba lokální server:

```
cd web
npx serve .
```

Pak otevřít adresu, kterou `serve` vypíše (obvykle `http://localhost:3000`).

## Co kde je

| Cesta | Co obsahuje |
|---|---|
| `web/` | živý zdroj webu — jediná složka, která se nasazuje |
| `docs/` | analýzy a audity projektu (proveditelnost, rezervační systémy, UX/UI audit) |
| `content/` | brandbook klientky (`brandbook-lenka-web.json`) — zdroj pravdy pro design tokeny |
| `CLAUDE.md` | architektura, principy a invarianty projektu |
| `STATUS.md` | průběžný stavový log — historie rozhodnutí a otevřené věci |

Podrobnosti o architektuře `web/` jsou v `CLAUDE.md`, aktuální fáze a co se právě řeší
ve `STATUS.md`.

## Rezervace

Rezervace neběží na tomto webu — jde přes externí systémy
(`app.tymuj.cz`, `justjump.chytra-rezervace.cz`). Motiv řeší jen odkazy a CTA tlačítka,
ne rezervační logiku.

## Před ostrým nasazením

`web/robots.txt` obsahuje `Disallow: /`, protože slouží náhledu pro klientku. Jako motiv
skončí ve `wp-content/themes/…`, kde ho roboti nečtou (neškodí). **Kdyby se `web/`
nasazovalo jako kořen domény, MUSÍ se smazat** — jinak zablokuje indexaci ostrého webu.

Zbytek nasazovacího checklistu je v `CLAUDE.md`.

## Historie

Historie vývoje do 3. 9. 2026, včetně tagu `v1-terracotta` (konec verze 1, terakotová
paleta), žije v lokálním archivu `../lenka-web/`. Tohle repo začíná čistým baseline
commitem se stavem verze 3.
