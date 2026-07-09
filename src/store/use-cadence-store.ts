"use client";

import { create } from "zustand";
import { createDaySession, DEFAULT_SETTINGS } from "@/lib/defaults";
import { loadState, saveState } from "@/lib/storage";
import type {
  DaySession,
  HistoryEntry,
  LanguageId,
  Settings,
} from "@/lib/types";
import { createId, playChime, todayKey } from "@/lib/utils";

interface CadenceState {
  hydrated: boolean;
  settings: Settings;
  session: DaySession;
  history: HistoryEntry[];
  celebration: boolean;
  hydrate: () => void;
  tick: () => void;
  startBlock: (index?: number) => void;
  pauseBlock: () => void;
  resumeBlock: () => void;
  resetBlock: (index?: number) => void;
  completeBlock: (index?: number, manual?: boolean) => void;
  nextBlock: () => void;
  setFocusMode: (value: boolean) => void;
  updateLanguageMinutes: (id: LanguageId, minutes: number) => void;
  setSoundEnabled: (value: boolean) => void;
  setFocusModeDefault: (value: boolean) => void;
  resetToday: () => void;
  clearHistory: () => void;
  dismissCelebration: () => void;
}

function persist(partial: {
  settings: Settings;
  session: DaySession;
  history: HistoryEntry[];
}) {
  saveState({
    ...partial,
    lastActiveDate: todayKey(),
  });
}

function languageName(settings: Settings, id: LanguageId) {
  return settings.languages.find((language) => language.id === id)?.namePt ?? id;
}

