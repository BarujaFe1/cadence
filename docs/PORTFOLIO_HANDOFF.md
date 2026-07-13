# Portfolio handoff — Cadence

**Recommendation:** **Laboratório / side project** (não destaque, não home featured)  
**Tier:** B  
**Canonical demo:** https://cadence-ecru-three.vercel.app  
**Repo:** https://github.com/BarujaFe1/cadence  
**Branch of record:** `chore/portfolio-quality-pass`

---

## Before / after

| Area | Before | After |
| --- | --- | --- |
| Grade | ~6.8 | ~8.5 (lab-honest) |
| Timer | Interval reset every tick | Stable deps + throttle persist |
| Tests | None | Domain + storage + demo-seed |
| CI | None | GitHub Actions |
| README | Product-lite / “premium” tone | Honest lab framing |
| Evidence | Favicon placeholder | `docs/screenshots/*` |
| Deploy claim | Implied latest | Documented: merge/redeploy may lag |

---

## Role in Felipe’s portfolio

Cadence shows **product taste + client domain modeling**. It must **not** compete with the core data narrative (ReconcileIQ, Maestro, StatLab, CausalForge, etc.).

- Portfolio card: `featured: false`, `lab: true`  
- Section: Side Projects / Laboratory  
- Demo CTA → ecru-three only  

---

## Commands executed (baseline)

```text
pnpm lint       → pass
pnpm typecheck  → pass
pnpm test       → pass (domain; storage + demo-seed added this pass)
pnpm build      → pass
```

---

## Bugs fixed this consolidation

1. Demo seed weekend collapse (all days → one Friday)  
2. Weekly chart fake bar on empty today  
3. “1 dias” grammar  

Plus prior quality-pass fixes (timer, persist, confirm, lint scope).

---

## Limitations

- No cross-device sync / auth  
- Public deploy may trail `main` until redeploy after merge  
- Client timer drift when tab is backgrounded  
- Screenshots from local dark mode; crop out Next.js issue badge if reusing  

---

## Next steps

1. Merge `chore/portfolio-quality-pass` → `main`  
2. `vercel deploy --prod` on the account that owns ecru-three  
3. Keep portfolio card as lab/side project  

---

## Supermegaprompt

`C:\dev\prompts_para_port\cadence-supermegaprompt-portfolio.md`
