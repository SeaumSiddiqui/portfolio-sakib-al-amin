import { defineQuery } from "next-sanity";

const media = `{
  "imageUrl": image.asset->url,
  "alt": image.alt,
  "videoUrl": coalesce(videoFile.asset->url, videoUrl),
  swatch
}`;

const summary = `
  title,
  "slug": slug.current,
  "code": coalesce(code, ""),
  "disciplines": coalesce(disciplines, []),
  format,
  client,
  year,
  "tools": coalesce(tools, []),
  cover ${media}
`;

export const settingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  name, monogram, role, statement, email,
  "heroLines": coalesce(heroLines, []),
  "heroFacts": coalesce(heroFacts, []),
  heroPortrait ${media},
  "socials": coalesce(socials, []),
  city, timezone, nextAvailability, bookingUrl,
  "bookingAvatarUrl": bookingAvatar.asset->url,
  "clients": coalesce(clients[]{name, "logoUrl": logo.asset->url}, []),
  showreel ${media}, showreelLabel, engagementFrom, seoDescription
}`);

export const projectsQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(order asc, year desc) { ${summary}, featured }`);

export const projectQuery = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  ${summary},
  headline, hero ${media}, summary, agency, recognition,
  "roles": coalesce(roles, []),
  "specs": coalesce(specs[]{label, value}, []),
  "modules": coalesce(modules[]{
    _type, _key, caption, title, heading, body,
    media ${media},
    "modelUrl": model.asset->url,
    "passes": passes[]{label, meta, media ${media}},
    "frames": frames[]{code, media ${media}}
  }, [])
}`);

export const projectSlugsQuery = defineQuery(`*[_type == "project" && defined(slug.current)].slug.current`);

export const servicesQuery = defineQuery(`*[_type == "service"] | order(order asc){ title, "deliverables": coalesce(deliverables, []) }`);

export const aboutQuery = defineQuery(`*[_id == "about"][0]{
  headline, bio, portrait ${media},
  "experience": coalesce(experience[]{company, role, years}, []),
  "clients": coalesce(clients, []),
  "awards": coalesce(awards[]{title, year}, []),
  "tools": coalesce(tools, [])
}`);
