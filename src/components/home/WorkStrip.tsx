"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import Media from "@/components/Media";
import { duration, gsap, prefersReducedMotion, setupMotion } from "@/lib/motion";
import type { ProjectSummary } from "@/lib/types";

function token(name: string, fallback: number) {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
}

/**
 * Set by the home scene while it reveals the strip: `released` once the
 * cards can be handled, `atRest` once the reveal has fully finished.
 */
export type StripGate = { released: boolean; atRest: boolean };

const OPEN: StripGate = { released: true, atRest: true };

/**
 * Three cards on screen, edge to edge: a larger one in the centre and one
 * either side. Advances one card at a time on a timer, or by wheel, swipe,
 * arrow keys or clicking a side card.
 */
export default function WorkStrip({ projects, gate }: { projects: ProjectSummary[]; gate?: RefObject<StripGate> }) {
  const stageRef = useRef<HTMLDivElement>(null);
  // At least five cards so both sides are always filled while sliding.
  const cards = projects.length >= 5 ? projects : [...projects, ...projects, ...projects].slice(0, Math.max(5, projects.length));
  const count = cards.length;

  useEffect(() => {
    setupMotion();
    const stage = stageRef.current;
    if (!stage) return;
    const els = Array.from(stage.querySelectorAll<HTMLElement>("[data-card]"));
    const reduced = prefersReducedMotion();
    const open = () => gate?.current ?? OPEN;
    const state = { pos: 0 };
    let target = 0;

    const render = () => {
      const vw = window.innerWidth / 100;
      const centerW = token("--strip-center-w", 37) * vw;
      const centerH = token("--strip-center-h", 21.2) * vw;
      const sideH = token("--strip-side-h", 18.7) * vw;
      const gap = token("--strip-gap", 2.55) * vw;
      const sideW = Math.max((100 * vw - centerW - gap * 2) / 2, centerW * 0.78);
      const step = centerW / 2 + gap + sideW / 2;
      const cx = 50 * vw;
      const active = gsap.utils.wrap(0, count, Math.round(state.pos));

      els.forEach((el, i) => {
        let d = i - state.pos;
        d = d - Math.round(d / count) * count; // shortest way round the loop
        const t = Math.min(Math.abs(d), 1);
        const w = centerW + (sideW - centerW) * t;
        const h = centerH + (sideH - centerH) * t;
        const offset = Math.abs(d) <= 1 ? Math.abs(d) * step : step + (Math.abs(d) - 1) * (sideW + gap);
        const x = cx + Math.sign(d) * offset - w / 2;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.transform = `translate3d(${x}px, ${-h / 2}px, 0)`;
        el.style.visibility = Math.abs(d) > 2.2 ? "hidden" : "visible";
        el.dataset.active = String(i === active);
        const link = el.querySelector("a");
        if (link) link.tabIndex = Math.abs(d) < 1.5 ? 0 : -1;
      });
    };
    render();
    gsap.ticker.add(render);

    const go = (next: number) => {
      target = next;
      gsap.to(state, { pos: target, duration: reduced ? 0 : duration("slow"), ease: "quart", overwrite: true });
    };

    // Auto-advance, paused while the visitor is pointing at or focused in the strip.
    let paused = false;
    const interval = token("--strip-interval", 4.5) * 1000;
    const timer = reduced ? 0 : window.setInterval(() => !paused && !document.hidden && open().atRest && go(target + 1), interval);

    // Horizontal wheel always steps. Vertical wheel steps only once the page
    // can't scroll further down; scrolling up is left to the page, which
    // plays the home reveal backwards.
    let wheelLock = 0;
    const onWheel = (e: WheelEvent) => {
      if (!open().released) return;
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      if (!horizontal && (e.deltaY < 0 || !atBottom)) return;
      const delta = horizontal ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 8 || performance.now() < wheelLock) return;
      wheelLock = performance.now() + 900;
      go(target + Math.sign(delta));
    };

    let startX: number | null = null;
    let swiped = false;
    const onDown = (e: PointerEvent) => {
      startX = e.clientX;
      swiped = false;
    };
    const onUp = (e: PointerEvent) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40 && open().released) {
        swiped = true;
        go(target - Math.sign(dx));
      }
    };

    // Clicking a side card brings it to the centre instead of opening it.
    const onClick = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
      if (swiped || !open().released) {
        e.preventDefault();
        return;
      }
      if (!card || card.dataset.active === "true") return;
      e.preventDefault();
      let d = Number(card.dataset.index) - gsap.utils.wrap(0, count, target);
      d = d - Math.round(d / count) * count;
      go(target + d);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!open().released) return;
      if (e.key === "ArrowRight") go(target + 1);
      else if (e.key === "ArrowLeft") go(target - 1);
    };
    const pause = () => (paused = true);
    const resume = () => (paused = false);

    window.addEventListener("wheel", onWheel, { passive: true });
    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    stage.addEventListener("click", onClick, true);
    stage.addEventListener("keydown", onKey);
    stage.addEventListener("pointerenter", pause);
    stage.addEventListener("pointerleave", resume);
    stage.addEventListener("focusin", pause);
    stage.addEventListener("focusout", resume);

    return () => {
      gsap.ticker.remove(render);
      gsap.killTweensOf(state);
      window.clearInterval(timer);
      window.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      stage.removeEventListener("click", onClick, true);
      stage.removeEventListener("keydown", onKey);
      stage.removeEventListener("pointerenter", pause);
      stage.removeEventListener("pointerleave", resume);
      stage.removeEventListener("focusin", pause);
      stage.removeEventListener("focusout", resume);
    };
  }, [count, gate]);

  return (
    <div
      ref={stageRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected work. Use left and right arrow keys to browse."
      className="absolute inset-x-0 top-1/2 h-0 touch-pan-y select-none"
    >
      <ul>
        {cards.map((card, i) => (
          <li
            key={`${card.slug}-${i}`}
            data-card
            data-index={i}
            className="absolute left-0 top-0 overflow-hidden rounded-sm will-change-transform"
            style={{ width: "29vw", height: "18.7vw", visibility: "hidden" }}
          >
            <Link href={`/work/${card.slug}`} draggable={false} aria-label={`${card.title}, ${card.code}`} className="block h-full w-full">
              <Media media={card.cover} className="h-full w-full" sizes="40vw" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
