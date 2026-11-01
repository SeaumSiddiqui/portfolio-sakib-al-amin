export type Discipline = "motion" | "3d" | "graphic";

export type Media = {
  imageUrl?: string | null;
  alt?: string | null;
  videoUrl?: string | null;
  swatch?: string | null;
};

export type Social = { label: string; url: string };

export type ClientMark = { name: string; logoUrl?: string | null; swatch?: string | null };

export type SiteSettings = {
  name: string;
  monogram: string;
  role: string;
  statement: string;
  /** The three lines of the home hero, e.g. first name / last name / discipline. */
  heroLines: string[];
  /** A few short facts under the hero: current role, company, previous companies. */
  heroFacts: string[];
  heroPortrait?: Media | null;
  email?: string | null;
  socials: Social[];
  city?: string | null;
  timezone: string;
  nextAvailability?: string | null;
  bookingUrl?: string | null;
  bookingAvatarUrl?: string | null;
  clients: ClientMark[];
  showreel?: Media | null;
  showreelLabel: string;
  engagementFrom?: string | null;
  seoDescription?: string | null;
};

export type ProjectSummary = {
  title: string;
  slug: string;
  code: string;
  disciplines: Discipline[];
  format?: string | null;
  client?: string | null;
  year?: string | null;
  tools: string[];
  cover?: Media | null;
};

export type BreakdownPass = { label: string; meta?: string | null; media?: Media | null };

export type ProjectModule =
  | { _type: "filmModule"; _key: string; media: Media; caption?: string | null }
  | { _type: "breakdownModule"; _key: string; title?: string | null; passes: BreakdownPass[] }
  | { _type: "modelModule"; _key: string; title?: string | null; modelUrl?: string | null; caption?: string | null }
  | { _type: "styleframesModule"; _key: string; title?: string | null; frames: { code?: string | null; media?: Media | null }[] }
  | { _type: "textModule"; _key: string; heading?: string | null; body: string };

export type Project = ProjectSummary & {
  headline?: string | null;
  hero?: Media | null;
  summary?: string | null;
  agency?: string | null;
  roles: string[];
  recognition?: string | null;
  specs: { label: string; value: string }[];
  modules: ProjectModule[];
  next?: Pick<ProjectSummary, "title" | "slug" | "code"> | null;
};

export type Service = { title: string; deliverables: string[] };

export type About = {
  headline: string;
  bio: string;
  portrait?: Media | null;
  experience: { company: string; role: string; years: string }[];
  clients: string[];
  awards: { title: string; year?: string | null }[];
  tools: string[];
};
