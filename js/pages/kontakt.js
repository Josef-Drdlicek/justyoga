/* Contact page. */

import { mount, $ } from "../lib/dom.js";
import { initReveal } from "../lib/reveal.js";
import { mountChrome } from "../ui/chrome.js";
import { mountHeartRateMeter } from "../ui/heart-rate-meter.js";
import { mountAssistant } from "../ui/assistant.js";
import { renderVenues, renderFollow } from "../ui/sections.js";
import { SITE_CONFIG } from "../data/site-config.js";
import { PHONE_ICON, MAIL_ICON } from "../data/icons.js";

mountChrome();

mount("[data-venues]", renderVenues);
mount("[data-follow]", renderFollow);

const phone = $("[data-contact-phone]");
phone.textContent = SITE_CONFIG.phone;
phone.href = SITE_CONFIG.phoneHref;

const email = $("[data-contact-email]");
email.textContent = SITE_CONFIG.email;
email.href = SITE_CONFIG.emailHref;

$('[data-icon="phone"]').innerHTML = PHONE_ICON;
$('[data-icon="mail"]').innerHTML = MAIL_ICON;

// Odeslání formuláře. Statický web nemá server, takže POST obslouží
// externí služba nastavená v SITE_CONFIG.formEndpoint. Dokud tam je `null`,
// je odeslání zablokované a návštěvník to dozví — tiše zmizelá zpráva je
// horší než formulář, který přizná, že nefunguje.
const form = $("[data-contact-form]");
const status = $("[data-form-status]");
const submit = $('[data-contact-form] button[type="submit"]');

const fallbackText =
  `Formulář zatím není propojený — napište mi prosím přímo na ${SITE_CONFIG.email} ` +
  `nebo zavolejte na ${SITE_CONFIG.phone}.`;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!SITE_CONFIG.formEndpoint) {
    status.textContent = fallbackText;
    return;
  }

  // Dvojklik na tlačítko by odeslal zprávu dvakrát; disabled to drží po
  // celou dobu requestu a finally ho vrátí i při chybě.
  submit.disabled = true;
  status.textContent = "Odesílám…";

  const payload = new FormData(form);
  payload.append("access_key", SITE_CONFIG.formAccessKey);

  // Bez tohohle přijde Lence do schránky předmět "New Submission" a odesílatel
  // Web3Forms, takže nepozná, o co jde, ani komu odpovídá. `replyto` je tu
  // nutné explicitně: Web3Forms si adresu tahá z pole jménem `email`, my ale
  // máme `your-email` podle Contact Form 7 na produkci.
  payload.append("subject", `Web justyoga.cz: ${payload.get("your-subject")}`);
  payload.append("from_name", payload.get("your-name"));
  payload.append("replyto", payload.get("your-email"));

  try {
    const response = await fetch(SITE_CONFIG.formEndpoint, {
      method: "POST",
      body: payload,
      headers: { Accept: "application/json" },
    });
    // Web3Forms vrací 200 i pro odmítnutou zprávu (zachycený spam, vyčerpaná
    // kvóta), takže samotný stavový kód nestačí — rozhoduje `success` v těle.
    const data = await response.json();
    if (!data.success) throw new Error(data.message || `HTTP ${response.status}`);
    form.reset();
    status.textContent = "Děkuji, zpráva odešla. Odpovím vám co nejdřív.";
  } catch {
    // Konkrétní chyba návštěvníkovi nepomůže, cesta k člověku ano.
    status.textContent =
      `Zprávu se nepodařilo odeslat. Napište mi prosím přímo na ${SITE_CONFIG.email} ` +
      `nebo zavolejte na ${SITE_CONFIG.phone}.`;
  } finally {
    submit.disabled = false;
  }
});

// Až po vykreslení obsahu: ukazatel si při startu hledá své zastávky
// v DOMu, a kdyby běžel dřív, nenašel by je a spadl by do klidového stavu.
mountHeartRateMeter();
mountAssistant();

initReveal();
