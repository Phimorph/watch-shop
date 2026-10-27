import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="page-x flex min-h-[70svh] flex-col items-start justify-center gap-6 py-24">
      <h1 className="text-display">This page has moved on</h1>
      <p className="max-w-[40ch] text-lead text-muted-foreground">
        The watch may have been sold or the link may be out of date.
      </p>
      <Link href="/watches" className="button">
        Browse the collection
      </Link>
    </section>
  )
}
