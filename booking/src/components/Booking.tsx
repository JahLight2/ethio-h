import { Calendar } from './Calendar'
import { SummaryPanel } from './SummaryPanel'

/** Calendar on the left, details on the right. Nothing between them. */
export function BookingSection() {
  return (
    <section id="book" className="scroll-mt-24 py-[clamp(28px,4vw,48px)]">
      <div className="shell grid items-stretch gap-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <div className="panel p-[clamp(20px,2.6vw,32px)]">
            <Calendar />
          </div>
        </div>
        <div className="flex min-w-0 lg:col-span-6 lg:col-start-7">
          <SummaryPanel />
        </div>
      </div>
    </section>
  )
}
