// src/pages/Landing.jsx
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Process from '../components/Process'
import Pets from '../components/Pets'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

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