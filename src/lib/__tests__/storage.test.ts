import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { getDefaultState, loadState, saveState } from "@/lib/storage";
import { STORAGE_KEY } from "@/lib/defaults";

describe("storage sanitization", () => {
  const memory = new Map<string, string>();

  beforeEach(() => {
    memory.clear();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => memory.get(key) ?? null,
        setItem: (key: string, value: string) => {
          memory.set(key, value);
        },
        removeItem: (key: string) => {
          memory.delete(key);
        },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns defaults when storage is empty", () => {
    const state = loadState();
    expect(state.settings.languages).toHaveLength(4);
    expect(state.history).toEqual([]);
    expect(state.session.blocks).toHaveLength(4);
  });

  it("falls back when languages payload is corrupt", () => {
    memory.set(
      STORAGE_KEY,
      JSON.stringify({
        ...getDefaultState(),
        settings: { languages: [{ id: "xx" }], soundEnabled: true },
      }),
    );
    const state = loadState();
    expect(state.settings.languages.map((l) => l.id)).toEqual([
      "en",
      "fr",
      "de",
      "es",
    ]);
  });

  it("persists and reloads a valid history entry", () => {
    const base = getDefaultState();
    const withHistory = {
      ...base,
      history: [
        {
          id: "h1",
          date: base.session.date,
          languageId: "en" as const,
          languageName: "Inglês",
          plannedSeconds: 600,
          actualSeconds: 600,
          status: "completed" as const,
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          dayTotalSeconds: 600,
          dayCompletedBlocks: 1,
        },
      ],
    };
    saveState(withHistory);
    const loaded = loadState();
    expect(loaded.history).toHaveLength(1);
    expect(loaded.history[0]?.languageId).toBe("en");
  });

  it("drops history rows without required fields", () => {
    memory.set(
      STORAGE_KEY,
      JSON.stringify({
        ...getDefaultState(),
        history: [{ id: 1, foo: "bar" }, null, "x"],
      }),
    );
    expect(loadState().history).toEqual([]);
  });
});
