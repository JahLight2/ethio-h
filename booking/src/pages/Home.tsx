import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Calculator } from '../components/Calculator'
import { Checklist } from '../components/Checklist'
import { TrustStrip } from '../components/TrustStrip'
import { BookingSection } from '../components/Booking'
import { Reviews } from '../components/Reviews'
import { Statement } from '../components/Statement'
import { Footer } from '../components/Footer'
import { ScrollProgress } from '../components/ScrollProgress'

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Calculator />
        <Checklist />
        <TrustStrip />
        <Statement />
        <BookingSection />
        <Reviews />
      </main>
      <Footer />
    </>
  )
}
