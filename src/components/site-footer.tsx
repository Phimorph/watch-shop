import Link from 'next/link'
import type { CSSProperties } from 'react'

import { getSettings } from '@/lib/queries'

import { Wordmark } from './wordmark'

/**
 * After the reference: the wordmark and tagline beside four columns, then the legal line.
 * Below it the wordmark again, set the width of the page, its letters rising onto the
 * footer's bottom edge as the page reaches its end.
 */
export async function SiteFooter() {
  const settings = await getSettings()
  const { navigation, services, social, legalLinks } = settings

  return (
    <footer className="site-footer">
      <div className="page-wrap">
        <div className="footer-top">
          <div className="footer-brand" style={{ '--c': 0 } as CSSProperties}>
            <Wordmark />
            {settings.tagline && <p>{settings.tagline}</p>}
          </div>

          <nav className="footer-col" aria-label={settings.exploreHeading} style={{ '--c': 1 } as CSSProperties}>
            <p className="footer-heading">{settings.exploreHeading}</p>
            <ul>
              {navigation?.map(({ id, href, label }) => (
                <li key={id}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col" style={{ '--c': 2 } as CSSProperties}>
            <p className="footer-heading">{settings.servicesHeading}</p>
            <ul>
              {services?.map(({ id, href, label }) => (
                <li key={id}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
              {settings.servicesNote && <li className="footer-quiet">{settings.servicesNote}</li>}
            </ul>
          </div>

          <address className="footer-col" style={{ '--c': 3 } as CSSProperties}>
            <p className="footer-heading">{settings.contactHeading}</p>
            <ul>
              <li>
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>{settings.phone}</a>
              </li>
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
              )}
              <li>{settings.address}</li>
            </ul>
          </address>

          {social?.length ? (
            <div className="footer-col" style={{ '--c': 4 } as CSSProperties}>
              <p className="footer-heading">{settings.followHeading}</p>
              <ul>
                {social.map(({ id, label, url }) => (
                  <li key={id} className={url ? undefined : 'footer-quiet'}>
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {label}
                      </a>
                    ) : (
                      label
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="footer-bottom">
          {settings.copyright && <p>{settings.copyright}</p>}
          {legalLinks?.length ? (
            <ul>
              {legalLinks.map(({ id, href, label }) => (
                <li key={id}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          ) : null}
          {settings.footerNote && <p>{settings.footerNote}</p>}
        </div>

        <p className="footer-mark" aria-hidden="true">
          {[...'watch.me'].map((letter, index) => (
            <span key={index} className={letter === '.' ? 'footer-mark-dot' : undefined} style={{ '--i': index } as CSSProperties}>
              {letter}
            </span>
          ))}
        </p>
      </div>
    </footer>
  )
}
