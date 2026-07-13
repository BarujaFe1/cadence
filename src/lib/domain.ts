import type { HistoryEntry, SessionBlock } from "./types";

/** Parse a `yyyy-MM-dd` key as a local calendar date (no UTC shift). */
export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function resolveHistoryStatus(
  actualSeconds: number,
  plannedSeconds: number,
): HistoryEntry["status"] {
  if (plannedSeconds <= 0) return "interrupted";
  if (actualSeconds >= plannedSeconds * 0.9) return "completed";
  if (actualSeconds >= plannedSeconds * 0.35) return "partial";
  return "interrupted";
}

export function resolveActualSeconds(options: {
  manual: boolean;
  elapsedSeconds: number;
  plannedSeconds: number;
  remainingSeconds: number;
}): number {
  const { manual, elapsedSeconds, plannedSeconds, remainingSeconds } = options;
  if (manual && elapsedSeconds === 0) {
    // Product choice: checking off an unstarted block counts the planned duration
    // (e.g. finished Duolingo outside the timer).
    return Math.max(1, plannedSeconds);
  }
  return Math.max(
    1,
    elapsedSeconds || plannedSeconds - remainingSeconds,
  );
}

export function isBlockRunnable(block: SessionBlock): boolean {
  return block.status === "pending" || block.status === "paused";
}

export function findNextRunnableIndex(
  blocks: SessionBlock[],
  afterIndex = -1,
): number {
  const forward = blocks.findIndex(
    (block, index) => index > afterIndex && isBlockRunnable(block),
  );
  if (forward >= 0) return forward;
  return blocks.findIndex((block) => isBlockRunnable(block));
}
