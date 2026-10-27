import { ArrowRight, ArrowUpRight, Search, X } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import { getSettings, whatsappHref } from '@/lib/queries'
import { cn } from '@/lib/utils'

import { Wordmark } from './wordmark'

/**
 * The utility bar and sticky header. A server component: the search panel and mobile menu
 * are native popovers (Escape closes them) and the scrolled state is a scroll-driven CSS
 * animation, so the header ships no JavaScript.
 */
export async function SiteHeader() {
  const { announcements, phone, contactLabel, whatsapp, messageGeneral, navigation } = await getSettings()
  const tel = `tel:${phone.replace(/[^\d+]/g, '')}`
  const chat = whatsappHref(whatsapp, messageGeneral)

  // Every display offers the same things: the links, search, the phone number and "contact us".
  // From 1024px they sit in the bars; below it, behind the search icon and the menu.
  return (
    <>
      <div className="utility">
        <div className="page-wrap utility-inner">
          <ul className="utility-notes" data-count={announcements?.length} aria-label="Why watch.me">
            {announcements?.map(({ id, text }) => (
              <li key={id}>{text}</li>
            ))}
          </ul>
          <address className="utility-contact">
            <a href={tel}>{phone}</a>
            <a href={chat} target="_blank" rel="noopener noreferrer">
              {contactLabel}
            </a>
          </address>
        </div>
      </div>

      <header className="site-header">
        <div className="page-wrap header-inner">
          <Wordmark />
          <nav className="desktop-nav" aria-label="Main">
            {navigation?.map(({ id, href, label }) => (
              <Link key={id} href={href} className="nav-link">
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <SearchForm className="header-search" placeholder="Search by brand or model" />
            <button type="button" className="icon-button search-toggle" popoverTarget="site-search" aria-label="Search">
              <Search size={19} strokeWidth={1.5} aria-hidden="true" className="icon-open" />
              <X size={20} strokeWidth={1.5} aria-hidden="true" className="icon-close" />
            </button>
            <button type="button" className="icon-button menu-toggle" popoverTarget="mobile-menu" aria-label="Menu">
              <span className="burger" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* The search icon opens this panel; its field takes focus as it opens. */}
        <div id="site-search" popover="auto" className="header-panel search-panel">
          <SearchForm className="page-wrap" placeholder="Brand or model" autoFocus button />
        </div>
      </header>

      {/*
        The menu opens under the header, whose menu icon turns into a close icon. Browsers
        without anchor positioning show it full screen with its own top row instead.
        Plain links, so moving to another page always leaves it closed.
      */}
      <div id="mobile-menu" popover="auto" className="mobile-menu">
        <div className="page-wrap mobile-menu-top">
          <Wordmark link={false} />
          <button
            type="button"
            className="icon-button"
            popoverTarget="mobile-menu"
            popoverTargetAction="hide"
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <nav className="page-wrap mobile-menu-links" aria-label="Mobile">
          {navigation?.map(({ id, href, label }, index) => (
            <a key={id} href={href} style={{ '--i': index } as CSSProperties}>
              {label}
              <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <address className="page-wrap mobile-menu-contact">
          <a href={chat} target="_blank" rel="noopener noreferrer" className="button">
            {contactLabel}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a href={tel} className="mobile-menu-phone">
            {phone}
          </a>
        </address>
      </div>
    </>
  )
}

/** A plain GET form: `/watches` reads `?q=`, so search works without any script. */
type SearchFormProps = { className?: string; placeholder: string; autoFocus?: boolean; button?: boolean }

function SearchForm({ className, placeholder, autoFocus, button }: SearchFormProps) {
  return (
    <form action="/watches" role="search" className={cn('search-form', className)}>
      <label className="search-field">
        <Search size={16} strokeWidth={1.5} aria-hidden="true" />
        <input
          type="search"
          name="q"
          maxLength={64}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label="Search watches"
          enterKeyHint="search"
        />
      </label>
      {button && (
        <button type="submit" className="search-submit" aria-label="Search">
          <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      )}
    </form>
  )
}
