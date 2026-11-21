import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { checklist } from '../content'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

export function Checklist() {
  return (
    <section id="checklist" className="scroll-mt-24 bg-white py-[clamp(64px,8vw,112px)]">
      <div className="shell grid gap-x-6 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>{checklist.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.07}>
            <h2 className="display h2 mt-6 text-[var(--ink)]">{checklist.h2}</h2>
          </Reveal>

          <ul className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {checklist.items.map((item, i) => (
              <Line key={item} index={i} text={item} />
            ))}
          </ul>
        </div>

        <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9">
          <figure>
            <img
              src={checklist.image.src}
              alt={checklist.image.alt}
              width={1120}
              height={840}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-[20px] object-cover sm:aspect-[4/3] lg:aspect-[4/5]"
              style={{ objectPosition: checklist.image.position }}
            />
            <figcaption className="caption mt-3">{checklist.caption}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

function Line({ index, text }: { index: number; text: string }) {
  const ref = useRef<HTMLLIElement>(null)
  const reduced = useReducedMotion()
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reduced) {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [reduced])

  return (
    <li ref={ref} className="flex gap-3 border-b border-[var(--hair)] pb-4">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-[7px] shrink-0">
        <path
          d="M2.8 8.6 6.1 11.9 13.2 4.4"
          stroke="var(--good)"
          strokeWidth="1.75"
          strokeLinecap="round"
          style={{
            strokeDasharray: 24,
            strokeDashoffset: seen ? 0 : 24,
            transition: `stroke-dashoffset .5s cubic-bezier(.22,1,.36,1) ${0.06 + index * 0.04}s`,
          }}
        />
      </svg>
      <span className="font-sub text-[13px] leading-[1.6] text-[var(--ink-soft)]">{text}</span>
    </li>
  )
}
