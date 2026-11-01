"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = { name: string; role: string; timezone: string; availability?: string | null };

function contextFor(pathname: string, role: string) {
  const [section, slug] = pathname.split("/").filter(Boolean);
  if (!section) return role;
  return slug ? `${section} / ${slug.replace(/-/g, " ")}` : section;
}

function safeZone(timezone: string) {
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: timezone });
    return timezone;
  } catch {
    return "UTC";
  }
}

function readClock(timeZone: string) {
  const now = new Date();
  const date = new Intl.DateTimeFormat("en-GB", { timeZone, day: "2-digit", month: "short", year: "2-digit" }).format(now);
  const time = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now);
  const offset =
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "UTC";
  return { date, time, offset };
}

/** The black HUD bar along the top: name, context, live local time, availability. */
export default function StatusBar({ name, role, timezone, availability }: Props) {
  const [clock, setClock] = useState<ReturnType<typeof readClock> | null>(null);
  const context = contextFor(usePathname(), role);

  useEffect(() => {
    const zone = safeZone(timezone);
    const update = () => setClock(readClock(zone));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [timezone]);

  return (
    <div className="instrument label fixed inset-x-[var(--gutter)] top-[var(--gutter)] z-50 hidden h-[var(--hud-height)] items-center justify-between gap-4 px-3.5 md:flex">
      <span className="truncate">
        <span className="text-muted-dark">{name}</span>
        <span className="ml-6">{context}</span>
      </span>
      <span aria-label="Local time" className="tabular-nums">
        {clock ? (
          <>
            {clock.offset} {clock.date}
            <span className="ml-6">{clock.time}</span>
          </>
        ) : (
          " "
        )}
      </span>
      {availability && (
        <span>
          <span className="text-muted-dark">Open for freelance:</span> {availability}
        </span>
      )}
    </div>
  );
}
