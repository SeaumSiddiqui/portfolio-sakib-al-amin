import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

export const client: SanityClient | null = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;

export function writeClient(): SanityClient | null {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!client || !token) return null;
  return client.withConfig({ token, useCdn: false });
}
