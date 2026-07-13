"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const ONBOARDING_KEY = "cadence.onboarding.v1";

export function OnboardingTip() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(ONBOARDING_KEY)) {
        setOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!open) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(ONBOARDING_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-4 sm:p-6">
      <div className="glass mx-auto flex max-w-xl flex-col gap-4 rounded-[24px] px-5 py-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">Bem-vindo</p>
          <p className="display mt-1 text-2xl text-ink">Um idioma de cada vez</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Comece a rotina, pause quando precisar e avance pelos quatro blocos.
            Atalhos: Espaço, N, C, F.
          </p>
        </div>
        <Button onClick={dismiss} className="shrink-0">
          Entendi
        </Button>
      </div>
    </div>
  );
}
