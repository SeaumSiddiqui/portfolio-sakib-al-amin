export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-11-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** False until a Sanity project ID is set in .env.local; the site then serves fallback content. */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);
