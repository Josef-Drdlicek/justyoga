/* Generátor letáků — interní nástroj, ne stránka webu.

   Klientka vyplní formulář, vidí živý náhled v přesných rozměrech A4 nebo
   A5 a vytiskne ho. PDF dělá tiskový dialog prohlížeče („Uložit jako PDF"),
   takže tu není žádná knihovna a text v PDF zůstane vektorový a vybíratelný
   — jsPDF by musel embedovat font kvůli české diakritice a typografie by
   na tom prodělala.

   Předvyplnění jde z js/data/*, takže leták nikdy neuvede jiný čas nebo
   cenu než rozvrh na webu. Cokoli si klientka přepíše, zůstane její. */

import { $, $$, el, fill, mount } from "../lib/dom.js";
import { isUnlocked, lock, unlock } from "../lib/gate.js";
import { renderFlyer } from "../ui/flyer.js";
import { ACTIVITIES } from "../data/activities.js";
import { SCHEDULE } from "../data/schedule.js";
import { GALLERY_PHOTOS } from "../data/gallery.js";
import { getVenueById, formatVenueLine } from "../data/venues.js";

/* Nadpis se nedá z názvu aktivity odvodit: čeština ho skloňuje („Jóga se
   světelnou terapií", ne „Jóga se Jóga a světelná terapie"). Rozdělení na
   běžný a zvýrazněný řez je navíc redakční rozhodnutí, ne vlastnost lekce,
   takže do activities.js nepatří — je to text tohohle nástroje. */
const TITLE_SPLITS = {
  joga: { titleMain: "Jóga se", titleAccent: "světelnou terapií" },
  jumping: { titleMain: "Jumping na", titleAccent: "trampolínách" },
  tabata: { titleMain: "Tabata, HIIT a", titleAccent: "kruhový trénink" },
};

const DAY_SHORT = {
  Pondělí: "Po",
  Úterý: "Út",
  Středa: "St",
  Čtvrtek: "Čt",
  Pátek: "Pá",
  Sobota: "So",
  Neděle: "Ne",
};

const czk = new Intl.NumberFormat("cs-CZ");

/* Kdy se lekce cvičí, na jeden řádek. Časy se sdružují po dnech —
   „Út 16:55–18:10 a 18:30–19:45" místo dvakrát vypsaného úterý. Na letáku
   je jeden řádek na tenhle údaj a nesdružený výpis se do něj nevejde. */
function scheduleLine(activityId) {
  const byDay = new Map();
  for (const slot of SCHEDULE) {
    if (slot.activityId !== activityId) continue;
    if (!byDay.has(slot.day)) byDay.set(slot.day, []);
    byDay.get(slot.day).push(slot.time);
  }
  return [...byDay]
    .map(([day, times]) => `${DAY_SHORT[day] ?? day} ${times.join(" a ")}`)
    .join(" · ");
}

function priceLine(activity) {
  return (
    `${czk.format(activity.pricePerLesson)} Kč za lekci · ` +
    `permanentka ${czk.format(activity.passPrice)} Kč / ${activity.passLessons} vstupů`
  );
}

/** Podklad pro předvyplnění formuláře jednou lekcí z rozvrhu. */
function presetForActivity(activity) {
  const venue = getVenueById(activity.venueId);
  return {
    eyebrow: "Boskovice",
    ...TITLE_SPLITS[activity.id],
    lede: activity.headline,
    bullets: activity.benefits.join("\n"),
    when: scheduleLine(activity.id),
    where: venue ? formatVenueLine(venue) : "",
    price: priceLine(activity),
  };
}

/* ---- Brána ---------------------------------------------------------- */

function showApp() {
  $("[data-gate]").hidden = true;
  const app = $("[data-app]");
  app.hidden = false;
  app.focus();
  // Dokud byl nástroj skrytý, měl náhled nulovou šířku a zmenšení se
  // nedalo spočítat. Po odemčení se tedy musí přeměřit.
  fitPreview();
}

function initGate() {
  const form = $("[data-gate-form]");
  const status = $("[data-gate-status]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Ověřuji…";
    const ok = await unlock(form.elements.password.value);
    if (ok) {
      status.textContent = "";
      showApp();
    } else {
      status.textContent = "Heslo nesedí. Zkuste to prosím znovu.";
      form.elements.password.select();
    }
  });

  $("[data-lock]").addEventListener("click", () => {
    lock();
    location.reload();
  });
}

/* ---- Formulář ------------------------------------------------------- */

