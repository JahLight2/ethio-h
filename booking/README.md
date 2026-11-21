# Ethio H — booking page

A single-page pricing and booking flow for Ethio H Cleaning Service, Toronto.
`index.html` holds the whole thing: a live quote, the inclusions list, a
fourteen-day picker, and a summary that confirms in the browser.

Built with Vite 5, React 18, TypeScript and Motion. Everything is self-hosted:
fonts, pattern artwork and photography all ship inside `dist/`. No CDN links,
no analytics, no external API calls.

## Run it

```bash
npm install
npm run dev      # http://localhost:4180
npm run build    # static output in dist/
```

`npm run build` type-checks first (`tsc -b`) and fails on any error.

## Where the numbers come from

`src/lib/quote.ts` is pure and holds the only arithmetic on the page:

| Line | Amount |
| --- | --- |
| Base visit | $320 |
| Each bedroom | +$45 |
| Each bathroom | +$30 |
| Every 2 weeks | −15% on the subtotal |
| Weekly | −25% on the subtotal |
| Glass & light | +$150 |
| Linen & interiors | +$95 |
| Brass & fixtures | +$80 |
| Inside the cupboards | +$120 |

Bedrooms clamp 1–6, bathrooms 1–4. The discount rounds once, so a $590 visit
on a fortnightly rhythm reads $501. Rates live in `src/content.ts` under
`rates`; the base figures match the prices already published on the main site.

## The flow

1. **Price** — two steppers, frequency pills, four add-on tiles. The total
   counts to its new value over 400 ms and changed line items flash.
2. **Inclusions** — eight plain-language items, checks drawing in as they
   arrive.
3. **Day and window** — fourteen days ahead. Sundays rest, one sample day is
   fully taken, past days never appear. The three windows only unlock once a
   day is chosen.
4. **Summary** — line items, total, then name, address, neighbourhood, phone
   and an optional access note. Submitting swaps the panel for a stamped
   confirmation with a reference like `EH-BDYZ-KBTK`.

Nothing leaves the browser. The draft and the booked state persist to
`localStorage` under `ethio-h:booking`; "Change this booking" returns to the
form pre-filled.

## Design notes

- Palette and type are carried over from the main site: Midnight `#001D39`,
  Estate `#0A4174`, Mist `#BDD8E9`, paper `#F3F7F9`; Antonio display, Manrope
  subheads and UI, Source Serif 4 body. One warm accent (`--amber`) is spent
  only on the live figure, add-on prices and the stamp.
- The Wave Inlay artwork appears in three roles: inside the display headings
  (`.ink-type`), as a fine band at section seams (`.band-edge`), and as the
  field behind the footer and mobile menu. `public/pattern/wave-ink-type.jpg`
  is a re-graded crop tuned for type at 40–92 px.
- Motion respects `prefers-reduced-motion`: no counting, no sweeps, no
  marquee, and the patterned headings fall back to solid Estate.

## Structure

```
src/
  content.ts          every string, rate, list and image path
  fonts.ts            @font-face assembled from hashed woff2 imports
  index.css           tokens, components, motion primitives
  lib/brand.ts        name, slug, email, phone, hours, service area
  lib/quote.ts        pure pricing
  lib/storage.ts      safe localStorage wrapper
  store/booking.ts    external store via useSyncExternalStore
  components/         Header, Hero, Calculator, Checklist, TrustStrip,
                      Statement, Booking, DatePicker, SummaryPanel,
                      Reviews, Footer, Reveal, Eyebrow, Sparkle
  pages/Home.tsx      composition
```

`src/assets/` holds the woff2 faces and the pattern crops, so Vite
fingerprints and emits them with the bundle. `public/` carries the four
photographs, the pattern files referenced from CSS, and the two logo lockups.
