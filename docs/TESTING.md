# Testing

## Stack

- **Vitest** for unit tests on pure domain/utils
- No browser E2E in CI (kept lightweight for free GitHub Actions)

## Commands

```bash
pnpm test
pnpm test:watch
pnpm typecheck
pnpm lint
pnpm build
```

## What is covered

- Duration formatting
- History status thresholds
- Actual-seconds resolution (manual vs timed)
- Next runnable block selection
- Session progress ratio
- Streak across weekdays / weekend skip
- Local date-key parsing

## Adding tests

Prefer pure functions in `src/lib/domain.ts` and `src/lib/utils.ts`.
Keep the Zustand store thin: orchestration only.
