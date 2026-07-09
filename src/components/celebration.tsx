"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCadenceStore } from "@/store/use-cadence-store";

export function Celebration() {
  const celebration = useCadenceStore((state) => state.celebration);
  const dismissCelebration = useCadenceStore((state) => state.dismissCelebration);
  const setFocusMode = useCadenceStore((state) => state.setFocusMode);

  return (
    <AnimatePresence>
      {celebration ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass w-full max-w-md rounded-[28px] px-8 py-10 text-center"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm uppercase tracking-[0.22em] text-ink-muted">
              Rotina completa
            </p>
            <h2 className="display mt-3 text-4xl text-ink">Dia bem feito.</h2>
            <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              Quatro idiomas, um ritmo. Sua consistência é o que transforma minutos
              em fluência.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setFocusMode(false);
                  dismissCelebration();
                }}
              >
                Fechar
              </Button>
              <Button onClick={dismissCelebration}>Continuar</Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
