import { defineField, defineType } from "sanity";

export const projectsType = defineType({
    name: "project",
    title: "Project",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "image",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "link",
            title: "Link",
            type: "url",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{ type: "string" }],
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "orderRank",
            title: "Order Rank",
            type: "string",
            hidden: true,
            initialValue: "0",
        })
    ],
    orderings: [
        {
            title: "Display Order",
            name: "orderAsc",
            by: [
                { field: "orderRank", direction: "asc" }
            ]
        }
    ],
});