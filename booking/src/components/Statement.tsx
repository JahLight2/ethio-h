import { Sparkle } from './Sparkle'

const words = ['dust', 'stone', 'brass', 'linen', 'glass']

/** A quiet continuous band — the only endless motion on the page. */
export function Statement() {
  return (
    <section className="overflow-hidden border-y border-[var(--hair)] bg-[var(--paper)] py-5" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((row) => (
          <div key={row} className="flex items-center gap-6 pr-6">
            {Array.from({ length: 4 })
              .flatMap(() => words)
              .map((w, i) => (
                <span
                  key={`${row}-${i}`}
                  className="flex items-center gap-6 font-sub text-[11px] font-extrabold uppercase tracking-[0.24em] text-[var(--ink-faint)]"
                >
                  {w}
                  <Sparkle size={7} style={{ color: 'var(--steel)', opacity: 0.6 }} />
                </span>
              ))}
          </div>
        ))}
      </div>
    </section>
  )
}
