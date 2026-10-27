import type { MetadataRoute } from 'next'

import { getWatches } from '@/lib/queries'
import { serverURL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const watches = await getWatches({})

  return [
    { url: serverURL },
    { url: `${serverURL}/watches` },
    ...watches.map((watch) => ({ url: `${serverURL}/watches/${watch.slug}`, lastModified: watch.updatedAt })),
  ]
}
