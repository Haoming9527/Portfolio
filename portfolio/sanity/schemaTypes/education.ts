import { defineField, defineType } from "sanity";

export const educationType = defineType({
    name: "education",
    title: "Education",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Institution Name",
            type: "string",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "period",
            title: "Period",
            type: "string",
            description: "e.g., Apr 2024 - Present",
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
            title: "Institution Logo",
            type: "image",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "color",
            title: "Color Theme",
            type: "string",
            options: {
                list: [
                    { title: "Blue", value: "blue" },
                    { title: "Purple", value: "purple" },
                    { title: "Indigo", value: "indigo" },
                    { title: "Green", value: "green" },
                    { title: "Red", value: "red" },
                    { title: "Orange", value: "orange" }
                ]
            },
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "url",
            title: "Institution Website URL",
            type: "url",
            description: "Optional: Link to the institution's website",
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
            subtitle: "period",
            media: "logo"
        }
    }
});
