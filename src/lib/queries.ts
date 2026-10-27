import 'server-only'

import config from '@payload-config'
import { cacheLife, cacheTag } from 'next/cache'
import { getPayload, type Where } from 'payload'

import type { Media, Watch } from '@/payload-types'

/*
 * Every read the site makes goes through the Payload Local API on the server, so the
 * browser never calls /api. Reads run as an anonymous visitor (`overrideAccess: false`):
 * access control only returns published watches.
 *
 * Each read is cached with `use cache` and tagged, which puts the content in the
 * prerendered static shell (PPR). Payload hooks revalidate the tags when an editor saves.
 */

export type WatchWithImages = Omit<Watch, 'images'> & { images: Media[] }

export type WatchFilters = {
  q?: string
  brand?: string
  condition?: Watch['condition']
  availability?: Watch['availability']
  sort?: keyof typeof sorts
}

export const sorts = { newest: '-createdAt', brand: 'brand', model: 'model' } as const

/** Narrows a populated upload field to its document. */
export const asMedia = (value: string | Media | null | undefined): Media | null =>
  value && typeof value === 'object' ? value : null

const withImages = (watch: Watch): WatchWithImages => ({
  ...watch,
  images: watch.images.map(asMedia).filter((image) => image !== null),
})

export async function getWatches({ q, brand, condition, availability, sort = 'newest' }: WatchFilters = {}) {
  'use cache'
  cacheLife('max')
  cacheTag('watches')

  const and: Where[] = []
  if (q) and.push({ or: [{ title: { like: q } }, { reference: { like: q } }] })
  if (brand) and.push({ brand: { equals: brand } })
  if (condition) and.push({ condition: { equals: condition } })
  if (availability) and.push({ availability: { equals: availability } })

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'watches',
    overrideAccess: false,
    where: and.length ? { and } : undefined,
    sort: sorts[sort],
    depth: 1,
    pagination: false,
  })

  return docs.map(withImages)
}

export async function getFeaturedWatches() {
  'use cache'
  cacheLife('max')
  cacheTag('watches')

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'watches',
    overrideAccess: false,
    where: { featured: { equals: true }, availability: { equals: 'available' } },
    depth: 1,
    limit: 4,
  })

  return docs.map(withImages)
}

export async function getWatch(slug: string) {
  'use cache'
  cacheLife('max')
  cacheTag('watches')

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'watches',
    overrideAccess: false,
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  return docs[0] ? withImages(docs[0]) : null
}

/** Distinct brands across published watches, for the filters. */
export async function getBrands() {
  'use cache'
  cacheLife('max')
  cacheTag('watches')

  const payload = await getPayload({ config })
  const { values } = await payload.findDistinct({
    collection: 'watches',
    field: 'brand',
    overrideAccess: false,
    sort: 'brand',
  })

  return values.map(({ brand }) => brand)
}

export async function getHome() {
  'use cache'
  cacheLife('max')
  cacheTag('home')

  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'home', overrideAccess: false, depth: 1 })
}

export async function getSettings() {
  'use cache'
  cacheLife('max')
  cacheTag('settings')

  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'settings', overrideAccess: false, depth: 1 })
}

/** Media is served through the `/media` rewrite so no `/api` URL reaches the page. */
export const mediaSrc = (media: Media) => `/media/${encodeURIComponent(media.filename ?? '')}`

/** A WhatsApp chat link with an editor-written message; `{watch}` names the watch. */
export function whatsappHref(number: string, message: string, watch?: Pick<Watch, 'title' | 'reference'>) {
  const name = watch ? [watch.title, watch.reference && `(ref. ${watch.reference})`].filter(Boolean).join(' ') : ''
  return `https://wa.me/${number}?text=${encodeURIComponent(message.replaceAll('{watch}', name))}`
}
