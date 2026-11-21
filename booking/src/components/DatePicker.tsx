import { useMemo } from 'react'
import { booking } from '../content'
import { bookingStore, useBooking } from '../store/booking'

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Fourteen days from tomorrow. Sunday rests; one day in the sample is fully taken. */
const TAKEN = 4

type Day = {
  key: string
  weekday: string
  number: number
  closed: boolean
  taken: boolean
}

function buildDays(): Day[] {
  const out: Day[] = []
  const start = new Date()
  start.setHours(12, 0, 0, 0)
  for (let i = 1; i <= 14; i += 1) {
    const d = new Date(start.getTime() + i * 86400000)
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      weekday: WEEKDAY[d.getDay()],
      number: d.getDate(),
      closed: d.getDay() === 0,
      taken: i === TAKEN,
    })
  }
  return out
}

export function DatePicker() {
  const { draft } = useBooking()
  const days = useMemo(buildDays, [])

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-sub text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
          {booking.dayChipNote}
        </p>
        <p className="font-sub text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
          {draft.date ? 'One chosen' : 'Choose one'}
        </p>
      </div>

      <DayChips days={days} />

      <div className="mt-8">
        <p className="font-sub text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
          {booking.windowLabel}
        </p>
        <WindowChips enabled={Boolean(draft.date)} />
      </div>
    </div>
  )
}

function DayChips({ days }: { days: Day[] }) {
  const { draft } = useBooking()

  return (
    <div
      className="snap-x-strip mt-3 flex gap-2 overflow-x-auto pb-2"
      role="group"
      aria-label={booking.dateLabel}
      style={{
        maskImage: 'linear-gradient(to right, #000 0, #000 calc(100% - 26px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, #000 0, #000 calc(100% - 26px), transparent 100%)',
      }}
    >
      {days.map((d) => {
        const on = draft.date === d.key
        const off = d.closed || d.taken
        return (
          <button
            key={d.key}
            type="button"
            disabled={off}
            aria-pressed={on}
            title={d.closed ? booking.closedNote : d.taken ? 'Fully booked' : undefined}
            onClick={() => bookingStore.patch({ date: d.key })}
            className="relative flex h-[74px] w-[62px] shrink-0 snap-start flex-col items-center justify-center rounded-[14px] border transition-colors duration-300 disabled:cursor-not-allowed"
            style={{
              borderColor: on ? 'var(--midnight)' : 'var(--hair)',
              background: on ? 'var(--midnight)' : 'rgba(255,255,255,.55)',
              color: on ? 'var(--mist-blue)' : 'var(--ink)',
              opacity: off ? 0.4 : 1,
            }}
          >
            <span className="font-sub text-[9.5px] font-extrabold uppercase tracking-[0.14em] opacity-70">
              {d.weekday}
            </span>
            <span
              className="num mt-1 font-sub text-[19px] font-extrabold leading-none"
              style={{ textDecoration: d.taken ? 'line-through' : 'none' }}
            >
              {d.number}
            </span>
            {d.closed && (
              <span className="absolute inset-x-0 bottom-[7px] font-sub text-[8px] uppercase tracking-[0.1em] opacity-70">
                rest
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function WindowChips({ enabled }: { enabled: boolean }) {
  const { draft } = useBooking()
  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-3" role="group" aria-label={booking.windowLabel}>
      {booking.windows.map((w) => {
        const on = draft.window === w.id
        return (
          <button
            key={w.id}
            type="button"
            disabled={!enabled}
            aria-pressed={on}
            onClick={() => bookingStore.patch({ window: w.id })}
            className="flex items-center justify-between rounded-[14px] border px-4 py-3 text-left transition-colors duration-300 disabled:opacity-40"
            style={{
              borderColor: on ? 'var(--midnight)' : 'var(--hair)',
              background: on ? 'var(--midnight)' : 'rgba(255,255,255,.55)',
              color: on ? 'var(--mist-blue)' : 'var(--ink)',
            }}
          >
            <span className="num font-sub text-[13px] font-extrabold tracking-[0.04em]">{w.label}</span>
            <span className="font-sub text-[10px] uppercase tracking-[0.14em] opacity-60">{w.note}</span>
          </button>
        )
      })}
    </div>
  )
}

export { WEEKDAY }
