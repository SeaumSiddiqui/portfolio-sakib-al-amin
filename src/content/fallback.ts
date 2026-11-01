import type { About, Project, ProjectSummary, Service, SiteSettings } from "@/lib/types";

/*
 * Placeholder content, used until Sanity is connected (and for any field the
 * client leaves empty). Bracketed values are for the client to replace.
 */

const swatch = {
  ember: "radial-gradient(circle at 70% 60%, #ffb347 0, #ff5a1f 35%, #b3200e 78%)",
  wire: "#e6e6ea",
  signal: "#f5e400",
  aurora: "linear-gradient(135deg, #0e1a3a, #3a2c8f 55%, #c04a9b)",
  ink: "linear-gradient(135deg, #121212, #494d4d)",
  sky: "linear-gradient(180deg, #9db7cf, #e9d9c2)",
};

export const fallbackSettings: SiteSettings = {
  name: "[Your Name]",
  monogram: "XX",
  role: "Motion · 3D · Graphic designer",
  statement: "[X] years of motion, 3D and identity work for the brands I've worked on",
  heroLines: ["[First]", "[Last]", "Designer."],
  heroFacts: ["Senior 3D & Motion Designer", "Currently at [Company]", "Previously [Company] · [Company]"],
  heroPortrait: { swatch: swatch.ink },
  email: "hello@yourname.com",
  socials: [
    { label: "Instagram", url: "https://instagram.com" },
    { label: "Behance", url: "https://behance.net" },
    { label: "Vimeo", url: "https://vimeo.com" },
  ],
  city: "[City]",
  timezone: "UTC",
  nextAvailability: "2026-11-11",
  bookingUrl: "https://cal.com",
  bookingAvatarUrl: null,
  clients: [
    { name: "[Client A]", swatch: swatch.ember },
    { name: "[Client B]", swatch: swatch.ink },
    { name: "[Client C]", swatch: swatch.signal },
    { name: "[Client D]", swatch: swatch.aurora },
    { name: "[Client E]", swatch: swatch.sky },
  ],
  showreel: { swatch: swatch.ember },
  showreelLabel: "Showreel 2026",
  engagementFrom: "[$XX,000]",
  seoDescription: "Portfolio of [Your Name], a senior motion, 3D and graphic designer. Open to select freelance projects.",
};

const rows: [string, ProjectSummary["disciplines"], string, string, string, keyof typeof swatch][] = [
  ["Afterimage", ["3d", "motion"], "3D Film", "Houdini / Redshift", "2026", "ember"],
  ["Northbound", ["graphic"], "Identity", "Illustrator / After Effects", "2026", "signal"],
  ["Tidal Signal", ["motion"], "Title sequence", "After Effects / C4D", "2026", "aurora"],
  ["Monolith", ["3d"], "Product 3D", "Blender / Octane", "2025", "wire"],
  ["Low Tide", ["motion"], "Music video", "C4D / Nuke", "2025", "ink"],
  ["Fieldnotes", ["graphic"], "Poster series", "Photoshop / InDesign", "2025", "sky"],
  ["Orbit", ["3d"], "CG world", "Houdini / Karma", "2025", "aurora"],
  ["Halftone", ["graphic"], "Campaign key art", "Figma / After Effects", "2024", "signal"],
  ["Pulse", ["motion"], "Brand motion kit", "After Effects / Cavalry", "2024", "ember"],
  ["Vessel", ["3d"], "Product film", "C4D / Redshift", "2024", "ink"],
  ["Signal", ["graphic"], "Identity", "Illustrator", "2024", "wire"],
  ["Driftwood", ["motion"], "Short film", "Blender / After Effects", "2023", "sky"],
];

export const fallbackProjects: (ProjectSummary & { featured: boolean })[] = rows.map(
  ([title, disciplines, format, tools, year, look], i) => ({
    title: `[${title}]`,
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    code: `WK_${String(i + 1).padStart(3, "0")}`,
    disciplines,
    format,
    client: "[Client]",
    year,
    tools: tools.split(" / "),
    cover: { swatch: swatch[look] },
    featured: i < 6,
  }),
);

export function fallbackProject(slug: string): Project | null {
  const index = fallbackProjects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  const base = fallbackProjects[index];
  const next = fallbackProjects[(index + 1) % fallbackProjects.length];
  return {
    ...base,
    headline: `${base.title} — a ${base.format?.toLowerCase()} for [Client]`,
    hero: base.cover,
    summary: "[Two sentences: what the brand needed, and the world built to answer it.]",
    agency: "[Agency]",
    roles: ["Direction", "3D", "Compositing"],
    recognition: "[Award]",
    specs: [
      { label: "Runtime", value: "01:12" },
      { label: "Format", value: "4K · 24 FPS · 2.39:1" },
    ],
    modules: [
      {
        _type: "breakdownModule",
        _key: "bd",
        title: "Breakdown",
        passes: [
          { label: "Wireframe", meta: "1.2M polys", media: { swatch: swatch.wire } },
          { label: "Clay", meta: "AO · grey shade", media: { swatch: "radial-gradient(circle at 40% 40%, #ffffff, #b9b9be 45%, #6e6e73 90%)" } },
          { label: "Light", meta: "Key + rim · HDRI", media: { swatch: "radial-gradient(circle at 35% 35%, #fff4e4, #c9925a 30%, #1e1e1e 80%)" } },
          { label: "Final", meta: "Redshift · Nuke · 4K", media: base.cover },
        ],
      },
      { _type: "modelModule", _key: "model", title: "Turntable", caption: "Drag to rotate. Replace with the hero asset (.glb) in Sanity." },
      {
        _type: "styleframesModule",
        _key: "sf",
        title: "Styleframes",
        frames: [
          { code: "SF_01", media: { swatch: swatch.ember } },
          { code: "SF_02", media: { swatch: swatch.wire } },
          { code: "SF_03", media: { swatch: swatch.ink } },
        ],
      },
    ],
    next: { title: next.title, slug: next.slug, code: next.code },
  };
}

export const fallbackServices: Service[] = [
  { title: "Brand", deliverables: ["Strategy", "Identity system", "Guidelines"] },
  { title: "Motion", deliverables: ["Launch film", "Social cutdowns", "Motion toolkit"] },
  { title: "3D", deliverables: ["Product renders", "CG worlds", "Real-time assets"] },
  { title: "Graphic", deliverables: ["Campaign key art", "Posters", "Packaging"] },
  { title: "Launch", deliverables: ["Web + social rollout", "Asset library", "Handover"] },
];

export const fallbackAbout: About = {
  headline: "In-house by day. Open for select freelance.",
  bio: "[A short bio: background, the kind of work taken on, and who it is for. Two or three sentences, written for a creative director.]",
  portrait: { swatch: swatch.ink },
  experience: [
    { company: "[Current company]", role: "Senior 3D & Motion Designer", years: "2022 — Now" },
    { company: "[Previous company]", role: "Motion Designer", years: "2019 — 2022" },
    { company: "[First company]", role: "Graphic Designer", years: "2016 — 2019" },
  ],
  clients: ["[Client]", "[Client]", "[Client]", "[Client]", "[Client]", "[Client]"],
  awards: [
    { title: "[Award or feature]", year: "2026" },
    { title: "[Award or feature]", year: "2025" },
  ],
  tools: ["Houdini", "Cinema 4D", "Blender", "Redshift", "After Effects", "Nuke", "Illustrator", "Figma"],
};
