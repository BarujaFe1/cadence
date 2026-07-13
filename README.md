# Cadence

**Serene language-study routine companion.**

A calm, Apple-inspired web app for a weekday four-language habit — English → French → German → Spanish — with elegant timers, focus mode, and persistent history.

**Live demo:** https://cadence-ochre-six.vercel.app

![Cadence — placeholder for product screenshot](./public/favicon.svg)

---

## The problem

Studying multiple languages on Duolingo is easy to start and easy to abandon mid-routine. Without a lightweight coach for *order, duration, and consistency*, sessions blur together and streaks feel accidental.

## The solution

Cadence turns the daily routine into four serene blocks:

1. See today’s sequence at a glance  
2. Start / pause / resume / complete each language  
3. Feel progress through a quiet progress ring  
4. Review history, streak, and weekly totals later  

Local-first: data stays in the browser. Open and go — no login.

---

## Features

- **Today** — ordered EN → FR → DE → ES blocks with configurable minutes  
- **Timers** — start, pause, continue, reset, manual complete, next block  
- **Focus mode** — quieter UI for deep sessions  
- **History** — by day / by language, filters, weekly chart, streak  
- **Settings** — durations, sound, focus default, demo seed  
- **Keyboard** — `Space` play/pause · `N` next · `C` complete · `F` focus  
- **Dark mode** — follows system preference  
- **Onboarding** — first-visit tip for the core loop  

---

## Architecture

```text
UI (App Router pages)
  → Zustand store (session machine)
    → domain helpers (pure)
    → localStorage (sanitized persistence)
```

Details: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

---

## Stack

- Next.js 15 · React 19 · TypeScript  
- Tailwind CSS 4 · Framer Motion · Zustand  
- Vitest · ESLint · GitHub Actions · Vercel  

---

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Quality commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

---

## Environment variables

None required for app functionality.

See [`.env.example`](./.env.example). Persistence is `localStorage` only.

---

## Tests

Unit tests cover duration formatting, completion thresholds, streak logic, and session progress.

See [`docs/TESTING.md`](./docs/TESTING.md).

---

## Technical decisions & trade-offs

- **Local-first over backend** — fastest habit loop; sync can come later  
- **Throttle persistence while the timer runs** — avoid writing every second  
- **Weekday streak** — weekends do not break Mon–Fri routines  
- **Manual complete with 0 elapsed = planned duration** — check-off after studying outside the timer  

More: [`docs/TECHNICAL_DECISIONS.md`](./docs/TECHNICAL_DECISIONS.md)

---

## Deploy

Canonical production URL: **https://cadence-ochre-six.vercel.app**

```bash
pnpm build
vercel deploy --prod --yes
```

Guide: [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)

---

## Roadmap

- [ ] Optional cloud sync (opt-in)
- [ ] Custom language order / fifth block
- [ ] Export history (JSON/CSV)
- [ ] Gentle browser notifications when a block ends
- [ ] i18n UI (PT/EN)

## Status

**Lab / side-project · production demo live · portfolio quality pass in progress**

---

## What this project demonstrates

- Product taste: calm hierarchy, restraint, microinteractions  
- Client-side domain modeling (session machine + history)  
- Practical DX: lint, typecheck, tests, CI, docs  
- Honest local-first trade-offs explained for reviewers  

## How I would present this in an interview

> “Cadence solves a real personal habit problem. I optimized for open → start in under five seconds. The interesting engineering is the session state machine, weekday streak semantics, and keeping the timer interval stable while persisting safely. I chose local-first on purpose; the domain layer is ready if sync becomes necessary.”

---

## Docs index

| Doc | Purpose |
| --- | --- |
| [`docs/AUDIT_REPORT.md`](./docs/AUDIT_REPORT.md) | Audit findings |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | System design |
| [`docs/TECHNICAL_DECISIONS.md`](./docs/TECHNICAL_DECISIONS.md) | ADRs / trade-offs |
| [`docs/TESTING.md`](./docs/TESTING.md) | Test strategy |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | Ship guide |
| [`docs/SECURITY_NOTES.md`](./docs/SECURITY_NOTES.md) | Privacy & secrets |
| [`docs/HANDOFF.md`](./docs/HANDOFF.md) | Review handoff |

## License

Personal / portfolio use.
