import { describe, expect, it } from "vitest";
import {
  findNextRunnableIndex,
  parseDateKey,
  resolveActualSeconds,
  resolveHistoryStatus,
} from "@/lib/domain";
import { computeStreak, formatDuration, sessionProgress, todayKey } from "@/lib/utils";
import type { HistoryEntry, SessionBlock } from "@/lib/types";

function block(
  partial: Partial<SessionBlock> & Pick<SessionBlock, "status">,
): SessionBlock {
  return {
    languageId: "en",
    plannedSeconds: 600,
    remainingSeconds: 600,
    elapsedSeconds: 0,
    startedAt: null,
    endedAt: null,
    ...partial,
  };
}

describe("formatDuration", () => {
  it("formats mm:ss and hh:mm:ss", () => {
    expect(formatDuration(65)).toBe("01:05");
    expect(formatDuration(3661)).toBe("1:01:01");
    expect(formatDuration(-5)).toBe("00:00");
  });
});

describe("resolveHistoryStatus", () => {
  it("classifies completed / partial / interrupted", () => {
    expect(resolveHistoryStatus(600, 600)).toBe("completed");
    expect(resolveHistoryStatus(540, 600)).toBe("completed");
    expect(resolveHistoryStatus(300, 600)).toBe("partial");
    expect(resolveHistoryStatus(60, 600)).toBe("interrupted");
  });
});

describe("resolveActualSeconds", () => {
  it("credits full planned time when manually completing an unstarted block", () => {
    expect(
      resolveActualSeconds({
        manual: true,
        elapsedSeconds: 0,
        plannedSeconds: 480,
        remainingSeconds: 480,
      }),
    ).toBe(480);
  });

  it("uses elapsed time when the timer ran", () => {
    expect(
      resolveActualSeconds({
        manual: false,
        elapsedSeconds: 120,
        plannedSeconds: 600,
        remainingSeconds: 480,
      }),
    ).toBe(120);
  });
});

describe("findNextRunnableIndex", () => {
  it("skips completed blocks and finds the next runnable one", () => {
    const blocks = [
      block({ status: "completed" }),
      block({ status: "pending", languageId: "fr" }),
      block({ status: "paused", languageId: "de" }),
    ];
    expect(findNextRunnableIndex(blocks, -1)).toBe(1);
    expect(findNextRunnableIndex(blocks, 1)).toBe(2);
  });
});

describe("sessionProgress", () => {
  it("computes ratio from elapsed / planned", () => {
    const progress = sessionProgress([
      block({ status: "completed", elapsedSeconds: 600, plannedSeconds: 600 }),
      block({ status: "active", elapsedSeconds: 150, plannedSeconds: 600 }),
    ]);
    expect(progress.completed).toBe(1);
    expect(progress.total).toBe(2);
    expect(progress.ratio).toBeCloseTo(750 / 1200);
  });
});

describe("computeStreak", () => {
  it("counts consecutive weekdays with completed entries and skips weekends", () => {
    // Build three consecutive weekdays ending on a known Friday.
    // Using explicit keys avoids flaky “today” dependence.
    const friday = parseDateKey("2026-07-10"); // Friday
    expect(friday.getDay()).toBe(5);

    const keys = ["2026-07-08", "2026-07-09", "2026-07-10"]; // Wed–Fri
    const history: HistoryEntry[] = keys.map((date) => ({
      id: date,
      date,
      languageId: "en",
      languageName: "Inglês",
      plannedSeconds: 600,
      actualSeconds: 600,
      status: "completed",
      startedAt: `${date}T08:00:00.000Z`,
      endedAt: `${date}T08:10:00.000Z`,
      dayTotalSeconds: 600,
      dayCompletedBlocks: 1,
    }));

    expect(computeStreak(history, "2026-07-10")).toBe(3);
    expect(computeStreak(history, "2026-07-11")).toBe(3); // Saturday → still 3
    expect(computeStreak([], todayKey())).toBe(0);
  });
});

describe("parseDateKey", () => {
  it("parses as local calendar date", () => {
    const date = parseDateKey("2026-07-13");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(6);
    expect(date.getDate()).toBe(13);
  });
});
