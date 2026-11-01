import type { Metadata } from "next";
import Frame from "@/components/frame/Frame";
import Preloader from "@/components/frame/Preloader";
import { ReelProvider } from "@/components/frame/Reel";
import SmoothScroll from "@/components/SmoothScroll";
import { getSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.name} — ${settings.role}`;
  return {
    title: { default: title, template: `%s — ${settings.name}` },
    description: settings.seoDescription || settings.statement,
    openGraph: { title, description: settings.seoDescription || settings.statement, type: "website" },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <ReelProvider>
      <a href="#main" className="label sr-only z-[110] rounded-sm bg-ink px-3 py-2 text-on-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Preloader monogram={settings.monogram} />
      <noscript>
        <style>{`.preloader{display:none}`}</style>
      </noscript>
      <SmoothScroll />
      <Frame settings={settings} />
      <main id="main">{children}</main>
      <div className="grain" aria-hidden="true" />
    </ReelProvider>
  );
}
