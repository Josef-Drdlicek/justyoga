// Registruje "chrome" komponenty — ty, které jsou na každé stránce webu.
// Tenhle seznam se proto nemění při změně obsahu žádné stránky.
//
// Komponenty specifické pro jednu stránku registruje ten skript, který je
// plní daty: js/pages/<stránka>.js. Dřív se odsud importovalo všech devět
// nepodmíněně, takže homepage stahovala a parsovala i rozvrh, ceník
// a galerii, které vůbec nezobrazuje.
//
// Statické importy, ne dynamické: dynamický import() by vytvořil řetěz
// main.js → detekce → komponenta a odložil stažení o jeden round-trip.
// U rozvrhu, který je nad ohybem na nejdůležitější stránce webu, by to
// zhoršilo LCP. Statický import ve stránkovém skriptu najde preload
// scanner už při parsování <head>.
import "./components/site-header.js"; // → site-nav.js
import "./components/site-footer.js";
// cta-button je přímo v light DOM na index.html i kontakt.html a zároveň si
// ho importují komponenty, které ho staví ve svém template (activity-card,
// schedule-widget) — je tedy skutečně na každé stránce.
import "./components/cta-button.js";
