export type LanguageId = "en" | "fr" | "de" | "es";

export type BlockStatus =
  | "idle"
  | "ready"
  | "running"
  | "paused"
  | "completed"
  | "interrupted"
  | "partial";

export type SessionBlockStatus =
  | "pending"
  | "active"
  | "paused"
  | "completed"
  | "skipped"
  | "interrupted";

export interface LanguageConfig {
  id: LanguageId;
  name: string;
  namePt: string;
  order: number;
  durationMinutes: number;
  accent: string;
}

export interface Settings {
  languages: LanguageConfig[];
  soundEnabled: boolean;
  focusModeDefault: boolean;
  weekdaysOnly: boolean;
}

export interface SessionBlock {
  languageId: LanguageId;
  plannedSeconds: number;
  remainingSeconds: number;
  elapsedSeconds: number;
  status: SessionBlockStatus;
  startedAt: string | null;
  endedAt: string | null;
}

export interface DaySession {
  date: string;
  blocks: SessionBlock[];
  activeIndex: number | null;
  completedAt: string | null;
  focusMode: boolean;
}

export interface HistoryEntry {
  id: string;
  date: string;
  languageId: LanguageId;
  languageName: string;
  plannedSeconds: number;
  actualSeconds: number;
  status: "completed" | "interrupted" | "partial";
  startedAt: string;
  endedAt: string;
  dayTotalSeconds: number;
  dayCompletedBlocks: number;
}

export interface AppPersistedState {
  settings: Settings;
  session: DaySession;
  history: HistoryEntry[];
  lastActiveDate: string;
}
