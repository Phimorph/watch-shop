/**
 * Loads sample content into Payload for development: photos, watches, the home page and
 * site settings. The site never reads this file; it reads Payload.
 * Run with `pnpm seed`. Each part is written only while it is still empty, so re-running
 * never overwrites content an editor has changed. `pnpm seed --force` rewrites the home
 * page and settings globals (never the watches).
 */
import config from '@payload-config'
import path from 'path'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { fileURLToPath } from 'url'

import { home, settings } from './content'
import { photos, watches, type Photo } from './watches'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const context = { disableRevalidate: true }
const force = process.argv.includes('--force')

const payload = await getPayload({ config })

const media = {} as Record<Photo, string>
for (const [name, alt] of Object.entries(photos) as [Photo, string][]) {
  const { docs } = await payload.find({
    collection: 'media',
    overrideAccess: true,
    where: { alt: { equals: alt } },
    limit: 1,
  })
  media[name] =
    docs[0]?.id ??
    (
      await payload.create({
        collection: 'media',
        overrideAccess: true,
        context,
        data: { alt },
        filePath: path.resolve(dirname, `./images/watch-${name}.webp`),
      })
    ).id
}

const { totalDocs } = await payload.count({ collection: 'watches', overrideAccess: true })
if (totalDocs === 0) {
  for (const { photos: names, ...watch } of watches) {
    const data: RequiredDataFromCollectionSlug<'watches'> = {
      ...watch,
      slug: `${watch.brand} ${watch.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      images: names.map((name) => media[name]),
      _status: 'published',
    }
    await payload.create({ collection: 'watches', overrideAccess: true, context, data })
  }
  payload.logger.info(`Seeded ${watches.length} watches.`)
}

const currentHome = await payload.findGlobal({ slug: 'home', overrideAccess: true, depth: 0 })
if (force || !currentHome.hero?.heading) {
  await payload.updateGlobal({ slug: 'home', overrideAccess: true, context, data: home(media) })
  payload.logger.info('Seeded the home page.')
} else if (await fillNew('home', currentHome, home(media))) {
  payload.logger.info('Filled new home page fields.')
}

const currentSettings = await payload.findGlobal({ slug: 'settings', overrideAccess: true, depth: 0 })
if (force || !currentSettings.siteTitle) {
  await payload.updateGlobal({ slug: 'settings', overrideAccess: true, context, data: settings() })
  payload.logger.info('Seeded site settings.')
} else if (await fillNew('settings', currentSettings, settings())) {
  payload.logger.info('Filled new settings fields.')
}

process.exit(0)

/**
 * Fields added after the first seed come back undefined. Give those their sample value and
 * keep everything else, so an editor's content (even a cleared field) is never overwritten.
 */
async function fillNew(slug: 'home' | 'settings', current: object, sample: object) {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, globalType: _globalType, ...data } = current as Record<string, unknown>
  const filled = withNew(data, sample)
  if (JSON.stringify(filled) === JSON.stringify(data)) return false
  await payload.updateGlobal({ slug, overrideAccess: true, context, data: filled as never })
  return true
}

function withNew(current: unknown, sample: unknown): unknown {
  if (current === undefined) return sample
  if (!isRecord(current) || !isRecord(sample)) return current
  const keys = new Set([...Object.keys(current), ...Object.keys(sample)])
  return Object.fromEntries([...keys].map((key) => [key, withNew(current[key], sample[key])]))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

