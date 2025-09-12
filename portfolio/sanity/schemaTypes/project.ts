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
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "image",
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
        }),
        defineField({
            name: "link",
            title: "Link",
            type: "url",
        }),
        defineField({
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{ type: "string" }],
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