import { Check, ShieldCheck, ShoppingBag } from 'lucide-react'

import { Emphasis } from '@/components/emphasis'
import type { Home } from '@/payload-types'

const icons = { shield: ShieldCheck, check: Check, bag: ShoppingBag } as const

/**
 * "Confidence in Every Detail", after the reference: a centred heading on a stone band and
 * three promises, each with a line icon that draws itself as the section scrolls in.
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
                <Icon size={26} strokeWidth={1.2} aria-hidden="true" className="trust-icon" />
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
