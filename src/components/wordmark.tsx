import Link from 'next/link'

import { cn } from '@/lib/utils'

/** The watch.me logotype. `link={false}` renders it as decoration, for places that already have a home link. */
export function Wordmark({ className, link = true }: { className?: string; link?: boolean }) {
  const mark = (
    <>
      watch<span>.</span>me
    </>
  )

  return link ? (
    <Link href="/" aria-label="watch.me home" className={cn('wordmark', className)}>
      {mark}
    </Link>
  ) : (
    <span aria-hidden="true" className={cn('wordmark', className)}>
      {mark}
    </span>
  )
}
