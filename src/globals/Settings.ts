import type { Field, GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { revalidateGlobal } from '@/hooks/revalidate'

/** Internal paths only, which also rules out javascript: URLs. */
const internalHref: Field = {
  name: 'href',
  type: 'text',
  required: true,
  admin: { description: 'A path on this site, such as /watches or /#faq.' },
  validate: (value: string | null | undefined) => /^\/(?!\/)/.test(value ?? '') || 'Start with a single /.',
}

const links = (name: string, maxRows = 8): Field => ({
  name,
  type: 'array',
  maxRows,
  fields: [{ type: 'row', fields: [{ name: 'label', type: 'text', required: true }, internalHref] }],
})

function httpsUrl(value: string | null | undefined) {
  return !value || /^https:\/\/\S+$/.test(value) || 'Use a full https:// link.'
}

/** Site-wide content: contact, navigation, footer, WhatsApp messages, watch page notes and SEO. */
export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGlobal('settings')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              name: 'whatsapp',
              type: 'text',
              required: true,
              admin: { description: 'International format, digits only. Example: 8801712345678' },
              validate: (value: string | null | undefined) =>
                /^\d{8,15}$/.test(value ?? '') || 'Use 8 to 15 digits, no spaces or +.',
            },
            { name: 'phone', type: 'text', required: true },
            { name: 'email', type: 'email' },
            { name: 'address', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                { name: 'instagram', type: 'text', validate: httpsUrl },
                { name: 'facebook', type: 'text', validate: httpsUrl },
              ],
            },
          ],
        },
        {
          label: 'Header',
          fields: [
            {
              name: 'announcements',
              type: 'array',
              maxRows: 3,
              admin: { description: 'The short lines in the dark bar at the very top.' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'contactLabel',
              type: 'text',
              required: true,
              defaultValue: 'Contact us',
              admin: { description: 'The link beside the phone number in the dark bar. Opens WhatsApp.' },
            },
            links('navigation', 6),
          ],
        },
        {
          label: 'Footer',
          fields: [
            { name: 'tagline', type: 'textarea', admin: { rows: 2 } },
            links('services', 5),
            { name: 'servicesNote', type: 'text' },
            links('legalLinks', 3),
            { name: 'copyright', type: 'text' },
            { name: 'footerNote', type: 'text' },
          ],
        },
        {
          label: 'Watch page',
          fields: [
            { name: 'detailNote', type: 'text', admin: { description: 'A line under the breadcrumbs.' } },
            { name: 'availableNote', type: 'text' },
            {
              type: 'row',
              fields: [
                { name: 'reassuranceTitle', type: 'text' },
                { name: 'reassuranceText', type: 'textarea', admin: { rows: 2 } },
              ],
            },
          ],
        },
        {
          label: 'Watch cards',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'cardDetailsLabel', type: 'text', required: true, admin: { description: 'Opens the watch page.' } },
                { name: 'cardPriceLabel', type: 'text', required: true, admin: { description: 'Opens WhatsApp with the price message.' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'referenceLabel', type: 'text', required: true, admin: { description: 'Before the reference number.' } },
                { name: 'boxLabel', type: 'text', required: true },
                { name: 'papersLabel', type: 'text', required: true },
                { name: 'boxPapersLabel', type: 'text', required: true, admin: { description: 'When both are included.' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'availableLabel', type: 'text', required: true },
                { name: 'soldLabel', type: 'text', required: true },
                { name: 'unavailableLabel', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Messages',
          description: 'Text pre-filled in WhatsApp. {watch} becomes the watch name and reference.',
          fields: [
            { name: 'messageGeneral', type: 'text', required: true },
            { name: 'messagePrice', type: 'text', required: true },
            { name: 'messageViewing', type: 'text', required: true },
            { name: 'messageFind', type: 'text', required: true, admin: { description: '{query} becomes the search.' } },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'siteTitle', type: 'text', required: true },
            { name: 'siteDescription', type: 'textarea', required: true, maxLength: 200 },
          ],
        },
      ],
    },
  ],
}
