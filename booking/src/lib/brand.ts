/**
 * Brand record. One place the name, city, slug and contact strings resolve.
 * Nothing here is fetched; the slug drives localStorage keys and the mail address.
 */
export const brand = {
  name: 'Ethio H',
  legal: 'Ethio H Cleaning Service',
  city: 'Toronto, Canada',
  shortCity: 'Toronto',
  edition: 'Edition 02',
  descriptor: 'Private estate care',
  focus: 'private residences',
} as const

/** "ethio h" → "ethio-h" — every run of non-alphanumerics becomes one hyphen. */
export const brandSlug = brand.name
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

/** "ethio-h" → "ethioh" */
export const brandCompact = brandSlug.replace(/-/g, '')

export const emailLocal = 'care'
export const emailDomain = `${brandCompact}.ca`
export const email = `${emailLocal}@${emailDomain}`

/** Placeholder voice line, printed as-is. Digits kept separate for tel:. */
export const phoneDisplay = '+1 416 000 0000'
export const phoneDigits = '14160000000'
export const telHref = `tel:+${phoneDigits}`

export const hours = [
  { days: 'Monday – Saturday', time: '07:00 – 18:00' },
  { days: 'Sunday', time: 'By arrangement' },
] as const

export const serviceArea = [
  'The Annex',
  'Rosedale',
  'Forest Hill',
  'Yorkville',
  'Lawrence Park',
  'Bridle Path',
] as const