function readForm(form) {
  const value = (name) => form.elements[name].value.trim();
  return {
    format: form.elements.format.value,
    eyebrow: value("eyebrow"),
    titleMain: value("titleMain"),
    titleAccent: value("titleAccent"),
    lede: value("lede"),
    bullets: value("bullets").split("\n"),
    when: value("when"),
    where: value("where"),
    price: value("price"),
    footnote: value("footnote"),
    image: form.dataset.image || "",
    showContact: form.elements.showContact.checked,
  };
}

/* Náhled se vykresluje v milimetrech, takže na obrazovce je pro sloupec
   s náhledem obvykle moc široký. Zmenší se transformací a jeviště si vezme
   jen tolik výšky, kolik zmenšený leták zabere — jinak by pod ním zůstala
   díra vysoká celou nezmenšenou stránku. */
function fitPreview() {
  const stage = $("[data-stage]");
  const flyer = $(".flyer", stage);
  // Skrytý nástroj má nulovou šířku a dělením by ze zmenšení vyšlo NaN.
  if (!flyer || stage.clientWidth === 0) return;

  flyer.style.scale = "1";
  const available = stage.clientWidth;
  const scale = Math.min(1, available / flyer.offsetWidth);
  flyer.style.scale = String(scale);
  stage.style.height = `${flyer.offsetHeight * scale}px`;
}

/* @page nejde nastavit třídou ani proměnnou, a přitom se musí měnit s
   formátem — bez toho by prohlížeč A5 leták vytiskl na A4 s bílým pruhem.
   Pravidlo proto přepisuje samostatný <style>, který drží jen tuhle jednu
   deklaraci. */
function setPageSize(format) {
  $("[data-page-size]").textContent = `@page { size: ${format.toUpperCase()} portrait; margin: 0; }`;
}

function initImagePicker(form, onChange) {
  const gallery = $("[data-image-choices]");

  fill(gallery, [
    el("button", {
      type: "button",
      class: "picker__item picker__item--none is-selected",
      text: "Bez fotky",
      dataset: { imageSrc: "" },
    }),
    ...GALLERY_PHOTOS.map((photo) =>
      el("button", { type: "button", class: "picker__item", dataset: { imageSrc: photo.src } }, [
        el("img", { src: photo.src, alt: photo.alt, loading: "lazy" }),
      ])
    ),
  ]);

  gallery.addEventListener("click", (event) => {
    const button = event.target.closest("[data-image-src]");
    if (!button) return;
    form.dataset.image = button.dataset.imageSrc;
    $$(".picker__item", gallery).forEach((item) =>
      item.classList.toggle("is-selected", item === button)
    );
    onChange();
  });

  /* Vlastní fotka se načte přes FileReader a zůstane v prohlížeči jako
     data URL. Nikam se neodesílá — nástroj nemá server, kam by ji poslal. */
  $("[data-image-upload]").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      form.dataset.image = String(reader.result);
      $$(".picker__item", gallery).forEach((item) => item.classList.remove("is-selected"));
      onChange();
    });
    reader.readAsDataURL(file);
  });
}

function initPresets(form, onChange) {
  const select = form.elements.preset;

  for (const activity of ACTIVITIES) {
    select.append(el("option", { value: activity.id, text: activity.name }));
  }

  select.addEventListener("change", () => {
    const activity = ACTIVITIES.find((item) => item.id === select.value);
    if (!activity) return;
    for (const [name, text] of Object.entries(presetForActivity(activity))) {
      const field = form.elements[name];
      // Předloha smí plnit jen pole, která formulář opravdu má. Kdyby se
      // klíč přejmenoval jen na jedné straně, tiše se přeskočí místo toho,
      // aby výjimka shodila celé předvyplnění.
      if (field) field.value = text;
    }
    onChange();
  });
}

/* ---- Start ---------------------------------------------------------- */

initGate();
if (isUnlocked()) showApp();

const form = $("[data-flyer-form]");

function update() {
  const data = readForm(form);
  setPageSize(data.format);
  mount("[data-stage]", () => renderFlyer(data));
  fitPreview();
}

initPresets(form, update);
initImagePicker(form, update);
form.addEventListener("input", update);
form.addEventListener("submit", (event) => event.preventDefault());
$("[data-print]").addEventListener("click", () => window.print());

/* Náhled se zmenšuje podle šířky sloupce, takže se musí přeměřit i při
   změně velikosti okna. Hlídá se jen ŠÍŘKA: fitPreview() sám nastavuje
   jevišti výšku, takže reakce na výšku by observer točila dokola. */
let lastWidth = 0;
new ResizeObserver(([entry]) => {
  const width = entry.contentRect.width;
  if (width === lastWidth) return;
  lastWidth = width;
  fitPreview();
}).observe($("[data-preview]"));

update();
