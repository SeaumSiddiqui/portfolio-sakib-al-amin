/* eslint-disable @next/next/no-img-element -- tiny logos; next/image adds nothing here */
import type { ClientMark } from "@/lib/types";

function Mark({ client }: { client: ClientMark }) {
  return (
    <span className="flex shrink-0 items-center gap-2.5 pr-7">
      {client.logoUrl ? (
        <img src={client.logoUrl} alt="" className="h-9 w-9 object-contain opacity-80 grayscale" />
      ) : (
        <span aria-hidden="true" className="h-9 w-9 rounded-xs opacity-80 grayscale" style={{ background: client.swatch || "var(--color-canvas-2)" }} />
      )}
      <span className="panel-type whitespace-nowrap">{client.name}</span>
    </span>
  );
}

/** Desktop home panel: client marks ticking by on the left, the statement on the right. */
export default function StatementPanel({ statement, clients }: { statement: string; clients: ClientMark[] }) {
  return (
    <div
      className="absolute left-1/2 hidden -translate-x-1/2 grid-cols-2 items-center gap-6 rounded-xs border border-hairline bg-canvas px-7 md:grid"
      style={{ width: "max(var(--panel-width), 560px)", height: "var(--panel-height)", bottom: "var(--panel-bottom)" }}
    >
      <div className="marquee" aria-label={`Brands worked on: ${clients.map((c) => c.name).join(", ")}`} role="img">
        <div className="marquee-track" aria-hidden="true">
          {[...clients, ...clients].map((client, i) => (
            <Mark key={`${client.name}-${i}`} client={client} />
          ))}
        </div>
      </div>
      <p className="panel-type indent-[2.2em]">{statement}</p>
    </div>
  );
}
