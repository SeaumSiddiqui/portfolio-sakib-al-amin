"use client";

import { useState } from "react";
import Media from "@/components/Media";
import type { BreakdownPass } from "@/lib/types";

/** Steps through render passes (wireframe → final) in one frame. */
export default function Breakdown({ title, passes }: { title: string; passes: BreakdownPass[] }) {
  const [active, setActive] = useState(passes.length - 1);
  const current = passes[active];

  return (
    <section aria-label={title} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="ui-title">{title}</h2>
        <div role="group" aria-label="Render pass" className="instrument flex gap-1 p-1">
          {passes.map((pass, i) => (
            <button key={pass.label} type="button" aria-pressed={i === active} onClick={() => setActive(i)} className="segment label">
              {pass.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative aspect-video overflow-hidden rounded-sm bg-canvas-2">
        {passes.map((pass, i) => (
          <div
            key={pass.label}
            aria-hidden={i !== active}
            className="absolute inset-0 transition-opacity duration-500 ease-[var(--ease-expo)]"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <Media media={pass.media} label={`${title}: ${pass.label}`} className="h-full w-full" sizes="100vw" />
          </div>
        ))}
        <p className="label absolute left-4 top-3.5 rounded-xs bg-ink px-2 py-1 text-on-ink">
          Pass {String(active + 1).padStart(2, "0")} / {current.label}
        </p>
        {current.meta && <p className="label absolute right-4 top-3.5 rounded-xs bg-ink px-2 py-1 text-on-ink">{current.meta}</p>}
      </div>
    </section>
  );
}
