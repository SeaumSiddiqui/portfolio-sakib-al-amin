"use client";

import { useReel } from "@/components/frame/Reel";
import { PlayIcon } from "@/components/frame/TopChips";
import Media from "@/components/Media";
import type { Project } from "@/lib/types";

export default function ProjectHero({ project }: { project: Project }) {
  const openReel = useReel();
  const film = project.hero || project.cover;

  return (
    <section className="relative h-[78svh] min-h-[480px] overflow-hidden rounded-sm md:h-[86vh]">
      <Media media={film} label={project.title} priority sizes="100vw" className="absolute inset-0" />
      <button
        type="button"
        onClick={() => openReel(film, project.title)}
        className="chip label absolute left-1/2 top-[42%] min-h-12 -translate-x-1/2 -translate-y-1/2"
      >
        <PlayIcon />
        Play film with sound
      </button>
      <h1 className="highlight-bars absolute bottom-[var(--gutter)] left-[var(--gutter)] right-[var(--gutter)] max-w-[960px] text-display tracking-[-0.035em] md:bottom-6 md:left-6">
        <span>{project.headline || project.title}</span>
      </h1>
    </section>
  );
}
