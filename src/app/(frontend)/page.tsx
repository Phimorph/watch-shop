import { Featured } from '@/components/home/featured'
import { Hero } from '@/components/home/hero'
import { Marquee } from '@/components/home/marquee'
import { Reviews } from '@/components/home/reviews'
import { Sold } from '@/components/home/sold'
import { Story } from '@/components/home/story'
import { Trust } from '@/components/home/trust'
import { getBrands, getFeaturedWatches, getHome, getSettings, getWatches, whatsappHref } from '@/lib/queries'

/**
 * Every read here is a cached Payload query, so the whole page is prerendered into the
 * static shell and served instantly; editing content in the admin revalidates it.
 */
export default async function HomePage() {
  const [home, settings, brands, featured, available, sold] = await Promise.all([
    getHome(),
    getSettings(),
    getBrands(),
    getFeaturedWatches(),
    getWatches({ availability: 'available' }),
    getWatches({ availability: 'sold' }),
  ])
  const chat = whatsappHref(settings.whatsapp, settings.messageGeneral)
  // The collection opens with the featured watches, then the rest of the stock, newest first.
  const collection = [...featured, ...available.filter((watch) => !featured.some(({ id }) => id === watch.id))]

  return (
    <>
      <Hero hero={home.hero} chat={chat} watches={featured} referenceLabel={settings.referenceLabel} />
      <Marquee brands={home.brands} names={brands} />
      <Featured catalog={home.catalog} watches={collection} total={available.length} settings={settings} />
      <Trust trust={home.trust} />
      <Sold sold={home.sold} watches={sold} settings={settings} />
      <Story story={home.story} chat={chat} />
      <Reviews reviews={home.reviews} />
    </>
  )
}
