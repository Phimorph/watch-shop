import type { Field, GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { revalidateGlobal } from '@/hooks/revalidate'

const eyebrow: Field = { name: 'eyebrow', type: 'text' }
const heading: Field = {
  name: 'heading',
  type: 'textarea',
  required: true,
  admin: { description: 'Wrap a word in *asterisks* for italics. New lines are kept.', rows: 2 },
}
const intro: Field = { name: 'intro', type: 'textarea', admin: { rows: 2 } }

/** Every word and picture on the home page, one tab per section, in page order. */
export const Home: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGlobal('home')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          fields: [
            eyebrow,
            heading,
            intro,
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: { description: 'Shown dimmed behind the turning ring of featured watches.' },
            },
            { name: 'buttonLabel', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                { name: 'questionPrompt', type: 'text', admin: { placeholder: 'Have a question?' } },
                { name: 'questionLabel', type: 'text', admin: { placeholder: 'Talk to us.' } },
              ],
            },
            { name: 'caption', type: 'text', admin: { description: 'Small text under the ring, for example the city.' } },
            {
              name: 'watchesLabel',
              type: 'text',
              required: true,
              admin: { description: 'Names the featured watches for screen readers.' },
            },
          ],
        },
        {
          name: 'brands',
          fields: [
            {
              name: 'note',
              type: 'text',
              required: true,
              admin: {
                description:
                  'Read to screen readers with the brand strip under the hero. The brands themselves come from the watches.',
              },
            },
          ],
        },
        {
          name: 'catalog',
          label: 'Collection',
          fields: [
            heading,
            intro,
            { name: 'linkLabel', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                { name: 'noticeLeft', type: 'text' },
                { name: 'noticeRight', type: 'text' },
              ],
            },
            { name: 'count', type: 'number', defaultValue: 8, min: 4, max: 16, admin: { description: 'Watches shown on the home page.' } },
            {
              type: 'row',
              fields: [
                {
                  name: 'countLabel',
                  type: 'text',
                  required: true,
                  admin: { description: '{shown} and {total} become the numbers.' },
                },
                { name: 'moreLabel', type: 'text', required: true, admin: { description: 'Shows the rest of the watches.' } },
              ],
            },

          ],
        },
        {
          name: 'trust',
          fields: [
            eyebrow,
            heading,
            {
              name: 'items',
              type: 'array',
              maxRows: 3,
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Shield', value: 'shield' },
                    { label: 'Check', value: 'check' },
                    { label: 'Bag', value: 'bag' },
                  ],
                },
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          name: 'sold',
          fields: [
            eyebrow,
            heading,
            intro,
            {
              type: 'row',
              fields: [
                { name: 'mark', type: 'textarea', admin: { rows: 2, description: 'The italic mark on the right.' } },
                {
                  name: 'markNumber',
                  type: 'text',
                  admin: { description: 'Under the mark. {total} becomes the number of sold watches.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'noticeLeft', type: 'text' },
                { name: 'noticeRight', type: 'text' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'countLabel',
                  type: 'text',
                  required: true,
                  admin: { description: '{shown} and {total} become the numbers.' },
                },
                { name: 'linkLabel', type: 'text', required: true, admin: { description: 'Shows the rest of the watches.' } },
              ],
            },
          ],
        },
        {
          name: 'story',
          label: 'About',
          fields: [
            eyebrow,
            heading,
            { name: 'body', type: 'textarea', required: true },
            {
              type: 'row',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'imageCaption', type: 'text' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'founderName', type: 'text' },
                { name: 'founderRole', type: 'text' },
              ],
            },
            { name: 'linkLabel', type: 'text', required: true },
          ],
        },
        {
          name: 'reviews',
          fields: [
            eyebrow,
            heading,
            intro,
            {
              name: 'items',
              type: 'array',
              admin: { description: 'Only publish reviews you have permission to share.' },
              fields: [
                { name: 'quote', type: 'textarea', required: true },
                { name: 'author', type: 'text', required: true },
              ],
            },
            { name: 'emptyText', type: 'text', admin: { description: 'Shown while there are no reviews.' } },
          ],
        },
        {
          name: 'faq',
          label: 'FAQ',
          fields: [
            eyebrow,
            heading,
            intro,
            {
              name: 'questions',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
