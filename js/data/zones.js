// Tepové zóny scroll-story na homepage — jediný zdroj pravdy pro
// <heart-rate-meter> i pro texty jednotlivých pásem stránky.
//
// Pořadí v tomto poli je pořadí zón na stránce. Sekce v index.html se k zóně
// přihlásí atributem data-hr-zone="<id>"; přidání, přehození nebo vypuštění
// zóny je tedy úprava tady plus jeden atribut v HTML — v komponentě se
// nemění nic.
//
// Zóny jsou PĚT, ne tři: kromě tří produktových pásem má stránka ještě
// "most" (kde tep poprvé zrychlí a text vysvětlí, proč) a závěrečné CTA
// (kde se tep ustálí). Na aktivity se proto nemapují 1:1 — vazba jde
// obráceně, od aktivit k zónám: každá aktivita v activities.js má pole
// `zone` a js/pages/home.js si je podle něj seskupí. Tenhle soubor
// o aktivitách neví nic.
//
// Čísla tepů jsou od klientky (75 / 100-120 / 150-170 / ustálený závěr),
// stejně jako slogany. Slogany jsou převedené do vykání, protože celý web
// vyká — včetně textu mostu, který klientka sama napsala.
//
// Tvar záznamu:
//   id         – shodné s data-hr-zone v index.html
//   label      – čte ho odečet tepometru (a screen reader)
//   heading    – H2 sekce
//   intro      – 1-2 věty pod nadpisem
//   slogan     – hlavní tagline zóny; sloganAlt je klientčina alternativa
//   body       – delší text (používá jen "most")
//   bpmFrom/To – tep na začátku a na konci zóny
//   rampIn     – jaká část zóny (0..1) se použije na plynulý dojezd
//                z PŘEDCHOZÍ zóny. Náběh vždy vede z prev.bpmTo do
//                zone.bpmFrom, takže křivka je spojitá strukturálně:
//                žádná úprava čísel nedokáže na hranici vyrobit skok.
//   color      – NÁZEV tokenu, ne hodnota. Komponenta barvu jen propíše do
//                CSS, takže nikdy nezná žádný hex a barvy zůstávají
//                výhradně v css/tokens.css.

export const ZONES = [
  {
    id: "calm",
    label: "Klidné tempo",
    heading: "Jóga v Boskovicích: protažení, zdravá záda a hluboký nádech",
    intro:
      "Sedmdesát pět minut, po kterých se ztuhlá záda ze sezení u počítače " +
      "pustí a hlava se zklidní. Jóga u mě není o dokonalých pozicích " +
      "z Instagramu – dýcháte, protahujete se a posilujete hluboké svaly " +
      "ve tempu, které vám vyhovuje, ať je vám dvacet, nebo šedesát.",
    slogan: "Nadechněte se a zklidněte mysl.",
    sloganAlt: "Váš prostor pro hluboký nádech.",
    bpmFrom: 75,
    bpmTo: 75,
    rampIn: 0,
    color: "--color-mint",
  },
  {
    id: "bridge",
    label: "Tempo se zvedá",
    heading: "Většina studií má jen jedno tempo",
    // Text klientky, doslova. Žije v datech, ne v HTML, protože je to copy,
    // kterou bude chtít po nasazení do WordPressu editovat — takhle je to
    // jedno mapovací místo, ne text zahrabaný v šabloně.
    body:
      "Já věřím, že tělo potřebuje klid i výkon – jen ne vždy ve stejný den. " +
      "Zpomalte dech na józe, nebo zvyšte tepovku na jumpingu a HIITu. " +
      "Najděte svůj balanc v jakémkoliv rytmu.",
    slogan: "Najděte svůj balanc v jakémkoliv rytmu.",
    bpmFrom: 75,
    bpmTo: 100,
    rampIn: 0,
    color: "--color-zone-move",
  },
  {
    id: "move",
    label: "Rozpohybované tempo",
    heading: "Kruhový trénink a tabata v Boskovicích: zdravý pohyb pro běžný den",
    intro:
      "Hodina, po které se cítíte rozhýbaně, ne zničeně. Střídání stanovišť " +
      "a krátkých intervalů zpevní postavu a udrží vás v kondici, ale zátěž " +
      "i rychlost si dávkujete úplně sami – u každého cviku ukážu lehčí " +
      "i těžší variantu, takže cvičíte sami za sebe a nemusíte nikoho stíhat.",
    slogan: "Najděte svůj rytmus.",
    sloganAlt: "Rozpohybujte své tělo.",
    bpmFrom: 100,
    bpmTo: 120,
    rampIn: 0,
    color: "--color-zone-move",
  },
  {
    id: "burn",
    label: "Maximální tempo",
    heading: "Jumping na trampolínách a HIIT v Boskovicích: spalování a endorfiny",
    intro:
      "Nejzábavnější způsob, jak spálit kalorie a vyplavit endorfiny: hodina " +
      "na trampolíně v partě, která vás potáhne. Kdo chce tep nahoře i bez " +
      "skákání, má na kondičních lekcích HIIT intervaly – stejný efekt, " +
      "jiné pomůcky.",
    slogan: "Nakopněte svůj tep na maximum!",
    sloganAlt: "Vyskočte ze stereotypu a budujte sílu.",
    // rampIn 0,3 = prvních 30 % zóny (nadpis a slogan) dojíždí ze 120 na 150,
    // takže mezi "move" a "burn" není skok, ale zrychlení.
    bpmFrom: 150,
    bpmTo: 170,
    rampIn: 0.3,
    color: "--color-coral",
  },
  {
    id: "cta",
    label: "Ustálený tep",
    heading: "Váš dech, váš tep, váš restart. Začněte ještě dnes.",
    intro:
      "Nemusíte vědět, jestli chcete jógu, nebo trampolínu. Podívejte se do " +
      "rozvrhu, vyberte si jeden termín a přijďte to zkusit – tempo si na " +
      "lekci určujete vy.",
    slogan: "Váš dech, váš tep, váš restart.",
    // Vědomé zpomalení na "příjemnou stabilní hodnotu" podle zadání klientky
    // = pocit úspěchu po výkonu. rampIn 0,6 dává doběhu ze 170 dost
    // prostoru, aby působil jako zklidnění, ne jako porucha — při 0,45 byl
    // změřený pokles na hranici toho, co ještě vypadá plynule.
    bpmFrom: 96,
    bpmTo: 96,
    rampIn: 0.6,
    color: "--color-berry",
  },
];

