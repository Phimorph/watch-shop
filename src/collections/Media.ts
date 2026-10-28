import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { revalidateCollection } from '@/hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Shop',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  // Watches, the home page and settings all show photographs, read with them filled in.
  hooks: {
    afterChange: [revalidateCollection('watches', 'home', 'settings')],
    afterDelete: [revalidateCollection('watches', 'home', 'settings')],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the photograph for people who cannot see it, e.g. "Rolex Explorer II, black dial".' },
    },
  ],
  upload: {
    // Inside public/ so a deploy serves the photographs as static files from the CDN;
    // a serverless function cannot read them from disk reliably.
    staticDir: 'public/media',
    adminThumbnail: ({ doc }) => `/media/${encodeURIComponent(String(doc.filename))}`,
    // Raster formats only: SVG can carry script.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  },
}
