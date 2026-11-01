"use client";

import dynamic from "next/dynamic";

const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false,
  loading: () => <div className="aspect-video rounded-sm bg-canvas-2" />,
});

export default function ModelModule({ title, url, caption }: { title: string; url?: string | null; caption?: string | null }) {
  return (
    <section aria-label={title} className="flex flex-col gap-3">
      <h2 className="ui-title">{title}</h2>
      <ModelViewer url={url} />
      {caption && <p className="label text-muted">{caption}</p>}
    </section>
  );
}
