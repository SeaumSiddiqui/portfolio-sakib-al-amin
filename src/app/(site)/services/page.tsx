import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ProcessDiagram from "@/components/services/ProcessDiagram";
import { getServices, getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);

  return (
    <div className="flex flex-col gap-8 px-[var(--gutter)] pb-28 pt-[96px] md:pt-[calc(var(--gutter)*2+var(--hud-height)+64px)]">
      <h1 className="highlight-bars max-w-[1100px] px-2 text-display tracking-[-0.035em]">
        <span>One designer. Idea to launch.</span>
      </h1>

      <ProcessDiagram services={services} />

      <Reveal className="flex flex-wrap items-center justify-between gap-4 px-2 py-6">
        {settings.engagementFrom && <p className="ui-title">Freelance projects from {settings.engagementFrom}</p>}
        {settings.bookingUrl && (
          <a href={settings.bookingUrl} target="_blank" rel="noreferrer" className="chip label min-h-12">
            Book a call
          </a>
        )}
      </Reveal>
    </div>
  );
}
