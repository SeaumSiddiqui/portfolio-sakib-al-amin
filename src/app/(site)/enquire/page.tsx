import type { Metadata } from "next";
import { formatAvailability } from "@/components/frame/Frame";
import EnquiryForm from "@/components/enquire/EnquiryForm";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Enquire" };

export default async function EnquirePage() {
  const settings = await getSettings();
  const availability = formatAvailability(settings.nextAvailability);

  return (
    <div className="grid gap-12 px-[var(--gutter)] pb-28 pt-[96px] md:grid-cols-12 md:pt-[calc(var(--gutter)*2+var(--hud-height)+64px)]">
      <div className="flex flex-col gap-6 md:col-span-5">
        <h1 className="highlight-bars text-display tracking-[-0.035em]">
          <span>Tell me what you&apos;re building.</span>
        </h1>
        <div className="label flex flex-col gap-1 text-muted">
          {availability && <p>Open for freelance from {availability}</p>}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="text-ink underline underline-offset-4">
              {settings.email}
            </a>
          )}
        </div>
        {settings.bookingUrl && (
          <a href={settings.bookingUrl} target="_blank" rel="noreferrer" className="chip label min-h-12 self-start">
            Prefer to talk? Book a call
          </a>
        )}
      </div>
      <div className="light-panel p-6 md:col-span-7 md:p-8">
        <EnquiryForm email={settings.email} />
      </div>
    </div>
  );
}
