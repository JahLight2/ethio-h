import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Layers, Minus, Plus, Sparkles, Sun, Wind } from 'lucide-react'
import { addons, calculator } from '../content'
import { quote } from '../lib/quote'
import { bookingStore, useBooking } from '../store/booking'
import { Reveal } from './Reveal'

const addonIcons = { glass: Wind, linen: Layers, brass: Sparkles, interior: Sun } as const

/** The whole price: two counts, a rhythm, four extras. No commentary. */
export function Calculator() {
  const { draft } = useBooking()

  return (
    <section id="price" className="scroll-mt-24 pb-[clamp(20px,2.6vw,32px)]">
      <div className="shell">
        <Reveal>
          <div className="panel p-[clamp(20px,2.6vw,36px)]">
            <div className="grid gap-[clamp(20px,3vw,40px)] lg:grid-cols-2">
              <div className="grid content-start gap-6">
                <Stepper
                  label={calculator.bedrooms.label}
                  min={calculator.bedrooms.min}
                  max={calculator.bedrooms.max}
                  value={draft.bedrooms}
                  onChange={(bedrooms) => bookingStore.patch({ bedrooms })}
                />
                <Stepper
                  label={calculator.bathrooms.label}
                  min={calculator.bathrooms.min}
                  max={calculator.bathrooms.max}
                  value={draft.bathrooms}
                  onChange={(bathrooms) => bookingStore.patch({ bathrooms })}
                />
              </div>

              <div className="grid content-start gap-4">
                <FrequencyPills />
                <div className="grid gap-2 sm:grid-cols-2">
                  {addons.map((a) => (
                    <AddonTile key={a.id} id={a.id} />
                  ))}
                </div>
              </div>
            </div>

            <QuoteLine />
          </div>
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
    <div className="flex items-center justify-between gap-4 border-b border-[var(--hair)] pb-5">
      <p className="font-sub text-[12px] font-extrabold uppercase tracking-[0.14em] text-[var(--ink)]">{label}</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="step-btn h-[38px] w-[38px]"
          onClick={() => bump(-1)}
          disabled={value <= min}
          aria-label={`One fewer ${label.toLowerCase()}`}
        >
          <Minus size={14} strokeWidth={1.75} />
        </button>
        <span
          key={pop}
          className={`figure num min-w-[30px] text-center text-[28px] text-[var(--ink)] ${pop ? 'pop' : ''}`}
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          className="step-btn h-[38px] w-[38px]"
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
    <div className="flex flex-wrap gap-2" role="group" aria-label="Frequency">
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
                className="rounded-full px-1.5 py-0.5 font-sub text-[9px] font-extrabold"
                style={{
                  background: on ? 'var(--mist-blue)' : 'rgba(189,216,233,.35)',
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
      className="flex items-center justify-between gap-3 rounded-[12px] border px-3.5 py-3 text-left transition-colors duration-300"
      style={{
        borderColor: on ? 'var(--estate)' : 'var(--hair)',
        background: on ? 'rgba(189,216,233,.22)' : 'transparent',
      }}
    >
      <span className="flex items-center gap-2.5">
        <Icon size={15} strokeWidth={1.75} style={{ color: on ? 'var(--estate)' : 'var(--ink-faint)' }} />
        <span className="font-sub text-[11.5px] font-extrabold leading-tight text-[var(--ink)]">{item.name}</span>
      </span>
      <span className="num shrink-0 font-sub text-[11px] font-extrabold text-[var(--amber-deep)]">${item.price}</span>
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
    <div className="mt-[clamp(24px,3vw,36px)] flex flex-wrap items-end justify-between gap-4 border-t border-[var(--hair)] pt-[clamp(20px,2.4vw,28px)]">
      <ul className="grid gap-1 font-sub text-[11.5px] text-[var(--ink-soft)]">
        {q.lines.map((l) => (
          <li key={l.key} className="flex items-baseline gap-3">
            <span>{l.label}</span>
            <span className={`num font-bold ${l.amount < 0 ? 'text-[var(--good)]' : 'text-[var(--ink)]'}`}>
              {l.amount < 0 ? '−' : ''}${Math.abs(l.amount).toLocaleString('en-CA')}
            </span>
          </li>
        ))}
      </ul>
      <div className="text-right">
        <p className="font-sub text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
          {calculator.totalLabel}
        </p>
        <p className="figure figure--amber num text-[clamp(40px,4.6vw,58px)]">${shown.toLocaleString('en-CA')}</p>
      </div>
    </div>
  )
}
