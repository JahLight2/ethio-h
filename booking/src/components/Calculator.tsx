import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { CalendarDays, Layers, Minus, Plus, Sparkles, Sun, Wind } from 'lucide-react'
import { addons, calculator, rates } from '../content'
import { quote } from '../lib/quote'
import { bookingStore, useBooking } from '../store/booking'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

const addonIcons = {
  glass: Wind,
  linen: Layers,
  brass: Sparkles,
  interior: Sun,
} as const

export function Calculator() {
  const { draft } = useBooking()

  return (
    <section id="calculator" className="band-edge relative scroll-mt-24 bg-[var(--paper)] py-[clamp(64px,8vw,112px)]">
      <div className="shell">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>{calculator.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.07}>
              <h2 className="display h2 mt-6 text-[var(--ink)]">
                {calculator.h2.split(',')[0]},<br />
                <span className="ink-type ink-type--h2">{calculator.h2.split(', ')[1]}</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.14} className="lg:col-span-5">
            <p className="lead lg:pb-2">{calculator.lede}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-[clamp(36px,4vw,56px)]">
          <div className="panel overflow-hidden">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="border-b border-[var(--hair)] p-[clamp(20px,2.4vw,32px)] md:border-b-0 md:border-r">
                <Stepper
                  label={calculator.bedrooms.label}
                  min={calculator.bedrooms.min}
                  max={calculator.bedrooms.max}
                  value={draft.bedrooms}
                  onChange={(bedrooms) => bookingStore.patch({ bedrooms })}
                />
                <div className="mt-7">
                  <Stepper
                    label={calculator.bathrooms.label}
                    min={calculator.bathrooms.min}
                    max={calculator.bathrooms.max}
                    value={draft.bathrooms}
                    onChange={(bathrooms) => bookingStore.patch({ bathrooms })}
                  />
                </div>
              </div>

              <div className="p-[clamp(20px,2.4vw,32px)]">
                <p className="font-sub text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                  How often
                </p>
                <FrequencyPills />
                <p className="mt-6 border-t border-[var(--hair)] pt-5 font-sub text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                  Base visit ${rates.base} · ${rates.bedroom} a bedroom · ${rates.bathroom} a bathroom
                </p>
              </div>
            </div>

            <div className="border-t border-[var(--hair)] p-[clamp(20px,2.4vw,32px)]">
              <p className="font-sub text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                On top, if you like
              </p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {addons.map((a) => (
                  <AddonTile key={a.id} id={a.id} />
                ))}
              </div>
            </div>

            <QuoteLine />
          </div>

          <p className="caption mt-4 max-w-[62ch]">{calculator.note}</p>
        </Reveal>
      </div>
    </section>
  )
}

function Stepper({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string
  min: number
  max: number
  value: number
  onChange: (v: number) => void
}) {
  const reduced = useReducedMotion()
  const [pop, setPop] = useState(0)

  const bump = (dir: 1 | -1) => {
    const next = Math.min(max, Math.max(min, value + dir))
    if (next === value) return
    onChange(next)
    if (!reduced) setPop((n) => n + 1)
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-sub text-[13px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink)]">{label}</p>
        <p className="mt-1 font-sub text-[11px] text-[var(--ink-faint)]">
          {value} of {max}
        </p>
      </div>
      <div className="well flex items-center gap-3 p-1.5 pl-4">
        <span
          key={pop}
          className={`figure num min-w-[26px] text-center text-[30px] text-[var(--ink)] ${pop ? 'pop' : ''}`}
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          className="step-btn h-[36px] w-[36px]"
          onClick={() => bump(-1)}
          disabled={value <= min}
          aria-label={`One fewer ${label.toLowerCase()}`}
        >
          <Minus size={14} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="step-btn h-[36px] w-[36px]"
          onClick={() => bump(1)}
          disabled={value >= max}
          aria-label={`One more ${label.toLowerCase()}`}
        >
          <Plus size={14} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}

