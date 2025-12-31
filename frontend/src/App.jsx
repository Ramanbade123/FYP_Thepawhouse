import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import AboutUsPage from './pages/AboutUsPage'
import CareGuide from './pages/CareGuide'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'
import AdoptionProcess from './pages/AdoptionProcess'
import RehomingProcess from './pages/RehomingProcess'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ Navbar always visible */}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/care-guide" element={<CareGuide />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/adoption-process" element={<AdoptionProcess />} />
        <Route path="/rehoming-process" element={<RehomingProcess />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
