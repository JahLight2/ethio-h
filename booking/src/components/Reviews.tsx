import { reviews } from '../content'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

export function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-24 bg-white py-[clamp(64px,8vw,112px)]">
      <div className="shell">
        <Reveal>
          <Eyebrow>{reviews.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.07}>
          <h2 className="display h2 mt-6 max-w-[18ch] text-[var(--ink)]">{reviews.h2}</h2>
        </Reveal>

        <div className="mt-[clamp(32px,4vw,52px)] grid gap-6 md:grid-cols-3">
          {reviews.items.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.07}>
              <figure className="flex h-full flex-col justify-between rounded-[20px] border border-[var(--hair)] bg-white p-6">
                <blockquote>
                  <p className="font-body text-[17px] leading-[1.55] text-[var(--ink)]">“{r.quote}”</p>
                </blockquote>
                <figcaption className="mt-6 border-t border-[var(--hair)] pt-4 font-sub text-[11.5px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                  <span className="font-extrabold text-[var(--ink)]">{r.name}</span>
                  <span className="mx-2 opacity-40">·</span>
                  <span className="text-[var(--amber-deep)]">{r.place}</span>
                  <span className="mx-2 opacity-40">·</span>
                  <span>{r.rhythm}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
