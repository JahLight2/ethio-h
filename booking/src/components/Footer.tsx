import { email, telHref } from '../lib/brand'
import { footer } from '../content'

export function Footer() {
  return (
    <footer className="booking-footer mt-[clamp(28px,4vw,48px)]">
      <div className="shell booking-footer-inner">
        <a href="../index.html" className="booking-footer-logo" aria-label="Ethio H Cleaning Service — home">
          <img src="/booking-page/logo-lockup-mist.png" alt="Ethio H Cleaning Service" />
        </a>
        <div className="booking-footer-meta">
          <span>{footer.bottom}</span>
          <span className="flex gap-5">
            <a href={telHref} className="link-draw num">{footer.contact.phoneDisplay}</a>
            <a href={`mailto:${email}`} className="link-draw">{email}</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
