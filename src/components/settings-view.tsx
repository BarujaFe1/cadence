"use client";

import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { formatMinutesLabel } from "@/lib/utils";
import { useCadenceStore } from "@/store/use-cadence-store";

export function SettingsView() {
  const hydrated = useCadenceStore((state) => state.hydrated);
  const settings = useCadenceStore((state) => state.settings);
  const updateLanguageMinutes = useCadenceStore((state) => state.updateLanguageMinutes);
  const setSoundEnabled = useCadenceStore((state) => state.setSoundEnabled);
  const setFocusModeDefault = useCadenceStore((state) => state.setFocusModeDefault);
  const resetToday = useCadenceStore((state) => state.resetToday);
  const loadDemoData = useCadenceStore((state) => state.loadDemoData);

  if (!hydrated) {
    return <LoadingSkeleton />;
  }

  const languages = [...settings.languages].sort((a, b) => a.order - b.order);
  const total = languages.reduce((sum, language) => sum + language.durationMinutes, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <section className="mb-10 max-w-xl">
        <p className="text-sm uppercase tracking-[0.22em] text-ink-muted">Ajustes</p>
        <h1 className="display mt-3 text-4xl text-ink sm:text-5xl">Seu tempo</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          Defina a duração de cada idioma. As mudanças salvam na hora e valem para os
          blocos ainda não iniciados.
        </p>
      </section>

      <section className="glass mb-6 rounded-[28px] px-5 py-6 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="display text-2xl text-ink">Blocos</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Total do dia: {formatMinutesLabel(total)}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {languages.map((language) => (
            <div
              key={language.id}
              className="rounded-[22px] border border-line px-4 py-4 sm:px-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: language.accent }}
                  />
                  <div>
                    <p className="text-[15px] font-medium text-ink">{language.namePt}</p>
                    <p className="text-sm text-ink-muted">{language.name}</p>
                  </div>
                </div>
                <p className="timer-digits text-xl text-ink">
                  {formatMinutesLabel(language.durationMinutes)}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={45}
                  value={language.durationMinutes}
                  onChange={(event) =>
                    updateLanguageMinutes(language.id, Number(event.target.value))
                  }
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--accent)]"
                  aria-label={`Duração de ${language.namePt}`}
                />
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={language.durationMinutes}
                  onChange={(event) =>
                    updateLanguageMinutes(language.id, Number(event.target.value))
                  }
                  className="h-10 w-16 rounded-2xl border border-line bg-transparent px-2 text-center text-sm text-ink"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass mb-6 rounded-[28px] px-5 py-6 sm:px-6">
        <h2 className="display text-2xl text-ink">Preferências</h2>
        <div className="mt-5 space-y-4">
          <ToggleRow
            title="Som ao concluir"
            description="Um chime suave quando um bloco termina."
            checked={settings.soundEnabled}
            onChange={setSoundEnabled}
          />
          <ToggleRow
            title="Abrir em modo foco"
            description="Começa o dia com a interface mais limpa."
            checked={settings.focusModeDefault}
            onChange={setFocusModeDefault}
          />
        </div>
      </section>

      <section className="glass rounded-[28px] px-5 py-6 sm:px-6">
        <h2 className="display text-2xl text-ink">Sessão</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Reinicia a rotina de hoje sem apagar o histórico. Útil se quiser recomeçar o
          dia do zero.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={resetToday}>
            Reiniciar rotina de hoje
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (
                window.confirm(
                  "Carregar dados de demonstração no histórico? Isso substitui o histórico atual.",
                )
              ) {
                loadDemoData();
              }
            }}
          >
            Carregar demo no histórico
          </Button>
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-ink-muted">
        Persistência local-first · seus dados ficam neste navegador
      </p>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[22px] border border-line px-4 py-4">
      <div>
        <p className="text-[15px] font-medium text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-line"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
