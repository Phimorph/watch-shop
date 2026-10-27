import type { MetadataRoute } from 'next'

import { getPageSlugs, getWatches } from '@/lib/queries'
import { serverURL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [watches, pages] = await Promise.all([getWatches({}), getPageSlugs()])

  return [
    { url: serverURL },
    { url: `${serverURL}/watches` },
    ...watches.map((watch) => ({ url: `${serverURL}/watches/${watch.slug}`, lastModified: watch.updatedAt })),
    ...pages.map((slug) => ({ url: `${serverURL}/${slug}` })),
  ]
}
