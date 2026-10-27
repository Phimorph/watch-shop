import Link from 'next/link'

import { getSettings } from '@/lib/queries'

import { Wordmark } from './wordmark'

export async function SiteFooter() {
  const { navigation, tagline, address, phone, email, copyright } = await getSettings()

  return (
    <footer className="bg-inverse py-16 text-inverse-foreground">
      <div className="page-wrap grid gap-10 md:grid-cols-3">
        <div>
          <Wordmark />
          {tagline && <p className="mt-4 max-w-[30ch] text-small text-inverse-muted">{tagline}</p>}
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-col gap-2 text-small">
            {navigation?.map(({ id, href, label }) => (
              <li key={id}>
                <Link href={href} className="hover:text-inverse-accent">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <address className="flex flex-col gap-2 text-small text-inverse-muted not-italic">
          <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:text-inverse-foreground">
            {phone}
          </a>
          {email && <a href={`mailto:${email}`}>{email}</a>}
          <span>{address}</span>
        </address>
      </div>
      {copyright && <p className="page-wrap mt-12 text-small text-inverse-muted">{copyright}</p>}
    </footer>
  )
}
