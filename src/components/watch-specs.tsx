import type { Watch } from '@/payload-types'
import { cn } from '@/lib/utils'

const included = (value?: boolean | null) =>
  value == null ? undefined : value ? 'Included' : 'Not included'

/** The watch's papers: every specification the editor filled in, nothing invented. */
export function WatchSpecs({ watch, className }: { watch: Watch | Omit<Watch, 'images'>; className?: string }) {
  const specs = [
    ['Reference', watch.reference],
    ['Condition', watch.condition],
    ['Year', watch.year?.toString()],
    ['Movement', watch.movement],
    ['Case', [watch.caseSize, watch.caseMaterial].filter(Boolean).join(', ')],
    ['Dial', watch.dial],
    ['Box', included(watch.box)],
    ['Papers', included(watch.papers)],
  ].filter((spec): spec is [string, string] => Boolean(spec[1]))

  return (
    <dl className={cn('grid grid-cols-[auto_1fr] gap-x-8 gap-y-2', className)}>
      {specs.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
