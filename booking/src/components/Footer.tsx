import { brand, email, hours, phoneDisplay, serviceArea, telHref } from '../lib/brand'
import { footer } from '../content'
import { Sparkle } from './Sparkle'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--midnight)] text-[var(--mist-blue)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[.18]"
        style={{
          backgroundImage: "url('./pattern/wave-inlay.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
        aria-hidden="true"
      />

      <div className="shell relative py-[clamp(48px,6vw,72px)]">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Sparkle size={16} style={{ color: 'var(--amber)' }} />
              <span className="display text-[22px] tracking-[0.02em]">{brand.name}</span>
            </div>
            <p className="mt-3 max-w-[30ch] font-sub text-[11px] uppercase leading-relaxed tracking-[0.14em] text-[var(--mist-blue)]/55">
              {brand.descriptor.toLowerCase()} · {brand.city} · {brand.edition}
            </p>
          </div>

          <div>
            <h4 className="font-sub text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--mist-blue)]/45">
              {footer.reach}
            </h4>
            <div className="mt-4 grid gap-2 font-sub text-[12.5px]">
              <a href={telHref} className="link-draw w-fit num">
                {phoneDisplay}
              </a>
              <a href={`mailto:${email}`} className="link-draw w-fit">
                {email}
              </a>
              <span className="opacity-60">{footer.hours}</span>
              <span className="opacity-60">{hours[1].days}: {hours[1].time.toLowerCase()}</span>
            </div>
          </div>

          <div>
            <h4 className="font-sub text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--mist-blue)]/45">
              {footer.page}
            </h4>
            <div className="mt-4 grid gap-2 font-sub text-[12.5px]">
              {footer.links.map((l) => (
                <a key={l.href} href={l.href} className="link-draw w-fit">
                  {l.label}
                </a>
              ))}
            </div>
            <p className="mt-4 max-w-[34ch] font-sub text-[10.5px] leading-relaxed uppercase tracking-[0.1em] text-[var(--mist-blue)]/40">
              {serviceArea.join(' · ')}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/12 pt-6 font-sub text-[10.5px] uppercase tracking-[0.14em] text-[var(--mist-blue)]/40">
          <span>{footer.bottom}</span>
          <span>Built for quiet rooms</span>
        </div>
      </div>
    </footer>
  )
}
