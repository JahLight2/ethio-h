import { booking } from '../content'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'
import { DatePicker } from './DatePicker'
import { SummaryPanel } from './SummaryPanel'

export function BookingSection() {
  return (
    <section id="book" className="band-edge scroll-mt-24 bg-[var(--paper)] py-[clamp(64px,8vw,112px)]">
      <div className="shell">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>{booking.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.07}>
              <h2 className="display h2 mt-6 text-[var(--ink)]">{booking.h2}</h2>
            </Reveal>
          </div>
          <Reveal delay={0.14} className="lg:col-span-4 lg:col-start-9">
            <figure>
              <img
                src={booking.side.src}
                alt={booking.side.alt}
                width={1120}
                height={840}
                loading="lazy"
                className="aspect-[16/10] w-full rounded-[20px] object-cover"
                style={{ objectPosition: booking.side.position }}
              />
              <figcaption className="caption mt-3">{booking.side.caption}</figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="mt-[clamp(36px,4vw,56px)] grid gap-6 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-7">
            <div className="panel overflow-hidden p-[clamp(18px,2.6vw,32px)]">
              <DatePicker />
            </div>
          </Reveal>
          <div className="min-w-0 lg:col-span-4 lg:col-start-9">
            <SummaryPanel />
          </div>
        </div>
      </div>
    </section>
  )
}
