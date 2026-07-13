"use client";

import { useEffect } from "react";
import { useCadenceStore } from "@/store/use-cadence-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useCadenceStore((state) => state.hydrate);
  const tick = useCadenceStore((state) => state.tick);
  const flushPersist = useCadenceStore((state) => state.flushPersist);
  const hydrated = useCadenceStore((state) => state.hydrated);
  const activeIndex = useCadenceStore((state) => state.session.activeIndex);
  const activeStatus = useCadenceStore((state) =>
    state.session.activeIndex === null
      ? null
      : state.session.blocks[state.session.activeIndex]?.status ?? null,
  );
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

  // Stable timer: depend on activeIndex + status, NOT the blocks array
  // (blocks change every second and would reset the interval).
  useEffect(() => {
    if (!hydrated || activeIndex === null || activeStatus !== "active") return;

    const id = window.setInterval(() => tick(), 1000);
    return () => window.clearInterval(id);
  }, [hydrated, activeIndex, activeStatus, tick]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        flushPersist();
      }
    };
    const onPageHide = () => flushPersist();
    window.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      flushPersist();
    };
  }, [flushPersist]);

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

      const { session } = useCadenceStore.getState();
      const currentIndex = session.activeIndex;
      const currentBlock =
        currentIndex === null ? null : session.blocks[currentIndex];

      if (event.code === "Space") {
        event.preventDefault();
        if (currentIndex === null) {
          startBlock();
          return;
        }
        if (currentBlock?.status === "active") pauseBlock();
        else if (currentBlock?.status === "paused") resumeBlock();
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
