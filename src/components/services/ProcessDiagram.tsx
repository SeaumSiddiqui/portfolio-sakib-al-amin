"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, setupMotion } from "@/lib/motion";
import type { Service } from "@/lib/types";

type Node = { x: number; y: number; service: Service; index: number };
type Layout = { nodes: Node[]; paths: string[]; height: number; stacked: boolean };

const BOX = 28;

/**
 * First service at the top, the middle ones side by side, the last at the
 * bottom — joined by lines that draw themselves as you scroll. On narrow
 * screens it becomes a single vertical line.
 */
function layout(width: number, services: Service[]): Layout {
  if (width < 720 || services.length < 3) {
    const step = 190;
    const nodes = services.map((service, index) => ({ x: 24, y: 80 + index * step, service, index }));
    const height = 80 + services.length * step;
    return { nodes, paths: [`M ${24 + BOX / 2} 0 V ${height}`], height, stacked: true };
  }

  const height = 920;
  const first = services[0];
  const last = services[services.length - 1];
  const middle = services.slice(1, -1);
  const xs = middle.map((_, i) => (middle.length === 1 ? 0.5 : 0.16 + (0.68 * i) / (middle.length - 1)) * width);
  const cx = width / 2;
  const yTop = 140, yBusTop = 300, yMid = 360, yBusBottom = 620, yBottom = 740;

  const nodes: Node[] = [
    { x: cx - BOX / 2, y: yTop, service: first, index: 0 },
    ...middle.map((service, i) => ({ x: xs[i] - BOX / 2, y: yMid, service, index: i + 1 })),
    { x: cx - BOX / 2, y: yBottom, service: last, index: services.length - 1 },
  ];
  const left = Math.min(...xs);
  const right = Math.max(...xs);

  const paths = [
    `M ${cx} 0 V ${yTop}`,
    `M ${cx} ${yTop + BOX} V ${yBusTop}`,
    `M ${left} ${yBusTop} H ${right}`,
    ...xs.map((x) => `M ${x} ${yBusTop} V ${yMid}`),
    ...xs.map((x) => `M ${x} ${yMid + BOX} V ${yBusBottom}`),
    `M ${left} ${yBusBottom} H ${right}`,
    `M ${cx} ${yBusBottom} V ${yBottom}`,
    `M ${cx} ${yBottom + BOX} V ${height}`,
  ];
  return { nodes, paths, height, stacked: false };
}

export default function ProcessDiagram({ services }: { services: Service[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const { nodes, paths, height, stacked } = layout(width || 1200, services);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setupMotion();
    const el = wrapRef.current;
    if (!el || !width || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 70%", scrub: 0.6 } });
      timeline.fromTo("[data-line]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", stagger: 0.08 });
      timeline.fromTo("[data-node]", { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.3 }, 0.1);
    }, el);
    return () => ctx.revert();
  }, [width, stacked]);

  return (
    <div ref={wrapRef} className="relative overflow-hidden rounded-sm bg-canvas-2" style={{ height }}>
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox={`0 0 ${width || 1200} ${height}`}>
        {paths.map((d) => (
          <path key={d} data-line d={d} pathLength={1} strokeDasharray="1" fill="none" stroke="var(--color-wire)" strokeWidth="1" />
        ))}
      </svg>
      <ol>
        {nodes.map(({ x, y, service, index }) => (
          <li key={service.title + index} data-node className="absolute" style={{ left: x, top: y, maxWidth: stacked ? "calc(100% - 48px)" : 220 }}>
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="h-7 w-7 shrink-0 border border-wire bg-canvas" />
              <h3 className="label inline-flex h-7 items-center rounded-xs bg-ink px-2.5 text-on-ink">
                {String(index + 1).padStart(2, "0")} / {service.title}
              </h3>
            </div>
            <ul className="label ml-[38px] mt-2.5 leading-[1.7] text-ink-soft">
              {service.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
