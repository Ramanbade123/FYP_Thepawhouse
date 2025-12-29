import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import AboutUsPage from './pages/AboutUsPage'
import CareGuide from './pages/CareGuide'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ Navbar always visible */}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/care-guide" element={<CareGuide />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  )
}

export default App
