/**
 * Every string, rate, list and image path on the page.
 * Components read from here and hold no copy of their own.
 */
import { brand, email, phoneDisplay, serviceArea } from './lib/brand'

export type FrequencyId = 'once' | 'fortnight' | 'weekly'
export type WindowId = 'morning' | 'midday' | 'afternoon'
export type AddonId = 'glass' | 'linen' | 'brass' | 'interior'

export const header = {
  nav: [
    { label: 'The price', href: '#calculator' },
    { label: 'What’s included', href: '#checklist' },
    { label: 'When', href: '#book' },
  ],
  cta: { label: 'Book a visit', href: '#book' },
}

export const hero = {
  eyebrow: `Residence care in ${brand.shortCity}`,
  h1: ['A fixed price.', 'Then a quiet house.'],
  lede: `Move two counts and the figure is real — a base visit, rooms on top, less when we come regularly. No calls, no “someone will contact you”. You pick the day and the window yourself.`,
  primary: { label: 'Price my visit', href: '#calculator' },
  secondary: { label: 'What’s included', href: '#checklist' },
  trust: ['Insured & bonded', 'Same team every visit', 'We bring everything'],
  image: {
    src: './images/room-clean.jpg',
    alt: 'A double-height sitting room with glass walls, pale curtains and a clean floor',
    position: '50% 50%',
  },
  badge: 'spotless, not sterile',
}

export const calculator = {
  eyebrow: 'The twenty-second price',
  h2: 'Your house, your figure.',
  lede: 'Two counts, one rhythm, whatever needs doing on top. The total moves as you do.',
  bedrooms: { label: 'Bedrooms', min: 1, max: 6, default: 3 },
  bathrooms: { label: 'Bathrooms', min: 1, max: 4, default: 2 },
  frequencies: [
    { id: 'once' as FrequencyId, label: 'Once', badge: null, note: 'one-off visit' },
    { id: 'fortnight' as FrequencyId, label: 'Every 2 weeks', badge: '−15%', note: 'every two weeks' },
    { id: 'weekly' as FrequencyId, label: 'Weekly', badge: '−25%', note: 'every week' },
  ],
  totalLabel: 'Your visit',
  note: 'Sample math for this page. The survey confirms the same figure in writing.',
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
    fortnight: '−15% every two weeks',
    weekly: '−25% every week',
  } as Record<FrequencyId, string | null>,
}

export const addons: {
  id: AddonId
  name: string
  price: number
  detail: string
  icon: 'glass' | 'linen' | 'brass' | 'interior'
}[] = [
  { id: 'glass', name: 'Glass & light', price: 150, detail: 'Interior panes, blade-dry', icon: 'glass' },
  { id: 'linen', name: 'Linen & interiors', price: 95, detail: 'Beds remade, linen changed', icon: 'linen' },
  { id: 'brass', name: 'Brass & fixtures', price: 80, detail: 'Polished, not stripped', icon: 'brass' },
  { id: 'interior', name: 'Inside the cupboards', price: 120, detail: 'Shelves out, wiped, returned', icon: 'interior' },
]

export const checklist = {
  eyebrow: 'Every visit includes',
  h2: 'The plain-words list.',
  items: [
    'Dusting — shelves, sills, ledges and cornices, top down',
    'Floors — stone, timber and rug, vacuumed then mopped, corners included',
    'Bathrooms and powder rooms — scrubbed, polished, mirrors wiped',
    'Kitchen surfaces and cabinet fronts — and the top of the fridge',
    'Beds made with the linen you leave out',
    'Brass and fixtures wiped by hand, never soaked',
    'Glass and mirrors inside, blade-dry and streak-free',
    'A note left on the hall table if we noticed anything — a bulb out, a drip',
  ],
  image: {
    src: './images/counter-clean.jpg',
    alt: 'A pale marble countertop with a brass tap and an empty sink',
    position: '50% 50%',
  },
  caption: 'The blade test: no streaks, no film, nothing left behind.',
}

export const booking = {
  eyebrow: 'Pick a day',
  h2: 'When should we come?',
  dayChipNote: 'Next fourteen days',
  closedNote: 'We rest',
  windows: [
    { id: 'morning' as WindowId, label: '07 – 11', note: 'morning' },
    { id: 'midday' as WindowId, label: '11 – 15', note: 'midday' },
    { id: 'afternoon' as WindowId, label: '15 – 18', note: 'afternoon' },
  ],
  windowLabel: 'Window',
  dateLabel: 'Day',
  summaryTitle: 'Your visit',
  formTitle: 'Where are we going?',
  fields: {
    name: { label: 'Name', placeholder: 'The name the household uses' },
    address: { label: 'Address', placeholder: 'Street and suite' },
    neighbourhood: { label: 'Neighbourhood', placeholder: 'Choose one' },
    phone: { label: 'Phone or WhatsApp', placeholder: '+1 416 000 0000' },
    note: { label: 'Access note', placeholder: 'Gate code, buzzer, parking — optional', optional: true },
  },
  submit: 'Book the visit',
  disclaimer:
    'This page saves your booking in this browser. The live page confirms by text within one business day.',
  requiredNote: 'Name, address, day and window are required.',
  confirmed: {
    stamp: 'BOOKED',
    headline: (day: string, window: string) => `See you ${day}, ${window}.`,
    line: 'Bring nothing. Do nothing. It’s handled.',
    change: 'Change this booking',
    reference: 'Reference',
  },
  side: {
    src: './images/hall-clean.jpg',
    alt: 'A bright entrance hall with a black door, a stone floor and a staircase',
    position: '50% 60%',
    caption: 'Six residences a day, two streets at a time.',
  },
}

export const trust = [
  'Insured, bonded, background-checked',
  'The same two people, every visit',
  'Supplies included — fragrance-free on request',
]

export const trustBand = {
  src: './images/brass-clean.jpg',
  alt: 'A polished brass tap and towel rail against a rough plaster wall',
  position: '50% 50%',
  caption: 'Brass, wiped by hand.',
}

export const reviews = {
  eyebrow: 'Households, quoted',
  h2: 'Three houses, three opinions.',
  items: [
    {
      quote: 'They charge what the counter said. In this city, that’s romance.',
      name: 'Marisol T.',
      place: serviceArea[0],
      rhythm: 'every two weeks',
    },
    {
      quote: 'The same two people every time — the dog has stopped filing complaints.',
      name: 'Dan & Priya',
      place: serviceArea[2],
      rhythm: 'weekly',
    },
    {
      quote: 'I read the list to my teenager as a threat. It worked on both of them.',
      name: 'Jules R.',
      place: serviceArea[3],
      rhythm: 'once a month',
    },
  ],
}

export const footer = {
  reach: 'Reach us',
  page: 'This page',
  links: [
    { label: 'The price', href: '#calculator' },
    { label: 'What’s included', href: '#checklist' },
    { label: 'When', href: '#book' },
  ],
  hours: 'Mon – Sat, 07:00 – 18:00',
  bottom: `© ${brand.legal}. Sample prices; spotless intentions.`,
  contact: { email, phoneDisplay },
}
