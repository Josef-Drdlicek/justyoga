// Často kladené otázky — obsah sekce FAQ na homepage. Odpovědi vycházejí
// z textů klientky (potvrzovací e-mail po rezervaci, viz `docs/`), aby web
// i potvrzení říkaly totéž.
//
// Záměrně tu nejsou konkrétní adresy ani ceny: ty žijí ve venues.js
// a activities.js a vykresluje je rozvrh, ceník a sekce "Kde cvičíme",
// takže se odpovědi nemohou rozejít s realitou.
//
// ⚠️ NA KONCI SOUBORU jsou připravené otázky, které se ZÁMĚRNĚ nevykreslují,
// protože k nim chybí fakta od klientky. Nejsou vymyšlené naslepo právě
// proto, že u parkování, kapacity nebo pravidel odhlašování je nesprávný
// údaj horší než chybějící — člověk podle něj jedná.
export const FAQ = [
  {
    question: "Jsem úplný začátečník, zvládnu to?",
    answer:
      "Zvládnete. Jóga pro začátečníky u mě nezačíná dokonalou pozicí, ale tím, " +
      "že vám u každého cviku i ásany ukážu snazší i pokročilejší variantu. " +
      "Každou lekci přizpůsobuji tomu, kdo na ni zrovna přijde, a tempo si " +
      "určujete vždy vy sami – necvičíte proti nikomu jinému. Na jumping ani " +
      "na kruhový trénink nemusíte přijít v kondici, přijdete si ji vybudovat.",
  },
  {
    question: "Bolí mě záda ze sezení. Můžu na jógu?",
    // ⚠️ [ZJISTIT u klientky] Sem patří ještě věta pro akutní bolest, stav po
    // operaci nebo diagnózu od lékaře. Je to zdravotní tvrzení, takže ho
    // nemůže formulovat nikdo jiný než ona.
    answer:
      "Právě proto většina lidí na jógu přijde poprvé. Lekce protáhne ztuhlé " +
      "tělo a posílí hluboké svaly, které záda drží, a na závěrečné relaxaci " +
      "nad vámi rozsvítím infrapanely s blízkým červeným světlem, které " +
      "prohřejí tělo do hloubky a uvolní unavená záda. Kdyby vám nějaká pozice " +
      "nedělala dobře, řekněte mi to a najdeme jinou.",
  },
  {
    question: "Kde lekce probíhají? Jsou na dvou místech?",
    answer:
      "Ano, a před první lekcí se to vyplatí ověřit. Jóga se světelnou terapií " +
      "je v mém studiu, jumping, tabata, HIIT i kruhový trénink v posilovně " +
      "u základní školy o několik minut dál. Obě adresy najdete na stránce " +
      "Kontakt v sekci Kde cvičíme, včetně tlačítka pro navigaci, a místo je " +
      "vždy uvedené i u každé lekce v rozvrhu a v rezervačním systému.",
  },
  {
    question: "Co si mám vzít s sebou?",
    answer:
      "Pohodlné sportovní oblečení, láhev s vodou a na jumping, tabatu i kruhový " +
      "trénink čistou sportovní obuv. Podložky na jógu a všechny pomůcky máte na " +
      "místě zdarma připravené.",
  },
  {
    question: "Jak si rezervuji lekci?",
    answer:
      "U každé lekce v rozvrhu je tlačítko do rezervačního systému – vyberete si " +
      "termín a rezervujete místo online. Potvrzení vám přijde hned po rezervaci. " +
      "Rezervujte si místo raději dřív, kapacita lekcí je omezená a lekce bývají " +
      "plné.",
  },
  {
    question: "Co když se nakonec nemůžu dostavit?",
    answer:
      "Odhlaste se prosím včas v rezervačním systému, ať vaše místo může využít " +
      "někdo další. Kapacita lekcí je omezená a bývají plné.",
  },
  {
    question: "Jak dlouho platí permanentka?",
    answer:
      "Permanentka na 10 vstupů platí 6 měsíců od zakoupení a vyjde levněji než " +
      "jednotlivé lekce. Přesné ceny i to, kolik s ní ušetříte, najdete v ceníku.",
  },
  {
    question: "Co je světelná terapie na konci lekce jógy?",
    answer:
      "Infrapanely s infračerveným a blízkým červeným světlem, které během " +
      "závěrečné relaxace rozsvítím nad vámi. Světlo prohřeje tělo do hloubky, " +
      "pomáhá regeneraci a uvolní mysl. Nic si na ni neberete, je součástí lekce " +
      "jógy.",
  },
];

// ⚠️ PŘIPRAVENO, ALE NEPOUŽITO — chybí fakta od klientky. Jsou to zároveň
// otázky, které podle auditu dostává telefonem nejčastěji, takže mají na
// webu vysokou hodnotu. Až odpovědi dorazí, stačí položku přesunout nahoru
// do FAQ a doplnit místa v hranatých závorkách.
//
// {
//   question: "Kde můžu zaparkovat?",
//   answer:
//     "U studia zaparkujete [ZJISTIT: kde, kolik míst, zdarma nebo zóna]. " +
//     "U posilovny [ZJISTIT: totéž]. Doporučuji přijet [ZJISTIT] minut předem.",
// },
//   -> bariéra číslo jedna u první návštěvy a na webu o ní není ani slovo
//
// {
//   question: "Kolik lidí je na jedné lekci?",
//   answer:
//     "Na jógu se ve studiu vejde [ZJISTIT] lidí, na jumping mám [ZJISTIT] " +
//     "trampolín a na kondiční lekce je [ZJISTIT] míst. Malá skupina je záměr " +
//     "– stihnu si všímat každého a opravit vám pozici.",
// },
//   -> activities.js má u všech tří capacity: 10, což je číslo z příkladu
//      klientky, ne potvrzený počet míst
//
// {
//   question: "Jak dlouho předem se musím objednat a můžu přijít bez rezervace?",
//   answer:
//     "[ZJISTIT: jde místo obsadit ještě hodinu předem, nebo se zavírá den
//      dopředu? A jde přijít bez rezervace, když je místo volné?]",
// },
//
// {
//   question: "Do kdy se můžu odhlásit, aby mi nepropadl vstup?",
//   answer:
//     "[ZJISTIT: 24 hodin, 12 hodin, do začátku lekce? A co se stane se vstupem
//      z permanentky, když se člověk neodhlásí?]",
// },
//   -> dnešní odpověď "odhlaste se prosím včas" je zdvořilá prosba, ne pravidlo
//
// {
//   question: "Od kolika let se dá k vám chodit?",
//   answer:
//     "Lekce jsou pro dospělé a mládež od [ZJISTIT] let, mladší [ZJISTIT]. " +
//     "Horní hranici nemám žádnou – na jógu chodí lidé i po šedesátce a vždy " +
//     "ukážu variantu podle možností vašeho těla.",
// },
//
// {
//   question: "Je permanentka přenosná na někoho jiného?",
//   answer: "[ZJISTIT: může s ní přijít kamarádka? A platí napříč aktivitami, " +
//     "nebo jen na jeden typ lekce?]",
// },
