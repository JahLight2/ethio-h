import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { booking, calendar } from '../content'
import { bookingStore, useBooking } from '../store/booking'

type Cell = { key: string; day: number } | null

const pad = (n: number) => String(n).padStart(2, '0')
const keyOf = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

/** Monday-first weeks for one month. */
function grid(year: number, month: number): Cell[] {
  const first = new Date(year, month, 1)
  const lead = (first.getDay() + 6) % 7 // Monday = 0
  const days = new Date(year, month + 1, 0).getDate()
  const cells: Cell[] = Array.from({ length: lead }, () => null)
  for (let d = 1; d <= days; d += 1) cells.push({ key: keyOf(year, month, d), day: d })
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function Calendar() {
  const { draft } = useBooking()
  const today = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const cells = useMemo(() => grid(cursor.getFullYear(), cursor.getMonth()), [cursor])
  const todayKey = keyOf(today.getFullYear(), today.getMonth(), today.getDate())

  const shift = (dir: 1 | -1) => {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + dir, 1)
    const floor = new Date(today.getFullYear(), today.getMonth(), 1)
    const ceil = new Date(today.getFullYear(), today.getMonth() + 12, 1)
    if (next < floor || next > ceil) return
    setCursor(next)
  }

  const atFloor = cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth()
  const atCeil = cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth() + 12

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-sub text-[13px] font-extrabold uppercase tracking-[0.16em] text-[var(--ink)]">
          {calendar.months[cursor.getMonth()]} <span className="text-[var(--ink-faint)]">{cursor.getFullYear()}</span>
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => shift(-1)}
            disabled={atFloor}
            aria-label="Previous month"
            className="step-btn h-[34px] w-[34px] disabled:opacity-25"
          >
            <ChevronLeft size={15} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            disabled={atCeil}
            aria-label="Next month"
            className="step-btn h-[34px] w-[34px] disabled:opacity-25"
          >
            <ChevronRight size={15} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-y-1">
        {calendar.weekdays.map((w) => (
          <span
            key={w}
            className="pb-2 text-center font-sub text-[9.5px] font-extrabold uppercase tracking-[0.12em] text-[var(--ink-faint)]"
          >
            {w}
          </span>
        ))}

        {cells.map((cell, i) => {
          if (!cell) return <span key={`x-${i}`} aria-hidden="true" />
          const on = draft.date === cell.key
          const isToday = cell.key === todayKey
          const dim = cell.key < todayKey
          return (
            <button
              key={cell.key}
              type="button"
              aria-pressed={on}
              aria-label={`${cell.day} ${calendar.months[cursor.getMonth()]}`}
              disabled={dim}
              onClick={() => bookingStore.patch({ date: cell.key, window: draft.window })}
              className="relative mx-auto grid h-[36px] w-[36px] place-items-center rounded-full font-sub text-[13px] font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-25 sm:h-[38px] sm:w-[38px]"
              style={{
                background: on ? 'var(--midnight)' : 'transparent',
                color: on ? 'var(--mist-blue)' : 'var(--ink)',
                boxShadow: isToday && !on ? 'inset 0 0 0 1px var(--hair)' : undefined,
              }}
            >
              <span className="num">{cell.day}</span>
              {isToday && !on && (
                <span className="absolute bottom-[6px] h-[2px] w-[2px] rounded-full bg-[var(--estate)]" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[var(--hair)] pt-4">
        <p className="font-sub text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
          {booking.windowLabel}
        </p>
        <div className="ml-auto flex gap-1.5" role="group" aria-label={booking.windowLabel}>
          {booking.windows.map((w) => {
            const on = draft.window === w.id
            const off = !draft.date
            return (
              <button
                key={w.id}
                type="button"
                disabled={off}
                aria-pressed={on}
                onClick={() => bookingStore.patch({ window: w.id })}
                className="num rounded-full border px-4 py-2.5 font-sub text-[11px] font-extrabold tracking-[0.04em] transition-colors duration-200 disabled:opacity-30 sm:py-1.5"
                style={{
                  borderColor: on ? 'var(--midnight)' : 'var(--hair)',
                  background: on ? 'var(--midnight)' : 'transparent',
                  color: on ? 'var(--mist-blue)' : 'var(--ink)',
                }}
              >
                {w.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function formatDay(key: string) {
  const [, m, d] = key.split('-').map(Number)
  return `${d} ${calendar.months[m - 1]}`
}
