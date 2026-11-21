# Ethio H — booking page

One page: a price, a calendar, a form. No navigation, no photography, no
explaining copy.

Vite 5 · React 18 · TypeScript · Motion. Everything self-hosted — fonts,
pattern and marks ship inside `dist/`. No CDN, no analytics, no network calls.

## Run

```bash
npm install
npm run dev      # http://localhost:4180
npm run build    # dist/
```

## The price

`src/lib/quote.ts` is pure and holds the only arithmetic:

| Line | Amount |
| --- | --- |
| Base visit | $320 |
| Each bedroom | +$45 |
| Each bathroom | +$30 |
| Every 2 weeks | −15% |
| Weekly | −25% |
| Glass & light | +$150 |
| Linen & interiors | +$95 |
| Brass & fixtures | +$80 |
| Inside the cupboards | +$120 |

Bedrooms 1–6, bathrooms 1–4. The discount rounds once. Rates live in
`src/content.ts`.

## The calendar

A full month, Monday-first, with chevrons to move through the next twelve
months. **Any date is bookable** — the only days that cannot be chosen are
today and earlier, greyed at 25%. Choosing a day unlocks the three windows
(07–11, 11–15, 15–18). A Sunday is available like any other day.

## The form

Name, address, phone, an optional access note. Submitting requires name,
address, day and window, then swaps the panel for a stamped confirmation with
a reference such as `EH-DGRQ-BVQ9`. Everything stays in `localStorage` under
`ethio-h:booking`; "Change" returns to the form pre-filled.

## Design

Midnight `#001D39`, Estate `#0A4174`, Mist `#BDD8E9`, paper `#F3F7F9`.
Antonio display, Manrope UI, Source Serif 4 body. One warm accent (`--amber`)
on the live figure, add-on prices and the stamp, nothing else. The Wave Inlay
appears once, inside the second line of the title; reduced-motion users get
solid Estate instead.

## Structure

```
src/
  content.ts        every string and rate
  fonts.ts          @font-face from hashed woff2 imports
  index.css         tokens and components
  lib/brand.ts      name, email, phone
  lib/quote.ts      pure pricing
  lib/storage.ts    safe localStorage
  store/booking.ts  external store (useSyncExternalStore)
  components/       Header, Hero, Calculator, Calendar, SummaryPanel,
                    Footer, Reveal, Sparkle, ScrollProgress
  pages/Home.tsx    composition
```
