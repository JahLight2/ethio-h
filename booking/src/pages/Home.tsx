import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Calculator } from '../components/Calculator'
import { BookingSection } from '../components/Booking'
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
        <BookingSection />
      </main>
      <Footer />
    </>
  )
}
