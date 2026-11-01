"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Media from "@/components/Media";
import { gsap, prefersReducedMotion, setupMotion } from "@/lib/motion";
import type { ProjectSummary } from "@/lib/types";

const COLS = 6;
const MIN_ROWS = 3;
const GAP_X = 48;
const GAP_Y = 72;

/** Rows per tile, chosen so the tile holds whole repeats of the list and the same row never sits under itself. */
function tileRows(count: number) {
  for (let r = MIN_ROWS; r <= MIN_ROWS + 8; r++) if ((COLS * r) % count === 0 && r * COLS > count) return r;
  return Math.max(MIN_ROWS, Math.ceil(count / COLS) + 1);
}

function cssNumber(name: string, fallback: number) {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
}

/**
 * An endless grid of work bent into a shallow bowl, like looking at the
 * inside of a sphere. Drag, wheel or arrow keys pan it; it wraps forever.
 */
export default function CurvedGrid({ projects }: { projects: ProjectSummary[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState({ x: 1, y: 1 });
  const rows = tileRows(projects.length);
  const tile = Array.from({ length: COLS * rows }, (_, i) => projects[i % projects.length]);

  const cells: { project: ProjectSummary; col: number; row: number; primary: boolean; key: string }[] = [];
  for (let ty = 0; ty < copies.y; ty++)
    for (let tx = 0; tx < copies.x; tx++)
      tile.forEach((project, i) => {
        // Only the first appearance of each project is focusable.
        const primary = tx === 0 && ty === 0 && i < projects.length;
        cells.push({ project, col: tx * COLS + (i % COLS), row: ty * rows + Math.floor(i / COLS), primary, key: `${tx}-${ty}-${i}` });
      });

  useEffect(() => {
    setupMotion();
    const stage = stageRef.current;
    if (!stage) return;
    const els = Array.from(stage.querySelectorAll<HTMLElement>("[data-cell]"));
    const reduced = prefersReducedMotion();

    let cardW = 0, cardH = 0, cellW = 0, cellH = 0, spanX = 0, spanY = 0, radius = 1;
    const measure = () => {
      const vw = stage.clientWidth;
      const vh = stage.clientHeight;
      cardW = Math.min(340, Math.max(220, vw * 0.2));
      cardH = cardW * 0.625 + 28;
      cellW = cardW + GAP_X;
      cellH = cardH + GAP_Y;
      const tileW = COLS * cellW;
      const tileH = rows * cellH;
      const need = { x: Math.ceil((vw + cellW * 2) / tileW), y: Math.ceil((vh + cellH * 2) / tileH) };
      if (need.x !== copies.x || need.y !== copies.y) setCopies(need);
      spanX = copies.x * tileW;
      spanY = copies.y * tileH;
      radius = vw * cssNumber("--grid-curve", 1.1);
      els.forEach((el) => {
        el.style.width = `${cardW}px`;
        el.style.marginLeft = `${-cardW / 2}px`;
        el.style.marginTop = `${-cardH / 2}px`;
      });
    };
    measure();

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const render = () => {
      current.x += (target.x - current.x) * (reduced ? 1 : 0.09);
      current.y += (target.y - current.y) * (reduced ? 1 : 0.09);
      const wrapX = gsap.utils.wrap(-spanX / 2, spanX / 2);
      const wrapY = gsap.utils.wrap(-spanY / 2, spanY / 2);
      els.forEach((el) => {
        const col = Number(el.dataset.col);
        const row = Number(el.dataset.row);
        const x = wrapX(col * cellW - spanX / 2 + cellW / 2 + current.x);
        const y = wrapY(row * cellH - spanY / 2 + cellH / 2 + current.y);
        const z = (x * x + y * y) / (2 * radius);
        el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${-x / radius}rad) rotateX(${y / radius}rad)`;
      });
    };
    gsap.ticker.add(render);

    let drag: { x: number; y: number } | null = null;
    let moved = 0;
    let vel = { x: 0, y: 0 };
    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY };
      moved = 0;
      vel = { x: 0, y: 0 };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag = { x: e.clientX, y: e.clientY };
      moved += Math.abs(dx) + Math.abs(dy);
      target.x += dx * 1.4;
      target.y += dy * 1.4;
      vel = { x: dx, y: dy };
    };
    const onUp = () => {
      if (!drag) return;
      drag = null;
      target.x += vel.x * 12;
      target.y += vel.y * 12;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target.x -= e.deltaX;
      target.y -= e.deltaY;
    };
    const onKey = (e: KeyboardEvent) => {
      const step = { ArrowLeft: [cellW, 0], ArrowRight: [-cellW, 0], ArrowUp: [0, cellH], ArrowDown: [0, -cellH] }[e.key];
      if (!step) return;
      e.preventDefault();
      target.x += step[0];
      target.y += step[1];
    };
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("keydown", onKey);
    stage.addEventListener("click", onClick, true);
    window.addEventListener("resize", measure);

    return () => {
      gsap.ticker.remove(render);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("keydown", onKey);
      stage.removeEventListener("click", onClick, true);
      window.removeEventListener("resize", measure);
    };
  }, [copies, rows, projects]);

  return (
    <div
      ref={stageRef}
      data-lenis-prevent
      tabIndex={0}
      aria-label="Work grid. Drag, scroll or use arrow keys to explore."
      className="fixed inset-0 cursor-grab touch-none select-none overflow-hidden active:cursor-grabbing"
      style={{ perspective: "var(--grid-perspective)" }}
    >
      <ul className="absolute left-1/2 top-1/2" style={{ transformStyle: "preserve-3d" }}>
        {cells.map(({ project, col, row, primary, key }) => (
          <li key={key} data-cell data-col={col} data-row={row} aria-hidden={!primary || undefined} className="group absolute left-0 top-0 will-change-transform">
            <Link href={`/work/${project.slug}`} tabIndex={primary ? undefined : -1} draggable={false} className="block">
              <Media media={project.cover} label={project.title} className="aspect-[16/10] rounded-sm" sizes="340px" />
              <span className="label mt-2 flex justify-between gap-3 text-muted">
                <span>{project.code}</span>
                <span className="truncate opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">{project.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
