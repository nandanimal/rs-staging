import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
    }),
    defineField({
      name: "ticketUrl",
      title: "Ticket URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "soldOut",
      title: "Sold Out",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "startTime",
      title: "Start Time",
      type: "string",
      description: 'e.g. "7:00 PM", "Doors at 6:30 PM"',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "coverPhoto",
      title: "Cover Photo",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "city" },
  },
  orderings: [
    {
      title: "Date (Newest First)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});
