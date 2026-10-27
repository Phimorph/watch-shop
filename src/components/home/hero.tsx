import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import { Emphasis } from '@/components/emphasis'
import { MediaImage } from '@/components/media-image'
import { asMedia, type WatchWithImages } from '@/lib/queries'
import type { Home } from '@/payload-types'

type Props = { hero: Home['hero']; chat: string; watches: WatchWithImages[] }

/** The stage shows four watches a lap, one per quarter of the minute track. */
const SLOTS = 4
const TICKS = Array.from({ length: 60 }, (_, index) => index)

/**
 * The stage is a watch face: a minute track around a round window that holds one featured
 * watch at a time. A lume pip sweeps the track; at each quarter the window turns over to the
 * next watch. All of it is CSS animation, so the hero ships no JavaScript.
 */
export function Hero({ hero, chat, watches }: Props) {
  const image = asMedia(hero.image)
  // Fewer than four featured watches repeat to fill the quarters; the repeats are decoration.
  const slots = watches.length ? Array.from({ length: SLOTS }, (_, index) => watches[index % watches.length]) : []

  return (
    <section className="hero" aria-labelledby="hero-heading">
      {image && <MediaImage media={image} priority sizes="100vw" className="hero-image" />}
      <div className="page-wrap hero-content">
        <div className="hero-text">
          {hero.eyebrow && <p className="eyebrow">{hero.eyebrow}</p>} {/* taste-skill-ignore: from the reference */}
          <h1 id="hero-heading">
            <Emphasis text={hero.heading} />
          </h1>
          {hero.caption && <p className="hero-caption">{hero.caption}</p>}
          {hero.intro && <p className="hero-copy">{hero.intro}</p>}
          <div className="hero-actions">
            <a href="#collection" className="button-light">
              {hero.buttonLabel}
              <ArrowDownRight size={15} aria-hidden="true" />
            </a>
            {hero.questionLabel && (
              <a href={chat} target="_blank" rel="noopener noreferrer" className="hero-question">
                {hero.questionPrompt} <span>{hero.questionLabel}</span>
              </a>
            )}
          </div>
        </div>

        {slots.length > 0 && (
          <div className="hero-stage">
            <svg className="hero-track" viewBox="0 0 100 100" aria-hidden="true">
              {TICKS.map((tick) => (
                <line
                  key={tick}
                  x1="50"
                  y1={tick % 15 ? 2.5 : 1}
                  x2="50"
                  y2="5"
                  className={tick % 15 ? undefined : 'hero-track-quarter'}
                  transform={`rotate(${tick * 6} 50 50)`}
                />
              ))}
              <circle className="hero-track-pip" cx="50" cy="1.6" r="1.1" />
            </svg>
            <ul className="hero-watches" aria-label="Featured watches">
              {slots.map((watch, index) => {
                const repeat = index >= watches.length
                const meta = [watch.reference && `Ref. ${watch.reference}`, watch.year].filter(Boolean).join(' · ')
                return (
                  <li key={index} style={{ '--i': index } as CSSProperties} aria-hidden={repeat || undefined}>
                    <Link href={`/watches/${watch.slug}`} tabIndex={repeat ? -1 : undefined}>
                      <span className="hero-window">
                        <MediaImage
                          media={watch.images[0]}
                          alt=""
                          priority={index === 0}
                          sizes="(min-width: 1024px) 520px, (min-width: 768px) 440px, 84vw"
                        />
                      </span>
                      <span className="hero-label">
                        <span className="hero-label-brand">{watch.brand}</span>
                        <span className="hero-label-model">
                          {watch.model}
                          <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
                        </span>
                        {meta && <span className="hero-label-meta">{meta}</span>}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
