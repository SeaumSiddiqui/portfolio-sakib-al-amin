import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "hud", title: "Status bar" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "name", type: "string", group: "identity", validation: (r) => r.required() }),
    defineField({ name: "monogram", type: "string", group: "identity", description: "2–3 characters", validation: (r) => r.max(3) }),
    defineField({ name: "role", type: "string", group: "identity", initialValue: "Motion · 3D · Graphic designer" }),
    defineField({ name: "statement", type: "text", rows: 2, group: "identity", description: "One line on the home page panel, in your own voice." }),
    defineField({
      name: "heroLines",
      title: "Hero lines",
      type: "array",
      group: "identity",
      of: [{ type: "string" }],
      description: "Exactly three short lines set huge on the home grid, e.g. First name / Last name / Designer.",
      validation: (r) => r.length(3),
    }),
    defineField({
      name: "heroFacts",
      title: "Hero facts",
      type: "array",
      group: "identity",
      of: [{ type: "string" }],
      description: "Two to four short lines: current role, current company, previous companies.",
      validation: (r) => r.max(4),
    }),
    defineField({ name: "heroPortrait", title: "Hero portrait", type: "media", group: "identity" }),
    defineField({ name: "email", type: "string", group: "identity" }),
    defineField({
      name: "socials",
      type: "array",
      group: "identity",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [defineField({ name: "label", type: "string" }), defineField({ name: "url", type: "url" })],
        }),
      ],
    }),
    defineField({ name: "city", type: "string", group: "hud" }),
    defineField({
      name: "timezone",
      type: "string",
      group: "hud",
      description: "IANA name for the live clock, e.g. Europe/London or Asia/Dhaka.",
      initialValue: "UTC",
    }),
    defineField({ name: "nextAvailability", title: "Open for freelance from", type: "date", group: "hud" }),
    defineField({ name: "bookingUrl", title: "Book a call URL", type: "url", group: "hud", description: "Cal.com or Calendly link." }),
    defineField({ name: "bookingAvatar", title: "Book a call photo", type: "image", group: "hud", description: "Small portrait shown inside the Book a call button." }),
    defineField({
      name: "clients",
      title: "Client logos",
      type: "array",
      group: "identity",
      description: "Shown with their names on the home page panel.",
      of: [
        defineArrayMember({
          type: "object",
          name: "clientMark",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "logo", type: "image", description: "Square-ish mark, works best monochrome." }),
          ],
          preview: { select: { title: "name", media: "logo" } },
        }),
      ],
    }),
    defineField({ name: "showreel", type: "media", group: "hud" }),
    defineField({ name: "showreelLabel", type: "string", group: "hud", initialValue: "Showreel 2026" }),
    defineField({ name: "engagementFrom", title: "Freelance projects from", type: "string", group: "hud", description: "e.g. $25,000 — shown on Services." }),
    defineField({ name: "seoDescription", type: "text", rows: 3, group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "card", title: "Card", default: true },
    { name: "page", title: "Page" },
  ],
  orderings: [{ title: "Manual order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  fields: [
    defineField({ name: "title", type: "string", group: "card", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", group: "card", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "code", type: "string", group: "card", description: "Mono code shown on cards, e.g. WK_001" }),
    defineField({ name: "order", type: "number", group: "card" }),
    defineField({ name: "featured", title: "Show on home strip", type: "boolean", group: "card", initialValue: true }),
    defineField({
      name: "disciplines",
      type: "array",
      group: "card",
      of: [{ type: "string" }],
      options: { list: [{ title: "Motion", value: "motion" }, { title: "3D", value: "3d" }, { title: "Graphic", value: "graphic" }], layout: "grid" },
      validation: (r) => r.min(1),
    }),
    defineField({ name: "format", type: "string", group: "card", description: "e.g. 3D Film, Identity, Title sequence" }),
    defineField({ name: "client", type: "string", group: "card" }),
    defineField({ name: "year", type: "string", group: "card" }),
    defineField({ name: "tools", type: "array", group: "card", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "cover", type: "media", group: "card", description: "Short muted loop or still for cards." }),
    defineField({ name: "headline", type: "string", group: "page", description: "Set on black bars over the film." }),
    defineField({ name: "hero", type: "media", group: "page", description: "Full film for the top of the page." }),
    defineField({ name: "summary", type: "text", rows: 3, group: "page" }),
    defineField({ name: "agency", type: "string", group: "page" }),
    defineField({ name: "roles", type: "array", group: "page", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "recognition", type: "string", group: "page" }),
    defineField({ name: "specs", title: "Extra specs", type: "array", group: "page", of: [{ type: "spec" }] }),
    defineField({
      name: "modules",
      title: "Page sections",
      type: "array",
      group: "page",
      of: [
        { type: "filmModule" },
        { type: "breakdownModule" },
        { type: "modelModule" },
        { type: "styleframesModule" },
        { type: "textModule" },
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "code", media: "cover.image" } },
});

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "order", type: "number", description: "First and last are drawn as the start and end of the diagram." }),
    defineField({ name: "deliverables", type: "array", of: [{ type: "string" }] }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({ name: "headline", type: "string" }),
    defineField({ name: "bio", type: "text", rows: 6 }),
    defineField({ name: "portrait", type: "media" }),
    defineField({
      name: "experience",
      type: "array",
      description: "Companies worked at, newest first.",
      of: [
        defineArrayMember({
          type: "object",
          name: "position",
          fields: [
            defineField({ name: "company", type: "string", validation: (r) => r.required() }),
            defineField({ name: "role", type: "string" }),
            defineField({ name: "years", type: "string", description: "e.g. 2022 — Now" }),
          ],
          preview: { select: { title: "company", subtitle: "role" } },
        }),
      ],
    }),
    defineField({ name: "clients", title: "Brands worked on", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({
      name: "awards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "award",
          fields: [defineField({ name: "title", type: "string" }), defineField({ name: "year", type: "string" })],
          preview: { select: { title: "title", subtitle: "year" } },
        }),
      ],
    }),
    defineField({ name: "tools", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
  ],
  preview: { prepare: () => ({ title: "About" }) },
});

export const enquiry = defineType({
  name: "enquiry",
  title: "Enquiry",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "discipline", type: "string" }),
    defineField({ name: "budget", type: "string" }),
    defineField({ name: "message", type: "text" }),
    defineField({ name: "receivedAt", type: "datetime" }),
  ],
  orderings: [{ title: "Newest", name: "newest", by: [{ field: "receivedAt", direction: "desc" }] }],
  preview: { select: { title: "name", subtitle: "budget" } },
});
