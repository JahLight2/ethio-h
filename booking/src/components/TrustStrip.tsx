import { trust, trustBand } from '../content'
import { Reveal } from './Reveal'

export function TrustStrip() {
  return (
    <section className="bg-[var(--midnight)] text-[var(--mist-blue)]" data-theme="dark">
      <div className="shell grid gap-10 py-[clamp(40px,5vw,64px)] lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <Reveal>
            <figure className="relative overflow-hidden rounded-[20px]">
              <img
                src={trustBand.src}
                alt={trustBand.alt}
                width={1120}
                height={840}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover opacity-90"
                style={{ objectPosition: trustBand.position }}
              />
            </figure>
            <figcaption className="mt-3 font-sub text-[10.5px] uppercase tracking-[0.18em] text-[var(--mist-blue)]/50">
              {trustBand.caption}
            </figcaption>
          </Reveal>
        </div>
        <ul className="grid gap-5 lg:col-span-7 lg:col-start-6">
          {trust.map((t, i) => (
            <Reveal as="li" key={t} delay={i * 0.07} className="flex items-center gap-4 border-b border-white/12 pb-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2.6 8.4 6 11.8 13.4 4" stroke="var(--mist-blue)" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </span>
              <span className="font-sub text-[13.5px] font-semibold leading-snug">{t}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
