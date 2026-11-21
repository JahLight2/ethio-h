# Ethio H — Cleaning Service

A quiet, scroll-driven site for **Ethio H · Private Estate Care** (Toronto).

The landing holds a **still, clean room**: the ETHIO H mark rests on the glass and the headline
sits low and fully legible from the first frame. Scrolling is a single **cross dissolve** — the mark
fades first, then the room itself dissolves into the paper of the section below. No wipe, no water,
no canvas.

## Pages
| File | What it is |
| --- | --- |
| `index.html` | The landing (mark + headline, cross dissolve on scroll), the standard, the register, wave band, testimonial, closing CTA |
| `services.html` | The six services with prices, the price table, how a visit runs, questions |
| `contact.html` | Residence-care request as a seven-question wizard with an availability calendar, direct contact, service-area map |

Every page carries a single **Book** button in the header; there is no menu.

## Motion system (`js/site.js`)
- **Smooth scroll** — lerped wheel + keyboard, honours `prefers-reduced-motion`
- **Custom cursor** — dot centred in the ring, label states, inverts over dark sections
- **Landing dissolve** — `initHero()`: mark 0.02–0.30, veil 0.46–0.96, headline hands over 0.88–1.00
- **Reveals** — line masks (`.ln > i`) for display type, staggered `.rv` fade-ups
- **Chapter rail** — right-hand index that tracks sections
- **Service previews**, **magnetic buttons**, parallax, counters, accordion

## Copy rules
- No descriptive paragraphs — names, prices, questions and labels only.
- Display type is set **solid**. The wave pattern lives in section backgrounds, never clipped
  into letterforms (it reads washed at display sizes).
- No logo is ever used as a background.

## Run locally
```bash
npx serve .        # or: python3 -m http.server 8080
```
Then open `http://localhost:8080`. (Open `index.html` directly also works, except the form's
`/api/booking` call, which then falls back to saving in `localStorage`.)

## Booking data layer
`api/booking.js` is a dependency-free Node handler for Vercel.

1. **Supabase** — run `supabase/schema.sql` in the SQL editor, then set on Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-side only — never expose it in the browser)
2. **Google Calendar (optional hold)** — set `GCAL_ACCESS_TOKEN` and `GCAL_CALENDAR_ID`.
   The handler creates an all-day hold on the preferred date.
3. Deploy: `vercel --prod` (the repo already contains `vercel.json`).

Until env vars are set, the form still works: it returns a reference and stores the request in
`localStorage` so nothing is lost. The success panel tells the visitor which happened.

## The booking wizard (`contact.html`)
Seven questions, **one per screen**, in a fixed order: name → phone → email → neighbourhood →
residence → service → date & time. `Next` advances; choice screens auto-advance on tap; `Back` is
always available; the progress bar and counter read `n / 7`. The form box holds its height so the
page never jumps between questions.

**Step 7 is the calendar**, drawn after the Rams reference: one huge day numeral with month, year and
weekday beside two chevrons, then a seven-column grid of dots. **Open days stay clear**, **booked days
fill with Estate blue**, partly booked days carry a blue ring, past days fade out. Choosing a day
opens three windows (Morning 07:00–11:00, Midday 11:00–15:00, Afternoon 15:00–18:00) where reserved
windows read blue and unclickable. Months page three months ahead.

### Wiring it to real availability
Availability is built from two sources in `js/site.js` (`initForm`):

```js
const EH_AVAILABILITY = { 0:['am','mid','pm'], 6:['pm'], ... }  // recurring weekly blocks
const EH_BOOKED = { '2026-11-21': ['pm'], ... }                  // real reservations by ISO date
```

`EH_BOOKED` is currently seeded with a demo month and merged with any requests saved in
`localStorage`. To go live, replace the seed with a fetch — e.g. `GET /api/availability?month=YYYY-MM`
reading the `booking_requests` table (see `supabase/schema.sql`, which already stores
`preferred_date` + `preferred_time`).

## The tide pattern, as a system
One artwork, four jobs — never a stray image:

| Role | Class | Where |
| --- | --- | --- |
| **Wash** — one large soft ground per screen | `.pat-wash` | the standard section (Home), the register (Services) |
| **Edge** — a single tide at a section seam | `.pat-edge--top/--bottom` | register seam, the closing CTA |
| **Tile** — the pattern at full strength | `.waveband__bg`, `.phero__bg` | the wave band, the services hero |

Textures: `wave-display.jpg` (navy, for ink) · `wave-display-soft.jpg` (h1) ·
`wave-display-light.jpg` (paper → steel, for ink/wash/edge) · `wave-band.jpg` ·
`wave-inlay-tile.jpg` · `wave-inlay-light.jpg` · `wave-inlay.jpg`.

Built from the supplied **`02 - Wave Inlay` artwork**: the gradient is flattened, the tile is made
seamless with a four-corner wrap blend, then tinted into the brand grounds. A light-ground variant
(`wave-inlay-light.jpg`) carries the same lines on Mist paper.

| Texture | Job |
| --- | --- |
| `wave-display-light.jpg` | Wash and edge on light grounds |
| `wave-band.jpg` · `wave-inlay-tile.jpg` · `wave-inlay-light.jpg` · `wave-inlay.jpg` | Full-strength tiles and grounds |

Rules: ink never drops below the navy register (legibility first), one wash per screen, edges are
cropped not repeated, never mirrored, never over body copy.

## Right action rail
Fixed on the right edge (≥1081px wide): chapter dots that track the page, plus a vertical
**Book** pill that goes straight to `booking-page/index.html`.

## Brand tokens used
- Midnight `#001D39` · Estate `#0A4174` · Steel `#49769F` · Marine `#4E8EA2` · Sea Glass `#6EA2B3` · Sky `#7BBDE8` · Mist `#BDD8E9`
- Display: **Antonio** (stand-in for Tide Display Soft) · Subheads: **Manrope Bold** · Body: **Source Serif 4**
- Logo extracted from the supplied identity artwork; wave texture from `02 - Wave Inlay.png`

## Placeholders to replace
- `+1 416 000 0000` · `care@ethioh.ca` — search and replace across the three HTML files
- Prices in `services.html` and the register rows in `index.html`
- Client testimonial (currently written in the brand voice, attributed privately)
