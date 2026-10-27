import type { CollectionConfig } from 'payload'

import { authenticated, authenticatedOrPublished } from '@/access/authenticated'
import { revalidateCollection } from '@/hooks/revalidate'

export const conditions = ['Unworn', 'Excellent', 'Very good', 'Good'] as const
export const availabilities = ['available', 'sold', 'unavailable'] as const

export const Watches: CollectionConfig = {
  slug: 'watches',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'reference', 'availability', 'featured', '_status'],
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
  defaultSort: '-createdAt',
  hooks: {
    afterChange: [revalidateCollection('watches')],
    afterDelete: [revalidateCollection('watches')],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'brand', type: 'text', required: true, index: true },
        { name: 'model', type: 'text', required: true },
        { name: 'reference', type: 'text', index: true },
      ],
    },
    {
      // Stored so it can be the admin title, the slug source and a search target.
      name: 'title',
      type: 'text',
      index: true,
      admin: { hidden: true },
      hooks: {
        beforeValidate: [({ siblingData }) => `${siblingData.brand ?? ''} ${siblingData.model ?? ''}`.trim()],
      },
    },
    { name: 'slug', type: 'slug', useAsSlug: 'title' },
    { name: 'description', type: 'textarea', required: true, maxLength: 600 },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: 12,
    },
    {
      type: 'collapsible',
      label: 'Specifications',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'condition', type: 'select', options: [...conditions], required: true },
            { name: 'year', type: 'number', min: 1900, max: 2100 },
            { name: 'movement', type: 'select', options: ['Automatic', 'Manual', 'Quartz'] },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'caseSize', type: 'text', admin: { placeholder: '39 mm' } },
            { name: 'caseMaterial', type: 'text' },
            { name: 'dial', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'box', type: 'checkbox', label: 'Box included' },
            { name: 'papers', type: 'checkbox', label: 'Papers included' },
          ],
        },
      ],
    },
    {
      name: 'availability',
      type: 'select',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Sold', value: 'sold' },
        { label: 'Unavailable', value: 'unavailable' },
      ],
      defaultValue: 'available',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: { position: 'sidebar', description: 'Shown on the home page.' },
    },
  ],
}
