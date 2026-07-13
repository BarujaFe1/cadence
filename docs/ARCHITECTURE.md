# Architecture

## Overview

Cadence is a Next.js App Router client application with a thin server shell
(layout, static pages) and a rich client domain for timers and history.

```text
Browser
  └─ React UI (Today / History / Settings)
       └─ Zustand store (session + settings + history)
            └─ localStorage (`cadence.v1`)
```

## Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Routes | `src/app/*` | Thin page wrappers |
| UI | `src/components/*` | Presentation, microinteractions |
| State | `src/store/use-cadence-store.ts` | Session machine, persistence orchestration |
| Domain | `src/lib/domain.ts` | Pure rules (status, next block, date keys) |
| Utils | `src/lib/utils.ts` | Formatting, streak, weekly aggregates |
| Storage | `src/lib/storage.ts` | Load/save + sanitize |

## Session model

Each calendar day gets a `DaySession` with four ordered blocks
(EN → FR → DE → ES). Block statuses: `pending` → `active` ↔ `paused` → `completed`.

Completing a block appends a `HistoryEntry` with planned vs actual duration and
a derived status (`completed` ≥90%, `partial` ≥35%, else `interrupted`).

## Why local-first

- Instant open, works offline
- Zero auth friction for a personal routine tool
- Adequate for single-device daily use
- Sync/backend can be added later without rewriting the domain layer

## Timer

A single `setInterval(1000)` runs while `activeIndex != null` and status is
`active`. Interval deps intentionally exclude the `blocks` array to avoid
resetting every tick. Persistence during ticks is throttled; forced flush on
pause/complete/hide.
