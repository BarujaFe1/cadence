import { createDaySession, DEFAULT_SETTINGS, STORAGE_KEY } from "./defaults";
import type { AppPersistedState } from "./types";
import { todayKey } from "./utils";

export function loadState(): AppPersistedState {
  if (typeof window === "undefined") {
    return {
      settings: DEFAULT_SETTINGS,
      session: createDaySession(),
      history: [],
      lastActiveDate: todayKey(),
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        settings: DEFAULT_SETTINGS,
        session: createDaySession(),
        history: [],
        lastActiveDate: todayKey(),
      };
    }

    const parsed = JSON.parse(raw) as AppPersistedState;
    const settings = {
      ...DEFAULT_SETTINGS,
      ...parsed.settings,
      languages:
        parsed.settings?.languages?.length === 4
          ? parsed.settings.languages
          : DEFAULT_SETTINGS.languages,
    };

    const today = todayKey();
    let session = parsed.session ?? createDaySession(settings);

    if (!session.date || session.date !== today) {
      session = createDaySession(settings, today);
    }

    return {
      settings,
      session,
      history: Array.isArray(parsed.history) ? parsed.history : [],
      lastActiveDate: today,
    };
  } catch {
    return {
      settings: DEFAULT_SETTINGS,
      session: createDaySession(),
      history: [],
      lastActiveDate: todayKey(),
    };
  }
}

export function saveState(state: AppPersistedState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
