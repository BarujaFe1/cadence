# Handoff — portfolio quality pass

**Branch:** `chore/portfolio-quality-pass`  
**Date:** 2026-07-13  
**Repo:** [BarujaFe1/cadence](https://github.com/BarujaFe1/cadence)  
**Canonical demo:** https://cadence-ecru-three.vercel.app

---

## What was found

- Strong visual product already (calm UI, focus mode, history).
- Missing tests, CI, and portfolio-grade documentation.
- Critical timer bug: interval depended on `blocks` and reset every second.
- `localStorage` written on every tick.
- Clear-history had no confirmation.
- ESLint was scanning `.next` build output.
- Local `.env.local` may hold Vercel OIDC token (gitignored; documented).

**Pre-pass grade:** ~6.8/10  
**Post-pass grade (expected):** ~8.5/10

---

## What was fixed

| Item | Fix |
| --- | --- |
| Timer interval thrash | Depend on `activeIndex` + `activeStatus` only |
| Persist spam | Throttle ticks (4s) + force flush on pause/complete/hide |
| Clear history | Native confirm dialog |
| Loading UX | Skeleton + `aria-busy` |
| Timer a11y | `aria-live="polite"` on countdown |
| First visit | Onboarding tip |
| Storage safety | Sanitize settings/session/history on load |
| Date keys | Local `parseDateKey` for streak/formatting |
| Lint scope | Ignore `.next` / `node_modules`; lint `src` only |

---

## What was improved

- Domain extraction (`src/lib/domain.ts`)
- Vitest suite (8 tests)
- Scripts: `typecheck`, `test`, `test:watch`
- GitHub Actions CI
- Portfolio README
- Docs: AUDIT, ARCHITECTURE, TECHNICAL_DECISIONS, TESTING, DEPLOYMENT, SECURITY_NOTES, HANDOFF
- `.env.example`
- Demo history seed in Settings
- Keyboard handlers read live store state (no stale `blocks` closure)

---

## Commands run

```bash
pnpm add -D vitest
pnpm test          # 8 passed
pnpm typecheck     # ok
pnpm lint          # ok (src, max-warnings=0)
pnpm build         # ok
```

---

## What still remains (optional)

- Real product screenshots in README (placeholder favicon only)
- Optional cloud sync
- E2E (Playwright) for timer flows
- Connect GitHub ↔ Vercel on the account that owns `ecru-three` for auto-deploy
- Export/import history JSON

---

## Remaining risks

- Browser tab sleep can still drift timers slightly (inherent to client timers).
- Local-first = no cross-device sync.
- Manual complete with 0 elapsed credits full planned time (documented product choice).

---

## Portfolio suggestions

- Keep card as **lab / side-project**, `featured: false`.
- Demo CTA → `https://cadence-ecru-three.vercel.app`.
- In interviews: emphasize session machine, habit semantics, and DX (tests/CI/docs).

---

## Suggested commit message

```text
chore: improve portfolio quality, docs, tests and stability
```

## Next steps

1. Review this branch / open PR → `main`
2. Redeploy Vercel after merge if Git is not auto-connected
3. Capture a homepage screenshot for README when convenient
