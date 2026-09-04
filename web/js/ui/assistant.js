/* Průvodce — plovoucí rozcestník ve tvaru konverzace.

   Bez vstupního pole: návštěvník klikne na nabídku, průvodce odpoví, nabídne
   další krok. Proč zrovna takhle, stojí v js/data/assistant.js.

   Jen na velké obrazovce. Na telefonu se průvodce vůbec nezobrazuje —
   viz `.assistant` v css/layout.css. Panel je proto vždy nemodální:
   nic nezakrývá, stránka pod ním zůstává použitelná, fokus se do něj
   nezamyká a scroll stránky se nezamyká.

   Přístupnost — tohle je ta část, kterou chatovací widgety dělají špatně:

   - Spouštěč je `<button>` s `aria-expanded` a `aria-controls`. Panel je
     `role="dialog"` s `aria-labelledby`, ale bez `aria-modal` — to by
     čtečce lhalo, že zbytek stránky není k dispozici.
   - Po otevření jde fokus na první nabídku, po zavření zpátky na spouštěč.
     Escape zavírá odkudkoli zevnitř.
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

  const root = el("div", { class: "assistant", "data-assistant": "" }, [
    launcher,
    panel,
  ]);

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
    // Měří se od spodní kotvy kontejneru, ne od spouštěče: ten je při
    // otevřeném panelu `display: none` a jeho rámeček by byl nulový.
    const breathingRoom = 16;
    const bottom = parseFloat(window.getComputedStyle(root).bottom) || 0;
    const available = window.innerHeight - bottom - breathingRoom;
    root.style.setProperty("--assistant-panel-max", `${Math.max(240, available)}px`);
  }

  /* Na nízkém okně se všechny nabídky nevejdou — z devíti uzlů FAQ jsou
     vidět tři. Seznam scrolluje, ale to nikdo nepozná, dokud to nezkusí,
     takže se dole rozsvítí stínítko a zhasne na konci seznamu. CSS samo
     o sobě přetečení nezjistí, proto to řeší JS. */
  function markScrollable() {
    const more = choices.scrollHeight - choices.clientHeight - choices.scrollTop > 4;
    choices.classList.toggle("has-more", more);
  }

  choices.addEventListener("scroll", markScrollable, { passive: true });

  function setOpen(open) {
    root.dataset.open = String(open);
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));

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

  root.addEventListener("keydown", (event) => {
    if (root.dataset.open !== "true") return;
    if (event.key === "Escape") setOpen(false);
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

/* Mezi 768 a 1280 px je průvodce vidět, ale ukazatel tempa je už
   překlopený do vodorovného proužku u spodní hrany, kde by si s ním sedly
   na sebe. Zvednutí se proto MĚŘÍ, ne hádá: napevno zapsaná hodnota
   (7,5rem) byla o 40 px menší než skutečná výška proužku a překrývaly se.
   ResizeObserver to drží i když proužek zalomí popisky na jiný počet
   řádků. */
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

/** Vloží průvodce do slotu. Jedno volání na stránku, až po ukazateli.
 *  Na malé obrazovce ho skryje CSS — nemontuje se tu podmíněně, aby
 *  hranice viditelnosti byla zapsaná na jediném místě. */
export function mountAssistant() {
  const slot = $("[data-assistant-slot]");
  if (!slot) return;
  const assistant = renderAssistant();
  slot.replaceWith(assistant);
  keepClearOfMeter(assistant);
}
