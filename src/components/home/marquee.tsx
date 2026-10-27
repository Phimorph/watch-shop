import Link from 'next/link'

import type { Home } from '@/payload-types'

type Props = { brands: Home['brands']; names: string[] }

/** Enough names per lap to run wider than a large screen. */
const MIN_PER_LAP = 16

/**
 * The strip of brands under the hero, taken from the watches in stock; each opens the
 * collection filtered to that brand. The names repeat so the CSS scroll loops without a
 * seam; only the first run is read out or reachable by keyboard.
 */
export function Marquee({ brands, names }: Props) {
  if (!names.length) return null
  const lap = Array.from({ length: Math.ceil(MIN_PER_LAP / names.length) }, () => names).flat()

  return (
    <nav className="marquee" aria-label={brands.note}>
      <ul className="marquee-track">
        {[...lap, ...lap].map((name, index) => {
          const repeat = index >= names.length
          return (
            <li key={index} aria-hidden={repeat || undefined}>
              <Link href={`/watches?brand=${encodeURIComponent(name)}`} tabIndex={repeat ? -1 : undefined}>
                {name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
