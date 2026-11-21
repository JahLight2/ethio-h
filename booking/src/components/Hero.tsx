import { motion, useReducedMotion } from 'motion/react'
import { hero, trust } from '../content'
import { Sparkle } from './Sparkle'

export function Hero() {
  const reduced = useReducedMotion()

  const line = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.08 + i * 0.09 },
        }

  return (
    <section className="relative pt-[76px]">
      <div className="shell grid items-end gap-x-6 gap-y-12 pb-[clamp(48px,6vw,88px)] pt-[clamp(40px,6vw,96px)] lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div {...line(0)}>
            <p className="eyebrow">{hero.eyebrow}</p>
          </motion.div>

          <h1 className="mt-7">
            <motion.span {...line(1)} className="display h1 block text-[var(--ink)]">
              {hero.h1[0]}
            </motion.span>
            <motion.span {...line(2)} className="display h1 mt-2 block ink-type">
              {hero.h1[1]}
            </motion.span>
          </h1>

          <motion.p {...line(3)} className="lead mt-8">
            {hero.lede}
          </motion.p>

          <motion.div {...line(4)} className="mt-9 flex flex-wrap items-center gap-3">
            <a href={hero.primary.href} className="btn">
              {hero.primary.label}
              <Arrow />
            </a>
            <a href={hero.secondary.href} className="btn btn--ghost">
              {hero.secondary.label}
            </a>
          </motion.div>

          <motion.ul {...line(5)} className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {trust.map((t) => (
              <li
                key={t}
                className="flex items-center gap-2.5 font-sub text-[11.5px] font-bold uppercase tracking-[0.12em] text-[var(--ink-soft)]"
              >
                <Check />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div {...line(3)} className="relative lg:col-span-5">
          <figure className="relative overflow-hidden rounded-[20px]">
            <img
              src={hero.image.src}
              alt={hero.image.alt}
              width={1280}
              height={960}
              loading="eager"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
              style={{ objectPosition: hero.image.position }}
            />
          </figure>

          {/* the sparkle badge, pinned to the corner */}
          <div className="absolute -bottom-4 -left-3 flex items-center gap-2.5 rounded-full bg-[var(--midnight)] py-3 pl-3 pr-5 text-[var(--mist-blue)] sm:-left-5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
              <Sparkle size={14} />
            </span>
            <span className="font-sub text-[10.5px] font-extrabold uppercase tracking-[0.18em]">
              {hero.badge}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="8" cy="8" r="7.2" stroke="var(--good)" strokeWidth="1.1" opacity=".35" />
      <path d="M4.6 8.3 6.9 10.6 11.5 5.6" stroke="var(--good)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg className="arr" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 8h11M9 3l5 5-5 5" />
    </svg>
  )
}
