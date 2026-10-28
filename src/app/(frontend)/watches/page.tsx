import { ArrowDownRight, ArrowRight, ArrowUpRight, Search, SlidersHorizontal, X } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { conditions } from '@/collections/Watches'
import { Emphasis } from '@/components/emphasis'
import { availabilityLabel, WatchCard } from '@/components/watch-card'
import { getBrands, getSettings, getWatches, sorts, whatsappHref, type WatchFilters } from '@/lib/queries'
import type { Setting } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return { title: settings.breadcrumbCollection, description: settings.searchIntro ?? undefined }
}

/** Cards a page; "load more" adds as many again. */
const STEP = 8

/**
 * The reference's search page, which brand links also open (/watches?brand=…). The intro and
 * an empty form are cached Payload content, so they are the static shell; the filled form and
 * the results depend on the URL, so they stream in behind Suspense. Plain GET forms and links:
 * it works without JavaScript.
 */
export default async function WatchesPage({ searchParams }: PageProps<'/watches'>) {
  const [settings, brands] = await Promise.all([getSettings(), getBrands()])

  return (
    <div className="finder page-wrap">
      <header className="finder-intro">
        {settings.searchEyebrow && <p className="finder-eyebrow">{settings.searchEyebrow}</p>} {/* taste-skill-ignore: from the reference */}
        <h1 className="finder-title">
          <Emphasis text={settings.searchHeading} />
        </h1>
        {settings.searchIntro && <p className="finder-lede">{settings.searchIntro}</p>}
      </header>
      <Suspense fallback={<Finder settings={settings} brands={brands} filters={{ availability: 'available' }} />}>
        <Results searchParams={searchParams} settings={settings} brands={brands} />
      </Suspense>
    </div>
  )
}

type SearchParams = Awaited<PageProps<'/watches'>['searchParams']>

