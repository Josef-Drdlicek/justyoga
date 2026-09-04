/* Jednoduchá brána před interním nástrojem.

   ⚠️ ČTI TOHLE, NEŽ SE NA NI SPOLEHNEŠ. Tohle NENÍ zabezpečení. Stránka
   i s celým generátorem se stáhne do prohlížeče dřív, než se kdokoli
   zeptá na heslo — kdo otevře zdrojový kód, obsah uvidí. Brána řeší jen
   to, aby na nástroj omylem nenarazil návštěvník webu.

   Skutečná ochrana je jedině na serveru:
     • basic auth na hostingu (.htpasswd u Apache, `auth_basic` u nginx),
     • nebo Cloudflare Access / Netlify Identity před celou cestou.
   Obojí je pár řádků v konfiguraci a nepotřebuje z téhle stránky nic.

   Heslo tu není v čitelné podobě: porovnává se PBKDF2-SHA256 otisk
   s 250 000 iteracemi, takže i kdyby někdo zdroj otevřel, heslo z něj
   rychle nedostane. Odolnost pořád stojí a padá na tom, jak dlouhé heslo
   je — krátké se ofline zlomí i tak.

   Nové heslo se spočítá v Node:
     node -e "const c=require('crypto');console.log(
       c.pbkdf2Sync('NOVÉ HESLO', Buffer.from('justyoga-letak-v1'),
       250000, 32, 'sha256').toString('base64'))"
   a vloží se do PASSWORD_HASH níž. */

const SALT = "justyoga-letak-v1";
const ITERATIONS = 250000;

/** Otisk hesla „justyoga2026". Změnu viz komentář výš. */
export const PASSWORD_HASH = "98dA5r9mW4chDYeYQnCV9ThH0OjUzdz7prsWdOr6Aas=";

/* Odemčení drží sessionStorage, ne localStorage: zavřením panelu se
   zámek vrací zpátky, takže na cizím počítači nezůstane otevřený. */
const SESSION_KEY = "justyoga:letak:unlocked";

async function derive(password) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(SALT), iterations: ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}

export function isUnlocked() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // Prohlížeč s vypnutým úložištěm bránu nezvládne zapamatovat, ale
    // nesmí kvůli tomu spadnout — heslo se prostě zeptá znovu.
    return false;
  }
}

export async function unlock(password) {
  const ok = (await derive(password)) === PASSWORD_HASH;
  if (ok) {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* viz isUnlocked() */
    }
  }
  return ok;
}

export function lock() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* viz isUnlocked() */
  }
}
