import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { conditions } from '@/collections/Watches'
import { availabilityLabel, WatchCard } from '@/components/watch-card'
import {
  getBrands,
  getHome,
  getSettings,
  getWatches,
  sorts,
  whatsappHref,
  type WatchFilters,
} from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Collection',
  description: 'Every pre-owned watch in the showroom. Filter by brand, condition and availability.',
}

/**
 * The heading is cached Payload content, so it is part of the static shell.
 * The results depend on the URL's search params, so they stream in behind Suspense.
 */
export default async function WatchesPage({ searchParams }: PageProps<'/watches'>) {
  const { catalog } = await getHome()

  return (
    <div className="page-x pt-12 pb-24 md:pt-20 md:pb-40">
      <div className="flex flex-col gap-4" data-reveal>
        <h1 className="text-display">{catalog.heading}</h1>
        {catalog.intro && <p className="max-w-[44ch] text-lead text-muted-foreground">{catalog.intro}</p>}
      </div>
      <Suspense fallback={<p className="mt-12 text-muted-foreground">Loading watches…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

type SearchParams = PageProps<'/watches'>['searchParams']

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const [params, brands, settings] = await Promise.all([searchParams, getBrands(), getSettings()])
  const filters = parseFilters(params, brands)
  const watches = await getWatches(filters)
  const filtered = Boolean(filters.q || filters.brand || filters.condition || filters.availability !== 'available')

  return (
    <>
      <form action="/watches" className="mt-12 grid gap-3 bg-muted p-4 sm:grid-cols-2 md:p-6 lg:grid-cols-6">
        <label className="flex flex-col gap-1.5 text-small lg:col-span-2">
          Search
          <input
            type="search"
            name="q"
            defaultValue={filters.q}
            maxLength={64}
            placeholder="Brand, model or reference"
            className="h-12 border border-input bg-background px-3 text-body"
          />
        </label>
        <Select label="Brand" name="brand" value={filters.brand} options={brands} all="All brands" />
        <Select label="Condition" name="condition" value={filters.condition} options={conditions} all="Any condition" />
        <Select
          label="Availability"
          name="availability"
          value={filters.availability}
          options={Object.entries(availabilityLabel).map(([value, label]) => ({ value, label }))}
          all="All watches"
        />
        <Select
          label="Sort"
          name="sort"
          value={filters.sort}
          options={[
            { value: 'newest', label: 'Newest' },
            { value: 'brand', label: 'Brand' },
            { value: 'model', label: 'Model' },
          ]}
        />
        <div className="flex items-center gap-6 sm:col-span-2 lg:col-span-6">
          <button type="submit" className="button">
            Show watches
          </button>
          {filtered && (
            <Link href="/watches" className="text-link text-small">
              Clear filters
            </Link>
          )}
        </div>
      </form>

      <p role="status" className="mt-8 text-muted-foreground">
        {watches.length === 1 ? '1 watch' : `${watches.length} watches`}
      </p>

      {watches.length > 0 ? (
        <ul className="mt-6 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {watches.map((watch) => (
            <li key={watch.id}>
              <WatchCard watch={watch} settings={settings} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 flex flex-col items-start gap-6 bg-muted p-8 md:p-12">
          <h2 className="text-heading">No watches match</h2>
          <p className="max-w-[44ch]">Try fewer filters, or tell us what you are looking for and we will search for it.</p>
          <a
            href={whatsappHref(settings.whatsapp, settings.messageGeneral)}
            target="_blank"
            rel="noopener noreferrer"
            className="button"
          >
            Ask us to find it
          </a>
        </div>
      )}
    </>
  )
}

type Option = string | { value: string; label: string }

function Select({ label, name, value, options, all }: { label: string; name: string; value?: string; options: readonly Option[]; all?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-small">
      {label}
      <select name={name} defaultValue={value ?? ''} className="h-12 border border-input bg-background px-3 text-body">
        {all && <option value="">{all}</option>}
        {options.map((option) => {
          const { value, label } = typeof option === 'string' ? { value: option, label: option } : option
          return (
            <option key={value} value={value}>
              {label}
            </option>
          )
        })}
      </select>
    </label>
  )
}

/** Only accept values the site itself offers; anything else in the URL is ignored. */
function parseFilters(params: Awaited<SearchParams>, brands: string[]): WatchFilters {
  const one = (key: string) => {
    const value = params[key]
    return (Array.isArray(value) ? value[0] : value)?.trim() || undefined
  }
  const pick = <T extends string>(value: string | undefined, allowed: readonly T[]) =>
    allowed.find((option) => option === value)

  // Availability defaults to watches you can still buy; an explicit empty value means all.
  const availability = params.availability === undefined ? 'available' : one('availability')

  return {
    q: one('q')?.slice(0, 64),
    brand: pick(one('brand'), brands),
    condition: pick(one('condition'), conditions),
    availability: pick(availability, ['available', 'sold', 'unavailable'] as const),
    sort: pick(one('sort'), Object.keys(sorts) as (keyof typeof sorts)[]) ?? 'newest',
  }
}
