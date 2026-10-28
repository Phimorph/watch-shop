import Link from 'next/link'

import { getSettings } from '@/lib/queries'

import { Wordmark } from './wordmark'

/**
 * After the reference: the wordmark and tagline beside four columns, then the legal line.
 * Links without a destination yet (social, legal) show muted, as placeholders.
 */
export async function SiteFooter() {
  const settings = await getSettings()
  const { navigation, services, social, legalLinks } = settings

  return (
    <footer className="site-footer">
      <div className="page-wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Wordmark />
            {settings.tagline && <p>{settings.tagline}</p>}
          </div>

          <nav className="footer-col" aria-label={settings.exploreHeading}>
            <p className="footer-heading">{settings.exploreHeading}</p>
            <ul>
              {navigation?.map(({ id, href, label }) => (
                <li key={id}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
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

          <address className="footer-col">
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
            <div className="footer-col">
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
                <li key={id} className={href ? undefined : 'footer-quiet'}>
                  {href ? <Link href={href}>{label}</Link> : label}
                </li>
              ))}
            </ul>
          ) : null}
          {settings.footerNote && <p>{settings.footerNote}</p>}
        </div>
      </div>
    </footer>
  )
}
