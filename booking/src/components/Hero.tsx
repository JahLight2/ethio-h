import { motion, useReducedMotion } from 'motion/react'
import { hero, rates } from '../content'

/** A title, two lines, and the one number that matters. Nothing else. */
export function Hero() {
  const reduced = useReducedMotion()
  const rise = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.08 },
        }

  return (
    <section className="pt-[72px]">
      <div className="shell pb-[clamp(28px,4vw,44px)] pt-[clamp(40px,5vw,72px)]">
        <h1>
          <motion.span {...rise(0)} className="display h1 block text-[var(--ink)]">
            {hero.h1[0]}
          </motion.span>
          <motion.span {...rise(1)} className="display h1 mt-1 block ink-type">
            {hero.h1[1]}
          </motion.span>
        </h1>
        <motion.p {...rise(2)} className="mt-6 font-sub text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
          Toronto · from ${rates.base}
        </motion.p>
      </div>
    </section>
  )
}
