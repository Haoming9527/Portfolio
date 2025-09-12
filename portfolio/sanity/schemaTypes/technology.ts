import { defineType, defineField } from "sanity";

export const technologyType = defineType({
  name: "technology",
  title: "Technology",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Technology Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
    name: "icon",
    title: "Icon",
    type: "image",
    options: {
        hotspot: true,
    },
    validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: "link",
        title: "Technology Link",
        type: "url",
        description: "Link to the technology's official page or documentation",
    }),
    defineField({
        name: "orderRank",
        title: "Order Rank",
        type: "string",
        hidden: true,
        initialValue: "0",
    }),
    ],
  preview: {
    select: {
      title: "name",
      media: "icon",
      subtitle: "link",
    },
  },
});
