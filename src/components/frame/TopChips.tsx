/* eslint-disable @next/next/no-img-element -- 32px avatar; next/image adds nothing here */
"use client";

import { useState } from "react";
import type { Media } from "@/lib/types";
import { useReel } from "./Reel";

type Props = {
  showreel?: Media | null;
  showreelLabel: string;
  bookingUrl?: string | null;
  bookingAvatarUrl?: string | null;
  availability?: string | null;
};

export function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
      <path d="M6.5 5l4 3-4 3z" fill="currentColor" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="2" y="3" width="12" height="11" rx="1" />
      <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
      <path d="M5 9h1.5M7.5 9H9M10 9h1.5M5 11.5h1.5M7.5 11.5H9" strokeWidth="1" />
    </svg>
  );
}

/** Showreel + Book a call on desktop; availability + showreel on mobile. */
export default function TopChips({ showreel, showreelLabel, bookingUrl, bookingAvatarUrl, availability }: Props) {
  const openReel = useReel();
  const [reelHidden, setReelHidden] = useState(false);

  return (
    <div className="fixed inset-x-[var(--gutter)] top-[var(--gutter)] z-50 grid grid-cols-[1fr_1.4fr] gap-2 md:inset-x-auto md:right-[var(--gutter)] md:top-[calc(var(--gutter)+var(--hud-height)+12px)] md:flex md:items-start">
      {availability && (
        <p className="instrument label flex min-h-12 flex-col justify-center px-3 md:hidden">
          <span className="text-muted-dark">Open for freelance:</span>
          {availability}
        </p>
      )}

      {!reelHidden && (
        <div className="instrument flex items-center">
          <button type="button" className="chip label min-h-12 flex-1 text-left md:min-h-[var(--chip-height)]" onClick={() => openReel(showreel, showreelLabel)}>
            <PlayIcon />
            <span className="leading-[1.35]">
              {showreelLabel}
              <br />
              <span className="text-muted-dark">/ Play film</span>
            </span>
          </button>
          <button
            type="button"
            aria-label="Hide showreel"
            onClick={() => setReelHidden(true)}
            className="hidden h-[var(--chip-height)] w-9 place-items-center text-muted-dark transition-colors hover:text-on-ink md:grid"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" stroke="currentColor" strokeWidth="1.3">
              <path d="M1 1l8 8M9 1L1 9" />
            </svg>
          </button>
        </div>
      )}

      {bookingUrl && (
        <a href={bookingUrl} target="_blank" rel="noreferrer" className="chip label hidden gap-2.5 pr-1 md:inline-flex">
          <CalendarIcon />
          <span className="pr-0.5">Book a call</span>
          {bookingAvatarUrl ? (
            <img src={bookingAvatarUrl} alt="" className="h-8 w-8 rounded-xs object-cover" />
          ) : (
            <span aria-hidden="true" className="h-8 w-8 rounded-xs bg-[linear-gradient(135deg,var(--color-panel-line),var(--color-wire))]" />
          )}
        </a>
      )}
    </div>
  );
}
