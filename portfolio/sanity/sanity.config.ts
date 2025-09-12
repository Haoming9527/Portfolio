import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Portfolio',

  projectId: 'yj7sdlty',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            orderableDocumentListDeskItem({
              title: 'Projects',
              type: 'project',
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              title: 'Certificates',
              type: 'certificate',
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              title: 'Education',
              type: 'education',
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              title: 'Experience',
              type: 'experience',
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              title: 'Technology',
              type: 'technology',
              S,
              context,
            }),
          ]),
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})