export const useCadenceStore = create<CadenceState>((set, get) => ({
  hydrated: false,
  settings: DEFAULT_SETTINGS,
  session: createDaySession(),
  history: [],
  celebration: false,

  hydrate: () => {
    const state = loadState();
    set({
      hydrated: true,
      settings: state.settings,
      session: state.session,
      history: state.history,
      celebration: false,
    });
  },

  tick: () => {
    const { session, settings, history } = get();
    if (session.activeIndex === null) return;

    const index = session.activeIndex;
    const block = session.blocks[index];
    if (!block || block.status !== "active") return;

    const remainingSeconds = Math.max(0, block.remainingSeconds - 1);
    const elapsedSeconds = Math.min(block.plannedSeconds, block.elapsedSeconds + 1);

    const nextBlocks = session.blocks.map((item, i) =>
      i === index
        ? {
            ...item,
            remainingSeconds,
            elapsedSeconds,
          }
        : item,
    );

    const nextSession = { ...session, blocks: nextBlocks };
    set({ session: nextSession });
    persist({ settings, session: nextSession, history });

    if (remainingSeconds === 0) {
      get().completeBlock(index, false);
    }
  },

  startBlock: (index) => {
    const { session, settings, history } = get();
    const target =
      typeof index === "number"
        ? index
        : session.blocks.findIndex(
            (block) => block.status === "pending" || block.status === "paused",
          );

    if (target < 0 || target >= session.blocks.length) return;

    const currentActive = session.activeIndex;
    const blocks = [...session.blocks];

    if (currentActive !== null && currentActive !== target) {
      const current = blocks[currentActive];
      if (current.status === "active") {
        blocks[currentActive] = { ...current, status: "paused" };
      }
    }

    const block = blocks[target];
    if (block.status === "completed") return;

    blocks[target] = {
      ...block,
      status: "active",
      startedAt: block.startedAt ?? new Date().toISOString(),
      endedAt: null,
      remainingSeconds:
        block.remainingSeconds > 0 ? block.remainingSeconds : block.plannedSeconds,
    };

    const nextSession: DaySession = {
      ...session,
      activeIndex: target,
      completedAt: null,
      blocks,
    };

    set({ session: nextSession, celebration: false });
    persist({ settings, session: nextSession, history });
  },

  pauseBlock: () => {
    const { session, settings, history } = get();
    if (session.activeIndex === null) return;
    const index = session.activeIndex;
    const block = session.blocks[index];
    if (!block || block.status !== "active") return;

    const nextSession: DaySession = {
      ...session,
      blocks: session.blocks.map((item, i) =>
        i === index ? { ...item, status: "paused" } : item,
      ),
    };

    set({ session: nextSession });
    persist({ settings, session: nextSession, history });
  },

  resumeBlock: () => {
    const { session } = get();
    if (session.activeIndex === null) return;
    get().startBlock(session.activeIndex);
  },

  resetBlock: (index) => {
    const { session, settings, history } = get();
    const target = typeof index === "number" ? index : session.activeIndex;
    if (target === null || target < 0) return;

    const block = session.blocks[target];
    const nextSession: DaySession = {
      ...session,
      activeIndex: session.activeIndex === target ? null : session.activeIndex,
      completedAt: null,
      blocks: session.blocks.map((item, i) =>
        i === target
          ? {
              ...item,
              status: "pending",
              remainingSeconds: item.plannedSeconds,
              elapsedSeconds: 0,
              startedAt: null,
              endedAt: null,
            }
          : item,
      ),
    };

    // If resetting a previously logged incomplete attempt mid-session, keep history as-is.
    void block;
    set({ session: nextSession, celebration: false });
    persist({ settings, session: nextSession, history });
  },

  completeBlock: (index, manual = true) => {
    const { session, settings, history } = get();
    const target = typeof index === "number" ? index : session.activeIndex;
    if (target === null || target < 0) return;

    const block = session.blocks[target];
    if (!block || block.status === "completed") return;

    const endedAt = new Date().toISOString();
    const actualSeconds = Math.max(
      1,
      manual && block.elapsedSeconds === 0
        ? block.plannedSeconds
        : block.elapsedSeconds || block.plannedSeconds - block.remainingSeconds,
    );

    const status: HistoryEntry["status"] =
      actualSeconds >= block.plannedSeconds * 0.9
        ? "completed"
        : actualSeconds >= block.plannedSeconds * 0.35
          ? "partial"
          : "interrupted";

    const nextBlocks = session.blocks.map((item, i) =>
      i === target
        ? {
            ...item,
            status: "completed" as const,
            remainingSeconds: 0,
            elapsedSeconds: Math.max(item.elapsedSeconds, actualSeconds),
            endedAt,
            startedAt: item.startedAt ?? endedAt,
          }
        : item,
    );

    const completedCount = nextBlocks.filter((item) => item.status === "completed").length;
    const allDone = completedCount === nextBlocks.length;

    const dayEntries = history.filter((entry) => entry.date === session.date);
    const dayTotalSeconds =
      dayEntries.reduce((sum, entry) => sum + entry.actualSeconds, 0) + actualSeconds;

    const entry: HistoryEntry = {
      id: createId(),
      date: session.date,
      languageId: block.languageId,
      languageName: languageName(settings, block.languageId),
      plannedSeconds: block.plannedSeconds,
      actualSeconds,
      status,
      startedAt: block.startedAt ?? endedAt,
      endedAt,
      dayTotalSeconds,
      dayCompletedBlocks: completedCount,
    };

    const nextHistory = [entry, ...history].slice(0, 500);
    const nextSession: DaySession = {
      ...session,
      blocks: nextBlocks,
      activeIndex: null,
      completedAt: allDone ? endedAt : session.completedAt,
    };

    if (settings.soundEnabled) {
      playChime();
    }

    set({
      session: nextSession,
      history: nextHistory,
      celebration: allDone,
    });
    persist({ settings, session: nextSession, history: nextHistory });
  },

  nextBlock: () => {
    const { session } = get();
    const nextIndex = session.blocks.findIndex(
      (block, index) =>
        index > (session.activeIndex ?? -1) &&
        (block.status === "pending" || block.status === "paused"),
    );

    if (nextIndex >= 0) {
      get().startBlock(nextIndex);
      return;
    }

    const firstPending = session.blocks.findIndex(
      (block) => block.status === "pending" || block.status === "paused",
    );
    if (firstPending >= 0) get().startBlock(firstPending);
  },

  setFocusMode: (value) => {
    const { session, settings, history } = get();
    const nextSession = { ...session, focusMode: value };
    set({ session: nextSession });
    persist({ settings, session: nextSession, history });
  },

  updateLanguageMinutes: (id, minutes) => {
    const safeMinutes = Math.min(90, Math.max(1, Math.round(minutes)));
    const { settings, session, history } = get();

    const nextSettings: Settings = {
      ...settings,
      languages: settings.languages.map((language) =>
        language.id === id ? { ...language, durationMinutes: safeMinutes } : language,
      ),
    };

    const nextSession: DaySession = {
      ...session,
      blocks: session.blocks.map((block) => {
        if (block.languageId !== id) return block;
        if (block.status === "completed" || block.status === "active" || block.status === "paused") {
          return block;
        }
        const plannedSeconds = safeMinutes * 60;
        return {
          ...block,
          plannedSeconds,
          remainingSeconds: plannedSeconds,
          elapsedSeconds: 0,
        };
      }),
    };

    set({ settings: nextSettings, session: nextSession });
    persist({ settings: nextSettings, session: nextSession, history });
  },

  setSoundEnabled: (value) => {
    const { settings, session, history } = get();
    const nextSettings = { ...settings, soundEnabled: value };
    set({ settings: nextSettings });
    persist({ settings: nextSettings, session, history });
  },

  setFocusModeDefault: (value) => {
    const { settings, session, history } = get();
    const nextSettings = { ...settings, focusModeDefault: value };
    set({ settings: nextSettings });
    persist({ settings: nextSettings, session, history });
  },

  resetToday: () => {
    const { settings, history } = get();
    const nextSession = createDaySession(settings);
    set({ session: nextSession, celebration: false });
    persist({ settings, session: nextSession, history });
  },

  clearHistory: () => {
    const { settings, session } = get();
    set({ history: [] });
    persist({ settings, session, history: [] });
  },

  dismissCelebration: () => set({ celebration: false }),
}));
