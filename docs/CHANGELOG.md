# Changelog — portfolio quality pass

## 2026-07-13 — `chore/portfolio-quality-pass`

### Fixed
- Timer interval no longer resets every second
- Throttled `localStorage` writes during ticks; flush on pause/complete/hide
- Confirm before clearing history
- Demo seed no longer collapses weekend offsets into one day
- Weekly chart no longer paints a fake bar on empty “today”
- Singular streak label (“1 dia”)
- ESLint ignores `.next` build output

### Added
- Domain helpers + Vitest (domain, storage, demo seed)
- CI workflow, `.env.example`, portfolio docs
- Onboarding tip, loading skeleton, `aria-live` timer
- Screenshots under `docs/screenshots/`
- Demo script and portfolio handoff

### Docs / meta
- Honest lab/side-project positioning
- GitHub topics + clearer description
- Canonical demo: https://cadence-ecru-three.vercel.app
