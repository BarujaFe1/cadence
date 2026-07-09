"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Focus,
  Pause,
  Play,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Celebration } from "@/components/celebration";
import { LanguageRow } from "@/components/language-row";
import { ProgressRing } from "@/components/progress-ring";
import { Button } from "@/components/ui/button";
import {
  computeStreak,
  formatDuration,
  formatLongDate,
  formatMinutesLabel,
  isStudyDay,
  sessionProgress,
  weekdayLabel,
} from "@/lib/utils";
import { useCadenceStore } from "@/store/use-cadence-store";

export function TodayView() {
  const hydrated = useCadenceStore((state) => state.hydrated);
  const settings = useCadenceStore((state) => state.settings);
  const session = useCadenceStore((state) => state.session);
  const history = useCadenceStore((state) => state.history);
  const startBlock = useCadenceStore((state) => state.startBlock);
  const pauseBlock = useCadenceStore((state) => state.pauseBlock);
  const resumeBlock = useCadenceStore((state) => state.resumeBlock);
  const resetBlock = useCadenceStore((state) => state.resetBlock);
  const completeBlock = useCadenceStore((state) => state.completeBlock);
  const nextBlock = useCadenceStore((state) => state.nextBlock);
  const setFocusMode = useCadenceStore((state) => state.setFocusMode);
  const setSoundEnabled = useCadenceStore((state) => state.setSoundEnabled);

  if (!hydrated) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center px-4">
        <div className="h-10 w-10 rounded-full border border-line border-t-accent animate-spin" />
      </div>
    );
  }

  const languages = [...settings.languages].sort((a, b) => a.order - b.order);
  const progress = sessionProgress(session.blocks);
  const activeIndex = session.activeIndex;
  const activeBlock = activeIndex !== null ? session.blocks[activeIndex] : null;
  const activeLanguage =
    activeBlock &&
    languages.find((language) => language.id === activeBlock.languageId);
  const nextPending = session.blocks.findIndex(
    (block) => block.status === "pending" || block.status === "paused",
  );
  const streak = computeStreak(history);
  const studyDay = isStudyDay(new Date(), settings.weekdaysOnly);
  const totalMinutes = languages.reduce(
    (sum, language) => sum + language.durationMinutes,
    0,
  );

  const heroProgress = activeBlock
    ? activeBlock.elapsedSeconds / Math.max(1, activeBlock.plannedSeconds)
    : progress.ratio;

  return (
    <>
      <div
        className={
          session.focusMode
            ? "mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6"
            : "mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6"
        }
      >
        <section className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-ink-muted">
              {weekdayLabel()}
            </p>
            <h1 className="display mt-3 text-4xl leading-none text-ink sm:text-5xl">
              Cadence
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
              {studyDay
                ? "Sua rotina de idiomas, em quatro blocos serenos. Comece quando estiver pronto."
                : "Hoje é descanso na rotina padrão. Você ainda pode estudar se quiser."}
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              {formatLongDate(session.date)} · {formatMinutesLabel(totalMinutes)} no total
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-line px-3.5 py-2 text-sm text-ink-soft">
              Streak <span className="font-medium text-ink">{streak}d</span>
            </div>
            <div className="rounded-full border border-line px-3.5 py-2 text-sm text-ink-soft">
              {progress.completed}/{progress.total} blocos
            </div>
            <Button
              size="sm"
              variant={session.focusMode ? "primary" : "secondary"}
              onClick={() => setFocusMode(!session.focusMode)}
            >
              <Focus className="h-3.5 w-3.5" />
              Foco
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSoundEnabled(!settings.soundEnabled)}
              aria-label="Alternar som"
            >
              {settings.soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="glass rounded-[32px] px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col items-center">
              <ProgressRing
                progress={heroProgress}
                size={280}
                stroke={5}
                color={activeLanguage?.accent ?? "var(--accent)"}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
                  {activeLanguage?.namePt ??
                    (progress.completed === progress.total
                      ? "Concluído"
                      : "Próximo")}
                </p>
                <p className="timer-digits display mt-2 text-6xl text-ink sm:text-7xl">
                  {activeBlock
                    ? formatDuration(activeBlock.remainingSeconds)
                    : formatDuration(
                        session.blocks
                          .filter((block) => block.status !== "completed")
                          .reduce((sum, block) => sum + block.remainingSeconds, 0),
                      )}
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  {activeBlock
                    ? `${formatDuration(activeBlock.elapsedSeconds)} decorridos`
                    : `${Math.round(progress.ratio * 100)}% do dia`}
                </p>
              </ProgressRing>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {activeBlock?.status === "active" ? (
                  <Button size="lg" variant="secondary" onClick={pauseBlock}>
                    <Pause className="h-4 w-4" />
                    Pausar
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => {
                      if (activeBlock?.status === "paused") resumeBlock();
                      else if (nextPending >= 0) startBlock(nextPending);
                      else startBlock();
                    }}
                    disabled={progress.completed === progress.total}
                  >
                    <Play className="h-4 w-4" />
                    {activeBlock?.status === "paused"
                      ? "Continuar"
                      : progress.completed === 0
                        ? "Começar rotina"
                        : "Próximo bloco"}
                  </Button>
                )}

                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => completeBlock()}
                  disabled={!activeBlock || activeBlock.status === "completed"}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Concluir
                </Button>

                <Button
                  size="lg"
                  variant="soft"
                  onClick={nextBlock}
                  disabled={progress.completed === progress.total}
                >
                  <SkipForward className="h-4 w-4" />
                  Avançar
                </Button>
              </div>

              <p className="mt-6 text-center text-xs text-ink-muted">
                Atalhos: Espaço · N próximo · C concluir · F foco
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!session.focusMode ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.28 }}
                className="space-y-3"
              >
                <div className="mb-4 flex items-end justify-between px-1">
                  <div>
                    <h2 className="display text-2xl text-ink">Rotina de hoje</h2>
                    <p className="mt-1 text-sm text-ink-muted">
                      Inglês → Francês → Alemão → Espanhol
                    </p>
                  </div>
                  <p className="text-sm text-ink-soft">
                    {formatDuration(progress.elapsed)} / {formatDuration(progress.planned)}
                  </p>
                </div>

                {session.blocks.map((block, index) => {
                  const language = languages.find(
                    (item) => item.id === block.languageId,
                  );
                  if (!language) return null;

                  return (
                    <LanguageRow
                      key={block.languageId}
                      language={language}
                      block={block}
                      index={index}
                      isActive={session.activeIndex === index}
                      onStart={() => startBlock(index)}
                      onPause={pauseBlock}
                      onReset={() => resetBlock(index)}
                      onComplete={() => completeBlock(index, true)}
                    />
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="focus"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="glass flex min-h-[420px] flex-col justify-between rounded-[32px] px-6 py-8"
              >
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-ink-muted">
                    Modo foco
                  </p>
                  <h2 className="display mt-3 text-3xl text-ink">
                    {activeLanguage?.namePt ?? "Pronto para o próximo bloco"}
                  </h2>
                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                    Menos ruído, mais presença. Um idioma de cada vez.
                  </p>
                </div>

                <div className="space-y-3">
                  {session.blocks.map((block, index) => {
                    const language = languages.find(
                      (item) => item.id === block.languageId,
                    );
                    if (!language) return null;
                    return (
                      <div
                        key={block.languageId}
                        className="flex items-center justify-between border-b border-line py-3 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: language.accent }}
                          />
                          <span className="text-sm text-ink">{language.namePt}</span>
                        </div>
                        <span className="text-sm text-ink-muted">
                          {block.status === "completed"
                            ? "Feito"
                            : session.activeIndex === index
                              ? "Agora"
                              : "Depois"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
      <Celebration />
    </>
  );
}
