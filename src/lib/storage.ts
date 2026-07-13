import { createDaySession, DEFAULT_SETTINGS, STORAGE_KEY } from "./defaults";
import type {
  AppPersistedState,
  DaySession,
  HistoryEntry,
  LanguageConfig,
  Settings,
} from "./types";
import { todayKey } from "./utils";

function isLanguageId(value: unknown): value is LanguageConfig["id"] {
  return value === "en" || value === "fr" || value === "de" || value === "es";
}

function sanitizeLanguages(input: unknown): LanguageConfig[] {
  if (!Array.isArray(input) || input.length !== 4) {
    return DEFAULT_SETTINGS.languages;
  }

  const sanitized = input
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Partial<LanguageConfig>;
      if (!isLanguageId(row.id)) return null;
      const fallback = DEFAULT_SETTINGS.languages[index];
      return {
        id: row.id,
        name: typeof row.name === "string" ? row.name : fallback.name,
        namePt: typeof row.namePt === "string" ? row.namePt : fallback.namePt,
        order: typeof row.order === "number" ? row.order : fallback.order,
        durationMinutes:
          typeof row.durationMinutes === "number" && row.durationMinutes > 0
            ? Math.min(90, Math.round(row.durationMinutes))
            : fallback.durationMinutes,
        accent: typeof row.accent === "string" ? row.accent : fallback.accent,
      } satisfies LanguageConfig;
    })
    .filter(Boolean) as LanguageConfig[];

  return sanitized.length === 4 ? sanitized : DEFAULT_SETTINGS.languages;
}

function sanitizeSettings(input: unknown): Settings {
  if (!input || typeof input !== "object") return DEFAULT_SETTINGS;
  const row = input as Partial<Settings>;
  return {
    languages: sanitizeLanguages(row.languages),
    soundEnabled: typeof row.soundEnabled === "boolean" ? row.soundEnabled : true,
    focusModeDefault:
      typeof row.focusModeDefault === "boolean" ? row.focusModeDefault : false,
    weekdaysOnly: typeof row.weekdaysOnly === "boolean" ? row.weekdaysOnly : true,
  };
}

function sanitizeHistory(input: unknown): HistoryEntry[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((entry): entry is HistoryEntry => {
      if (!entry || typeof entry !== "object") return false;
      const row = entry as Partial<HistoryEntry>;
      return (
        typeof row.id === "string" &&
        typeof row.date === "string" &&
        isLanguageId(row.languageId) &&
        typeof row.actualSeconds === "number"
      );
    })
    .slice(0, 500);
}

function sanitizeSession(input: unknown, settings: Settings): DaySession {
  const today = todayKey();
  if (!input || typeof input !== "object") {
    return createDaySession(settings, today);
  }
  const row = input as Partial<DaySession>;
  if (row.date !== today || !Array.isArray(row.blocks) || row.blocks.length !== 4) {
    return createDaySession(settings, today);
  }
  return {
    date: today,
    activeIndex:
      typeof row.activeIndex === "number" || row.activeIndex === null
        ? row.activeIndex
        : null,
    completedAt: typeof row.completedAt === "string" ? row.completedAt : null,
    focusMode: typeof row.focusMode === "boolean" ? row.focusMode : settings.focusModeDefault,
    blocks: row.blocks.map((block, index) => {
      const fallback = createDaySession(settings, today).blocks[index];
      if (!block || typeof block !== "object") return fallback;
      return {
        languageId: isLanguageId(block.languageId) ? block.languageId : fallback.languageId,
        plannedSeconds:
          typeof block.plannedSeconds === "number"
            ? block.plannedSeconds
            : fallback.plannedSeconds,
        remainingSeconds:
          typeof block.remainingSeconds === "number"
            ? block.remainingSeconds
            : fallback.remainingSeconds,
        elapsedSeconds:
          typeof block.elapsedSeconds === "number" ? block.elapsedSeconds : 0,
        status: block.status ?? "pending",
        startedAt: typeof block.startedAt === "string" ? block.startedAt : null,
        endedAt: typeof block.endedAt === "string" ? block.endedAt : null,
      };
    }),
  };
}

export function getDefaultState(): AppPersistedState {
  return {
    settings: DEFAULT_SETTINGS,
    session: createDaySession(),
    history: [],
    lastActiveDate: todayKey(),
  };
}

export function loadState(): AppPersistedState {
  if (typeof window === "undefined") {
    return getDefaultState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();

    const parsed = JSON.parse(raw) as Partial<AppPersistedState>;
    const settings = sanitizeSettings(parsed.settings);
    const session = sanitizeSession(parsed.session, settings);
    const history = sanitizeHistory(parsed.history);

    return {
      settings,
      session,
      history,
      lastActiveDate: todayKey(),
    };
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: AppPersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota / private mode — fail soft.
  }
}
