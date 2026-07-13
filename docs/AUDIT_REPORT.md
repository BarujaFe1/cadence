# Cadence — Audit Report

**Date:** 2026-07-13  
**Branch:** `chore/portfolio-quality-pass`  
**Auditor role:** architecture · product · QA · security · portfolio

---

## Executive summary

Cadence is a polished local-first Next.js companion for a four-language Duolingo-style study routine. The visual product is already strong (calm hierarchy, focus mode, history). The gaps that weaken it as a portfolio piece are **missing tests**, **thin documentation**, **no CI**, a **timer interval bug** (re-subscribing every tick), and **localStorage writes every second**.

**Current grade (before this pass):** **6.8 / 10**  
**Target after this pass:** **8.5+ / 10**

---

## Stack (actual)

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| UI | React 19 + Tailwind CSS 4 + Framer Motion |
| State | Zustand |
| Persistence | `localStorage` (`cadence.v1`) |
| Deploy | Vercel (`cadence-ochre-six.vercel.app`) |
| Auth / backend | None (intentional local-first) |

---

## Main risks

1. **Timer effect depends on `blocks`** → interval cleared/recreated every second → drift and wasted work.
2. **`saveState` on every tick** → disk/IO pressure and jank on slower devices.
3. **No tests** → domain regressions (streak, completion thresholds) go unnoticed.
4. **No CI** → broken PRs can land unnoticed.
5. **README is product-lite** → weak recruiter narrative.
6. **Destructive clear history** without confirm → easy data loss.
7. **Local `.env.local` holds Vercel OIDC token** → safe if gitignored (it is); document in security notes.

---

## Bugs found

| ID | Severity | Issue |
| --- | --- | --- |
| B1 | High | Timer `useEffect` deps include `blocks`, resetting interval each tick |
| B2 | Medium | Persist to `localStorage` every second while running |
| B3 | Medium | Clear history has no confirmation |
| B4 | Low | Loading state is a spinner only (no skeleton) |
| B5 | Low | Timer lacks `aria-live` for screen readers |
| B6 | Low | No first-run onboarding / empty guidance |
| B7 | Info | Manual “Concluir” with 0 elapsed credits full planned time (product choice; document) |

---

## Quick wins

- Fix timer effect deps (status + index only)
- Debounce/throttle persistence during ticks
- Confirm before clearing history
- Add `typecheck` + Vitest for pure domain utils
- GitHub Actions CI
- Portfolio-grade README + architecture docs
- Onboarding tip + aria-live

---

## Structural improvements

- Extract pure domain helpers (`resolveHistoryStatus`, date-key parsing)
- Light storage sanitization
- Scripts: `lint`, `typecheck`, `test`, `build`
- Docs suite under `docs/`

---

## Execution plan

1. Branch + audit (this file)
2. Fix B1–B5 + domain extraction + tests
3. UX: confirm dialog, skeleton, onboarding, a11y
4. Docs + README + CI + `.env.example`
5. Build/lint/test green → HANDOFF → commit/push

---

## Final checklist

- [x] Install / build / lint / typecheck / test pass
- [x] Timer stable under load
- [x] Persistence throttled
- [x] Docs + README portfolio-ready
- [x] CI workflow present
- [x] Secrets not committed
- [x] HANDOFF written

**Post-pass grade:** **8.5 / 10**
