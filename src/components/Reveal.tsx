"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { duration, gsap, prefersReducedMotion, ScrollTrigger, setupMotion } from "@/lib/motion";

type Props = { children: ReactNode; as?: ElementType; className?: string; delay?: number; "aria-labelledby"?: string };

/** Fades and lifts its content in the first time it scrolls into view. */
export default function Reveal({ children, as: Tag = "div", className, delay = 0, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setupMotion();
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: duration("slow"),
        ease: "expo",
        delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay]);

  useEffect(() => () => ScrollTrigger.refresh(), []);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
