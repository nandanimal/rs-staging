import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Standup", value: "standup" },
          { title: "Film", value: "film" },
          { title: "Documentary", value: "documentary" },
          { title: "Misc", value: "misc" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "artist",
      title: "Artist",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "networks",
      title: "Network(s)",
      type: "array",
      of: [
        {
          type: "image",
          options: { accept: "image/png" },
        },
      ],
    }),
    defineField({
      name: "starring",
      title: "Starring",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "directedBy",
      title: "Directed By",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
    defineField({
      name: "merch",
      title: "Merch",
      type: "array",
      of: [
        {
          type: "object",
          name: "merchItem",
          title: "Merch Item",
          fields: [
            defineField({
              name: "photo",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "desc",
              title: "Description",
              type: "text",
              rows: 2,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", media: "photo" },
          },
        },
      ],
    }),
    defineField({
      name: "coverPhoto",
      title: "Cover Photo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mobileCoverPhoto",
      title: "Mobile Cover Photo",
      type: "image",
      description:
        "Optional portrait crop for the mobile hero. Use the crop tool to frame the subject vertically (9:16 ratio). Falls back to Cover Photo if not set.",
      options: { hotspot: true },
    }),
    defineField({
      name: "titleCard",
      title: "Title Card",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "videoPreview",
      title: "Video Preview",
      type: "file",
      options: { accept: "video/*" },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "artist", media: "coverPhoto" },
  },
});
