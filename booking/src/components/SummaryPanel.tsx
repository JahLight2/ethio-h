import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { booking, calculator } from '../content'
import { quote } from '../lib/quote'
import { bookingStore, useBooking } from '../store/booking'
import { formatDay } from './Calendar'
import { SparklePop } from './Sparkle'

export function SummaryPanel() {
  const state = useBooking()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!state.booked) return
    const node = ref.current
    if (!node) return
    if (node.getBoundingClientRect().top < 80) node.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [state.booked])

  return (
    <aside ref={ref} id="summary" className="panel flex w-full flex-col overflow-hidden scroll-mt-[84px]">
      {state.booked ? <Confirmed /> : <BookingForm />}
    </aside>
  )
}

function BookingForm() {
  const { draft } = useBooking()
  const [touched, setTouched] = useState(false)

  const ready = draft.name.trim().length > 1 && draft.address.trim().length > 3 && Boolean(draft.date) && Boolean(draft.window)

  return (
    <form
      className="flex h-full flex-col p-[clamp(20px,2.4vw,28px)]"
      onSubmit={(e) => {
        e.preventDefault()
        setTouched(true)
        if (ready) bookingStore.confirm()
      }}
    >
      <div className="grid gap-2.5">
        <input
          className="field"
          aria-label={booking.fields.name.label}
          placeholder={booking.fields.name.placeholder}
          autoComplete="name"
          value={draft.name}
          onChange={(e) => bookingStore.patch({ name: e.target.value })}
        />
        <input
          className="field"
          aria-label={booking.fields.address.label}
          placeholder={booking.fields.address.placeholder}
          autoComplete="street-address"
          value={draft.address}
          onChange={(e) => bookingStore.patch({ address: e.target.value })}
        />
        <input
          className="field num"
          aria-label={booking.fields.phone.label}
          placeholder={booking.fields.phone.placeholder}
          inputMode="tel"
          autoComplete="tel"
          value={draft.phone}
          onChange={(e) => bookingStore.patch({ phone: e.target.value })}
        />
        <input
          className="field"
          aria-label={booking.fields.note.label}
          placeholder={booking.fields.note.placeholder}
          value={draft.note}
          onChange={(e) => bookingStore.patch({ note: e.target.value })}
        />
      </div>

      {draft.date && (
        <div className="mt-4 flex items-baseline justify-between border-t border-[var(--hair)] pt-4">
          <span className="font-sub text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
            {booking.summaryTitle}
          </span>
          <span className="num font-sub text-[11.5px] font-bold text-[var(--ink)]">
            {formatDay(draft.date)}
            {draft.window ? ` · ${booking.windows.find((w) => w.id === draft.window)!.label}` : ''}
          </span>
        </div>
      )}

      <Total />

      <div className="mt-auto" />

      <button type="submit" className="btn mt-4 w-full">
        {booking.submit}
      </button>

      {touched && !ready && (
        <p className="mt-2 font-sub text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--amber-deep)]">
          Name, address, date and window.
        </p>
      )}
      <p className="mb-0 mt-auto pt-4 text-center font-sub text-[10px] text-[var(--ink-faint)]">{booking.disclaimer}</p>
    </form>
  )
}

function Total() {
  const { draft } = useBooking()
  const q = quote({ bedrooms: draft.bedrooms, bathrooms: draft.bathrooms, frequency: draft.frequency, addons: draft.addons })
  return (
    <div className="mt-1 flex items-baseline justify-between gap-4">
      <span className="font-sub text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
        {calculator.totalLabel}
      </span>
      <span className="figure figure--amber num text-[34px] leading-[0.85]">${q.total.toLocaleString('en-CA')}</span>
    </div>
  )
}

function Confirmed() {
  const { draft, reference } = useBooking()
  const reduced = useReducedMotion()
  const q = useMemo(
    () => quote({ bedrooms: draft.bedrooms, bathrooms: draft.bathrooms, frequency: draft.frequency, addons: draft.addons }),
    [draft.bedrooms, draft.bathrooms, draft.frequency, draft.addons],
  )

  return (
    <div className="relative flex h-full flex-col p-[clamp(22px,2.6vw,30px)]">
      <div className="relative mx-auto grid h-[96px] w-[96px] place-items-center">
        <SparklePop size={12} style={{ position: 'absolute', top: 0, right: 4, color: 'var(--amber)' }} />
        <SparklePop size={9} delay={90} style={{ position: 'absolute', bottom: 8, left: 0, color: 'var(--amber)' }} />
        <svg
          viewBox="0 0 120 120"
          className="h-full w-full"
          style={{ animation: reduced ? undefined : 'stamp-in .6s cubic-bezier(.22,1,.36,1) both' }}
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="55" fill="none" stroke="var(--amber)" strokeWidth="1.5" />
          <circle cx="60" cy="60" r="48" fill="none" stroke="var(--amber)" strokeWidth="0.75" opacity=".5" />
          <text x="60" y="58" textAnchor="middle" fontFamily="Antonio, sans-serif" fontSize="19" letterSpacing="1.6" fill="var(--amber-deep)">
            {booking.confirmed.stamp}
          </text>
          <text x="60" y="74" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="7" letterSpacing="1.4" fill="var(--amber-deep)" opacity=".75">
            ETHIO H
          </text>
        </svg>
      </div>

      <h3 className="display mt-5 text-center text-[24px] leading-none text-[var(--ink)]">
        {booking.confirmed.headline(draft.date ? formatDay(draft.date) : '')}
      </h3>

      <div className="mt-5 grid gap-1 font-sub text-[11.5px] text-[var(--ink-soft)]">
        <div className="flex items-baseline justify-between gap-4 pb-3">
          <span className="uppercase tracking-[0.14em] text-[var(--ink-faint)]">{booking.confirmed.reference}</span>
          <span className="num font-extrabold tracking-[0.06em] text-[var(--ink)]">{reference}</span>
        </div>
        <div className="h-px w-full bg-[var(--hair)]" />
        <span className="pt-3">{draft.name}</span>
        <span>{draft.address}</span>
        <span className="num">
          {draft.date ? formatDay(draft.date) : ''}
          {draft.window ? ` · ${booking.windows.find((w) => w.id === draft.window)!.label}` : ''}
        </span>
        {draft.phone && <span className="num">{draft.phone}</span>}
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-[var(--hair)] pt-4">
        <span className="font-sub text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-faint)]">Total</span>
        <span className="figure figure--amber num text-[28px]">${q.total.toLocaleString('en-CA')}</span>
      </div>

      <div className="mt-auto pt-5 text-center">
        <button
          type="button"
          onClick={() => bookingStore.reopen()}
          className="link-draw font-sub text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--estate)]"
        >
          {booking.confirmed.change}
        </button>
      </div>
    </div>
  )
}
