# Deployment

## Production URL (canonical)

https://cadence-ochre-six.vercel.app

## Prerequisites

- Node 22+
- pnpm 10.6.1 (`packageManager` field)

## Local

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Quality gate before deploy

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Vercel

1. Import the GitHub repo (or `vercel link`)
2. Framework: **Next.js** (auto-detected; see `vercel.json`)
3. **No environment variables required**
4. Deploy production:

```bash
vercel deploy --prod --yes
```

## Notes

- `localStorage` is per-browser / per-origin — demos on Vercel start empty unless
  the visitor loads demo history from **Ajustes**.
- GitHub Actions CI runs lint, typecheck, test, and build on push/PR.
