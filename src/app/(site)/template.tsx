"use client";

import { useEffect, useRef } from "react";
import { duration, gsap, prefersReducedMotion, setupMotion } from "@/lib/motion";

/**
 * Every route change fades the new page in. Opacity only: a transform here
 * would become the containing block for the pages' fixed-position layers.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setupMotion();
    if (!ref.current || prefersReducedMotion()) return;
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: duration("base"), ease: "expo", clearProps: "opacity" });
  }, []);

  return <div ref={ref}>{children}</div>;
}
