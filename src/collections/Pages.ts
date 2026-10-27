import type { CollectionConfig } from 'payload'

import { authenticated, authenticatedOrPublished } from '@/access/authenticated'
import { revalidateCollection } from '@/hooks/revalidate'

/** Plain text pages, such as privacy, terms or delivery, served at /their-slug. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Site',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'Text pages such as privacy or terms. Link one from Settings → Footer → Legal links as /its-slug.',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidateCollection('pages')],
    afterDelete: [revalidateCollection('pages')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'title' },
    { name: 'intro', type: 'textarea', admin: { rows: 2, description: 'Also the description search engines show.' } },
    {
      name: 'sections',
      type: 'array',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea', required: true, admin: { description: 'A blank line starts a new paragraph.' } },
      ],
    },
  ],
}
