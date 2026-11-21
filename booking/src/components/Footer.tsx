import { email, telHref } from '../lib/brand'
import { footer } from '../content'

export function Footer() {
  return (
    <footer className="mt-[clamp(28px,4vw,48px)] border-t border-[var(--hair)]">
      <div className="shell flex flex-wrap items-center justify-between gap-3 py-6 font-sub text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
        <span>{footer.bottom}</span>
        <span className="flex gap-5">
          <a href={telHref} className="link-draw num">
            {footer.contact.phoneDisplay}
          </a>
          <a href={`mailto:${email}`} className="link-draw">
            {email}
          </a>
        </span>
      </div>
    </footer>
  )
}
