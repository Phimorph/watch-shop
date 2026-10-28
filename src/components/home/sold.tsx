import { ArrowDownRight } from 'lucide-react'
import type { ComponentProps } from 'react'

import { Emphasis } from '@/components/emphasis'
import { progress } from '@/components/home/featured'
import { WatchCard } from '@/components/watch-card'
import type { WatchWithImages } from '@/lib/queries'
import type { Home } from '@/payload-types'

type Props = {
  sold: Home['sold']
  watches: WatchWithImages[]
  settings: ComponentProps<typeof WatchCard>['settings']
}

/** Cards shown before "explore past sales": two, as in the reference; a full row of three on desktop. */
const FIRST = 2

/**
 * "Collected by Others", after the reference: Our Collection's layout, with an
 * eyebrow, the archive mark and three wider cards a row. Reuses the collection's hidden
 * checkbox and CSS counter, so it needs no JavaScript either.
 */
export function Sold({ sold, watches, settings }: Props) {
  if (watches.length === 0) return null

  const more = watches.length > FIRST
  const [before, after = ''] = sold.countLabel.replace('{total}', String(watches.length)).split('{shown}')
  const number = sold.markNumber?.replace('{total}', String(watches.length).padStart(2, '0')) // taste-skill-ignore: the reference's archive mark

  return (
    <section id="sold" className="collection sold" aria-labelledby="sold-heading">
      <div className="page-wrap">
        <div className="collection-head">
          <div>
            {sold.eyebrow && <p className="sold-eyebrow">{sold.eyebrow}</p>} {/* taste-skill-ignore: from the reference */}
            <h2 id="sold-heading" className="collection-title">
              <span>
                <Emphasis text={sold.heading} />
              </span>
            </h2>
            {sold.intro && <p className="collection-intro">{sold.intro}</p>}
          </div>
          {sold.mark && (
            <p className="sold-mark" aria-hidden="true">
              {sold.mark.split('\n').map((line) => (
                <span key={line}>{line}</span>
              ))}
              {number && <b>{number}</b>}
            </p>
          )}
        </div>

        {(sold.noticeLeft || sold.noticeRight) && (
          <div className="collection-note">
            {sold.noticeLeft && <span>{sold.noticeLeft}</span>}
            {sold.noticeRight && <span>{sold.noticeRight}</span>}
          </div>
        )}

        <ul className="collection-grid">
          {watches.map((watch, index) => (
            <li
              key={watch.id}
              className={index >= FIRST ? 'collection-later' : undefined}
            >
              <WatchCard watch={watch} settings={settings} />
            </li>
          ))}
        </ul>

        <div
          className="collection-foot"
          style={progress(Math.min(FIRST, watches.length), watches.length, watches.length, Math.min(3, watches.length))}
        >
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
              {sold.linkLabel}
              <ArrowDownRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </label>
          )}
        </div>
      </div>
    </section>
  )
}
