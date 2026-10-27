import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'

import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getSettings } from '@/lib/queries'
import { serverURL } from '@/lib/site'

import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export async function generateMetadata(): Promise<Metadata> {
  const { siteTitle, siteDescription } = await getSettings()

  return {
    metadataBase: new URL(serverURL),
    title: { default: siteTitle, template: `%s | ${siteTitle.split('|')[0].trim()}` },
    description: siteDescription,
    openGraph: { type: 'website', title: siteTitle, description: siteDescription },
    twitter: { card: 'summary_large_image' },
  }
}

export const viewport: Viewport = {
  themeColor: '#f7f5f0',
}

export default function FrontendLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-background focus:p-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
