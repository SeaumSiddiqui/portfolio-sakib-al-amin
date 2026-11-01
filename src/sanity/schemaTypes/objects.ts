import { defineArrayMember, defineField, defineType } from "sanity";

export const media = defineType({
  name: "media",
  title: "Media",
  type: "object",
  description: "Add a video for motion work, an image for stills. Video wins when both are set.",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({ name: "videoFile", title: "Video file", type: "file", options: { accept: "video/*" } }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "Direct .mp4 or HLS .m3u8 link (e.g. from Mux). Used when no file is uploaded.",
    }),
    defineField({
      name: "swatch",
      title: "Placeholder colour",
      type: "string",
      description: "Optional CSS background shown while media loads.",
    }),
  ],
});

export const spec = defineType({
  name: "spec",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});

export const filmModule = defineType({
  name: "filmModule",
  title: "Film",
  type: "object",
  fields: [
    defineField({ name: "media", type: "media", validation: (r) => r.required() }),
    defineField({ name: "caption", type: "string" }),
  ],
  preview: { select: { title: "caption" }, prepare: ({ title }) => ({ title: title || "Film" }) },
});

export const breakdownModule = defineType({
  name: "breakdownModule",
  title: "3D breakdown",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Breakdown" }),
    defineField({
      name: "passes",
      type: "array",
      description: "In order, e.g. Wireframe, Clay, Lighting, Final.",
      of: [
        defineArrayMember({
          type: "object",
          name: "pass",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "meta", type: "string", description: "e.g. 1.2M polys · Houdini" }),
            defineField({ name: "media", type: "media" }),
          ],
          preview: { select: { title: "label", subtitle: "meta" } },
        }),
      ],
      validation: (r) => r.min(2),
    }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: title || "3D breakdown" }) },
});

export const modelModule = defineType({
  name: "modelModule",
  title: "3D model viewer",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Turntable" }),
    defineField({ name: "model", title: "Model (.glb)", type: "file", options: { accept: ".glb,.gltf" } }),
    defineField({ name: "caption", type: "string" }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: title || "3D model viewer" }) },
});

export const styleframesModule = defineType({
  name: "styleframesModule",
  title: "Styleframes",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Styleframes" }),
    defineField({
      name: "frames",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "frame",
          fields: [
            defineField({ name: "code", type: "string", description: "e.g. SF_01" }),
            defineField({ name: "media", type: "media" }),
          ],
          preview: { select: { title: "code", media: "media.image" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: title || "Styleframes" }) },
});

export const textModule = defineType({
  name: "textModule",
  title: "Text",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "body", type: "text", rows: 5, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "heading", subtitle: "body" } },
});
