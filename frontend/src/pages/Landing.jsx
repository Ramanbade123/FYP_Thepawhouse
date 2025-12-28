import Navbar from '../../../../coding/frontend/src/components/Navbar'
import Hero from '../../../../coding/frontend/src/components/Hero'
import Process from '../../../../coding/frontend/src/components/Process'
import Pets from '../../../../coding/frontend/src/components/Pets'
import Testimonials from '../../../../coding/frontend/src/components/Testimonials'
import FAQ from '../../../../coding/frontend/src/components/FAQ'
import Footer from '../../../../coding/frontend/src/components/Footer'

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <Process />
      <Pets />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  )
}

export default Landing