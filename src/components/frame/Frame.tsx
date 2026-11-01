import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import Menu from "./Menu";
import StatusBar from "./StatusBar";
import TopChips from "./TopChips";

export function formatAvailability(date?: string | null) {
  if (!date) return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(parsed);
}

/** The persistent HUD around every page. */
export default function Frame({ settings }: { settings: SiteSettings }) {
  const availability = formatAvailability(settings.nextAvailability);

  return (
    <>
      <StatusBar name={settings.name} role={settings.role} timezone={settings.timezone} availability={availability} />
      <TopChips
        showreel={settings.showreel}
        showreelLabel={settings.showreelLabel}
        bookingUrl={settings.bookingUrl}
        bookingAvatarUrl={settings.bookingAvatarUrl}
        availability={availability}
      />

      <Link
        href="/"
        aria-label={`${settings.name}, home`}
        className="instrument fixed bottom-[var(--gutter)] left-[var(--gutter)] z-50 grid h-12 w-12 place-items-center font-mono text-[13px] font-bold md:h-14 md:w-14 md:text-[15px]"
      >
        {settings.monogram}
      </Link>

      {settings.bookingUrl && (
        <a
          href={settings.bookingUrl}
          target="_blank"
          rel="noreferrer"
          className="chip label fixed bottom-[var(--gutter)] left-1/2 z-50 min-h-12 -translate-x-1/2 md:hidden"
        >
          Book a call
        </a>
      )}

      <Menu monogram={settings.monogram} email={settings.email} socials={settings.socials} />
    </>
  );
}
