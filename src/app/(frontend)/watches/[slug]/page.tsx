import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { MediaImage } from '@/components/media-image'
import { availabilityLabel, WatchCard } from '@/components/watch-card'
import { WatchSpecs } from '@/components/watch-specs'
import { getSettings, getWatch, getWatches, mediaSrc, whatsappHref } from '@/lib/queries'

/** Published watches are prerendered at build; new ones are rendered on first visit, then cached. */
export async function generateStaticParams() {
  const watches = await getWatches({})
  return watches.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/watches/[slug]'>): Promise<Metadata> {
  const watch = await getWatch((await params).slug)
  if (!watch) return {}

  const image = watch.images[0]
  return {
    title: watch.title,
    description: watch.description,
    openGraph: image ? { images: [{ url: mediaSrc(image), alt: image.alt }] } : undefined,
  }
}

export default function WatchPage({ params }: PageProps<'/watches/[slug]'>) {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <WatchDetail params={params} />
    </Suspense>
  )
}

async function WatchDetail({ params }: Pick<PageProps<'/watches/[slug]'>, 'params'>) {
  const { slug } = await params
  const [watch, settings] = await Promise.all([getWatch(slug), getSettings()])
  if (!watch) notFound()

  const available = watch.availability === 'available'
  const related = (await getWatches({ brand: watch.brand, availability: 'available' }))
    .filter(({ id }) => id !== watch.id)
    .slice(0, 4)

  return (
    <article>
      <div className="grid lg:grid-cols-2">
        {/* Phones: photographs scroll sideways. Desktop: they stack and scroll past the papers. */}
        <ul className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:flex-col lg:overflow-visible">
          {watch.images.map((image, index) => (
            <li key={image.id} className="w-full shrink-0 snap-start">
              <MediaImage
                media={image}
                priority={index === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-square w-full bg-muted object-cover"
              />
            </li>
          ))}
        </ul>

        <div className="page-x py-12 lg:sticky lg:top-(--header-height) lg:self-start lg:px-16 lg:py-16">
          <nav aria-label="Breadcrumb" className="text-small text-muted-foreground">
            <Link href="/watches" className="text-link">
              Collection
            </Link>{' '}
            / {watch.brand}
          </nav>
          <h1 className="mt-6 text-display">{watch.title}</h1>
          <p className="mt-6 max-w-[46ch] text-lead">{watch.description}</p>

          <p className="mt-8 font-medium">
            {available ? 'Available to see in the showroom' : availabilityLabel(settings, watch.availability)}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
            {available ? (
              <>
                <a
                  href={whatsappHref(settings.whatsapp, settings.messagePrice, watch)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button"
                >
                  Ask the price
                </a>
                <a
                  href={whatsappHref(settings.whatsapp, settings.messageViewing, watch)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  Book a viewing
                </a>
              </>
            ) : (
              <Link href="/watches" className="button">
                See available watches
              </Link>
            )}
          </div>

          <WatchSpecs watch={watch} className="mt-12 max-w-md" />
        </div>
      </div>

      {related.length > 0 && (
        <section className="page-x py-24 md:py-32">
          <h2 className="text-heading">More from {watch.brand}</h2>
          <ul className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.id}>
                <WatchCard watch={item} settings={settings} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
