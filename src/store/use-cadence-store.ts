"use client";

import { create } from "zustand";
import { createDaySession, DEFAULT_SETTINGS } from "@/lib/defaults";
import {
  findNextRunnableIndex,
  resolveActualSeconds,
  resolveHistoryStatus,
} from "@/lib/domain";
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
  flushPersist: () => void;
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
  loadDemoData: () => void;
}

let lastPersistAt = 0;
const PERSIST_THROTTLE_MS = 4000;

function persist(
  partial: {
    settings: Settings;
    session: DaySession;
    history: HistoryEntry[];
  },
  options: { force?: boolean } = {},
) {
  const now = Date.now();
  if (!options.force && now - lastPersistAt < PERSIST_THROTTLE_MS) {
    return;
  }
  lastPersistAt = now;
  saveState({
    ...partial,
    lastActiveDate: todayKey(),
  });
}

function languageName(settings: Settings, id: LanguageId) {
  return settings.languages.find((language) => language.id === id)?.namePt ?? id;
}

function buildDemoHistory(): HistoryEntry[] {
  const formatLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const day = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() - 1);
    }
    return formatLocal(d);
  };

  const langs: Array<{ id: LanguageId; name: string; planned: number }> = [
    { id: "en", name: "Inglês", planned: 600 },
    { id: "fr", name: "Francês", planned: 480 },
    { id: "de", name: "Alemão", planned: 720 },
    { id: "es", name: "Espanhol", planned: 600 },
  ];

  const entries: HistoryEntry[] = [];
  for (const offset of [1, 2, 3]) {
    const date = day(offset);
    langs.forEach((lang, index) => {
      const started = new Date(`${date}T08:${String(10 + index * 12).padStart(2, "0")}:00`);
      const ended = new Date(started.getTime() + lang.planned * 1000);
      entries.push({
        id: `demo_${date}_${lang.id}`,
        date,
        languageId: lang.id,
        languageName: lang.name,
        plannedSeconds: lang.planned,
        actualSeconds: lang.planned,
        status: "completed",
        startedAt: started.toISOString(),
        endedAt: ended.toISOString(),
        dayTotalSeconds: langs.reduce((s, l) => s + l.planned, 0),
        dayCompletedBlocks: 4,
      });
    });
  }

  return entries;
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

  flushPersist: () => {
    const { settings, session, history } = get();
    persist({ settings, session, history }, { force: true });
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
        : findNextRunnableIndex(session.blocks);

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
    persist({ settings, session: nextSession, history }, { force: true });
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
    persist({ settings, session: nextSession, history }, { force: true });
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

    set({ session: nextSession, celebration: false });
    persist({ settings, session: nextSession, history }, { force: true });
  },

  completeBlock: (index, manual = true) => {
    const { session, settings, history } = get();
    const target = typeof index === "number" ? index : session.activeIndex;
    if (target === null || target < 0) return;

    const block = session.blocks[target];
    if (!block || block.status === "completed") return;

    const endedAt = new Date().toISOString();
    const actualSeconds = resolveActualSeconds({
      manual,
      elapsedSeconds: block.elapsedSeconds,
      plannedSeconds: block.plannedSeconds,
      remainingSeconds: block.remainingSeconds,
    });
    const status = resolveHistoryStatus(actualSeconds, block.plannedSeconds);

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
    persist({ settings, session: nextSession, history: nextHistory }, { force: true });
  },

  nextBlock: () => {
    const { session } = get();
    const nextIndex = findNextRunnableIndex(
      session.blocks,
      session.activeIndex ?? -1,
    );
    if (nextIndex >= 0) get().startBlock(nextIndex);
  },

  setFocusMode: (value) => {
    const { session, settings, history } = get();
    const nextSession = { ...session, focusMode: value };
    set({ session: nextSession });
    persist({ settings, session: nextSession, history }, { force: true });
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
    persist({ settings: nextSettings, session: nextSession, history }, { force: true });
  },

  setSoundEnabled: (value) => {
    const { settings, session, history } = get();
    const nextSettings = { ...settings, soundEnabled: value };
    set({ settings: nextSettings });
    persist({ settings: nextSettings, session, history }, { force: true });
  },

  setFocusModeDefault: (value) => {
    const { settings, session, history } = get();
    const nextSettings = { ...settings, focusModeDefault: value };
    set({ settings: nextSettings });
    persist({ settings: nextSettings, session, history }, { force: true });
  },

  resetToday: () => {
    const { settings, history } = get();
    const nextSession = createDaySession(settings);
    set({ session: nextSession, celebration: false });
    persist({ settings, session: nextSession, history }, { force: true });
  },

  clearHistory: () => {
    const { settings, session } = get();
    set({ history: [] });
    persist({ settings, session, history: [] }, { force: true });
  },

  dismissCelebration: () => set({ celebration: false }),

  loadDemoData: () => {
    const { settings, session } = get();
    const history = buildDemoHistory();
    set({ history });
    persist({ settings, session, history }, { force: true });
  },
}));
