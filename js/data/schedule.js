// Real weekly schedule — časy upravené podle e-mailu klientky ze 4. 9. 2026,
// páteční kurz doplněn 7. 9. 2026.
// Each row only references an activity id — name/location come from
// activities.js, so the two never drift out of sync.
//
// Tvar řádku:
//   day        – název dne, musí být v DAY_ORDER v js/ui/sections.js
//   time       – ⚠️ TYPOGRAFICKÁ POMLČKA (–, U+2013), ne spojovník
//   activityId – odkaz do activities.js; odtud jde název, délka i místo
//   label      – nepovinné; přebije název z activities.js pro tenhle jeden
//                termín. Použité u pátečního kurzu, který je jóga, ale ne
//                otevřená lekce jako ostatní jógové termíny.
//   badge      – nepovinné; štítek na řádku pro termín, který se chová
//                jinak než zbytek rozvrhu (kurz, jednorázová akce).
//                Drž ho na dvě slova: štítek se nesmí zalomit (nowrap
//                v CSS) a nejužší sloupec rozvrhu má 160 px.
export const SCHEDULE = [
  { day: "Pondělí", time: "17:00–18:00", activityId: "jumping" },
  { day: "Pondělí", time: "18:30–19:30", activityId: "tabata" },
  { day: "Úterý", time: "16:55–18:10", activityId: "joga" },
  { day: "Úterý", time: "18:30–19:45", activityId: "joga" },
  { day: "Středa", time: "16:45–18:00", activityId: "joga" },
  { day: "Středa", time: "17:00–18:00", activityId: "jumping" },
  { day: "Středa", time: "18:30–19:30", activityId: "tabata" },
  { day: "Čtvrtek", time: "16:55–18:10", activityId: "joga" },
  { day: "Čtvrtek", time: "18:30–19:45", activityId: "joga" },
  {
    day: "Pátek",
    time: "17:00–18:15",
    activityId: "joga",
    label: "Jóga pro začátečníky",
    badge: "Na objednání",
  },
];

/* Poznámka pod rozvrhem. Štítek „Kurz · na objednání" na řádku říká, že se
   termín chová jinak, ale ne co s tím má návštěvník dělat — a „kurz" si
   spousta lidí přeloží jako „už mi ujel". Věta je proto o tom, že se dá
   přidat i do rozjetého kurzu, což je klientčin vlastní vzkaz ze 7. 9. 2026.

   Žije v datech, ne v HTML: rozvrh je na homepage i na stránce rozvrhu
   a věta se nesmí rozejít. */
export const SCHEDULE_NOTE =
  "Páteční jóga pro začátečníky je kurz. Přidat se dá i do právě " +
  "běžícího kurzu — napište mi a domluvíme se.";
