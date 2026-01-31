import { defineField, defineType } from "sanity";

export const experienceType = defineType({
    name: "experience",
    title: "Experience",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Job Title",
            type: "string",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "organization",
            title: "Organization",
            type: "string",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "period",
            title: "Period",
            type: "string",
            description: "e.g., Jan 2023 - Present",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "logo",
            title: "Organization Logo",
            type: "image",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "url",
            title: "Organization Website URL",
            type: "url",
            description: "Optional: Link to the organization's website",
            validation: Rule => Rule.uri({
                scheme: ['http', 'https']
            })
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
    preview: {
        select: {
            title: "title",
            subtitle: "organization",
            media: "logo"
        }
    }
});
