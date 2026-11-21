import { header } from '../content'
import { brand } from '../lib/brand'

/** Wordmark and one button. No navigation. */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[var(--paper)]/90 backdrop-blur-md">
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <a href="../index.html" aria-label={`${brand.legal} — home`}>
          <img
            src="/booking-page/logo-lockup-mist.png"
            alt={brand.legal}
            className="h-[34px] w-auto"
            width={110}
            height={34}
          />
        </a>
        <a href={header.cta.href} className="btn !h-[44px] !px-6">
          {header.cta.label}
        </a>
      </div>
    </header>
  )
}
