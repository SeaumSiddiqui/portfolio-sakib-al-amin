"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Media from "@/components/Media";
import { gsap, prefersReducedMotion, setupMotion } from "@/lib/motion";
import type { ClientMark, Media as MediaType, ProjectSummary } from "@/lib/types";
import GuideLines from "./GuideLines";
import StatementPanel from "./StatementPanel";
import WorkStrip, { type StripGate } from "./WorkStrip";

type Props = {
  name: string;
  role: string;
  lines: string[];
  facts: string[];
  availability?: string | null;
  portrait?: MediaType | null;
  statement: string;
  clients: ClientMark[];
  projects: ProjectSummary[];
};

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
/** smoothstep: 0 before a, 1 after b, eased in between */
const ease = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/* Transition timeline, as fractions of the scroll travel (0 = hero, 1 = work).
 * Each name line slides out of its own mask: first left, second up, third right. */
const WORDS = [
  { a: 0, b: 0.2, dir: "left" },
  { a: 0.02, b: 0.18, dir: "up" },
  { a: 0.04, b: 0.24, dir: "right" },
] as const;

type Opening =
  | null
  | { hero: true; w: number; h: number; x0: number; x1: number; y0: number; y1: number }
  | { hero: false; corner: [number, number]; start: number };

/**
 * The visible part of a card at progress q, as a clip-path.
 * "" = fully open, null = not open yet (hidden).
 * The hero card first fills the box the middle name line leaves behind, like
 * a curtain, then grows from that box to its full frame. The others open
 * diagonally from a corner once the hero is in place.
 */
function clipFor(o: Opening, q: number): string | null {
  if (!o) return "";
  if (o.hero) {
    const fill = ease(0.2, 0.28, q);
    const grow = ease(0.3, 0.48, q);
    if (fill <= 0) return null;
    if (grow >= 1) return "";
    const x0 = o.x0 * (1 - grow);
    const x1 = o.x1 + (o.w - o.x1) * grow;
    const y0 = o.y0 * (1 - grow);
    const y1 = o.y0 + (o.y1 - o.y0) * fill + (o.h - o.y1) * grow;
    return `inset(${y0.toFixed(2)}px ${(o.w - x1).toFixed(2)}px ${(o.h - y1).toFixed(2)}px ${x0.toFixed(2)}px)`;
  }
  const u = ease(o.start, o.start + 0.2, q);
  if (u >= 1) return "";
  if (u <= 0) return null;
  const r = (1 - u) * 100;
  const [cx, cy] = o.corner;
  return `inset(${cy ? r : 0}% ${cx === 0 ? r : 0}% ${cy ? 0 : r}% ${cx ? r : 0}%)`;
}

const corner = (): [number, number] => [Math.random() < 0.5 ? 0 : 1, Math.random() < 0.5 ? 0 : 1];

const VERTICALS = Array.from({ length: 13 }, (_, i) => i);
const HORIZONTALS = ["14%", "50%", "86%"];

/**
 * Home: the client's name set on a 12-column grid. Scrolling plays the
 * transition into the work strip — the name lines retract into their masks,
 * the centre card opens out of the middle line, its neighbours open from the
 * corners, the grid gives way to the three guide lines, and the panel arrives.
 */
