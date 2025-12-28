// Updated Navbar.jsx with modal
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PawPrint, User, LogIn, Menu, X, LogOut, Heart, Home } from 'lucide-react'
import LoginModal from './LoginModal'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = ['Adopt', 'Rehome', 'Care Guide', 'Why Adopt', 'About Us']

  const handleLoginClick = () => {
    setIsLoginModalOpen(true)
    setIsMobileMenuOpen(false)
  }

  const handleRegisterClick = () => {
    setIsLoginModalOpen(true)
    setIsMobileMenuOpen(false)
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    // Save to localStorage for persistence
    localStorage.setItem('pawhouse_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('pawhouse_user')
    setIsMobileMenuOpen(false)
  }

  const handleProfile = () => {
    setIsMobileMenuOpen(false)
    alert(`This would navigate to ${user?.role} profile page`)
  }

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('pawhouse_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg py-3' 
            : 'bg-white/95 backdrop-blur-sm py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <PawPrint className="h-10 w-10 text-[#008737]" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#008737] to-[#085558] rounded-full opacity-10 blur-sm"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-[#063630] tracking-tight">The Paw</h1>
                <p className="text-xs font-semibold text-[#008737] tracking-wider">HOUSE</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-[#063630] hover:text-[#008737] font-medium transition-colors duration-300 relative group text-base"
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#008737] to-[#085558] transition-all duration-300 group-hover:w-full rounded-full"></span>
                </motion.a>
              ))}
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <>
                  {/* User Profile Dropdown */}
                  <div className="relative group">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#008737]/10 to-[#085558]/10 border border-[#008737]/20"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#008737] to-[#085558] flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#063630]">{user.name}</p>
                        <p className="text-xs text-[#008737] capitalize">
                          {user.role === 'adopter' ? 'Pet Adopter' : 'Pet Rehomer'}
                        </p>
                      </div>
                    </motion.button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <button
                        onClick={handleProfile}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-[#063630] flex items-center gap-2 rounded-t-xl"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </button>
                      {user.role === 'rehomer' && (
                        <button
                          onClick={() => alert('Navigating to My Pets page...')}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 text-[#063630] flex items-center gap-2"
                        >
                          <PawPrint className="h-4 w-4" />
                          My Pets
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600 flex items-center gap-2 border-t border-gray-100 rounded-b-xl"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLoginClick}
                    className="flex items-center gap-2 text-[#008737] hover:text-[#085558] font-semibold border border-[#008737] hover:border-[#085558] px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-md"
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRegisterClick}
                    className="bg-gradient-to-r from-[#008737] to-[#085558] text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4 text-white" />
                    <span className="text-white">Register</span>
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-[#063630]" />
              ) : (
                <Menu className="h-6 w-6 text-[#063630]" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 pb-4 border-t border-gray-100"
            >
              <div className="flex flex-col gap-4 pt-4">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-[#063630] hover:text-[#008737] font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#008737] to-[#085558] flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#063630]">{user.name}</p>
                          <p className="text-sm text-[#008737] capitalize">
                            {user.role === 'adopter' ? 'Pet Adopter' : 'Pet Rehomer'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleProfile}
                        className="text-left px-4 py-3 hover:bg-gray-50 text-[#063630] rounded-lg"
                      >
                        My Profile
                      </button>
                      {user.role === 'rehomer' && (
                        <button
                          onClick={() => {
                            alert('Navigating to My Pets page...')
                            setIsMobileMenuOpen(false)
                          }}
                          className="text-left px-4 py-3 hover:bg-gray-50 text-[#063630] rounded-lg"
                        >
                          My Pets
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="text-left px-4 py-3 hover:bg-gray-50 text-red-600 rounded-lg border-t border-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLoginClick}
                        className="w-full flex items-center justify-center gap-2 text-[#008737] font-semibold border border-[#008737] py-3 rounded-lg hover:bg-[#008737]/5 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Login</span>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRegisterClick}
                        className="w-full bg-gradient-to-r from-[#008737] to-[#085558] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <LogIn className="h-4 w-4 text-white" />
                        <span className="text-white">Register</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Login/Register Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}

export default Navbar