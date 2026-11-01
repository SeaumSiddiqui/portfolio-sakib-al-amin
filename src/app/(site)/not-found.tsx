import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex h-dvh flex-col items-start justify-center gap-6 px-[var(--gutter)]">
      <p className="label text-muted">Error 404 / Frame not found</p>
      <h1 className="highlight-bars text-display tracking-[-0.035em]">
        <span>This shot didn&apos;t make the cut.</span>
      </h1>
      <Link href="/work" className="chip label min-h-12">
        Back to work
      </Link>
    </section>
  );
}
