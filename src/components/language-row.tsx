"use client";

import { Check, Pause, Play, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { LanguageConfig, SessionBlock } from "@/lib/types";
import { cn, formatDuration, formatMinutesLabel, progressRatio } from "@/lib/utils";

interface LanguageRowProps {
  language: LanguageConfig;
  block: SessionBlock;
  index: number;
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onComplete: () => void;
}

const statusLabel: Record<SessionBlock["status"], string> = {
  pending: "Aguardando",
  active: "Em foco",
  paused: "Pausado",
  completed: "Concluído",
  skipped: "Pulado",
  interrupted: "Interrompido",
};

export function LanguageRow({
  language,
  block,
  index,
  isActive,
  onStart,
  onPause,
  onReset,
  onComplete,
}: LanguageRowProps) {
  const progress = progressRatio(block);
  const done = block.status === "completed";

  return (
    <motion.div
      layout
      className={cn(
        "rounded-[24px] border px-4 py-4 transition-colors sm:px-5",
        isActive
          ? "border-transparent bg-white/70 shadow-[0_18px_40px_rgba(28,27,26,0.06)] dark:bg-white/[0.04]"
          : "border-line/80 bg-transparent hover:bg-white/40 dark:hover:bg-white/[0.02]",
        done && "opacity-80",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium text-white"
              style={{ backgroundColor: language.accent }}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <div>
              <p className="text-[15px] font-medium text-ink">{language.namePt}</p>
              <p className="text-sm text-ink-muted">
                {language.name} · {formatMinutesLabel(language.durationMinutes)}
              </p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="timer-digits text-lg text-ink">
            {done
              ? formatDuration(block.elapsedSeconds)
              : formatDuration(block.remainingSeconds)}
          </p>
          <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">
            {statusLabel[block.status]}
          </p>
        </div>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-line">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: language.accent }}
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {block.status === "active" ? (
          <Button size="sm" variant="secondary" onClick={onPause}>
            <Pause className="h-3.5 w-3.5" />
            Pausar
          </Button>
        ) : (
          <Button size="sm" onClick={onStart} disabled={done}>
            <Play className="h-3.5 w-3.5" />
            {block.status === "paused" ? "Continuar" : "Iniciar"}
          </Button>
        )}

        <Button size="sm" variant="ghost" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reiniciar
        </Button>

        {!done ? (
          <Button size="sm" variant="soft" onClick={onComplete}>
            Concluir
          </Button>
        ) : null}
      </div>
    </motion.div>
  );
}