export default function HomeScene({ name, role, lines, facts, availability, portrait, statement, clients, projects }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gridCaptionRef = useRef<HTMLSpanElement>(null);
  const gate = useRef<StripGate>({ released: false, atRest: false });

  useEffect(() => {
    setupMotion();
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const $ = <T extends Element = HTMLElement>(s: string) => stage.querySelector<HTMLElement>(s) as unknown as T;
    const $$ = (s: string) => Array.from(stage.querySelectorAll<HTMLElement>(s));

    const words = $$("[data-word]");
    const masks = $$("[data-mask]");
    const portraitInner = $("[data-portrait-inner]");
    const facts = $("[data-facts]");
    const captions = $$("[data-caption]");
    const plan = $("[data-plan]");
    const guides = $("[data-guides]");
    const panel = $("[data-panel]");
    const cards = $$("[data-card]");
    const reduced = prefersReducedMotion();

    let openings: Opening[] = [];
    let prev = -1;

    /* Which card opens out of the middle line, and where everything sits on screen. */
    const measure = () => {
      const vw = window.innerWidth;
      const block = masks[1]?.getBoundingClientRect();
      const rects = cards.map((el) => (el.style.visibility === "hidden" ? null : el.getBoundingClientRect()));
      let hero = -1;
      let best = 0;
      rects.forEach((c, k) => {
        if (!c || !block) return;
        const ix = Math.max(0, Math.min(block.right, c.right) - Math.max(block.left, c.left));
        const iy = Math.max(0, Math.min(block.bottom, c.bottom) - Math.max(block.top, c.top));
        if (ix * iy > best) {
          best = ix * iy;
          hero = k;
        }
      });
      if (hero < 0) {
        // No overlap (narrow screens): the card nearest the centre plays the part.
        let nearest = Infinity;
        rects.forEach((c, k) => {
          if (!c) return;
          const d = Math.abs(c.left + c.width / 2 - vw / 2);
          if (d < nearest) {
            nearest = d;
            hero = k;
          }
        });
      }
      const centre = hero >= 0 && rects[hero] ? rects[hero]!.left + rects[hero]!.width / 2 : vw / 2;
      openings = rects.map((c, k) => {
        if (!c || c.right <= 0 || c.left >= vw) return null;
        if (k === hero && block) {
          return {
            hero: true,
            w: c.width,
            h: c.height,
            x0: clamp(block.left - c.left, 0, c.width),
            x1: clamp(block.right - c.left, 0, c.width),
            y0: clamp(block.top - c.top, 0, c.height),
            y1: clamp(block.bottom - c.top, 0, c.height),
          };
        }
        return { hero: false, corner: corner(), start: c.left + c.width / 2 < centre ? 0.4 : 0.46 };
      });

      const cell = (document.documentElement.clientWidth - 2 * parseFloat(getComputedStyle(stage).getPropertyValue("--scene-margin"))) / 12;
      if (gridCaptionRef.current) gridCaptionRef.current.textContent = `Grid · 12 × ${Math.round(cell)} px`;
    };

    const apply = (q: number) => {
      words.forEach((el, i) => {
        const w = WORDS[i] ?? WORDS[2];
        const e = ease(w.a, w.b, q);
        el.style.transform =
          e <= 0 ? "" : w.dir === "left" ? `translate3d(${-104 * e}%,0,0)` : w.dir === "right" ? `translate3d(${104 * e}%,0,0)` : `translate3d(0,${-112 * e}%,0)`;
      });
      if (portraitInner) portraitInner.style.transform = `translate3d(0,${(-106 * ease(0.02, 0.2, q)).toFixed(2)}%,0)`;
      if (facts) facts.style.opacity = (1 - ease(0, 0.15, q)).toFixed(3);
      captions.forEach((c) => (c.style.opacity = (1 - ease(0, 0.18, q)).toFixed(3)));
      if (plan) plan.style.opacity = (1 - ease(0.3, 0.75, q)).toFixed(3);
      if (guides) guides.style.clipPath = `inset(${((1 - ease(0.45, 0.85, q)) * 100).toFixed(2)}% 0 0 0)`;

      cards.forEach((el, k) => {
        const clip = clipFor(openings[k] ?? null, q);
        el.style.clipPath = clip || "";
        el.style.opacity = clip === null ? "0" : "";
        el.style.pointerEvents = clip === "" ? "" : "none";
      });

      if (panel) {
        const p = ease(0.62, 0.8, q);
        panel.style.opacity = p.toFixed(3);
        panel.style.visibility = p > 0 ? "visible" : "hidden";
      }
      gate.current.released = q >= 0.6;
      gate.current.atRest = q >= 0.98;
    };

    const tick = () => {
      const travel = (parseFloat(getComputedStyle(stage).getPropertyValue("--scene-travel")) || 110) * (window.innerHeight / 100);
      let q = clamp((window.scrollY - section.offsetTop) / travel, 0, 1);
      if (reduced) q = q < 0.5 ? 0 : 1;
      // New corners every time the transition starts again from the hero;
      // coming back up, it replays on whichever cards are on screen now.
      if (openings.length === 0 || (q < 0.02 && prev >= 0.02) || (q < 0.6 && prev >= 0.6)) measure();
      if (q !== prev) {
        apply(q);
        prev = q;
      }
    };
    tick(); // hide the cards before the first paint
    gsap.ticker.add(tick);

    const onResize = () => {
      measure();
      apply(prev < 0 ? 0 : prev);
    };
    window.addEventListener("resize", onResize);

    /* Intro on load: the grid draws itself, the name rises into place, the portrait unveils.
     * Built in a context so cleanup reverts every `from` state — killing alone would leave
     * the elements stuck hidden (React mounts effects twice in development). */
    const intro = gsap.context(() => {
      if (reduced) return;
      const delay = document.querySelector(".preloader") ? 1.25 : 0.1;
      gsap
        .timeline({ delay })
        .from($$("[data-v]"), { scaleY: 0, transformOrigin: "50% 0%", duration: 1.4, ease: "expo", stagger: 0.035 }, 0)
        .from($$("[data-h]"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1.4, ease: "expo", stagger: 0.1 }, 0.1)
        .from($$("[data-rise]"), { yPercent: 110, duration: 1.2, ease: "expo", stagger: 0.09 }, 0.25)
        .from($$("[data-portrait-rise]"), { clipPath: "inset(100% 0% 0% 0%)", duration: 1.2, ease: "expo" }, 0.45)
        .from($$("[data-intro-fade]"), { opacity: 0, duration: 0.8, stagger: 0.06 }, 0.7);
    }, stage);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", onResize);
      intro.revert();
    };
  }, []);

  const cellLeft = (col: string): CSSProperties => ({ left: `calc(var(--scene-margin) + var(--cell) * ${col})` });

  return (
    <section ref={sectionRef} className="relative" style={{ height: "calc(100dvh + (var(--scene-travel) + var(--scene-hold)) * 1vh)" }}>
      <div ref={stageRef} className="sticky top-0 h-dvh overflow-hidden">
        {/* The 12-column plan */}
        <div data-plan aria-hidden="true" className="pointer-events-none absolute inset-0">
          {VERTICALS.map((i) => (
            <i key={`v${i}`} data-v className="absolute bottom-0 top-0 w-px bg-hairline" style={cellLeft(String(i))} />
          ))}
          {HORIZONTALS.map((top) => (
            <i key={top} data-h className="absolute h-px bg-hairline" style={{ top, left: "var(--scene-margin)", right: "var(--scene-margin)" }} />
          ))}
          <div data-intro-fade>
            <span data-caption className="label absolute text-muted" style={{ left: "calc(var(--scene-margin) + 8px)", top: "calc(14% + 8px)" }}>
              Col 01
            </span>
            <span data-caption className="label absolute text-muted max-md:hidden" style={{ right: "calc(var(--scene-margin) + 8px)", top: "calc(14% + 8px)" }}>
              Col 12
            </span>
            <span data-caption ref={gridCaptionRef} className="label absolute text-muted" style={{ left: "calc(var(--scene-margin) + 8px)", top: "calc(86% + 8px)" }}>
              Grid · 12 columns
            </span>
          </div>
        </div>

        {/* Our three guide lines, rising from the vanishing point during the transition */}
        <div data-guides aria-hidden="true" className="absolute inset-0" style={{ clipPath: "inset(100% 0 0 0)" }}>
          <GuideLines />
        </div>

        <WorkStrip projects={projects} gate={gate} />

        {/* Hero */}
        <h1
          aria-label={`${name}, ${role}`}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 font-display font-extrabold uppercase leading-[1.04] tracking-[-0.045em]"
          style={{ fontSize: "var(--hero-size)" }}
        >
          {lines.slice(0, 3).map((line, i) => (
            <span key={i} aria-hidden="true" className="block" style={{ paddingLeft: `calc(var(--scene-margin) + var(--cell) * var(--hero-l${i + 1}))` }}>
              <span data-mask className="inline-block overflow-hidden align-top">
                <span data-word className="block will-change-transform">
                  <span data-rise className="block whitespace-nowrap">
                    {line}
                  </span>
                </span>
              </span>
            </span>
          ))}
        </h1>

        <div
          data-portrait-rise
          className="absolute overflow-hidden rounded-xs"
          style={{ ...cellLeft("var(--hero-portrait-col)"), top: "calc(14% + 16px)", width: "calc(var(--cell) * var(--hero-portrait-w))", aspectRatio: "4 / 5" }}
        >
          <div data-portrait-inner className="h-full w-full will-change-transform">
            <Media media={portrait} label={`Portrait of ${name}`} className="h-full w-full" sizes="(min-width: 768px) 16vw, 40vw" priority />
          </div>
        </div>

        <div data-intro-fade>
          <ul data-facts className="label absolute leading-[1.7]" style={{ left: "calc(var(--scene-margin) + 8px)", bottom: "calc(14% + 16px)" }}>
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
            {availability && (
              <li className="mt-2 flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ink" />
                Open for freelance · from {availability}
              </li>
            )}
          </ul>
        </div>

        {/* What the transition arrives at */}
        <div data-panel className="absolute inset-0" style={{ opacity: 0, visibility: "hidden" }}>
          <StatementPanel statement={statement} clients={clients} />
          <p className="highlight-bars absolute inset-x-[var(--gutter)] bottom-[calc(var(--gutter)+64px)] text-[30px] leading-[1.02] tracking-[-0.03em] md:hidden">
            <span>{statement}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
