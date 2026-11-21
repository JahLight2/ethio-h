import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'

/** A hairline that fills as the page is read. */
export function ScrollProgress() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const width = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.3 })

  if (reduced) return null

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-[var(--estate)]"
      style={{ scaleX: width }}
      aria-hidden="true"
    />
  )
}
