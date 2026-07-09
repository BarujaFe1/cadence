"use client";

import { useMemo, useState } from "react";
import { formatDuration, formatFriendlyDate, formatClock, totalsByLanguage, weeklyTotals, computeStreak } from "@/lib/utils";
import type { HistoryEntry, LanguageId } from "@/lib/types";
import { useCadenceStore } from "@/store/use-cadence-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Filter = "all" | LanguageId;
type ViewMode = "day" | "language";

const statusLabel: Record<HistoryEntry["status"], string> = {
  completed: "Concluído",
  partial: "Parcial",
  interrupted: "Interrompido",
};

export function HistoryView() {
  const hydrated = useCadenceStore((state) => state.hydrated);
  const history = useCadenceStore((state) => state.history);
  const settings = useCadenceStore((state) => state.settings);
  const clearHistory = useCadenceStore((state) => state.clearHistory);

  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<ViewMode>("day");

  const filtered = useMemo(() => {
    if (filter === "all") return history;
    return history.filter((entry) => entry.languageId === filter);
  }, [history, filter]);

  const byDay = useMemo(() => {
    const map = new Map<string, HistoryEntry[]>();
    for (const entry of filtered) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    return [...map.entries()];
  }, [filtered]);

  const byLanguage = useMemo(() => {
    const map = new Map<LanguageId, HistoryEntry[]>();
    for (const entry of filtered) {
      const list = map.get(entry.languageId) ?? [];
      list.push(entry);
      map.set(entry.languageId, list);
    }
    return [...map.entries()];
  }, [filtered]);

  const week = weeklyTotals(history);
  const languageTotals = totalsByLanguage(history);
  const streak = computeStreak(history);
  const totalSeconds = history.reduce((sum, entry) => sum + entry.actualSeconds, 0);
  const weekSeconds = week.reduce((sum, day) => sum + day.seconds, 0);
  const maxWeek = Math.max(...week.map((day) => day.seconds), 1);

  if (!hydrated) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center px-4">
        <div className="h-10 w-10 rounded-full border border-line border-t-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <section className="mb-10 max-w-xl">
        <p className="text-sm uppercase tracking-[0.22em] text-ink-muted">Histórico</p>
        <h1 className="display mt-3 text-4xl text-ink sm:text-5xl">Seu ritmo</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          Cada bloco fica registrado. Veja consistência, totais e o que você já construiu.
        </p>
      </section>

      <section className="mb-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Streak" value={`${streak} dias`} />
        <Stat label="Esta semana" value={formatDuration(weekSeconds)} />
        <Stat label="Total acumulado" value={formatDuration(totalSeconds)} />
      </section>

      <section className="glass mb-10 rounded-[28px] px-5 py-6 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="display text-2xl text-ink">Semana</h2>
            <p className="mt-1 text-sm text-ink-muted">Progresso simples, sem ruído</p>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {week.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-2">
              <div className="flex h-28 w-full items-end rounded-2xl bg-black/[0.03] px-1.5 py-2 dark:bg-white/[0.03]">
                <div
                  className={cn(
                    "w-full rounded-xl transition-all",
                    day.isToday ? "bg-accent" : "bg-ink/25 dark:bg-ink/40",
                    day.isWeekend && "opacity-40",
                  )}
                  style={{ height: `${Math.max(8, (day.seconds / maxWeek) * 100)}%` }}
                  title={formatDuration(day.seconds)}
                />
              </div>
              <span className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                {day.label}
              </span>
            </div>
          ))}
        </div>

        <div className="soft-divider my-6" />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {settings.languages.map((language) => (
            <div key={language.id} className="rounded-2xl border border-line px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: language.accent }}
                />
                <p className="text-sm text-ink">{language.namePt}</p>
              </div>
              <p className="timer-digits mt-2 text-xl text-ink">
                {formatDuration(languageTotals.get(language.id) ?? 0)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            Todos
          </FilterChip>
          {settings.languages.map((language) => (
            <FilterChip
              key={language.id}
              active={filter === language.id}
              onClick={() => setFilter(language.id)}
            >
              {language.namePt}
            </FilterChip>
          ))}
        </div>

        <div className="flex gap-2">
          <FilterChip active={view === "day"} onClick={() => setView("day")}>
            Por dia
          </FilterChip>
          <FilterChip active={view === "language"} onClick={() => setView("language")}>
            Por idioma
          </FilterChip>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="glass rounded-[28px] px-6 py-16 text-center">
          <p className="display text-2xl text-ink">Ainda sem registros</p>
          <p className="mx-auto mt-3 max-w-sm text-sm text-ink-soft">
            Complete seu primeiro bloco na tela Hoje. O histórico aparece aqui automaticamente.
          </p>
        </div>
      ) : view === "day" ? (
        <div className="space-y-6">
          {byDay.map(([date, entries]) => {
            const daySeconds = entries.reduce((sum, entry) => sum + entry.actualSeconds, 0);
            const completed = entries.filter((entry) => entry.status === "completed").length;
            return (
              <div key={date} className="glass rounded-[28px] px-5 py-5 sm:px-6">
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="display text-2xl capitalize text-ink">
                      {formatFriendlyDate(date)}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">
                      {completed} concluídos · {formatDuration(daySeconds)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <HistoryRow key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {byLanguage.map(([languageId, entries]) => {
            const language = settings.languages.find((item) => item.id === languageId);
            const seconds = entries.reduce((sum, entry) => sum + entry.actualSeconds, 0);
            return (
              <div key={languageId} className="glass rounded-[28px] px-5 py-5 sm:px-6">
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: language?.accent }}
                  />
                  <div>
                    <h3 className="display text-2xl text-ink">
                      {language?.namePt ?? languageId}
                    </h3>
                    <p className="text-sm text-ink-muted">
                      {entries.length} sessões · {formatDuration(seconds)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <HistoryRow key={entry.id} entry={entry} showLanguage={false} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {history.length > 0 ? (
        <div className="mt-10 flex justify-center">
          <Button variant="ghost" onClick={clearHistory}>
            Limpar histórico
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-[24px] px-5 py-4">
      <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">{label}</p>
      <p className="timer-digits mt-2 text-2xl text-ink">{value}</p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm transition-colors",
        active
          ? "bg-ink text-canvas dark:bg-accent dark:text-[#0e0f10]"
          : "border border-line text-ink-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function HistoryRow({
  entry,
  showLanguage = true,
}: {
  entry: HistoryEntry;
  showLanguage?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-line/70 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">
          {showLanguage ? entry.languageName : formatFriendlyDate(entry.date)}
        </p>
        <p className="mt-0.5 text-xs text-ink-muted">
          {formatClock(entry.startedAt)} – {formatClock(entry.endedAt)} ·{" "}
          {statusLabel[entry.status]}
        </p>
      </div>
      <div className="text-right">
        <p className="timer-digits text-sm text-ink">{formatDuration(entry.actualSeconds)}</p>
        <p className="text-[11px] text-ink-muted">
          de {formatDuration(entry.plannedSeconds)}
        </p>
      </div>
    </div>
  );
}
