import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { booking, calculator } from '../content'
import { quote } from '../lib/quote'
import { bookingStore, useBooking } from '../store/booking'
import { Sparkle, SparklePop } from './Sparkle'

export function SummaryPanel() {
  const state = useBooking()
  const { draft } = state
  const panel = useRef<HTMLElement>(null)

  // once booked, bring the confirmation into view rather than leaving it above the fold
  useEffect(() => {
    if (!state.booked) return
    const node = panel.current
    if (!node) return
    const top = node.getBoundingClientRect().top
    if (top < 84) node.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [state.booked])

  const q = quote({
    bedrooms: draft.bedrooms,
    bathrooms: draft.bathrooms,
    frequency: draft.frequency,
    addons: draft.addons,
  })

  return (
    <aside id="summary" ref={panel} className="panel overflow-hidden scroll-mt-[90px] lg:sticky lg:top-[96px]">
      {state.booked ? (
        <Confirmed />
      ) : (
        <>
          <div className="p-[clamp(20px,2.4vw,28px)]">
            <p className="font-sub text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
              {booking.summaryTitle}
            </p>
            <ul className="mt-3 grid gap-1">
              {q.lines.map((l) => (
                <li key={l.key} className="flex items-baseline justify-between gap-3 font-sub text-[12px]">
                  <span className="text-[var(--ink-soft)]">{l.label}</span>
                  <span className={`num font-bold ${l.amount < 0 ? 'text-[var(--good)]' : 'text-[var(--ink)]'}`}>
                    {l.amount < 0 ? '−' : ''}${Math.abs(l.amount).toLocaleString('en-CA')}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-end justify-between border-t border-[var(--hair)] pt-4">
              <span className="font-sub text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                Total
              </span>
              <span className="figure figure--amber num text-[34px]">
                ${q.total.toLocaleString('en-CA')}
              </span>
            </div>

            <div className="mt-3 grid gap-1 font-sub text-[11.5px] text-[var(--ink-soft)]">
              <span>
                <b className="font-extrabold text-[var(--ink)]">{booking.dateLabel}:</b>{' '}
                {draft.date ? formatDay(draft.date) : 'not chosen'}
              </span>
              <span>
                <b className="font-extrabold text-[var(--ink)]">{booking.windowLabel}:</b>{' '}
                {draft.window
                  ? `${booking.windows.find((w) => w.id === draft.window)!.label} · ${booking.windows.find((w) => w.id === draft.window)!.note}`
                  : 'not chosen'}
              </span>
            </div>
          </div>

          <BookingForm />
        </>
      )}
    </aside>
  )
}

function BookingForm() {
  const { draft } = useBooking()
  const [touched, setTouched] = useState(false)

  const ready =
    draft.name.trim().length > 1 &&
    draft.address.trim().length > 3 &&
    Boolean(draft.date) &&
    Boolean(draft.window)

  return (
    <form
      className="border-t border-[var(--hair)] p-[clamp(20px,2.4vw,28px)]"
      onSubmit={(e) => {
        e.preventDefault()
        setTouched(true)
        if (ready) bookingStore.confirm()
      }}
    >
      <p className="font-sub text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
        {booking.formTitle}
      </p>

      <div className="mt-3 grid gap-2.5">
        <label className="sr-only" htmlFor="f-name">
          {booking.fields.name.label}
        </label>
        <input
          id="f-name"
          className="field"
          placeholder={booking.fields.name.placeholder}
          autoComplete="name"
          value={draft.name}
          onChange={(e) => bookingStore.patch({ name: e.target.value })}
        />

        <label className="sr-only" htmlFor="f-address">
          {booking.fields.address.label}
        </label>
        <input
          id="f-address"
          className="field"
          placeholder={booking.fields.address.placeholder}
          autoComplete="street-address"
          value={draft.address}
          onChange={(e) => bookingStore.patch({ address: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-2.5">
          <label className="sr-only" htmlFor="f-hood">
            {booking.fields.neighbourhood.label}
          </label>
          <select
            id="f-hood"
            className="field"
            value={draft.neighbourhood}
            onChange={(e) => bookingStore.patch({ neighbourhood: e.target.value })}
          >
            <option value="">{booking.fields.neighbourhood.placeholder}</option>
            {['The Annex', 'Rosedale', 'Forest Hill', 'Yorkville', 'Lawrence Park', 'Bridle Path'].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="f-phone">
            {booking.fields.phone.label}
          </label>
          <input
            id="f-phone"
            className="field"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Phone"
            value={draft.phone}
            onChange={(e) => bookingStore.patch({ phone: e.target.value })}
          />
        </div>

        <label className="sr-only" htmlFor="f-note">
          {booking.fields.note.label}
        </label>
        <textarea
          id="f-note"
          className="field"
          placeholder={booking.fields.note.placeholder}
          value={draft.note}
          onChange={(e) => bookingStore.patch({ note: e.target.value })}
        />
      </div>

      <button type="submit" className="btn mt-4 w-full" disabled={!ready && touched}>
        {booking.submit}
        <Arrow />
      </button>

      {touched && !ready && (
        <p className="mt-2 font-sub text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[var(--amber-deep)]">
          {booking.requiredNote}
        </p>
      )}
      <p className="caption mt-3 leading-relaxed">{booking.disclaimer}</p>
    </form>
  )
}

function Confirmed() {
  const { draft, reference } = useBooking()
  const reduced = useReducedMotion()
  const q = useMemo(
    () =>
      quote({
        bedrooms: draft.bedrooms,
        bathrooms: draft.bathrooms,
        frequency: draft.frequency,
        addons: draft.addons,
      }),
    [draft.bedrooms, draft.bathrooms, draft.frequency, draft.addons],
  )

  const day = draft.date ? formatDay(draft.date) : ''
  const win = draft.window ? booking.windows.find((w) => w.id === draft.window)! : null

  return (
    <div className="relative overflow-hidden p-[clamp(22px,2.6vw,30px)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[180px] opacity-[.3]"
        style={{
          backgroundImage: "url('./pattern/wave-display-light.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,.9), transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,.9), transparent 85%)',
        }}
        aria-hidden="true"
      />

      <div className="relative">
        {/* the stamp */}
        <div className="relative mx-auto grid h-[112px] w-[112px] place-items-center">
          <SparklePop size={15} style={{ position: 'absolute', top: -2, right: 2, color: 'var(--amber)' }} />
          <SparklePop size={11} delay={90} style={{ position: 'absolute', bottom: 10, left: -4, color: 'var(--amber)' }} />
          <SparklePop size={9} delay={160} style={{ position: 'absolute', top: 22, left: 4, color: 'var(--amber)' }} />

          <svg
            viewBox="0 0 120 120"
            className="h-full w-full"
            style={{ animation: reduced ? undefined : 'stamp-in .6s cubic-bezier(.22,1,.36,1) both' }}
            aria-hidden="true"
          >
            <circle cx="60" cy="60" r="55" fill="none" stroke="var(--amber)" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="48" fill="none" stroke="var(--amber)" strokeWidth="0.75" opacity=".5" />
            <text
              x="60"
              y="58"
              textAnchor="middle"
              fontFamily="Antonio, sans-serif"
              fontSize="19"
              letterSpacing="1.6"
              fill="var(--amber-deep)"
            >
              BOOKED
            </text>
            <text
              x="60"
              y="74"
              textAnchor="middle"
              fontFamily="Manrope, sans-serif"
              fontSize="7"
              letterSpacing="1.4"
              fill="var(--amber-deep)"
              opacity=".75"
            >
              ETHIO H
            </text>
          </svg>
        </div>

        <h3 className="display mt-6 text-center text-[26px] leading-[1.05] text-[var(--ink)]">
          {booking.confirmed.headline(day, win ? win.label : '')}
        </h3>
        <p className="mt-2 text-center font-sub text-[12px] font-semibold text-[var(--ink-soft)]">
          {booking.confirmed.line}
        </p>

        <div className="mt-6 rounded-[14px] border border-[var(--hair)] bg-white/60 p-4">
          <div className="flex items-baseline justify-between font-sub text-[11.5px]">
            <span className="uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              {booking.confirmed.reference}
            </span>
            <span className="num font-extrabold tracking-[0.06em] text-[var(--ink)]">{reference}</span>
          </div>
          <div className="my-3 h-px bg-[var(--hair)]" />
          <div className="grid gap-1 font-sub text-[11.5px] text-[var(--ink-soft)]">
            <span>{draft.name}</span>
            <span>{draft.address}</span>
            {draft.neighbourhood && <span>{draft.neighbourhood}</span>}
            {draft.phone && <span className="num">{draft.phone}</span>}
          </div>
          <div className="my-3 h-px bg-[var(--hair)]" />
          <div className="flex items-baseline justify-between">
            <span className="font-sub text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              {calculator.totalLabel}
            </span>
            <span className="figure figure--amber num text-[26px]">${q.total.toLocaleString('en-CA')}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => bookingStore.reopen()}
          className="mt-4 w-full font-sub text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--estate)] link-draw"
        >
          {booking.confirmed.change}
        </button>
      </div>
    </div>
  )
}

export function formatDay(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dt.getDay()]} ${d} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]}`
}

function Arrow() {
  return (
    <svg className="arr" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 8h11M9 3l5 5-5 5" />
    </svg>
  )
}

// keep the sparkle glyph reachable for the stamp's companions
export { Sparkle }
