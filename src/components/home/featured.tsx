import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { ComponentProps, CSSProperties } from 'react'

import { Emphasis } from '@/components/emphasis'
import { WatchCard } from '@/components/watch-card'
import type { WatchWithImages } from '@/lib/queries'
import type { Home } from '@/payload-types'

type Props = {
  catalog: Home['catalog']
  watches: WatchWithImages[]
  total: number
  settings: ComponentProps<typeof WatchCard>['settings']
}

/** Cards shown before "load more", as in the reference. */
const FIRST = 4

/** The progress line's share of the total, before and after "load more". */
export const progress = (from: number, to: number, total: number, fromWide = from) =>
  ({
    '--from': from / Math.max(total, 1),
    '--from-wide': fromWide / Math.max(total, 1),
    '--to': to / Math.max(total, 1),
  }) as CSSProperties

/**
 * "Our Collection", after the reference: the heading row with its link, the sample notice,
 * four cards a row, then the count, a progress line and "load more". "Load more" is a label
 * for a hidden checkbox and the count a CSS counter, so the section needs no JavaScript.
 */
export function Featured({ catalog, watches, total, settings }: Props) {
  const shown = watches.slice(0, catalog.count ?? 8)
  const more = shown.length > FIRST
  const [before, after = ''] = catalog.countLabel.replace('{total}', String(total)).split('{shown}')

  return (
    <section id="collection" className="collection" aria-labelledby="collection-heading">
      <div className="page-wrap">
        <div className="collection-head">
          <div>
            {/* The heading rises out from behind its own edge as the section arrives. */}
            <h2 id="collection-heading" className="collection-title">
              <span>
                <Emphasis text={catalog.heading} />
              </span>
            </h2>
            {catalog.intro && <p className="collection-intro">{catalog.intro}</p>}
          </div>
          <Link href="/watches" className="collection-link">
            {catalog.linkLabel}
            <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>

        {(catalog.noticeLeft || catalog.noticeRight) && (
          <div className="collection-note">
            {catalog.noticeLeft && <span>{catalog.noticeLeft}</span>}
            {catalog.noticeRight && <span>{catalog.noticeRight}</span>}
          </div>
        )}

        <ul className="collection-grid">
          {shown.map((watch, index) => (
            <li
              key={watch.id}
              className={index >= FIRST ? 'collection-later' : undefined}
            >
              <WatchCard watch={watch} settings={settings} />
            </li>
          ))}
        </ul>

        <div className="collection-foot" style={progress(Math.min(FIRST, shown.length), shown.length, total)}>
          <p className="collection-count">
            {before}
            <b className="collection-shown" />
            {after}
          </p>
          <span className="collection-progress" aria-hidden="true" />
          {more && (
            <label className="collection-more">
              {/* Inside the button, so the focus a click gives it doesn't scroll the page up. */}
              <input type="checkbox" className="collection-toggle sr-only" />
              {catalog.moreLabel}
              <ArrowDownRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </label>
          )}
          {/* Once every card here is open, the rest of the stock is on the collection page. */}
          {total > shown.length && (
            <Link href="/watches" className="collection-more collection-onward">
              {catalog.linkLabel}
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
