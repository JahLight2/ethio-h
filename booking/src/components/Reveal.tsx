import { motion, useReducedMotion } from 'motion/react'

type Props = {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'section'
}

/** Blocks settle from 12px below each time a fifth of them is in view. */
export function Reveal({ children, delay = 0, y = 16, className, as = 'div' }: Props) {
  const reduced = useReducedMotion()
  const M = motion[as]
  return (
    <M
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </M>
  )
}
