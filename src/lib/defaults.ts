import type { DaySession, LanguageConfig, Settings } from "./types";
import { todayKey } from "./utils";

export const DEFAULT_LANGUAGES: LanguageConfig[] = [
  {
    id: "en",
    name: "English",
    namePt: "Inglês",
    order: 1,
    durationMinutes: 10,
    accent: "#5B7CFF",
  },
  {
    id: "fr",
    name: "Français",
    namePt: "Francês",
    order: 2,
    durationMinutes: 8,
    accent: "#C45C7A",
  },
  {
    id: "de",
    name: "Deutsch",
    namePt: "Alemão",
    order: 3,
    durationMinutes: 12,
    accent: "#3D8B7A",
  },
  {
    id: "es",
    name: "Español",
    namePt: "Espanhol",
    order: 4,
    durationMinutes: 10,
    accent: "#C47A3D",
  },
];

export const DEFAULT_SETTINGS: Settings = {
  languages: DEFAULT_LANGUAGES,
  soundEnabled: true,
  focusModeDefault: false,
  weekdaysOnly: true,
};

export function createDaySession(
  settings: Settings = DEFAULT_SETTINGS,
  date = todayKey(),
): DaySession {
  return {
    date,
    activeIndex: null,
    completedAt: null,
    focusMode: settings.focusModeDefault,
    blocks: [...settings.languages]
      .sort((a, b) => a.order - b.order)
      .map((language) => ({
        languageId: language.id,
        plannedSeconds: language.durationMinutes * 60,
        remainingSeconds: language.durationMinutes * 60,
        elapsedSeconds: 0,
        status: "pending" as const,
        startedAt: null,
        endedAt: null,
      })),
  };
}

export const STORAGE_KEY = "cadence.v1";
