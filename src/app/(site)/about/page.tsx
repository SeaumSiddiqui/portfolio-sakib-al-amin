import type { Metadata } from "next";
import Media from "@/components/Media";
import Reveal from "@/components/Reveal";
import { getAbout, getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAbout(), getSettings()]);

  return (
    <div className="flex flex-col gap-16 px-[var(--gutter)] pb-28 pt-[96px] md:pt-[calc(var(--gutter)*2+var(--hud-height)+64px)]">
      <h1 className="highlight-bars max-w-[1100px] px-2 text-display tracking-[-0.035em]">
        <span>{about.headline}</span>
      </h1>

      <div className="grid gap-8 md:grid-cols-12">
        <Media media={about.portrait} label={`Portrait of ${settings.name}`} className="aspect-[4/5] rounded-sm md:col-span-5" sizes="(min-width: 768px) 40vw, 100vw" />
        <div className="flex flex-col gap-10 md:col-span-6 md:col-start-7">
          <p className="whitespace-pre-line text-[22px] font-medium leading-[1.25] tracking-[-0.02em] md:text-[26px]">{about.bio}</p>
          {settings.city && (
            <p className="label text-muted">
              Based in {settings.city} · Working worldwide
            </p>
          )}
        </div>
      </div>

      {about.experience.length > 0 && (
        <Reveal as="section" aria-labelledby="experience">
          <h2 id="experience" className="ui-title border-b border-hairline pb-4">
            Experience
          </h2>
          <ol>
            {about.experience.map((job, i) => (
              <li key={`${job.company}-${i}`} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-hairline py-4 md:grid-cols-12">
                <span className="text-[22px] font-medium uppercase tracking-[-0.025em] md:col-span-5">{job.company}</span>
                <span className="label self-center text-ink-soft md:col-span-5">{job.role}</span>
                <span className="label row-start-1 self-center text-right text-muted md:col-span-2 md:col-start-11">{job.years}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      )}

      <Reveal className="grid gap-10 md:grid-cols-3">
        <section aria-labelledby="clients">
          <h2 id="clients" className="label border-b border-hairline pb-3 text-muted">Brands worked on</h2>
          <ul className="label leading-[2.2]">
            {about.clients.map((c, i) => (
              <li key={`${c}-${i}`}>{c}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="awards">
          <h2 id="awards" className="label border-b border-hairline pb-3 text-muted">Recognition</h2>
          <ul className="label">
            {about.awards.map((a, i) => (
              <li key={`${a.title}-${i}`} className="flex justify-between gap-4 border-b border-hairline py-2.5">
                <span>{a.title}</span>
                <span className="text-muted">{a.year}</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="tools">
          <h2 id="tools" className="label border-b border-hairline pb-3 text-muted">Tools</h2>
          <ul className="flex flex-wrap gap-2 pt-3">
            {about.tools.map((t) => (
              <li key={t} className="label rounded-xs border border-hairline px-2.5 py-1">
                {t}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>
    </div>
  );
}
