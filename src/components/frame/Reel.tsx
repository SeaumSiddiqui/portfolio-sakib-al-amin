"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Media from "@/components/Media";
import { getLenis } from "@/components/SmoothScroll";
import type { Media as MediaType } from "@/lib/types";

type ReelState = { media: MediaType; title: string } | null;

const ReelContext = createContext<(media: MediaType | null | undefined, title: string) => void>(() => {});

/** Opens any film full-screen: the showreel chip and project heroes both use it. */
export function useReel() {
  return useContext(ReelContext);
}

export function ReelProvider({ children }: { children: ReactNode }) {
  const [reel, setReel] = useState<ReelState>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((media: MediaType | null | undefined, title: string) => {
    if (!media) return;
    returnFocus.current = document.activeElement as HTMLElement;
    setReel({ media, title });
  }, []);

  const close = useCallback(() => {
    setReel(null);
    returnFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (!reel) return;
    getLenis()?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
    };
  }, [reel, close]);

  return (
    <ReelContext.Provider value={open}>
      {children}
      {reel && (
        <div role="dialog" aria-modal="true" aria-label={reel.title} className="fixed inset-0 z-[80] flex flex-col bg-ink p-[var(--gutter)] text-on-ink">
          <div className="flex items-center justify-between pb-[var(--gutter)]">
            <span className="label text-muted-dark">{reel.title}</span>
            <button ref={closeRef} type="button" onClick={close} className="label min-h-11 px-2">
              Close ×
            </button>
          </div>
          <Media media={reel.media} controls label={reel.title} className="flex-1 rounded-sm" sizes="100vw" />
          {!reel.media.videoUrl && (
            <p className="label pt-3 text-muted-dark">Add the film in Sanity to play it here.</p>
          )}
        </div>
      )}
    </ReelContext.Provider>
  );
}
