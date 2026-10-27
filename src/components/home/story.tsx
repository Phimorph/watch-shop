import { ArrowUpRight } from 'lucide-react'

import { Emphasis } from '@/components/emphasis'
import { MediaImage } from '@/components/media-image'
import { asMedia } from '@/lib/queries'
import type { Home } from '@/payload-types'

/**
 * "A Passion for Timepieces", after the reference: a photograph with its caption beside
 * the story, the founder's monogram and name under a rule, and a link to talk to us.
 */
export function Story({ story, chat }: { story: Home['story']; chat: string }) {
  const image = asMedia(story.image)
  const initial = story.founderName?.match(/\p{L}/u)?.[0]

  return (
    <section id="about" className="story" aria-labelledby="story-heading">
      <div className="page-wrap story-layout">
        <figure className="story-photo">
          {image && <MediaImage media={image} sizes="(min-width: 768px) 52vw, 100vw" />}
          {story.imageCaption && <figcaption>{story.imageCaption}</figcaption>}
        </figure>
        <div className="story-copy">
          {story.eyebrow && <p className="story-eyebrow">{story.eyebrow}</p>} {/* taste-skill-ignore: from the reference */}
          <h2 id="story-heading" className="story-title">
            <span>
              <Emphasis text={story.heading} />
            </span>
          </h2>
          <p className="story-body">{story.body}</p>
          {story.founderName && (
            <div className="story-founder">
              {initial && (
                <span className="story-initial" aria-hidden="true">
                  {initial}.
                </span>
              )}
              <p>
                <b>{story.founderName}</b>
                {story.founderRole && <small>{story.founderRole}</small>}
              </p>
            </div>
          )}
          <a href={chat} target="_blank" rel="noopener noreferrer" className="collection-link story-link">
            {story.linkLabel}
            <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
