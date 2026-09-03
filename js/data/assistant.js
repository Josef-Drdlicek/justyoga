/* Průvodce — rozcestník ve tvaru konverzace.

   Vypadá jako chat, ale chat to není: **nemá vstupní pole a nic neodesílá.**
   Návštěvník jen klikne na jednu z nabídnutých možností. To je záměr, ne
   omezení:

   - Nikdo nečeká na odpověď. Skutečné chatovací okno na webu jednoho
     člověka slibuje obsluhu, která tam v šest večer není, a nezodpovězená
     zpráva udělá horší dojem než žádné okno.
   - Není co moderovat, není co ukládat, nepadá žádné GDPR ani cookie.
   - Nefunguje na žádné službě třetí strany, takže vypadá jako zbytek webu.

   Strom se skládá z dat, která na webu už jsou (FAQ, adresy, kontakt),
   takže se odpovědi nikde neopisují. Když se změní `faq.js`, změní se
   i průvodce.

   Tvar uzlu:
     message – co „řekne" průvodce
     options – nabídky; každá má `label` a právě jedno z:
                 to       … id dalšího uzlu
                 href     … odkaz uvnitř webu (okno se zavře a naviguje)
                 external … odkaz ven (nové okno, popisek to říká)
*/
import { FAQ } from "./faq.js";
import { VENUES, formatVenueAddress, venueNavigationUrl } from "./venues.js";
import { SITE_CONFIG } from "./site-config.js";

/* Id uzlu z otázky: index stačí a je stabilní vůči diakritice. */
const faqNodeId = (index) => `faq-${index}`;

export function buildAssistantTree() {
  const nodes = {
    start: {
      message: "S čím vám můžu pomoct?",
      options: [
        { label: "Jdu cvičit poprvé", to: "first" },
        { label: "Chci vidět rozvrh", href: "rozvrh-cenik.html#rozvrh" },
        { label: "Kolik to stojí", href: "rozvrh-cenik.html#cenik" },
        { label: "Kde se cvičí", to: "where" },
        { label: "Mám jinou otázku", to: "faq" },
        { label: "Chci se ozvat", to: "contact" },
      ],
    },

    first: {
      message:
        "Přijít poprvé není nic těžkého. Stačí pohodlné oblečení a lahev " +
        "s vodou, podložky a pomůcky máte na místě. U každého cviku ukážu " +
        "lehčí i těžší variantu, takže tempo si určujete sami.",
      options: [
        { label: "Ukaž mi celý postup", href: "index.html#poprve" },
        { label: "Kterou lekci si vybrat?", to: "choose" },
        { label: "Zpět na začátek", to: "start" },
      ],
    },

    choose: {
      message:
        "Podle toho, co dnes potřebujete. Klidnější tempo, nebo si dát do těla?",
      options: [
        { label: "Klid a protažení", href: "index.html#joga" },
        { label: "Něco mezi", href: "index.html#tabata" },
        { label: "Chci se zapotit", href: "index.html#jumping" },
        { label: "Zpět na začátek", to: "start" },
      ],
    },

    where: {
      // Dvě adresy, a záměna stojí zákazníka lekci — proto je průvodce
      // nikdy nesloučí do jedné věty.
      message:
        "Cvičí se na dvou místech, tak si před první lekcí zkontrolujte, " +
        "kam jdete.",
      options: [
        ...VENUES.map((venue) => ({
          label: `${venue.label} — ${formatVenueAddress(venue)}`,
          external: venueNavigationUrl(venue),
        })),
        { label: "Zpět na začátek", to: "start" },
      ],
    },

    contact: {
      message: "Napište nebo zavolejte, ozvu se hned, jak to půjde.",
      options: [
        { label: `Zavolat ${SITE_CONFIG.phone}`, href: SITE_CONFIG.phoneHref },
        { label: `Napsat na ${SITE_CONFIG.email}`, href: SITE_CONFIG.emailHref },
        { label: "Otevřít kontaktní stránku", href: "kontakt.html" },
        { label: "Zpět na začátek", to: "start" },
      ],
    },

    faq: {
      message: "Tady jsou otázky, které dostávám nejčastěji.",
      options: [
        ...FAQ.map((item, index) => ({ label: item.question, to: faqNodeId(index) })),
        { label: "Zpět na začátek", to: "start" },
      ],
    },
  };

  // Odpovědi se neopisují — berou se z faq.js.
  FAQ.forEach((item, index) => {
    nodes[faqNodeId(index)] = {
      message: item.answer,
      options: [
        { label: "Další otázka", to: "faq" },
        { label: "Zpět na začátek", to: "start" },
      ],
    };
  });

  return nodes;
}
