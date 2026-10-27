import { notFound } from 'next/navigation'

/** Renders the site's own 404 (with header and footer) for any unmatched URL. */
export default function CatchAll() {
  notFound()
}
