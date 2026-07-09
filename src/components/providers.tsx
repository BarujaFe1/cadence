"use client";

import { useEffect } from "react";
import { useCadenceStore } from "@/store/use-cadence-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useCadenceStore((state) => state.hydrate);
  const tick = useCadenceStore((state) => state.tick);
  const hydrated = useCadenceStore((state) => state.hydrated);
  const activeIndex = useCadenceStore((state) => state.session.activeIndex);
  const blocks = useCadenceStore((state) => state.session.blocks);
  const startBlock = useCadenceStore((state) => state.startBlock);
  const pauseBlock = useCadenceStore((state) => state.pauseBlock);
  const resumeBlock = useCadenceStore((state) => state.resumeBlock);
  const completeBlock = useCadenceStore((state) => state.completeBlock);
  const nextBlock = useCadenceStore((state) => state.nextBlock);
  const setFocusMode = useCadenceStore((state) => state.setFocusMode);
  const focusMode = useCadenceStore((state) => state.session.focusMode);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated || activeIndex === null) return;
    const block = blocks[activeIndex];
    if (!block || block.status !== "active") return;

    const id = window.setInterval(() => tick(), 1000);
    return () => window.clearInterval(id);
  }, [hydrated, activeIndex, blocks, tick]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        if (activeIndex === null) {
          startBlock();
          return;
        }
        const block = blocks[activeIndex];
        if (block?.status === "active") pauseBlock();
        else if (block?.status === "paused") resumeBlock();
        else startBlock();
      }

      if (event.key === "n" || event.key === "N") {
        event.preventDefault();
        nextBlock();
      }

      if (event.key === "c" || event.key === "C") {
        event.preventDefault();
        completeBlock();
      }

      if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        setFocusMode(!focusMode);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    activeIndex,
    blocks,
    startBlock,
    pauseBlock,
    resumeBlock,
    completeBlock,
    nextBlock,
    setFocusMode,
    focusMode,
  ]);

  return <>{children}</>;
}
