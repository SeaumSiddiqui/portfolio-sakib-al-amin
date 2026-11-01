import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Media from "@/components/Media";
import Breakdown from "@/components/project/Breakdown";
import ModelModule from "@/components/project/ModelModule";
import ProjectHero from "@/components/project/ProjectHero";
import Reveal from "@/components/Reveal";
import { disciplineLabel, getProject, getProjectSlugs } from "@/lib/data";
import type { Project, ProjectModule } from "@/lib/types";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return {};
  return { title: project.title, description: project.summary || undefined };
}

function specsFor(project: Project) {
  const rows = [
    { label: "Client", value: project.client },
    { label: "Agency", value: project.agency },
    { label: "Discipline", value: project.disciplines.map(disciplineLabel).join(" / ") },
    { label: "Role", value: project.roles.join(", ") },
    { label: "Tools", value: project.tools.join(" / ") },
    { label: "Year", value: project.year },
    ...project.specs,
    { label: "Recognition", value: project.recognition },
  ];
  return rows.filter((r): r is { label: string; value: string } => Boolean(r.value));
}

function Module({ module }: { module: ProjectModule }) {
  switch (module._type) {
    case "filmModule":
      return (
        <figure className="flex flex-col gap-2">
          <Media media={module.media} label={module.caption || "Film"} className="aspect-video rounded-sm" sizes="100vw" />
          {module.caption && <figcaption className="label text-muted">{module.caption}</figcaption>}
        </figure>
      );
    case "breakdownModule":
      return module.passes?.length ? <Breakdown title={module.title || "Breakdown"} passes={module.passes} /> : null;
    case "modelModule":
      return <ModelModule title={module.title || "Turntable"} url={module.modelUrl} caption={module.caption} />;
    case "styleframesModule":
      return (
        <section aria-label={module.title || "Styleframes"} className="flex flex-col gap-3">
          <h2 className="ui-title">{module.title || "Styleframes"}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {module.frames?.map((frame, i) => (
              <figure key={frame.code || i} className="flex flex-col gap-2">
                <Media media={frame.media} label={frame.code || `Styleframe ${i + 1}`} className="aspect-[4/5] rounded-sm" sizes="(min-width: 1024px) 33vw, 50vw" />
                {frame.code && <figcaption className="label text-muted">{frame.code}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      );
    case "textModule":
      return (
        <section className="grid gap-4 md:grid-cols-12">
          {module.heading && <h2 className="ui-title md:col-span-4">{module.heading}</h2>}
          <p className="max-w-[640px] whitespace-pre-line text-ink-soft md:col-span-8 md:col-start-5">{module.body}</p>
        </section>
      );
  }
}

export default async function ProjectPage({ params }: Params) {
  const project = await getProject((await params).slug);
  if (!project) notFound();
  const specs = specsFor(project);

  return (
    <article className="flex flex-col gap-4 px-[var(--gutter)] pb-28 pt-[76px] md:pt-[calc(var(--gutter)*2+var(--hud-height))]">
      <ProjectHero project={project} />

      <Reveal className="grid gap-10 px-2 py-16 md:grid-cols-2 md:py-24">
        {project.summary && <p className="max-w-[620px] text-[26px] font-medium leading-[1.1] tracking-[-0.025em] md:text-[32px]">{project.summary}</p>}
        <dl className="label grid grid-cols-1 border-t border-hairline sm:grid-cols-2 sm:gap-x-6">
          {specs.map((s) => (
            <div key={s.label} className="flex gap-3 border-b border-hairline py-3">
              <dt className="w-28 shrink-0 text-muted">{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <div className="flex flex-col gap-24">
        {project.modules.map((module) => (
          <Reveal key={module._key}>
            <Module module={module} />
          </Reveal>
        ))}
      </div>

      {project.next && (
        <Link
          href={`/work/${project.next.slug}`}
          className="instrument mt-24 flex min-h-[220px] flex-col justify-between gap-6 p-6 md:flex-row md:items-end"
        >
          <span className="label self-start text-muted-dark">Next project / {project.next.code}</span>
          <span className="text-[clamp(48px,7vw,104px)] font-medium uppercase leading-[0.9] tracking-[-0.035em]">{project.next.title}</span>
        </Link>
      )}
    </article>
  );
}
