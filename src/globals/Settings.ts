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

/** A required one-line label. */
const label = (name: string, description?: string): Field => ({
  name,
  type: 'text',
  required: true,
  admin: { description },
})

function httpsUrl(value: string | null | undefined) {
  return !value || /^https:\/\/\S+$/.test(value) || 'Use a full https:// link.'
}

/** Site-wide content: contact, navigation, footer, WhatsApp messages, watch page notes and SEO. */
export const Settings: GlobalConfig = {
  slug: 'settings',
  admin: {
    group: 'Site',
  },
  // Keeps the last 25 saves, so a mistake can be restored from the Versions tab.
  versions: {
    max: 25,
  },
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
            {
              name: 'chatLabel',
              type: 'text',
              required: true,
              defaultValue: 'Chat on WhatsApp',
              admin: {
                description: 'The round WhatsApp button in the corner of every page. Opens WhatsApp with the general message.',
              },
            },
            { name: 'phone', type: 'text', required: true },
            { name: 'email', type: 'email' },
            { name: 'address', type: 'text', required: true },
            {
              name: 'social',
              type: 'array',
              maxRows: 4,
              admin: { description: 'Shown in the footer. Without a link the name shows muted, as a placeholder.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    { name: 'url', type: 'text', validate: httpsUrl },
                  ],
                },
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
            {
              type: 'row',
              fields: [
                label('headerSearchPlaceholder', 'Inside the search field in the header.'),
                label('searchLabel', 'Names the search field and button for screen readers.'),
              ],
            },
            {
              type: 'row',
              fields: [
                label('menuLabel', 'The menu button, for screen readers.'),
                label('closeMenuLabel'),
                label('announcementsLabel', 'Names the dark bar’s lines for screen readers.'),
              ],
            },
          ],
        },
        {
          label: 'Collection page',
          description: 'The search page at /watches, which brand links also open. Top to bottom.',
          fields: [
            { name: 'searchEyebrow', type: 'text' },
            {
              name: 'searchHeading',
              type: 'textarea',
              required: true,
              admin: { description: 'Wrap a word in *asterisks* for italics. New lines are kept.', rows: 2 },
            },
            { name: 'searchIntro', type: 'textarea', admin: { rows: 2, description: 'Also the description search engines show.' } },
            { type: 'row', fields: [label('searchPlaceholder'), label('searchButton')] },
            {
              type: 'row',
              fields: [
                label('refineLabel'),
                label('filterBrandLabel', 'Names the brand list for screen readers.'),
                label('filterConditionLabel', 'Names the condition list for screen readers.'),
                label('filterAvailabilityLabel', 'Names the availability list for screen readers.'),
              ],
            },
            { type: 'row', fields: [label('allBrands'), label('allConditions'), label('allWatches')] },
            { type: 'row', fields: [label('sortLabel'), label('sortNewest'), label('sortBrand'), label('sortModel')] },
            {
              type: 'row',
              fields: [label('applyLabel', 'Applies the lists, which need a press without JavaScript.'), label('clearLabel')],
            },
            {
              type: 'row',
              fields: [
                label('resultsOne', '{count} becomes the number.'),
                label('resultsMany', '{count} becomes the number.'),
                label('resultsFor', '{q} becomes the search.'),
              ],
            },
            { type: 'row', fields: [{ name: 'resultsNote', type: 'text' }, label('loadMoreLabel')] },
            {
              name: 'loadMoreCount',
              type: 'text',
              required: true,
              defaultValue: 'Showing {shown} of {total} watches',
              admin: { description: 'Above “load more”. {shown} and {total} become the numbers.' },
            },
            { type: 'row', fields: [label('emptyHeading'), label('emptyText')] },
            {
              type: 'row',
              fields: [label('emptyButton', 'Opens WhatsApp with the “find” message.'), label('emptyClear')],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            { name: 'tagline', type: 'textarea', admin: { rows: 2 } },
            {
              type: 'row',
              fields: [
                {
                  name: 'exploreHeading',
                  type: 'text',
                  required: true,
                  admin: { description: 'Lists the header navigation.' },
                },
                { name: 'servicesHeading', type: 'text', required: true },
                { name: 'contactHeading', type: 'text', required: true },
                { name: 'followHeading', type: 'text', required: true },
              ],
            },
            links('services', 5),
            { name: 'servicesNote', type: 'text' },
            {
              name: 'legalLinks',
              type: 'array',
              maxRows: 3,
              admin: {
                description:
                  'Create the page under Site → Pages, then link it as /its-slug. Without a link the name shows muted, as a placeholder.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    {
                      name: 'href',
                      type: 'text',
                      validate: (value: string | null | undefined) =>
                        !value || /^\/(?!\/)/.test(value) || 'Start with a single /.',
                    },
                  ],
                },
              ],
            },
            { name: 'copyright', type: 'text' },
            { name: 'footerNote', type: 'text' },
          ],
        },
        {
          label: 'Watch page',
          description: 'Every label on a watch’s own page, top to bottom.',
          fields: [
            { type: 'row', fields: [label('breadcrumbHome'), label('breadcrumbCollection')] },
            { name: 'detailNote', type: 'text', admin: { description: 'A line under the breadcrumbs.' } },
            label('referenceHeading', 'Before the reference number, beside the title.'),
            { type: 'row', fields: [label('availableHeadline'), { name: 'availableNote', type: 'text' }] },
            {
              type: 'row',
              fields: [label('soldHeadline'), label('unavailableHeadline'), { name: 'unavailableNote', type: 'text' }],
            },
            {
              type: 'row',
              fields: [
                label('priceButton', 'Opens WhatsApp with the price message.'),
                label('viewingButton', 'Opens WhatsApp with the viewing message.'),
                label('exploreButton', 'Shown instead when the watch is sold or unavailable.'),
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'reassuranceTitle', type: 'text' },
                { name: 'reassuranceText', type: 'textarea', admin: { rows: 2 } },
              ],
            },
            label('specsHeading'),
            {
              name: 'specLabels',
              type: 'group',
              admin: { description: 'Box and papers use the labels under Watch cards.' },
              fields: [
                {
                  type: 'row',
                  fields: [label('condition'), label('year'), label('movement'), label('caseSize')],
                },
                {
                  type: 'row',
                  fields: [label('caseMaterial'), label('dial'), label('included'), label('notIncluded')],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                label('viewingHeading'),
                label('viewingText', 'The address follows it.'),
                label('viewingLink'),
              ],
            },
            label('backLabel'),
            { type: 'row', fields: [label('relatedEyebrow'), label('relatedHeading'), label('relatedLink')] },
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
