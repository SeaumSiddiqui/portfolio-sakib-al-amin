import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="mx-auto max-w-xl p-10">
        <h1 className="ui-title">Connect Sanity</h1>
        <p className="mt-4">
          Copy <code>.env.example</code> to <code>.env.local</code>, set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>, and
          add <code>http://localhost:3000</code> as a CORS origin (with credentials) in sanity.io/manage. Then restart the
          dev server.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
