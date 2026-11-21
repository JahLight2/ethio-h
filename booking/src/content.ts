/**
 * Every string and rate on the page. Components hold no copy of their own.
 * Deliberately short: a title, a price, a calendar, a form.
 */
import { brand, email, phoneDisplay } from './lib/brand'

export type FrequencyId = 'once' | 'fortnight' | 'weekly'
export type WindowId = 'morning' | 'midday' | 'afternoon'
export type AddonId = 'glass' | 'linen' | 'brass' | 'interior'

export const header = {
  cta: { label: 'Book', href: '#book' },
}

export const hero = {
  h1: ['Residence care.', 'Priced plainly.'],
  base: 320,
}

export const calculator = {
  bedrooms: { label: 'Bedrooms', min: 1, max: 6, default: 3 },
  bathrooms: { label: 'Bathrooms', min: 1, max: 4, default: 2 },
  frequencies: [
    { id: 'once' as FrequencyId, label: 'Once', badge: null },
    { id: 'fortnight' as FrequencyId, label: 'Every 2 weeks', badge: '−15%' },
    { id: 'weekly' as FrequencyId, label: 'Weekly', badge: '−25%' },
  ],
  totalLabel: 'Total',
}

/** Base visit, per-room adders, frequency multipliers and flat add-on fees. */
export const rates = {
  base: 320,
  bedroom: 45,
  bathroom: 30,
  frequency: {
    once: 1,
    fortnight: 0.85,
    weekly: 0.75,
  } as Record<FrequencyId, number>,
  discountLabel: {
    once: null,
    fortnight: '−15%',
    weekly: '−25%',
  } as Record<FrequencyId, string | null>,
}

export const addons: {
  id: AddonId
  name: string
  price: number
  icon: 'glass' | 'linen' | 'brass' | 'interior'
}[] = [
  { id: 'glass', name: 'Glass & light', price: 150, icon: 'glass' },
  { id: 'linen', name: 'Linen & interiors', price: 95, icon: 'linen' },
  { id: 'brass', name: 'Brass & fixtures', price: 80, icon: 'brass' },
  { id: 'interior', name: 'Inside the cupboards', price: 120, icon: 'interior' },
]

export const calendar = {
  label: 'Date',
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}

export const booking = {
  windows: [
    { id: 'morning' as WindowId, label: '07 – 11' },
    { id: 'midday' as WindowId, label: '11 – 15' },
    { id: 'afternoon' as WindowId, label: '15 – 18' },
  ],
  windowLabel: 'Window',
  summaryTitle: 'Visit',
  formTitle: 'Details',
  fields: {
    name: { label: 'Name', placeholder: 'Name' },
    address: { label: 'Address', placeholder: 'Address' },
    phone: { label: 'Phone', placeholder: 'Phone' },
    note: { label: 'Note', placeholder: 'Access note (optional)' },
  },
  submit: 'Book the visit',
  disclaimer: 'Saved in this browser.',
  confirmed: {
    stamp: 'SAVED LOCALLY',
    headline: (day: string) => `Saved for ${day}.`,
    change: 'Change',
    reference: 'Reference',
  },
}

export const footer = {
  bottom: `© ${brand.legal}`,
  contact: { email, phoneDisplay },
}
