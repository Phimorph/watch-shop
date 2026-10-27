import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { whatsappHref, type WatchWithImages } from '@/lib/queries'
import type { Setting, Watch } from '@/payload-types'

import { MediaImage } from './media-image'

type AvailabilityLabels = Pick<Setting, 'availableLabel' | 'soldLabel' | 'unavailableLabel'>

/** The editor's word for a watch's availability, from the settings. */
export const availabilityLabel = (settings: AvailabilityLabels, availability: Watch['availability']) =>
  settings[`${availability}Label`]

type Props = {
  watch: WatchWithImages
  settings: AvailabilityLabels &
    Pick<
      Setting,
      | 'whatsapp'
      | 'messagePrice'
      | 'cardDetailsLabel'
      | 'cardPriceLabel'
      | 'referenceLabel'
      | 'boxLabel'
      | 'papersLabel'
      | 'boxPapersLabel'
    >
}

/**
 * The reference's product card: photograph, maker and reference, model, the description's
 * first sentence, then condition with the two actions. The photograph repeats the title
 * link, so it is hidden from keyboards and screen readers.
 */
export function WatchCard({ watch, settings }: Props) {
  const href = `/watches/${watch.slug}`
  const available = watch.availability === 'available'
  const set = watch.box && watch.papers
    ? settings.boxPapersLabel
    : watch.box
      ? settings.boxLabel
      : watch.papers
        ? settings.papersLabel
        : null
  const summary = watch.description?.split('.')[0]

  return (
    <article className="watch-card">
      <Link href={href} className="watch-card-photo" tabIndex={-1} aria-hidden="true">
        <MediaImage
          media={watch.images[0]}
          alt=""
          sizes="(min-width: 1051px) 25vw, (min-width: 371px) 50vw, 100vw"
        />
        {!available && <span className="watch-card-status">{availabilityLabel(settings, watch.availability)}</span>}
      </Link>
      <div className="watch-card-meta">
        <span>{watch.brand}</span>
        {watch.reference && <span>
            {settings.referenceLabel} {watch.reference}
          </span>}
      </div>
      <h3>
        <Link href={href} className="watch-card-model">
          {watch.model}
        </Link>
      </h3>
      {summary && <p className="watch-card-summary">{summary}.</p>}
      <div className="watch-card-foot">
        <p className="watch-card-condition">
          <span>{watch.condition}</span>
          {set && <span>{set}</span>}
        </p>
        {/* Two halves of one bar, like a ticket's stub: details, then the price on WhatsApp. */}
        <div className="watch-card-actions">
          <Link href={href}>
            {settings.cardDetailsLabel}
            <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
          </Link>
          {available ? (
            <a href={whatsappHref(settings.whatsapp, settings.messagePrice, watch)} target="_blank" rel="noopener noreferrer">
              {settings.cardPriceLabel}
              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </a>
          ) : (
            <span>{availabilityLabel(settings, watch.availability)}</span>
          )}
        </div>
      </div>
    </article>
  )
}
