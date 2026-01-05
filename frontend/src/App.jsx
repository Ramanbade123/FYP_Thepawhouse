import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages
import Landing from './pages/Landing'
import AboutUsPage from './pages/AboutUsPage'
import CareGuide from './pages/CareGuide'
import Contact from './pages/Contact'
import AdoptionProcess from './pages/AdoptionProcess'
import RehomingProcess from './pages/RehomingProcess'
import AdoptionFAQS from './pages/AdoptionFAQS'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Auth
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Dashboard from './components/Auth/Dashboard'
import PrivateRoute from './components/Auth/PrivateRoute'

function App() {
  return (
    <Router>

      {/* Auth routes (NO Navbar/Footer) */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<WithNavbar />} />
      </Routes>

    </Router>
  )
}

// Layout with Navbar + Footer
function WithNavbar() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/care-guide" element={<CareGuide />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/adoption-process" element={<AdoptionProcess />} />
        <Route path="/rehoming-process" element={<RehomingProcess />} />
        <Route path="/adoption-faq" element={<AdoptionFAQS />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  )
}

export default App
