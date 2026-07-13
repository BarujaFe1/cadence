import { describe, expect, it, vi, afterEach } from "vitest";

/**
 * Mirrors the weekday seed walk used by loadDemoData.
 * Kept as a pure test helper so we don't import the Zustand store in Node.
 */
function previousWeekdays(count: number, from = new Date("2026-07-13T12:00:00")) {
  const formatLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };
  const dates: string[] = [];
  const cursor = new Date(from);
  while (dates.length < count) {
    cursor.setDate(cursor.getDate() - 1);
    const day = cursor.getDay();
    if (day === 0 || day === 6) continue;
    dates.push(formatLocal(cursor));
  }
  return dates;
}

describe("demo history weekday seeding", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns distinct weekdays when walking back over a weekend", () => {
    // Monday 13 Jul 2026 → Fri 10, Thu 9, Wed 8
    const dates = previousWeekdays(3, new Date("2026-07-13T12:00:00"));
    expect(dates).toEqual(["2026-07-10", "2026-07-09", "2026-07-08"]);
    expect(new Set(dates).size).toBe(3);
  });
});
