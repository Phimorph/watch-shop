import { Check, ShieldCheck, ShoppingBag } from 'lucide-react'

import { Emphasis } from '@/components/emphasis'
import type { Home } from '@/payload-types'

const icons = { shield: ShieldCheck, check: Check, bag: ShoppingBag } as const

/**
 * "Confidence in Every Detail", after the reference: a centred heading on a stone band and
 * three promises, each set in a subdial like the three of a chronograph.
 */
export function Trust({ trust }: { trust: Home['trust'] }) {
  if (!trust.items?.length) return null

  return (
    <section className="trust" aria-labelledby="trust-heading">
      <div className="page-wrap">
        <div className="trust-head">
          {trust.eyebrow && <p className="trust-eyebrow">{trust.eyebrow}</p>} {/* taste-skill-ignore: from the reference */}
          <h2 id="trust-heading" className="trust-title">
            <span>
              <Emphasis text={trust.heading} />
            </span>
          </h2>
        </div>
        <ul className="trust-grid">
          {trust.items.map(({ id, icon, title, text }) => {
            const Icon = icons[icon]
            return (
              <li key={id} className="trust-item">
                <span className="trust-dial" aria-hidden="true">
                  {/* pathLength turns the dashes into 60 minute and 12 hour ticks, from twelve o'clock. */}
                  <svg viewBox="0 0 100 100" className="trust-track">
                    <circle cx="50" cy="50" r="49.5" className="trust-bezel" />
                    <circle cx="50" cy="50" r="47" pathLength="60" className="trust-minutes" />
                    <circle cx="50" cy="50" r="46" pathLength="12" className="trust-hours" />
                    <line x1="50" y1="1" x2="50" y2="13" className="trust-hand" />
                  </svg>
                  <Icon size={28} strokeWidth={1.2} className="trust-icon" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