async function Results({
  searchParams,
  settings,
  brands,
}: {
  searchParams: PageProps<'/watches'>['searchParams']
  settings: Setting
  brands: string[]
}) {
  const params = await searchParams
  const filters = parseFilters(params, brands)
  const watches = await getWatches(filters)
  const show = Math.max(STEP, Math.min(Number(one(params, 'show')) || STEP, watches.length))
  const active = Boolean(filters.brand || filters.condition || filters.availability !== 'available')

  const count = (watches.length === 1 ? settings.resultsOne : settings.resultsMany).split('{count}')
  const chips = [
    filters.brand,
    filters.condition,
    filters.availability !== 'available' &&
      (filters.availability ? availabilityLabel(settings, filters.availability) : settings.allWatches),
  ].filter(Boolean)
  const wanted = filters.q || [filters.brand, filters.condition].filter(Boolean).join(' ')

  return (
    <>
      <Finder settings={settings} brands={brands} filters={filters} active={active || Boolean(filters.q)} />

      {chips.length > 0 && (
        <ul className="finder-chips">
          {chips.map((chip) => (
            <li key={String(chip)}>{chip}</li>
          ))}
        </ul>
      )}

      <div className="finder-bar-results">
        <p role="status">
          {count[0]}
          <b>{watches.length}</b>
          {count[1]}
          {filters.q && <> {settings.resultsFor.replace('{q}', filters.q)}</>}
        </p>
        {settings.resultsNote && <p>{settings.resultsNote}</p>}
      </div>

      {watches.length > 0 ? (
        <>
          <ul className="collection-grid">
            {watches.slice(0, show).map((watch) => (
              <li key={watch.id}>
                <WatchCard watch={watch} settings={settings} />
              </li>
            ))}
          </ul>
          {watches.length > show && (
            <p className="finder-more">
              <Link href={withParams(params, { show: String(show + STEP) })} scroll={false} className="collection-link">
                {settings.loadMoreLabel}
                <ArrowDownRight size={15} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </p>
          )}
        </>
      ) : (
        <div className="finder-empty">
          <span className="finder-empty-icon" aria-hidden="true">
            <Search size={22} strokeWidth={1.4} />
          </span>
          <h2>{settings.emptyHeading}</h2>
          <p>{settings.emptyText}</p>
          <a
            href={
              wanted
                ? whatsappHref(settings.whatsapp, settings.messageFind.replaceAll('{query}', wanted))
                : whatsappHref(settings.whatsapp, settings.messageGeneral)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="detail-button"
          >
            {settings.emptyButton}
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </a>
          <Link href="/watches" className="finder-clear">
            {settings.emptyClear}
          </Link>
        </div>
      )}
    </>
  )
}

/** The search field and the lists that refine it: one GET form, so every choice is a URL. */
function Finder({
  settings,
  brands,
  filters,
  active = false,
}: {
  settings: Setting
  brands: string[]
  filters: WatchFilters
  active?: boolean
}) {
  return (
    <form action="/watches" role="search" className="finder-form">
      <div className="finder-field">
        <Search size={20} strokeWidth={1.4} aria-hidden="true" />
        <input
          type="search"
          name="q"
          defaultValue={filters.q}
          maxLength={64}
          placeholder={settings.searchPlaceholder}
          aria-label={settings.searchLabel}
          enterKeyHint="search"
        />
        <button type="submit" className="finder-submit">
          {settings.searchButton}
          <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="finder-tools">
        <p className="finder-refine">
          <SlidersHorizontal size={15} strokeWidth={1.5} aria-hidden="true" />
          {settings.refineLabel}
        </p>
        <Select name="brand" label={settings.filterBrandLabel} value={filters.brand} all={settings.allBrands} options={brands} />
        <Select
          name="condition"
          label={settings.filterConditionLabel}
          value={filters.condition}
          all={settings.allConditions}
          options={conditions}
        />
        <Select
          name="availability"
          label={settings.filterAvailabilityLabel}
          value={filters.availability}
          all={settings.allWatches}
          options={(['available', 'sold', 'unavailable'] as const).map((value) => ({
            value,
            label: availabilityLabel(settings, value),
          }))}
        />
        <label className="finder-sort">
          <span>{settings.sortLabel}</span>
          <select name="sort" defaultValue={filters.sort ?? 'newest'}>
            <option value="newest">{settings.sortNewest}</option>
            <option value="brand">{settings.sortBrand}</option>
            <option value="model">{settings.sortModel}</option>
          </select>
        </label>
        <button type="submit" className="finder-apply">
          {settings.applyLabel}
        </button>
        {active && (
          <Link href="/watches" className="finder-clear">
            {settings.clearLabel}
            <X size={13} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        )}
      </div>
    </form>
  )
}

type Option = string | { value: string; label: string }

function Select({ name, label, value, all, options }: { name: string; label: string; value?: string; all: string; options: readonly Option[] }) {
  return (
    <label className="finder-select">
      <span className="sr-only">{label}</span>
      <select name={name} defaultValue={value ?? ''}>
        <option value="">{all}</option>
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

const one = (params: SearchParams, key: string) => {
  const value = params[key]
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined
}

/** The current URL with some parameters replaced, for "load more". */
function withParams(params: SearchParams, changes: Record<string, string>) {
  const query = new URLSearchParams()
  for (const key of ['q', 'brand', 'condition', 'availability', 'sort']) {
    const value = params[key]
    if (value !== undefined) query.set(key, Array.isArray(value) ? value[0] : value)
  }
  for (const [key, value] of Object.entries(changes)) query.set(key, value)
  return `/watches?${query}`
}

/** Only accept values the site itself offers; anything else in the URL is ignored. */
function parseFilters(params: SearchParams, brands: string[]): WatchFilters {
  const pick = <T extends string>(value: string | undefined, allowed: readonly T[]) =>
    allowed.find((option) => option === value)

  // Availability defaults to watches you can still buy; an explicit empty value means all.
  const availability = params.availability === undefined ? 'available' : one(params, 'availability')

  return {
    q: one(params, 'q')?.slice(0, 64),
    brand: pick(one(params, 'brand'), brands),
    condition: pick(one(params, 'condition'), conditions),
    availability: pick(availability, ['available', 'sold', 'unavailable'] as const),
    sort: pick(one(params, 'sort'), Object.keys(sorts) as (keyof typeof sorts)[]) ?? 'newest',
  }
}
