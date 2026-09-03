// Real weekly schedule taken from justyoga.cz/rozvrh (checked 2026-07-07).
// Each row only references an activity id — name/location come from
// activities.js, so the two never drift out of sync.
export const SCHEDULE = [
  { day: "Pondělí", time: "17:30–18:30", activityId: "jumping" },
  { day: "Pondělí", time: "19:00–20:00", activityId: "tabata" },
  { day: "Úterý", time: "16:55–18:10", activityId: "joga" },
  { day: "Úterý", time: "18:30–19:45", activityId: "joga" },
  { day: "Středa", time: "16:30–17:45", activityId: "joga" },
  { day: "Středa", time: "17:30–18:30", activityId: "jumping" },
  { day: "Středa", time: "19:00–20:00", activityId: "tabata" },
  { day: "Čtvrtek", time: "16:55–18:10", activityId: "joga" },
  { day: "Čtvrtek", time: "18:30–19:45", activityId: "joga" },
];
