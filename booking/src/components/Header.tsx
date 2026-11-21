import { useEffect, useState } from 'react'
import { brand } from '../lib/brand'
import { header } from '../content'

export function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
        style={{
          background: solid ? 'rgba(243,247,249,.88)' : 'transparent',
          backdropFilter: solid ? 'blur(14px) saturate(1.1)' : 'none',
          WebkitBackdropFilter: solid ? 'blur(14px) saturate(1.1)' : 'none',
          borderBottom: solid ? '1px solid var(--hair)' : '1px solid transparent',
        }}
      >
        <div className="shell flex h-[76px] items-center justify-between gap-6">
          <a
            href="./index.html"
            className="flex shrink-0 items-center gap-3"
            aria-label={`${brand.legal} — home`}
          >
            <img
              src="./logo-lockup-midnight.png"
              alt={brand.legal}
              className="h-[38px] w-auto"
              width={120}
              height={38}
            />
          </a>

          <nav aria-label="Sections" className="hidden items-center gap-8 md:flex">
            {header.nav.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className="link-draw font-sub text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
              >
                <span className="mr-2 text-[9px] tracking-[0.1em] text-[var(--ink-faint)]">
                  0{i + 1}
                </span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href={header.cta.href} className="btn hidden md:inline-flex">
              {header.cta.label}
              <Arrow />
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Menu"
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--hair)] md:hidden"
            >
              <span className="relative block h-[9px] w-[18px]">
                <span className="absolute inset-x-0 top-0 h-px bg-[var(--ink)]" />
                <span className="absolute inset-x-0 bottom-0 h-px bg-[var(--ink)]" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* mobile sheet — Midnight, numbered, the pattern in the field */}
      <div
        className="fixed inset-0 z-[60] flex h-[100dvh] flex-col md:hidden"
        style={{
          background: 'var(--midnight)',
          pointerEvents: open ? 'auto' : 'none',
          opacity: open ? 1 : 0,
          transition: 'opacity .4s var(--ease)',
        }}
        aria-hidden={!open}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[.22]"
          style={{
            backgroundImage: "url('./pattern/wave-inlay.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />
        <div className="relative flex h-[76px] items-center justify-between px-5">
          <a href="./index.html" aria-label={`${brand.legal} — home`}>
            <img src="./logo-lockup-mist.png" alt={brand.legal} className="h-[38px] w-auto" />
          </a>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-[var(--mist-blue)]"
          >
            <span className="relative block h-4 w-4">
              <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav className="relative mt-6 flex flex-col px-5" aria-label="Mobile">
          {header.nav.concat([{ label: 'Book a visit', href: '#book' }]).map((item, i) => (
            <a
              key={`${item.href}-${i}`}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b border-white/12 py-5 text-[var(--mist-blue)]"
            >
              <span className="font-sub text-[10px] font-extrabold tracking-[0.18em] opacity-50">
                0{i + 1}
              </span>
              <span className="display text-[34px] leading-none">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="relative mt-auto flex flex-col gap-1.5 border-t border-white/12 px-6 pb-12 pt-6 font-sub text-[11px] uppercase tracking-[0.16em] text-[rgba(189,216,233,.78)]">
          <span>+1 416 000 0000</span>
          <span>care@ethioh.ca</span>
          <span>Toronto</span>
        </div>
      </div>
    </>
  )
}

function Arrow() {
  return (
    <svg className="arr" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 8h11M9 3l5 5-5 5" />
    </svg>
  )
}
