import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPage, getPageSlugs } from '@/lib/queries'

/*
 * Text pages from the Pages collection, such as /privacy; any other URL gets the site's own
 * 404, marked noindex. Next.js streams an unknown URL's first visit with status 200, then
 * serves it as a 404.
 */

/** Allowed to block: nothing can show until the slug's document is read. */
export const instant = false

/** Cache Components needs at least one sample; with no pages yet, the sample is simply a 404. */
export async function generateStaticParams() {
  const slugs = await getPageSlugs()
  return slugs.length ? slugs.map((slug) => ({ slug: [slug] })) : [{ slug: ['_'] }]
}

async function pageFor(params: PageProps<'/[...slug]'>['params']) {
  const { slug } = await params
  return slug.length === 1 ? getPage(slug[0]) : null
}

export async function generateMetadata({ params }: PageProps<'/[...slug]'>): Promise<Metadata> {
  const page = await pageFor(params)
  return page ? { title: page.title, description: page.intro ?? undefined } : {}
}

export default async function TextPage({ params }: PageProps<'/[...slug]'>) {
  const page = await pageFor(params)
  if (!page) notFound()

  return (
    <article className="text-page page-wrap">
      <h1>{page.title}</h1>
      {page.intro && <p className="text-page-intro">{page.intro}</p>}
      {page.sections?.map(({ id, heading, body }) => (
        <section key={id}>
          {heading && <h2>{heading}</h2>}
          {body.split(/\n\s*\n/).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  )
}
