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

/**
 * "Our Collection", after the reference: the heading row with its link, the sample notice,
 * four cards a row and the count with "load more". "Load more" is a label for a hidden
 * checkbox and the count a CSS counter, so the section needs no JavaScript.
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

        {more && <input type="checkbox" id="collection-more" className="collection-toggle sr-only" />}
        <ul className="collection-grid">
          {shown.map((watch, index) => (
            <li
              key={watch.id}
              className={index >= FIRST ? 'collection-later' : undefined}
              style={{ '--i': index - FIRST } as CSSProperties}
            >
              <WatchCard watch={watch} settings={settings} />
            </li>
          ))}
        </ul>

        <div className="collection-foot">
          <p className="collection-count">
            {before}
            <b className="collection-shown" />
            {after}
          </p>
          {more && (
            <label htmlFor="collection-more" className="collection-more">
              {catalog.moreLabel}
              <ArrowDownRight size={15} strokeWidth={1.5} aria-hidden="true" />
            </label>
          )}
        </div>
      </div>
    </section>
  )
}
