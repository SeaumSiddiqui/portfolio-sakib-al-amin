"use client";

import { useState, type FormEvent } from "react";

const DISCIPLINES = ["Motion", "3D", "Graphic", "Full campaign"];
const BUDGETS = ["Under $15k", "$15–30k", "$30–60k", "$60k+"];

type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

function Pills({ legend, name, options, value, onChange }: { legend: string; name: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="label mb-3 text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className={`label flex min-h-11 cursor-pointer items-center rounded-sm border px-3.5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${value === o ? "border-ink bg-ink text-on-ink" : "border-hairline hover:border-ink"}`}>
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const field = "h-12 w-full border-0 border-b border-ink/30 bg-transparent px-0.5 text-[17px] outline-none transition-colors focus:border-ink";

export default function EnquiryForm({ email }: { email?: string | null }) {
  const [discipline, setDiscipline] = useState(DISCIPLINES[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(form), discipline, budget }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus({ kind: "sent", message: "Thanks — you'll hear back within two working days." });
      formEl.reset();
    } catch (err) {
      const fallback = email ? ` You can also email ${email}.` : "";
      setStatus({ kind: "error", message: `${(err as Error).message}${fallback}` });
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="label flex flex-col gap-2 text-muted">
          Name
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="label flex flex-col gap-2 text-muted">
          Work email
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="label flex flex-col gap-2 text-muted sm:col-span-2">
          Company
          <input name="company" autoComplete="organization" className={field} />
        </label>
      </div>

      <Pills legend="Project type" name="discipline" options={DISCIPLINES} value={discipline} onChange={setDiscipline} />
      <Pills legend="Budget" name="budget" options={BUDGETS} value={budget} onChange={setBudget} />

      <label className="label flex flex-col gap-2 text-muted">
        About the project
        <textarea name="message" required rows={4} className={`${field} h-auto resize-y py-3 leading-[1.5]`} placeholder="Goals, timeline, links" />
      </label>

      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" disabled={status.kind === "sending"} className="chip label min-h-12 px-6 disabled:opacity-60">
          {status.kind === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        <p role="status" aria-live="polite" className={`label ${status.kind === "error" ? "text-error" : "text-muted"}`}>
          {status.message}
        </p>
      </div>
    </form>
  );
}
