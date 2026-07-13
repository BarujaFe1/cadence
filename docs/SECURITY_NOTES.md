# Security notes — Cadence

## Scope

Cadence is a **local-first** web app. Study settings and history live in the browser
`localStorage` under the key `cadence.v1`. There is no auth, no backend database,
and no telemetry.

## Findings

| Item | Status |
| --- | --- |
| `.env` / secrets in git | Not committed (`.gitignore` covers `.env*`) |
| Local `.env.local` | May contain `VERCEL_OIDC_TOKEN` created by Vercel CLI — **do not commit** |
| XSS via stored history | History is rendered as text nodes (React), not `dangerouslySetInnerHTML` |
| Audio | Web Audio API chime only; no remote media |

## Guidance

- Never commit `.env.local`, `.vercel/`, or exported personal history dumps.
- If you add a backend later, introduce auth, RLS, and env validation before shipping.
- Clearing site data in the browser permanently deletes the local history.
