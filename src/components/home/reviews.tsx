import { Emphasis } from '@/components/emphasis'
import type { Home } from '@/payload-types'

/**
 * "From Our Customers", after the reference: the heading beside a quotation hung from a
 * brass rule. Until the editor publishes real reviews, the quotation is the placeholder.
 */
export function Reviews({ reviews }: { reviews: Home['reviews'] }) {
  const items = reviews.items ?? []
  if (!items.length && !reviews.emptyText) return null

  return (
    <section id="reviews" className="reviews" aria-labelledby="reviews-heading">
      <div className="page-wrap reviews-inner">
        <div>
          {reviews.eyebrow && <p className="reviews-eyebrow">{reviews.eyebrow}</p>} {/* taste-skill-ignore: from the reference */}
          <h2 id="reviews-heading" className="reviews-title">
            <span>
              <Emphasis text={reviews.heading} />
            </span>
          </h2>
          {reviews.intro && <p className="reviews-intro">{reviews.intro}</p>}
        </div>

        {items.length ? (
          <ul className="reviews-list">
            {items.map(({ id, quote, author }) => (
              <li key={id}>
                <figure className="review">
                  <span className="review-mark" aria-hidden="true">
                    “
                  </span>
                  <blockquote>
                    <p>{quote}</p>
                  </blockquote>
                  <figcaption>{author}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : (
          <figure className="review">
            <span className="review-mark" aria-hidden="true">
              “
            </span>
            <p>{reviews.emptyText}</p>
            {reviews.emptyNote && <figcaption>{reviews.emptyNote}</figcaption>}
          </figure>
        )}
      </div>
    </section>
  )
}
