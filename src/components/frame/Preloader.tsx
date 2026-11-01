"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, setupMotion } from "@/lib/motion";

const glyphs = ["◐", "◓", "◑", "◒"];

/** Shown on a full page load: a cycling tile and a counter, then it lifts away. */
export default function Preloader({ monogram }: { monogram: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [glyph, setGlyph] = useState(monogram);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setupMotion();
    const root = rootRef.current;
    if (!root) return;
    const fast = prefersReducedMotion();
    const progress = { value: 0 };
    let i = 0;
    const spin = window.setInterval(() => setGlyph(glyphs[i++ % glyphs.length]), 140);

    let cancelled = false;
    const finish = () => {
      if (cancelled) return;
      window.clearInterval(spin);
      setGlyph(monogram);
      gsap.to(root, { yPercent: fast ? 0 : -100, opacity: fast ? 0 : 1, duration: fast ? 0.2 : 0.9, ease: "quart", delay: 0.15, onComplete: () => setDone(true) });
    };

    // Wait for fonts (so the first frame is set in the right type), not for every video.
    const tween = gsap.to(progress, {
      value: 100,
      duration: fast ? 0.2 : 1.1,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(progress.value)),
      onComplete: () => void document.fonts.ready.then(finish),
    });

    // Background tabs throttle animation frames; never hold the page behind the loader.
    const safety = window.setTimeout(() => setDone(true), 4000);

    return () => {
      cancelled = true;
      tween.kill();
      window.clearInterval(spin);
      window.clearTimeout(safety);
    };
  }, [monogram]);

  if (done) return null;

  return (
    <div ref={rootRef} className="preloader fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-canvas" aria-hidden="true">
      <div className="grid h-14 w-14 place-items-center rounded-sm bg-ink font-mono text-[15px] font-bold text-on-ink">{glyph}</div>
      <div className="w-[200px]">
        <div className="h-px bg-hairline">
          <div className="h-px bg-ink" style={{ width: `${count}%` }} />
        </div>
        <p className="label mt-2 text-muted tabular-nums">{String(count).padStart(3, "0")}%</p>
      </div>
    </div>
  );
}
