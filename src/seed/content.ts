import type { Home, Setting } from '@/payload-types'

import type { Photo } from './watches'

type Media = Record<Photo, string>

/** Sample home page content. Edit it in the admin under Globals → Home. */
export const home = (media: Media): Omit<Home, 'id'> => ({
  hero: {
    eyebrow: 'The art of collecting',
    heading: 'Pre-Owned Luxury\n& *Authentic* Watches',
    intro: 'Carefully selected timepieces. Genuine watches.\nA more personal way to collect.',
    image: media.hero,
    buttonLabel: 'Explore Collection',
    questionPrompt: 'Have a question?',
    questionLabel: 'Talk to us.',
    caption: 'Dhaka · Bangladesh',
    watchesLabel: 'Featured watches',
  },
  brands: {
    note: 'Brand names are editorial references only; no official affiliation is implied',
  },
  catalog: {
    heading: 'Our Collection',
    intro: 'A considered selection of pre-owned timepieces, chosen for their character, craftsmanship and lasting appeal.',
    linkLabel: 'View full collection',
    noticeLeft: 'Illustrative sample inventory',
    noticeRight: 'Details shown are not confirmed live stock',
    count: 8,
    countLabel: 'Showing {shown} of {total} sample watches',
    moreLabel: 'Load More Watches',
  },
  trust: {
    eyebrow: 'A more personal way to collect',
    heading: 'Confidence in Every Detail.',
    items: [
      { icon: 'shield', title: 'Authenticity, Assured', text: 'Every watch is checked before it is listed. Ask us what was checked.' },
      { icon: 'check', title: 'Availability, Transparent', text: 'Know what is available and ask us for the details that matter.' },
      { icon: 'bag', title: 'Pricing, Personal', text: 'Request a price directly and discuss your chosen watch with our team.' },
    ],
  },
  sold: {
    eyebrow: 'A look back',
    heading: 'Collected by Others.\n*Remembered Here.*',
    intro: 'A glimpse at timepieces that have found their next owners.',
    mark: 'The\nArchive',
    markNumber: '№ 01—{total}',
    noticeLeft: 'Illustrative archive examples',
    noticeRight: 'Past-sale status is sample content',
    countLabel: 'Showing {shown} of {total} archive examples',
    linkLabel: 'Explore Past Sales',
  },
  story: {
    eyebrow: 'Behind the collection',
    heading: 'A Passion for\n*Timepieces.*',
    body: 'At watch.me, we believe a great watch is more than an accessory. It carries craftsmanship, character and a story worth passing on. We bring pre-owned timepieces to collectors who value authenticity, thoughtful selection and a more personal buying experience.',
    image: media.hero,
    imageCaption: "The collector's eye",
    founderName: '[Founder Name]',
    founderRole: 'Founder & Curator',
    linkLabel: 'Get to Know Us',
  },
  reviews: {
    eyebrow: 'Reviews',
    heading: 'From Our Customers',
    intro: 'Real experiences. Lasting impressions. Personal service.',
    items: [],
    emptyText: 'Customer feedback will appear here once verified and approved for publication.',
    emptyNote: 'Verified customer reviews · placeholder',
  },
  faq: {
    eyebrow: 'FAQ',
    heading: 'Your Questions,\nAnswered.',
    intro: 'A little more clarity, before the first conversation.',
    questions: [
      { question: 'Are all watches 100% authentic?', answer: 'Each watch is checked against its reference, serial and movement before it is listed. Ask about any piece and we will show you what was checked.' },
      { question: 'Can I see a watch before purchasing?', answer: 'Yes. Message us on WhatsApp to confirm the watch is available and arrange a suitable time to visit.' },
      { question: 'How do I request a price?', answer: 'Open any available watch and choose “Request Price” to send us a message with the watch details.' },
      { question: 'Are the watches new or pre-owned?', answer: 'watch.me focuses on pre-owned timepieces. Each listing shows its condition.' },
      { question: 'Do watches come with their original box and papers?', answer: 'Each listing says whether the original box and papers are included.' },
      { question: 'Can you arrange delivery?', answer: 'Ask us on WhatsApp about the current delivery options.' },
      { question: 'Do you accept trade-ins?', answer: 'Send us photos of your watch on WhatsApp and we will tell you what we can offer.' },
      { question: 'How can I contact the team?', answer: 'Message watch.me on WhatsApp or call the number at the top of the page.' },
    ],
  },
})

/** Sample site settings. Edit them in the admin under Globals → Settings. */
export const settings = (): Omit<Setting, 'id'> => ({
  whatsapp: '880000000000',
  phone: '+880 000 000 000',
  address: 'Suvastu Archad ICT Bhaban, New Elephant Rd, Dhaka 1205',
  announcements: [
    { text: '100% authentic' },
    { text: 'See it first. Decide with confidence.' },
    { text: 'Trusted by watch collectors' },
  ],
  contactLabel: 'Contact us',
  cardDetailsLabel: 'View Details',
  cardPriceLabel: 'Ask for Price',
  referenceLabel: 'Ref.',
  boxLabel: 'Box',
  papersLabel: 'Papers',
  boxPapersLabel: 'Box & papers',
  availableLabel: 'Available',
  soldLabel: 'Sold',
  unavailableLabel: 'Unavailable',
  navigation: [
    { label: 'Collection', href: '/#collection' },
    { label: 'Sold Watches', href: '/#sold' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'About', href: '/#about' },
    { label: 'FAQ', href: '/#faq' },
  ],
  tagline: 'Your destination for authentic pre-owned luxury watches in Dhaka.',
  services: [
    { label: 'In-Store Viewing', href: '/#about' },
    { label: 'Watch Sales', href: '/watches' },
  ],
  servicesNote: 'By personal inquiry',
  legalLinks: [],
  copyright: '© 2026 watch.me. All rights reserved.',
  footerNote: 'Sample storefront · inventory is illustrative',
  detailNote: 'Illustrative sample listing — specifications and availability are not verified live inventory.',
  availableNote: 'Availability should be confirmed directly.',
  reassuranceTitle: 'A considered purchase.',
  reassuranceText: 'Ask us about the watch’s provenance, condition and included accessories before making a decision.',
  messageGeneral: "Hello watch.me, I'd like to know more about your watches.",
  messagePrice: "Hello watch.me, I'd like to know the price of the {watch}. Is it currently available?",
  messageViewing: "Hello watch.me, I'd like to arrange an in-store viewing of the {watch}. Please let me know the available times.",
  messageFind: 'Hello watch.me, could you help me find {query}?',
  siteTitle: 'watch.me — Pre-Owned Luxury Watches in Dhaka',
  siteDescription:
    'Explore the watch.me collection of pre-owned luxury watches in Dhaka. Ask about a timepiece through WhatsApp.',
})
