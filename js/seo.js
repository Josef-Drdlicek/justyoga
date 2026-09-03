// Injects schema.org structured data (JSON-LD) describing the business,
// read entirely from SITE_CONFIG so the studio's name/address/contact/social
// links exist in exactly one place. Loaded on every page next to main.js —
// search engines use this to match the site to the business's real-world
// identity (e.g. Google Business Profile), independent of the page's
// visible <title>.
import { SITE_CONFIG } from "./data/site-config.js";

const sameAs = Object.values(SITE_CONFIG.social).filter(Boolean);

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ExerciseGym",
  name: SITE_CONFIG.legalName,
  alternateName: SITE_CONFIG.siteName,
  url: document.location.origin + "/",
  image: new URL(SITE_CONFIG.logoSrc, document.baseURI).href,
  telephone: SITE_CONFIG.phone,
  email: SITE_CONFIG.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE_CONFIG.address,
    addressCountry: "CZ",
  },
  ...(sameAs.length ? { sameAs } : {}),
};

const script = document.createElement("script");
script.type = "application/ld+json";
script.textContent = JSON.stringify(structuredData);
document.head.append(script);
