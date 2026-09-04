// Real weekly schedule — časy upravené podle e-mailu klientky ze 4. 9. 2026.
// Each row only references an activity id — name/location come from
// activities.js, so the two never drift out of sync.
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
];
