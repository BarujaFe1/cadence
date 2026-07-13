# Technical decisions

## LocalStorage instead of Supabase

For a single-user habit companion, a backend adds login friction and cost without
improving the core loop. Domain logic is kept pure so a sync layer can be added later.

## Zustand over React Context

Timers update every second. Zustand selectors keep re-renders scoped (e.g. only
the active status drives the interval effect).

## Completion thresholds

| Actual / planned | Status |
| --- | --- |
| ≥ 90% | `completed` |
| ≥ 35% | `partial` |
| < 35% | `interrupted` |

Manual complete with **0 elapsed** credits the full planned duration — intentional
for “I finished Duolingo outside the timer” check-offs.

## Streak

Counts **weekdays** with ≥1 completed history entry. Weekends are skipped so
Sat/Sun do not break the chain (matches the Mon–Fri study routine).

## Styling

Custom design tokens + Tailwind 4 (not a generic dashboard kit). Dark mode follows
`prefers-color-scheme`. Motion is subtle and respects `prefers-reduced-motion`.

## Trade-offs

| Choice | Upside | Downside |
| --- | --- | --- |
| Local-first | Fast, private, simple | No cross-device sync |
| Client timers | Easy UX | Tab sleep can drift slightly |
| No auth | Zero onboarding wall | Shared devices can overwrite data |
