// src/pages/AboutUsPage.jsx
import Navbar from '../components/Navbar'
import AboutUs from '../components/AboutUs' // This is the AboutUs component we created
import Footer from '../components/Footer'

const AboutUsPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AboutUs />
      <Footer />
    </div>
  )
}

export default AboutUsPage