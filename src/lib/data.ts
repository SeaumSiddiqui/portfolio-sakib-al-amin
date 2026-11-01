import "server-only";

import {
  fallbackAbout,
  fallbackProject,
  fallbackProjects,
  fallbackServices,
  fallbackSettings,
} from "@/content/fallback";
import { client } from "@/sanity/lib/client";
import {
  aboutQuery,
  projectQuery,
  projectSlugsQuery,
  projectsQuery,
  servicesQuery,
  settingsQuery,
} from "@/sanity/lib/queries";
import type { About, Project, ProjectSummary, Service, SiteSettings } from "./types";

const REVALIDATE_SECONDS = 60;

async function fetchOr<T>(query: string, params: Record<string, unknown>, fallback: () => T): Promise<T> {
  if (!client) return fallback();
  try {
    const result = await client.fetch<T | null>(query, params, { next: { revalidate: REVALIDATE_SECONDS } });
    if (result == null || (Array.isArray(result) && result.length === 0)) return fallback();
    return result;
  } catch (error) {
    console.error("[sanity] fetch failed, serving fallback content", error);
    return fallback();
  }
}

/** Fill gaps the client hasn't filled in yet, so the frame never renders empty. */
function withDefaults<T extends object>(value: Partial<T>, defaults: T): T {
  const out = { ...defaults } as Record<string, unknown>;
  for (const [key, v] of Object.entries(value)) {
    if (v == null || v === "" || (Array.isArray(v) && v.length === 0)) continue;
    out[key] = v;
  }
  return out as T;
}

export async function getSettings(): Promise<SiteSettings> {
  const s = await fetchOr<Partial<SiteSettings>>(settingsQuery, {}, () => fallbackSettings);
  return withDefaults(s, fallbackSettings);
}

export async function getProjects(): Promise<(ProjectSummary & { featured?: boolean })[]> {
  return fetchOr(projectsQuery, {}, () => fallbackProjects);
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!client) return fallbackProject(slug);
  const [project, all] = await Promise.all([
    fetchOr<Project | null>(projectQuery, { slug }, () => null),
    getProjects(),
  ]);
  if (!project) return null;
  const index = all.findIndex((p) => p.slug === slug);
  const next = all.length > 1 ? all[(index + 1) % all.length] : null;
  return { ...project, next: next && { title: next.title, slug: next.slug, code: next.code } };
}

export async function getProjectSlugs(): Promise<string[]> {
  return fetchOr<string[]>(projectSlugsQuery, {}, () => fallbackProjects.map((p) => p.slug));
}

export async function getServices(): Promise<Service[]> {
  return fetchOr(servicesQuery, {}, () => fallbackServices);
}

export async function getAbout(): Promise<About> {
  const a = await fetchOr<Partial<About>>(aboutQuery, {}, () => fallbackAbout);
  return withDefaults(a, fallbackAbout);
}

export function disciplineLabel(d: string) {
  return d === "3d" ? "3D" : d.charAt(0).toUpperCase() + d.slice(1);
}
