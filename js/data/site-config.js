// Single source of truth for site-wide facts. Change values here only —
// no component or page should hardcode the name, address, or phone number.
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
  address: "Bílkova 91, 680 00 Boskovice",
  phone: "723 466 926",
  phoneHref: "tel:+420723466926",
  email: "info@justyoga.cz",
  emailHref: "mailto:info@justyoga.cz",
  passValidityMonths: 6,
  social: {
    facebook: "https://www.facebook.com/justyogacz",
    instagram: "https://www.instagram.com/justyoga_boskovice/",
  },
};
