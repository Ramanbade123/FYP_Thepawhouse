import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import AboutUsPage from './pages/AboutUsPage'
import CareGuide from './pages/CareGuide'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'
import AdoptionProcess from './pages/AdoptionProcess'
import RehomingProcess from './pages/RehomingProcess'
import AdoptionFAQS from './pages/AdoptionFAQS'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <Navbar /> 

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/care-guide" element={<CareGuide />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/adoption-process" element={<AdoptionProcess />} />
        <Route path="/rehoming-process" element={<RehomingProcess />} />
        <Route path="/adoption-faq" element={<AdoptionFAQS />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
