import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'

import { MediaImage } from '@/components/media-image'
import { availabilityLabel, WatchCard } from '@/components/watch-card'
import { getSettings, getWatch, getWatches, mediaSrc, whatsappHref } from '@/lib/queries'

/** Allowed to block: nothing can show until the slug's document is read. */
export const instant = false

/**
 * Published watches are prerendered at build; new ones are rendered on first visit, then
 * cached. Cache Components needs at least one sample, so an empty shop samples a 404.
 */
export async function generateStaticParams() {
  const watches = await getWatches({})
  return watches.length ? watches.map(({ slug }) => ({ slug })) : [{ slug: '_' }]
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

const pad = (value: number) => String(value).padStart(2, '0') // taste-skill-ignore: the reference's gallery counter

/**
 * After the reference: breadcrumbs, the gallery beside the watch's name, availability, the two
 * WhatsApp actions, the specifications and the in-store viewing; then more watches. Every
 * label comes from Settings → Watch page.
 */
export default async function WatchPage({ params }: PageProps<'/watches/[slug]'>) {
  const { slug } = await params
  const [watch, settings] = await Promise.all([getWatch(slug), getSettings()])
  if (!watch) notFound()

  const available = watch.availability === 'available'
  // The same maker first, then the rest of the stock, as in the reference.
  const others = (await getWatches({ availability: 'available' })).filter(({ id }) => id !== watch.id)
  const related = [...others.filter(({ brand }) => brand === watch.brand), ...others.filter(({ brand }) => brand !== watch.brand)].slice(0, 4)

  const labels = settings.specLabels
  const included = (value?: boolean | null) => (value == null ? null : value ? labels.included : labels.notIncluded)
  const specs = [
    [labels.condition, watch.condition],
    [labels.year, watch.year?.toString()],
    [labels.movement, watch.movement],
    [labels.caseSize, watch.caseSize],
    [labels.caseMaterial, watch.caseMaterial],
    [labels.dial, watch.dial],
    [settings.boxLabel, included(watch.box)],
    [settings.papersLabel, included(watch.papers)],
  ].filter((spec): spec is [string, string] => Boolean(spec[1]))

  const viewing = whatsappHref(settings.whatsapp, settings.messageViewing, watch)
  const { images } = watch
  const many = images.length > 1

  return (
    <article className="detail page-wrap">
      <nav aria-label="Breadcrumb" className="detail-crumbs">
        <ol>
          <li>
            <Link href="/">{settings.breadcrumbHome}</Link>
          </li>
          <li>
            <Link href="/watches">{settings.breadcrumbCollection}</Link>
          </li>
          <li>
            <Link href={`/watches?brand=${encodeURIComponent(watch.brand)}`}>{watch.brand}</Link>
          </li>
          <li aria-current="page">{watch.model}</li>
        </ol>
      </nav>
      {settings.detailNote && <p className="detail-note">{settings.detailNote}</p>}

      <div className="detail-layout">
        {/* A radio a photograph: the thumbnails and arrows are its labels, so it needs no JavaScript. */}
        <div className="gallery" role="radiogroup" aria-label={watch.title ?? watch.model}>
          {images.map((image, index) => (
            <Fragment key={image.id}>
              <input
                type="radio"
                name="photo"
                id={`photo-${index}`}
                className="gallery-radio sr-only"
                defaultChecked={index === 0}
                aria-label={image.alt}
              />
              <figure className="gallery-slide">
                <MediaImage
                  media={image}
                  priority={index === 0}
                  sizes="(min-width: 1051px) 54vw, 100vw"
                />
                {!available && (
                  <span className="gallery-status">{availabilityLabel(settings, watch.availability)}</span>
                )}
                {many && (
                  <>
                    <label htmlFor={`photo-${(index + images.length - 1) % images.length}`} className="gallery-prev" aria-hidden="true">
                      <ChevronLeft size={21} strokeWidth={1.5} />
                    </label>
                    <label htmlFor={`photo-${(index + 1) % images.length}`} className="gallery-next" aria-hidden="true">
                      <ChevronRight size={21} strokeWidth={1.5} />
                    </label>
                    <span className="gallery-counter" aria-hidden="true">
                      {pad(index + 1)} / {pad(images.length)}
                    </span>
                  </>
                )}
              </figure>
            </Fragment>
          ))}
          {many && (
            <div className="gallery-thumbs" aria-hidden="true">
              {images.map((image, index) => (
                <label key={image.id} htmlFor={`photo-${index}`}>
                  <MediaImage media={image} alt="" sizes="80px" />
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <p className="detail-brand">{watch.brand}</p>
          <h1 className="detail-title">{watch.model}</h1>
          {watch.reference && (
            <p className="detail-ref">
              {settings.referenceHeading} <span>{watch.reference}</span>
            </p>
          )}
          <p className="detail-description">{watch.description}</p>

          {available ? (
            <>
              <p className="detail-status">
                {settings.availableHeadline}
                {settings.availableNote && <small>{settings.availableNote}</small>}
              </p>
              <div className="detail-actions">
                <a
                  href={whatsappHref(settings.whatsapp, settings.messagePrice, watch)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-button"
                >
                  {settings.priceButton}
                  <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </a>
                <a href={viewing} target="_blank" rel="noopener noreferrer" className="detail-button detail-button-quiet">
                  {settings.viewingButton}
                  <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="detail-status detail-status-closed">
                {watch.availability === 'sold' ? settings.soldHeadline : settings.unavailableHeadline}
                {settings.unavailableNote && <small>{settings.unavailableNote}</small>}
              </p>
              <div className="detail-actions">
                <Link href="/watches" className="detail-button">
                  {settings.exploreButton}
                  <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>
            </>
          )}

          {settings.reassuranceTitle && (
            <div className="detail-reassurance">
              <ShieldCheck size={20} strokeWidth={1.4} aria-hidden="true" />
              <p>
                <b>{settings.reassuranceTitle}</b>
                {settings.reassuranceText}
              </p>
            </div>
          )}

          <section className="detail-specs" aria-labelledby="specs-heading">
            <h2 id="specs-heading" className="detail-eyebrow">{settings.specsHeading}</h2>{/* taste-skill-ignore: from the reference */}
            <dl>
              {specs.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {available && (
            <section className="detail-viewing" aria-labelledby="viewing-heading">
              <h2 id="viewing-heading" className="detail-eyebrow">{settings.viewingHeading}</h2>{/* taste-skill-ignore: from the reference */}
              <p>
                {settings.viewingText}
                <br />
                {settings.address}
              </p>
              <a href={viewing} target="_blank" rel="noopener noreferrer" className="collection-link">
                {settings.viewingLink}
                <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
              </a>
            </section>
          )}
        </div>
      </div>

      <p className="detail-back">
        <Link href="/watches">
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          {settings.backLabel}
        </Link>
      </p>

      {related.length > 0 && (
        <section className="detail-related" aria-labelledby="related-heading">
          <div className="collection-head">
            <div>
              <p className="detail-eyebrow">{settings.relatedEyebrow}</p> {/* taste-skill-ignore: from the reference */}
              <h2 id="related-heading" className="collection-title">
                <span>{settings.relatedHeading}</span>
              </h2>
            </div>
            <Link href="/watches" className="collection-link">
              {settings.relatedLink}
              <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
          <ul className="collection-grid">
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