// Čtecí linka tepometru: 45 % výšky výřezu odshora — pod lepivou hlavičkou
// a nad palcem na mobilu. Tatáž konstanta řídí i okamžik odkrytí "mostu",
// takže se zrychlení a text NEMOHOU rozejít.
export const READ_LINE = 0.45;

// rootMargin pro IntersectionObserver, který odkrývá text mostu. Zúží root
// na horních READ_LINE výřezu, takže intersekce nastane přesně tehdy, když
// horní hrana prvku překročí čtecí linku — tedy ve stejný okamžik, kdy
// tepometr přepne na tuhle zónu.
export const BRIDGE_ROOT_MARGIN = `0px 0px -${((1 - READ_LINE) * 100).toFixed(2)}% 0px`;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
// Hladký nájezd uvnitř segmentu. Bez něj je na hranicích vidět zlom
// v derivaci jako "cuknutí" pulzu, i když je samotná hodnota spojitá.
const ease = (t) => t * t * (3 - 2 * t);

// Jediné místo, kde se z dat počítá tep, barva a postup. Komponenta tuhle
// funkci jen volá a výsledek zapíše do CSS — žádná matematika v ní není.
//   index … index zóny v ZONES
//   t     … 0..1 postup uvnitř té zóny
export function resolveZoneState(index, t) {
  const zone = ZONES[index];
  const previous = ZONES[index - 1] ?? zone;
  const progressInZone = clamp01(t);
  const inRamp = zone.rampIn > 0 && progressInZone < zone.rampIn;
  const u = ease(
    inRamp
      ? progressInZone / zone.rampIn
      : (progressInZone - zone.rampIn) / (1 - zone.rampIn)
  );

  return {
    zoneId: zone.id,
    label: zone.label,
    bpm: inRamp ? lerp(previous.bpmTo, zone.bpmFrom, u) : lerp(zone.bpmFrom, zone.bpmTo, u),
    // V náběhu se barva přelévá z předchozí zóny do téhle, dál už zůstává.
    colorFrom: inRamp ? previous.color : zone.color,
    colorTo: zone.color,
    mix: inRamp ? u : 1,
    // Velikost kolečka se řídí POSTUPEM V PŘÍBĚHU, ne tepem: klientka chce
    // kolečko, které se se scrollem monotónně zvětšuje, zatímco tep se
    // v závěrečné zóně vědomě vrací dolů. Dva derivované skaláry, každý
    // s vlastním významem.
    progress: clamp01((index + progressInZone) / (ZONES.length - 1)),
  };
}
