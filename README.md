# Ethio H — Cleaning Service

Ethio H's Toronto residence-care website. The landing page uses the brand's midnight, estate blue and mist palette, the supplied Wave Inlay artwork and the staff-uniform imagery.

## Pages

- `index.html` — responsive landing page, services, process, testimonial and booking links.
- `services.html` — service details and indicative prices.
- `contact.html` — seven-step residence-care request form.
- `booking-page/` — prebuilt React booking and quote experience.
- `booking/` — source for the booking page (Vite, React and TypeScript).

The landing page's motion is in `js/home.js`; the other static pages use `js/site.js`. Scroll reveals repeat as sections enter the viewport and respect reduced-motion preferences. Styles and self-hosted assets are in `css/` and `assets/`.

## Run locally

From the repository root:

```bash
python3 -m http.server 3000
# open http://localhost:3000
```

The static server does not run the Vercel booking endpoint.

## Booking behavior and deployment

**The quote and booking page currently saves its details in the visitor's browser only.** It does not send a booking to Ethio H or create a calendar event. Its confirmation is a locally saved record, not a server-confirmed reservation.

The separate contact wizard posts to `/api/booking` on a deployment that supports the included Vercel function. The function can write requests to Supabase when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured; optional calendar integration uses `GCAL_ACCESS_TOKEN` and `GCAL_CALENDAR_ID`. See `.env.example` and `supabase/schema.sql`. When the endpoint is unavailable the contact form stores the request in that browser; there is no automatic retry mechanism. A successful endpoint response does not by itself guarantee that a request was stored unless Supabase is configured. Verify the complete flow before accepting live bookings.

The phone number displayed on the site is a placeholder and must be replaced before launch.

## Rebuild the booking page

```bash
cd booking
npm ci
npm run build
# Copy the contents of booking/dist/ into booking-page/ for static deployment.
```

The `booking-page/` directory contains the committed built output served by the main static site; rebuild and update it when making changes in `booking/src/`.
