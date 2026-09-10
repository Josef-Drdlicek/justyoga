// Single source of truth for site-wide facts. Change values here only —
// no component or page should hardcode the name or phone number.
export const SITE_CONFIG = {
  siteName: "Just Yoga Boskovice",
  // Plný oficiální název studia — používá se tam, kde jde o identitu firmy
  // (patička, strukturovaná data pro vyhledávače), zatímco kratší siteName
  // zůstává vizuální značka v hlavičce/titulcích stránek.
  legalName: "Just Yoga a pohybové studio Boskovice",
  tagline: "Pohyb, který vás nabije energií i klidem.",
  logoSrc: "assets/images/logo-just-yoga-wide.png",
  logoAlt: "Just Yoga – pohybové studio",
  // Vlastní rozměry souboru. Hlavička logu určuje výšku a šířku nechává na
  // "auto", takže do načtení obrázku prohlížeč jeho šířku nezná a navigace
  // vedle něj po dorazu loga poskočí. Ostatní obrázky na webu tyhle atributy
  // nepotřebují — hero je absolutně pozicovaný a fotky mají aspect-ratio
  // v CSS, takže jejich místo je známé předem.
  logoWidth: 2074,
  logoHeight: 751,
  // Adresy NEJSOU tady: studio cvičí na dvou místech, takže žijí
  // rozložené na složky v js/data/venues.js (strukturovaná data
  // i navigační odkazy potřebují ulici, PSČ a město zvlášť).
  phone: "723 466 926",
  phoneHref: "tel:+420723466926",
  email: "justlenicka@gmail.com",
  emailHref: "mailto:justlenicka@gmail.com",
  // Kam odesílá formulář na kontaktu. `null` znamená "nenapojeno" —
  // js/pages/kontakt.js pak odeslání zablokuje a řekne to návštěvníkovi,
  // místo aby zpráva tiše zmizela. Statický web nemá server, takže POST
  // musí obsloužit externí služba; tady je to Web3Forms, které zprávy
  // přeposílá na e-mail zadaný při registraci klíče.
  formEndpoint: "https://api.web3forms.com/submit",
  // Klíč je veřejný záměrně — Web3Forms ho tak navrhlo, jede v kódu
  // stránky a sám o sobě nic neodemyká. Nepatří proto mezi tajemství,
  // ale patří sem, aby nebyl zapsaný uprostřed logiky odesílání.
  // ⚠️ Váže se na schránku, která zprávy dostává. Změna schránky =
  // nový klíč, tenhle přestane platit.
  formAccessKey: "ed4a29bc-041b-4118-8773-3bf517ecd8d8",
  passValidityMonths: 6,
  social: {
    facebook: "https://www.facebook.com/justyogacz",
    instagram: "https://www.instagram.com/justyoga_boskovice/",
  },
};
