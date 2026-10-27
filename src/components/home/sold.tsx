import Link from 'next/link'

import { MediaImage } from '@/components/media-image'
import type { WatchWithImages } from '@/lib/queries'
import type { Home } from '@/payload-types'
import { cn } from '@/lib/utils'

/** Alternating module shapes keep the row from reading as a grid of identical cards. */
const shapes = ['aspect-[3/4] h-full', 'aspect-[16/10] h-full', 'aspect-square h-full']

export function Sold({ sold, watches }: { sold: Home['sold']; watches: WatchWithImages[] }) {
  if (watches.length === 0) return null

  return (
    <section id="sold" className="py-24 md:py-40">
      <div className="page-x flex flex-wrap items-end justify-between gap-x-8 gap-y-4" data-reveal>
        <div className="flex max-w-[40ch] flex-col gap-4">
          <h2 className="text-heading">{sold.heading}</h2>
          {sold.intro && <p className="text-muted-foreground">{sold.intro}</p>}
        </div>
        <p className="text-small text-muted-foreground">{watches.length} watches</p>
      </div>

      <ul className="no-scrollbar mt-10 flex h-[62svh] snap-x snap-proximity scroll-px-5 gap-3 overflow-x-auto px-5 md:h-[68svh] md:scroll-px-8 md:px-8 lg:scroll-px-12 lg:px-12">
        {watches.map((watch, index) => (
          <li key={watch.id} className={cn('flex shrink-0 snap-start flex-col', shapes[index % shapes.length])}>
            <Link href={`/watches/${watch.slug}`} className="group flex h-full flex-col gap-3">
              <div className="min-h-0 flex-1 overflow-hidden bg-muted">
                <MediaImage
                  media={watch.images[0]}
                  sizes="(min-width: 768px) 40vw, 80vw"
                  className="size-full object-cover grayscale-[35%] transition-[scale,filter] duration-700 ease-out-quart group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              </div>
              <p className="text-small">
                {watch.title} <span className="text-muted-foreground">sold</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
