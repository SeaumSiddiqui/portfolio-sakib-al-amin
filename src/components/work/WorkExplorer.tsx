"use client";

import Link from "next/link";
import { useState } from "react";
import Media from "@/components/Media";
import type { Discipline, ProjectSummary } from "@/lib/types";
import CurvedGrid from "./CurvedGrid";

const FILTERS: { value: "all" | Discipline; label: string }[] = [
  { value: "all", label: "All" },
  { value: "motion", label: "Motion" },
  { value: "3d", label: "3D" },
  { value: "graphic", label: "Graphic" },
];

const label = (d: Discipline) => FILTERS.find((f) => f.value === d)?.label ?? d;

export default function WorkExplorer({ projects }: { projects: ProjectSummary[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | Discipline>("all");
  const shown = projects.filter((p) => filter === "all" || p.disciplines.includes(filter));

  return (
    <>
      <h1 className="sr-only">Work</h1>

      {view === "grid" && shown.length > 0 && (
        <>
          {/* Desktop: the curved, endless grid. */}
          <div className="hidden md:block">
            <CurvedGrid key={filter} projects={shown} />
          </div>
          {/* Phones: a flat two-column grid that scrolls normally. */}
          <ul className="grid grid-cols-2 gap-x-3 gap-y-6 px-[var(--gutter)] pb-28 pt-36 md:hidden">
            {shown.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className="block">
                  <Media media={p.cover} label={p.title} className="aspect-[4/5] rounded-sm" sizes="50vw" />
                  <span className="label mt-2 block text-muted">{p.code}</span>
                  <span className="block text-[15px] font-medium uppercase leading-tight tracking-[-0.02em]">{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {view === "list" && (
        <div className="px-[var(--gutter)] pb-32 pt-36 md:pt-28">
          <table className="label w-full border-collapse text-left">
            <thead className="text-muted">
              <tr>
                <th scope="col" className="hidden w-28 py-3 pr-2 font-normal md:table-cell">Preview</th>
                <th scope="col" className="w-24 py-3 pr-2 font-normal">Code</th>
                <th scope="col" className="py-3 pr-2 font-normal">Project</th>
                <th scope="col" className="hidden py-3 pr-2 font-normal md:table-cell">Discipline</th>
                <th scope="col" className="hidden py-3 pr-2 font-normal lg:table-cell">Tools</th>
                <th scope="col" className="py-3 text-right font-normal">Year</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.slug} className="group relative border-t border-hairline">
                  <td className="hidden py-2 pr-2 md:table-cell">
                    <Media media={p.cover} label={p.title} className="h-[50px] w-20 rounded-xs" sizes="80px" />
                  </td>
                  <td className="py-2 pr-2 text-muted">{p.code}</td>
                  <td className="py-2 pr-2">
                    <Link href={`/work/${p.slug}`} className="font-display text-[20px] font-medium normal-case tracking-[-0.025em] after:absolute after:inset-0 md:text-[24px]">
                      {p.title}
                    </Link>
                  </td>
                  <td className="hidden py-2 pr-2 md:table-cell">{p.disciplines.map(label).join(" / ")}</td>
                  <td className="hidden py-2 pr-2 text-muted lg:table-cell">{p.tools.join(" / ")}</td>
                  <td className="py-2 text-right">{p.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {shown.length === 0 && <p className="label px-[var(--gutter)] pt-40 text-muted">Nothing in this discipline yet.</p>}

      <div
        role="toolbar"
        aria-label="Filter and view"
        className="instrument fixed inset-x-[var(--gutter)] top-[76px] z-50 flex items-center justify-between gap-1 overflow-x-auto p-1 md:inset-x-auto md:bottom-[var(--gutter)] md:left-1/2 md:top-auto md:-translate-x-1/2"
      >
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button key={f.value} type="button" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)} className="segment label px-2 md:px-3">
              {f.label}
            </button>
          ))}
        </div>
        <span aria-hidden="true" className="mx-1.5 h-5 w-px shrink-0 bg-panel-line" />
        <div className="flex gap-1">
          {(["grid", "list"] as const).map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className="segment label px-2 md:px-3">
              {v}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
