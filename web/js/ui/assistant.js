/* Průvodce — plovoucí rozcestník ve tvaru konverzace.

   Bez vstupního pole: návštěvník klikne na nabídku, průvodce odpoví, nabídne
   další krok. Proč zrovna takhle, stojí v js/data/assistant.js.

   Přístupnost — tohle je ta část, kterou chatovací widgety dělají špatně:

   - Spouštěč je `<button>` s `aria-expanded` a `aria-controls`. Panel je
     `role="dialog"` s `aria-labelledby`, ale **není modální**: stránka pod
     ním zůstává použitelná, takže se do něj fokus nezamyká.
   - Po otevření jde fokus na první nabídku, po zavření zpátky na spouštěč.
     Escape zavírá odkudkoli zevnitř.
   Na telefonu to není plovoucí bublina, ale **bottom sheet**: panel sedí
   u spodní hrany, zabírá skoro celou výšku a má vlastní překryv. Malé
   okénko v rohu se na 390 px nedá číst a většina návštěvníků chodí právě
   z mobilu. V režimu sheetu se panel chová jako modální dialog — má
   `aria-modal`, zamyká fokus i scroll stránky a překryv se dá zavřít
   klepnutím. Na desktopu zůstává nemodální, protože tam nic nezakrývá.

   - Průběh konverzace je `aria-live="polite"`: přibývá po jednom bloku na
     kliknutí, což čtečka stihne přečíst. (Na rozdíl od tepometru, kde se
     hodnota mění desítkykrát za scroll a `aria-live` by mluvilo přes všechno.)
   - Nabídky jsou skutečná tlačítka a odkazy, ne divy s onclick. */

import { el, $, fill } from "../lib/dom.js";
import { buildAssistantTree } from "../data/assistant.js";

const PANEL_ID = "assistant-panel";
const TITLE_ID = "assistant-title";

function bubble(text) {
  return el("div", { class: "assistant__row assistant__row--bot" }, [
    el("p", { class: "assistant__bubble", text }),
  ]);
}

/** Echo toho, na co návštěvník klikl — jinak se konverzace čte jako
 *  monolog a není poznat, odkud se odpověď vzala. */
function echo(text) {
  return el("div", { class: "assistant__row assistant__row--you" }, [
    el("p", { class: "assistant__bubble assistant__bubble--you", text }),
  ]);
}

