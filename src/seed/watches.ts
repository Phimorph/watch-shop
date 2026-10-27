import type { Watch } from '@/payload-types'

export const photos = {
  chronograph: 'Steel chronograph with a cream dial on a brown leather strap',
  diver: 'Steel diver with a blue bezel and dial on a steel bracelet',
  dress: 'Gold rectangular dress watch with a white dial on a brown leather strap',
  gmt: 'Steel GMT watch with a black bezel and dial on a steel bracelet',
  hero: 'Three pre-owned watches resting on dark velvet and slate',
} as const

export type Photo = keyof typeof photos

type SeedWatch = Omit<Watch, 'id' | 'images' | 'title' | 'slug' | 'createdAt' | 'updatedAt'> & {
  photos: Photo[]
}

/** Sample inventory for development. Replace with real stock and photography before launch. */
export const watches: SeedWatch[] = [
  { brand: 'Omega', model: 'Speedmaster Reduced', reference: '3510.50', description: 'A compact chronograph with the spirit of the Moonwatch, sized for a smaller wrist.', photos: ['chronograph', 'hero'], condition: 'Very good', year: 1998, movement: 'Automatic', caseSize: '39 mm', caseMaterial: 'Stainless steel', dial: 'Black', box: true, papers: false, availability: 'available', featured: true },
  { brand: 'Tudor', model: 'Black Bay 58', reference: '79030N', description: 'A balanced diver with a vintage profile and a crisp, everyday presence.', photos: ['diver', 'hero'], condition: 'Excellent', year: 2021, movement: 'Automatic', caseSize: '39 mm', caseMaterial: 'Stainless steel', dial: 'Navy blue', box: true, papers: true, availability: 'available', featured: true },
  { brand: 'Cartier', model: 'Tank Must', reference: 'WSTA0041', description: 'The geometry of the Tank with a silvered dial and a leather strap.', photos: ['dress', 'hero'], condition: 'Very good', movement: 'Quartz', caseSize: '33.7 × 25.5 mm', caseMaterial: 'Stainless steel', dial: 'Silvered', box: false, papers: false, availability: 'available', featured: true },
  { brand: 'Rolex', model: 'Explorer II', reference: '16570', description: 'An honest tool watch with a legible dial and a second time zone.', photos: ['gmt', 'hero'], condition: 'Good', year: 2004, movement: 'Automatic', caseSize: '40 mm', caseMaterial: 'Stainless steel', dial: 'Black', box: true, papers: true, availability: 'available', featured: true },
  { brand: 'Breitling', model: 'Navitimer 41', reference: 'A13324', description: 'An aviation chronograph with an intricate dial and a confident wrist presence.', photos: ['chronograph'], condition: 'Very good', year: 2019, movement: 'Automatic', caseSize: '41 mm', caseMaterial: 'Stainless steel', dial: 'Black', box: true, papers: true, availability: 'available' },
  { brand: 'TAG Heuer', model: 'Carrera', reference: 'CV2010', description: 'A restrained sports chronograph with strong legibility and a steel bracelet.', photos: ['gmt'], condition: 'Good', movement: 'Automatic', caseSize: '41 mm', caseMaterial: 'Stainless steel', dial: 'Black', box: false, papers: false, availability: 'available' },
  { brand: 'Tudor', model: '1926', reference: 'M91550', description: 'An everyday watch with a subtly textured dial and considered proportions.', photos: ['dress'], condition: 'Very good', movement: 'Automatic', caseSize: '39 mm', caseMaterial: 'Stainless steel', dial: 'Silver', box: true, papers: true, availability: 'available' },
  { brand: 'Breitling', model: 'Superocean Heritage', reference: 'A17320', description: 'Dive-watch utility with polished, mid-century influence.', photos: ['diver'], condition: 'Good', movement: 'Automatic', caseSize: '42 mm', caseMaterial: 'Stainless steel', dial: 'Black', box: false, papers: false, availability: 'available' },
  { brand: 'Patek Philippe', model: 'Calatrava', reference: '3919', description: 'A classic dress-watch silhouette with an understated dial.', photos: ['dress'], condition: 'Very good', movement: 'Manual', caseSize: '33 mm', caseMaterial: '18k yellow gold', dial: 'White', box: false, papers: false, availability: 'unavailable' },
  { brand: 'Audemars Piguet', model: 'Royal Oak', reference: '14790ST', description: 'The integrated-bracelet design that started a category.', photos: ['diver'], condition: 'Very good', movement: 'Automatic', caseSize: '36 mm', caseMaterial: 'Stainless steel', dial: 'Blue', box: true, papers: false, availability: 'sold' },
  { brand: 'Rolex', model: 'Datejust 36', reference: '16234', description: 'A versatile Datejust with a traditional profile and a silver dial.', photos: ['dress'], condition: 'Very good', year: 1995, movement: 'Automatic', caseSize: '36 mm', caseMaterial: 'Stainless steel', dial: 'Silver', box: false, papers: true, availability: 'sold' },
  { brand: 'Omega', model: 'Seamaster 300', reference: '233.30.41.21.01.001', description: 'A robust diver with a black dial and vintage cues.', photos: ['diver'], condition: 'Excellent', year: 2020, movement: 'Automatic', caseSize: '41 mm', caseMaterial: 'Stainless steel', dial: 'Black', box: true, papers: true, availability: 'sold' },
]
