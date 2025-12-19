import {defineField, defineType} from 'sanity'

export const certificatesType = defineType({
  name: 'certificate',
  title: 'Certificate',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company/Organization',
      type: 'string',
      description:
        'The company or organization that issued this certificate (optional). Certificates from the same company will be grouped together.',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'string',
      hidden: true,
      initialValue: '0',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'orderRank', direction: 'asc'}],
    },
  ],
})
