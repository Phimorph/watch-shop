import type { MetadataRoute } from 'next'

import { serverURL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${serverURL}/sitemap.xml`,
  }
}
