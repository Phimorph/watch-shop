import { ChevronDown } from 'lucide-react'

import { Emphasis } from '@/components/emphasis'
import type { Home } from '@/payload-types'

/**
 * "Your Questions, Answered", after the reference: the heading beside a list of questions.
 * Native details elements sharing one name, so one answer opens at a time without JavaScript.
 */
export function Faq({ faq }: { faq: Home['faq'] }) {
  if (!faq.questions?.length) return null

  return (
    <section id="faq" className="faq" aria-labelledby="faq-heading">
      <div className="page-wrap faq-layout">
        <div className="faq-head">
          {faq.eyebrow && <p className="faq-eyebrow">{faq.eyebrow}</p>} {/* taste-skill-ignore: from the reference */}
          <h2 id="faq-heading" className="faq-title">
            <span>
              <Emphasis text={faq.heading} />
            </span>
          </h2>
          {faq.intro && <p className="faq-intro">{faq.intro}</p>}
        </div>
        <div className="faq-list">
          {faq.questions.map(({ id, question, answer }) => (
            <details key={id} name="faq" className="faq-item">
              <summary>
                <span>{question}</span>
                <ChevronDown size={18} strokeWidth={1.4} aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
