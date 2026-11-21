import { rates, type FrequencyId, addons as addonCatalogue, type AddonId } from '../content'

export type QuoteInput = {
  bedrooms: number
  bathrooms: number
  frequency: FrequencyId
  addons: AddonId[]
}

export type Line = {
  key: string
  label: string
  amount: number
  kind: 'charge' | 'discount'
  detail?: string
}

export type Quote = {
  lines: Line[]
  subtotal: number
  discount: number
  total: number
}

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))

/** Pure. Same input, same figure — no clock, no storage, no fetch. */
export function quote({ bedrooms, bathrooms, frequency, addons }: QuoteInput): Quote {
  const beds = clamp(Math.round(bedrooms), 1, 6)
  const baths = clamp(Math.round(bathrooms), 1, 4)
  const picked = addonCatalogue.filter((a) => addons.includes(a.id))

  const lines: Line[] = [
    { key: 'base', label: 'Base visit', amount: rates.base, kind: 'charge' },
    { key: 'bedrooms', label: `Bedrooms × ${beds}`, amount: rates.bedroom * beds, kind: 'charge', detail: `$${rates.bedroom} each` },
    { key: 'bathrooms', label: `Bathrooms × ${baths}`, amount: rates.bathroom * baths, kind: 'charge', detail: `$${rates.bathroom} each` },
    ...picked.map((a) => ({ key: `addon-${a.id}`, label: a.name, amount: a.price, kind: 'charge' as const })),
  ]

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0)
  const multiplier = rates.frequency[frequency]
  const discount = Math.round(subtotal * (1 - multiplier))
  const total = subtotal - discount

  if (discount > 0) {
    const label = rates.discountLabel[frequency]
    if (label) lines.push({ key: 'frequency', label, amount: -discount, kind: 'discount' })
  }

  return { lines, subtotal, discount, total }
}

export const money = (n: number) =>
  `$${Math.abs(Math.round(n)).toLocaleString('en-CA')}`