export function renderAssistant() {
  const tree = buildAssistantTree();

  const thread = el("div", {
    class: "assistant__thread",
    "data-assistant-thread": "",
    // Polite, ne assertive: nový blok smí počkat, až čtečka dočte větu.
    "aria-live": "polite",
  });

  const choices = el("div", { class: "assistant__choices", "data-assistant-choices": "" });

  const close = el("button", {
    class: "assistant__close",
    type: "button",
    "aria-label": "Zavřít průvodce",
    text: "✕",
  });

  const panel = el(
    "div",
    {
      class: "assistant__panel",
      id: PANEL_ID,
      role: "dialog",
      "aria-labelledby": TITLE_ID,
      hidden: true,
    },
    [
      el("div", { class: "assistant__head" }, [
        el("p", { class: "assistant__title", id: TITLE_ID, text: "Poradím vám" }),
        close,
      ]),
      thread,
      choices,
      // Řekne nahlas, co okno je a co není — jinak lidé čekají odpověď
      // od člověka, která nepřijde.
      el("p", {
        class: "assistant__note",
        text: "Rozcestník, ne chat — vyberte si z nabídky. Psát sem nemusíte.",
      }),
    ]
  );

  const launcher = el("button", {
    class: "assistant__launcher",
    type: "button",
    "aria-expanded": "false",
    "aria-controls": PANEL_ID,
  }, [
    el("span", { class: "assistant__launcher-dot", "aria-hidden": "true" }),
    el("span", { text: "Poradím vám" }),
  ]);

  // Překryv existuje jen kvůli režimu sheetu; na desktopu je schovaný.
  const backdrop = el("div", { class: "assistant__backdrop", "data-assistant-backdrop": "" });

  const root = el("div", { class: "assistant", "data-assistant": "" }, [
    backdrop,
    launcher,
    panel,
  ]);

  /* Sheet nejen na úzké obrazovce, ale i na nízké: telefon na šířku má
     760 px šířky a 360 px výšky, takže by spadl do desktopové větve
     a plovoucí panel by z něj vylezl nahoře i dole. */
  const sheet = window.matchMedia("(width < 768px), (height < 560px)");

  /** Vykreslí uzel: odpověď do vlákna, nabídky pod něj. */
  function goTo(id, chosenLabel) {
    const node = tree[id];
    if (!node) return;

    if (chosenLabel) thread.append(echo(chosenLabel));
    const answer = bubble(node.message);
    thread.append(answer);

    // Na ZAČÁTEK nové odpovědi, ne na konec vlákna. Chat scrolluje dolů,
    // protože poslední řádek je ten nový; tady je novým obsahem celý
    // odstavec a odrolovat na jeho konec znamená ukázat člověku poslední
    // větu odpovědi, kterou ještě nečetl. Scrolluje se jen vlákno,
    // stránka pod ním zůstává, kde byla.
    thread.scrollTop += answer.getBoundingClientRect().top - thread.getBoundingClientRect().top;

    fill(
      choices,
      node.options.map((option) => {
        // Odkaz je <a>: musí jít otevřít na novou kartu, zkopírovat
        // a přečíst čtečkou jako odkaz, ne jako tlačítko.
        if (option.href || option.external) {
          return el("a", {
            class: "assistant__choice assistant__choice--link",
            href: option.href ?? option.external,
            target: option.external ? "_blank" : null,
            rel: option.external ? "noopener" : null,
            text: option.external ? `${option.label} ↗` : option.label,
          });
        }

        const button = el("button", {
          class: "assistant__choice",
          type: "button",
          text: option.label,
        });
        button.addEventListener("click", () => goTo(option.to, option.label));
        return button;
      })
    );

    markScrollable();

    const firstChoice = $(".assistant__choice", choices);
    if (firstChoice && root.dataset.open === "true") firstChoice.focus();
  }

  /* Strop panelu se MĚŘÍ z místa, které nad spouštěčem zbývá — ne
     z podílu výšky okna. Panel je ukotvený dole a roste nahoru, takže
     `max-height: 78svh` ho nezastaví: na okně 1000×700 vylezl 15 px nad
     horní hranu a s ním i zavírací křížek. */
  function sizePanel() {
    if (sheet.matches) {
      root.style.removeProperty("--assistant-panel-max");
      return;
    }
    // Měří se od spodní kotvy kontejneru, ne od spouštěče: ten je při
    // otevřeném panelu `display: none` a jeho rámeček by byl nulový.
    const breathingRoom = 16;
    const bottom = parseFloat(window.getComputedStyle(root).bottom) || 0;
    const available = window.innerHeight - bottom - breathingRoom;
    root.style.setProperty("--assistant-panel-max", `${Math.max(240, available)}px`);
  }

  /* Na nízkém okně se všechny nabídky nevejdou — na telefonu na šířku jsou
     ze šesti vidět dvě. Seznam scrolluje, ale to nikdo nepozná, dokud to
     nezkusí, takže se dole rozsvítí stínítko a zhasne na konci seznamu.
     CSS samo o sobě přetečení nezjistí, proto to řeší JS. */
  function markScrollable() {
    const more = choices.scrollHeight - choices.clientHeight - choices.scrollTop > 4;
    choices.classList.toggle("has-more", more);
  }

  choices.addEventListener("scroll", markScrollable, { passive: true });

  function focusables() {
    return [...panel.querySelectorAll("button, a[href]")].filter(
      (node) => !node.hidden && node.offsetParent !== null
    );
  }

  function setOpen(open) {
    const modal = open && sheet.matches;

    root.dataset.open = String(open);
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));

    // Modální jen v režimu sheetu. Na desktopu panel nic nezakrývá, takže
    // by `aria-modal` čtečce lhalo, že zbytek stránky není k dispozici.
    if (modal) panel.setAttribute("aria-modal", "true");
    else panel.removeAttribute("aria-modal");

    // Zámek scrollu jen u sheetu — jinak by se stránka pod plovoucím
    // panelem na desktopu bezdůvodně zasekla.
    document.documentElement.classList.toggle("assistant-locked", modal);

    if (open) {
      sizePanel();
      // Po změně stropu se mění i to, co se vejde.
      requestAnimationFrame(markScrollable);
      // Vlákno se pokaždé začíná znovu: půlka rozhovoru ze včerejška
      // otevřená na jiné stránce mate víc, než pomáhá.
      fill(thread, []);
      goTo("start");
      $(".assistant__choice", choices)?.focus();
    } else {
      launcher.focus();
    }
  }

  launcher.addEventListener("click", () => setOpen(root.dataset.open !== "true"));
  close.addEventListener("click", () => setOpen(false));
  backdrop.addEventListener("click", () => setOpen(false));

  root.addEventListener("keydown", (event) => {
    if (root.dataset.open !== "true") return;

    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    // Fokus se zamyká jen když je panel modální. Bez toho by tabulátor
    // na telefonu odešel za překryv, do obsahu, na který se nedá kliknout.
    if (event.key !== "Tab" || !sheet.matches) return;
    const items = focusables();
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Otočení telefonu nebo přechod přes 768 px mění režim — otevřený panel
  // by jinak zůstal modální na desktopu nebo naopak.
  sheet.addEventListener("change", () => {
    if (root.dataset.open === "true") setOpen(true);
  });

  // Změna velikosti okna mění, kolik místa nad spouštěčem zbývá.
  window.addEventListener("resize", () => {
    if (root.dataset.open !== "true") return;
    sizePanel();
    markScrollable();
  }, { passive: true });

  root.sizePanel = sizePanel;

  return root;
}

/* Pod 1280 px se ukazatel tempa překlápí do vodorovného proužku u spodní
   hrany, kde by si s průvodcem sedly na sebe. Zvednutí se proto MĚŘÍ, ne
   hádá: napevno zapsaná hodnota (7,5rem) byla o 40 px menší než skutečná
   výška proužku a na 390 px se překrývaly. ResizeObserver to drží i když
   proužek zalomí popisky na jiný počet řádků. */
function keepClearOfMeter(assistant) {
  const meter = $("[data-hrm]");
  if (!meter) return;

  const strip = window.matchMedia("(width < 1280px)");

  const sync = () => {
    if (!strip.matches) {
      assistant.style.removeProperty("--assistant-lift");
      return;
    }
    const gap = 12;
    assistant.style.setProperty("--assistant-lift", `${meter.offsetHeight + gap}px`);
  };

  new ResizeObserver(() => {
    sync();
    // Zvednutí posune spouštěč, a tím i místo, které panelu zbývá nahoře.
    assistant.sizePanel?.();
  }).observe(meter);
  strip.addEventListener("change", sync);
  sync();
}

/** Vloží průvodce do slotu. Jedno volání na stránku, až po ukazateli. */
export function mountAssistant() {
  const slot = $("[data-assistant-slot]");
  if (!slot) return;
  const assistant = renderAssistant();
  slot.replaceWith(assistant);
  keepClearOfMeter(assistant);
}
