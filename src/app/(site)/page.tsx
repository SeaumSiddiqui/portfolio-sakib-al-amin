import { formatAvailability } from "@/components/frame/Frame";
import HomeScene from "@/components/home/HomeScene";
import { getProjects, getSettings } from "@/lib/data";

export default async function IndexPage() {
  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);
  const featured = projects.filter((p) => p.featured !== false);

  return (
    <HomeScene
      name={settings.name}
      role={settings.role}
      lines={settings.heroLines}
      facts={settings.heroFacts}
      availability={formatAvailability(settings.nextAvailability)}
      portrait={settings.heroPortrait}
      statement={settings.statement}
      clients={settings.clients}
      projects={featured.length >= 3 ? featured : projects}
    />
  );
}