function FrequencyPills() {
  const { draft } = useBooking()
  return (
    <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Frequency">
      {calculator.frequencies.map((f) => {
        const on = draft.frequency === f.id
        return (
          <button
            key={f.id}
            type="button"
            aria-pressed={on}
            onClick={() => bookingStore.patch({ frequency: f.id })}
            className={`chip ${on ? '!bg-[var(--midnight)] !text-[var(--mist-blue)]' : ''}`}
          >
            {f.label}
            {f.badge && (
              <span
                className="rounded-full px-2 py-0.5 font-sub text-[9.5px] font-extrabold tracking-[0.06em]"
                style={{
                  background: on ? 'var(--amber)' : 'rgba(200,137,47,.12)',
                  color: on ? 'var(--midnight)' : 'var(--amber-deep)',
                }}
              >
                {f.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function AddonTile({ id }: { id: (typeof addons)[number]['id'] }) {
  const { draft } = useBooking()
  const item = addons.find((a) => a.id === id)!
  const on = draft.addons.includes(id)
  const Icon = addonIcons[item.icon]

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => bookingStore.toggleAddon(id)}
      className="group relative overflow-hidden rounded-[14px] border p-4 text-left transition-colors duration-300"
      style={{
        borderColor: on ? 'var(--estate)' : 'var(--hair)',
        background: on ? 'rgba(189,216,233,.22)' : 'transparent',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <Icon
          size={17}
          strokeWidth={1.75}
          className="mt-0.5 shrink-0"
          style={{ color: on ? 'var(--estate)' : 'var(--ink-faint)' }}
        />
        <span
          className="grid h-[18px] w-[18px] shrink-0 place-items-center overflow-hidden rounded-full border transition-colors duration-300"
          style={{
            borderColor: on ? 'var(--estate)' : 'var(--hair)',
            background: on ? 'var(--estate)' : 'transparent',
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            style={{ opacity: on ? 1 : 0, transition: 'opacity .2s var(--ease) .06s' }}
            aria-hidden="true"
          >
            <path d="M2.4 6.3 4.9 8.8 9.8 3.4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      <p className="mt-3 font-sub text-[12.5px] font-extrabold leading-tight text-[var(--ink)]">
        {item.name}
      </p>
      <p className="mt-1 font-sub text-[10.5px] leading-snug text-[var(--ink-faint)]">{item.detail}</p>
      <p className="mt-2.5 font-sub text-[12px] font-extrabold text-[var(--amber-deep)] num">+${item.price}</p>
    </button>
  )
}

function QuoteLine() {
  const { draft } = useBooking()
  const reduced = useReducedMotion()
  const q = quote({
    bedrooms: draft.bedrooms,
    bathrooms: draft.bathrooms,
    frequency: draft.frequency,
    addons: draft.addons,
  })

  const [shown, setShown] = useState(q.total)
  const from = useRef(q.total)

  useEffect(() => {
    if (reduced) {
      setShown(q.total)
      from.current = q.total
      return
    }
    const start = performance.now()
    const a = from.current
    const b = q.total
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 420)
      const e = 1 - Math.pow(1 - t, 3)
      setShown(Math.round(a + (b - a) * e))
      if (t < 1) raf = requestAnimationFrame(tick)
      else from.current = b
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [q.total, reduced])

  return (
    <div
      className="border-t border-[var(--hair)] p-[clamp(20px,2.4vw,32px)]"
      style={{ background: 'rgba(189,216,233,.14)' }}
    >
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <ul className="grid gap-1.5">
            {q.lines.map((l) => (
              <LineRow key={l.key} l={l} />
            ))}
          </ul>
        </div>

        <div className="md:text-right">
          <p className="font-sub text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
            Your visit
          </p>
          <p className="figure figure--amber num mt-1 text-[clamp(44px,5vw,64px)]">
            ${shown.toLocaleString('en-CA')}
          </p>
          <p className="font-sub text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            per visit, {rates.frequency[draft.frequency] === 1 ? 'one-off' : calculator.frequencies.find((f) => f.id === draft.frequency)!.note}
          </p>
          <a href="#book" className="btn mt-5 w-full md:w-auto">
            Check a date
            <CalendarDays size={14} strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </div>
  )
}

function LineRow({ l }: { l: { key: string; label: string; amount: number; detail?: string } }) {
  const [flash, setFlash] = useState(false)
  const prev = useRef(l.amount)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (prev.current !== l.amount && !reduced) {
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 320)
      prev.current = l.amount
      return () => clearTimeout(t)
    }
    prev.current = l.amount
  }, [l.amount, reduced])

  return (
    <li
      className={`flex items-baseline justify-between gap-4 rounded-md px-2 py-0.5 font-sub text-[12.5px] ${flash ? 'flash' : ''}`}
    >
      <span className="text-[var(--ink-soft)]">
        {l.label}
        {l.detail && <span className="ml-2 text-[10.5px] text-[var(--ink-faint)]">{l.detail}</span>}
      </span>
      <span className={`num font-bold ${l.amount < 0 ? 'text-[var(--good)]' : 'text-[var(--ink)]'}`}>
        {l.amount < 0 ? '−' : ''}${Math.abs(l.amount).toLocaleString('en-CA')}
      </span>
    </li>
  )
}
