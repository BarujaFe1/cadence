import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  isToday,
  isYesterday,
  parseISO,
  startOfWeek,
  eachDayOfInterval,
  endOfWeek,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { HistoryEntry, LanguageId, SessionBlock } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function todayKey(date = new Date()) {
  return format(date, "yyyy-MM-dd");
}

export function formatDuration(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatMinutesLabel(minutes: number) {
  return minutes === 1 ? "1 min" : `${minutes} min`;
}

export function formatClock(iso: string | null) {
  if (!iso) return "—";
  return format(parseISO(iso), "HH:mm");
}

function capitalizePt(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatFriendlyDate(dateKey: string) {
  const date = parseISO(dateKey);
  if (isToday(date)) return "Hoje";
  if (isYesterday(date)) return "Ontem";
  return capitalizePt(format(date, "EEEE, d MMM", { locale: ptBR }));
}

export function formatLongDate(dateKey: string) {
  return capitalizePt(
    format(parseISO(dateKey), "EEEE, d 'de' MMMM", { locale: ptBR }),
  );
}

export function weekdayLabel(date = new Date()) {
  return capitalizePt(format(date, "EEEE", { locale: ptBR }));
}

export function isStudyDay(date = new Date(), weekdaysOnly = true) {
  if (!weekdaysOnly) return true;
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

export function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function progressRatio(block: SessionBlock) {
  if (block.plannedSeconds <= 0) return 0;
  return Math.min(1, block.elapsedSeconds / block.plannedSeconds);
}

export function sessionProgress(blocks: SessionBlock[]) {
  const planned = blocks.reduce((sum, block) => sum + block.plannedSeconds, 0);
  const elapsed = blocks.reduce((sum, block) => sum + block.elapsedSeconds, 0);
  const completed = blocks.filter((block) => block.status === "completed").length;
  return {
    planned,
    elapsed,
    completed,
    total: blocks.length,
    ratio: planned > 0 ? Math.min(1, elapsed / planned) : 0,
  };
}

export function computeStreak(history: HistoryEntry[], today = todayKey()) {
  const completedDays = new Set(
    history
      .filter((entry) => entry.status === "completed")
      .map((entry) => entry.date),
  );

  if (completedDays.size === 0) return 0;

  let cursor = parseISO(today);
  // If today has no completion yet, start from yesterday so streak doesn't break mid-day.
  if (!completedDays.has(todayKey(cursor))) {
    cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
  }

  let streak = 0;
  while (true) {
    const key = todayKey(cursor);
    const day = cursor.getDay();
    const isWeekend = day === 0 || day === 6;

    if (isWeekend) {
      cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
      continue;
    }

    if (!completedDays.has(key)) break;
    streak += 1;
    cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
  }

  return streak;
}

export function weekDays(date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function weeklyTotals(history: HistoryEntry[], date = new Date()) {
  const days = weekDays(date);
  return days.map((day) => {
    const key = todayKey(day);
    const entries = history.filter((entry) => entry.date === key);
    const seconds = entries.reduce((sum, entry) => sum + entry.actualSeconds, 0);
    const completedBlocks = entries.filter((entry) => entry.status === "completed").length;
    return {
      date: key,
      label: format(day, "EEE", { locale: ptBR }),
      seconds,
      completedBlocks,
      isToday: isSameDay(day, date),
      isWeekend: day.getDay() === 0 || day.getDay() === 6,
    };
  });
}

export function totalsByLanguage(history: HistoryEntry[]) {
  const map = new Map<LanguageId, number>();
  for (const entry of history) {
    map.set(entry.languageId, (map.get(entry.languageId) ?? 0) + entry.actualSeconds);
  }
  return map;
}

export function playChime() {
  if (typeof window === "undefined") return;

  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02 + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35 + index * 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + index * 0.08);
      osc.stop(now + 0.45 + index * 0.08);
    });

    window.setTimeout(() => {
      void ctx.close();
    }, 900);
  } catch {
    // Audio is optional; ignore failures.
  }
}
