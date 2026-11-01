"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, setupMotion } from "@/lib/motion";

let lenis: Lenis | null = null;

/** The active Lenis instance, so overlays can pause page scrolling. */
export function getLenis() {
  return lenis;
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    setupMotion();
    if (prefersReducedMotion()) return;

    lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
