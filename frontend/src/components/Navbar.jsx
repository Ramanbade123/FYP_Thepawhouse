import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom' // ADD useNavigate
import {
  PawPrint,
  Menu,
  X,
  ChevronDown,
  Search,
  Heart,
  Dog,
  HelpCircle,
  BookOpen,
  Home,
  Users,
  MessageCircle,
  User,
  LogIn,
  LogOut // ADD LogOut import
} from 'lucide-react'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAdoptDropdownOpen, setIsAdoptDropdownOpen] = useState(false)
  const [isRehomeDropdownOpen, setIsRehomeDropdownOpen] = useState(false)
  const [user, setUser] = useState(null) // ADD user state
  const navigate = useNavigate() // ADD navigate hook

  const adoptRef = useRef(null)
  const rehomeRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check for user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (adoptRef.current && !adoptRef.current.contains(e.target)) {
        setIsAdoptDropdownOpen(false)
      }
      if (rehomeRef.current && !rehomeRef.current.contains(e.target)) {
        setIsRehomeDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Dog Adoption Items
  const adoptItems = [
    {
      icon: Dog,
      label: 'Browse Dogs',
      description: 'Find your perfect canine companion',
      count: '50+ available',
      path: '/adopt'
    },
    {
      icon: Heart,
      label: 'How Adoption Works',
      description: 'Step-by-step guide to adoption',
      path: '/adoption-process'
    },
    {
      icon: HelpCircle,
      label: 'Adopt FAQ\'s',
      description: 'Common questions answered',
      path: '/adoption-faq'
    }
  ]

  // Dog Rehoming Items
  const rehomeItems = [
    {
      icon: Home,
      label: 'Rehome a Dog',
      description: 'Find a loving home for your dog',
      path: '/rehome'
    },
    {
      icon: BookOpen,
      label: 'Rehoming Process',
      description: 'Step-by-step rehoming guide',
      path: '/rehoming-process'
    },
    {
      icon: HelpCircle,
      label: 'Rehome FAQ\'s',
      description: 'Common rehoming questions',
      path: '/rehoming-faq'
    }
  ]

  // Regular navigation items (non-dropdown) - Updated with paths
  const navItems = [
    { name: 'Care Guide', icon: BookOpen, path: '/care-guide' },
    { name: 'About Us', icon: Users, path: '/about' },
    { name: 'Contact', icon: MessageCircle, path: '/contact' }
  ]

  // Handler for closing other dropdown when one opens
  const handleAdoptHover = (isHovering) => {
    setIsAdoptDropdownOpen(isHovering)
    if (isHovering) {
      setIsRehomeDropdownOpen(false)
    }
  }

  const handleRehomeHover = (isHovering) => {
    setIsRehomeDropdownOpen(isHovering)
    if (isHovering) {
      setIsAdoptDropdownOpen(false)
    }
  }

  // Mobile click handlers
  const handleMobileAdoptClick = () => {
    setIsAdoptDropdownOpen(!isAdoptDropdownOpen)
    setIsRehomeDropdownOpen(false)
  }

  const handleMobileRehomeClick = () => {
    setIsRehomeDropdownOpen(!isRehomeDropdownOpen)
    setIsAdoptDropdownOpen(false)
  }

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsMobileMenuOpen(false)
    navigate('/')
  }

  return (
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

          {/* Logo - Links to home page */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3"
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
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">

            {/* Adopt Dropdown (Dogs Only) */}
            <div 
              ref={adoptRef} 
              className="relative"
              onMouseEnter={() => handleAdoptHover(true)}
              onMouseLeave={() => handleAdoptHover(false)}
            >
              <button
                className="flex items-center gap-1 font-medium text-[#063630] hover:text-[#008737] transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-50 group"
              >
                Adopt a Dog
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isAdoptDropdownOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-[#008737] to-[#085558] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </button>

              <AnimatePresence>
                {isAdoptDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-1">
                      <div className="p-3 bg-gradient-to-r from-[#008737]/5 to-[#085558]/5 rounded-lg mb-2">
                        <h3 className="font-bold text-[#063630] text-lg">Dog Adoption</h3>
                        <p className="text-sm text-gray-600">Find your new best friend</p>
                      </div>
                      
                      {adoptItems.map((item, i) => (
                        <Link
                          key={i}
                          to={item.path}
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                          onClick={() => setIsAdoptDropdownOpen(false)}
                        >
                          <div className="p-2 bg-gradient-to-r from-[#008737]/10 to-[#085558]/10 rounded-lg">
                            <item.icon className="h-5 w-5 text-[#008737]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-[#063630] group-hover:text-[#008737]">
                                {item.label}
                              </h4>
                              {item.count && (
                                <span className="text-xs font-medium bg-[#008737]/10 text-[#008737] px-2 py-1 rounded-full">
                                  {item.count}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rehome Dropdown (Dogs Only) */}
            <div 
              ref={rehomeRef} 
              className="relative"
              onMouseEnter={() => handleRehomeHover(true)}
              onMouseLeave={() => handleRehomeHover(false)}
            >
              <button
                className="flex items-center gap-1 font-medium text-[#063630] hover:text-[#085558] transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-50 group"
              >
                Rehome a Dog
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isRehomeDropdownOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-[#085558] to-[#008737] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </button>

              <AnimatePresence>
                {isRehomeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-1">
                      <div className="p-3 bg-gradient-to-r from-[#085558]/5 to-[#008737]/5 rounded-lg mb-2">
                        <h3 className="font-bold text-[#063630] text-lg">Dog Rehoming</h3>
                        <p className="text-sm text-gray-600">Find a loving home for your dog</p>
                      </div>
                      
                      {rehomeItems.map((item, i) => (
                        <Link
                          key={i}
                          to={item.path}
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                          onClick={() => setIsRehomeDropdownOpen(false)}
                        >
                          <div className="p-2 bg-gradient-to-r from-[#085558]/10 to-[#008737]/10 rounded-lg">
                            <item.icon className="h-5 w-5 text-[#085558]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#063630] group-hover:text-[#085558]">
                              {item.label}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Regular Navigation Items */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="font-medium text-[#063630] hover:text-[#008737] transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-50 group relative"
              >
                {item.name}
                <span className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-[#008737] to-[#085558] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            ))}

            {/* Login/Register Buttons or User Profile */}
            {user ? (
              <div className="flex items-center gap-3 ml-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-[#008737] hover:text-[#085558] font-semibold"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#008737] to-[#085558] rounded-full flex items-center justify-center text-white text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline">{user.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[#085558] hover:text-[#008737] font-semibold text-sm flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-[#008737] hover:text-[#085558] font-semibold border border-[#008737] hover:border-[#085558] px-4 py-2 rounded-full transition-all duration-300 hover:shadow-md text-sm whitespace-nowrap"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-[#008737] to-[#085558] text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  <LogIn className="h-4 w-4 text-white" />
                  <span className="text-white">Register</span>
                </Link>
              </div>
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
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 pb-4 border-t border-gray-100"
            >
              <div className="flex flex-col gap-1 pt-4">
                
                {/* Adopt Mobile Dropdown */}
                <div className="mb-2">
                  <button
                    onClick={handleMobileAdoptClick}
                    className="w-full flex items-center justify-between text-left font-medium text-[#063630] hover:text-[#008737] py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Dog className="h-5 w-5" />
                      <span>Adopt a Dog</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isAdoptDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isAdoptDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-10 pr-4"
                      >
                        <div className="space-y-2 py-2">
                          {adoptItems.map((item, i) => (
                            <Link
                              key={i}
                              to={item.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <item.icon className="h-4 w-4 text-[#008737]" />
                              <div className="flex-1">
                                <p className="font-medium text-[#063630]">{item.label}</p>
                                <p className="text-xs text-gray-600">{item.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Rehome Mobile Dropdown */}
                <div className="mb-2">
                  <button
                    onClick={handleMobileRehomeClick}
                    className="w-full flex items-center justify-between text-left font-medium text-[#063630] hover:text-[#085558] py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      <span>Rehome a Dog</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isRehomeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isRehomeDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-10 pr-4"
                      >
                        <div className="space-y-2 py-2">
                          {rehomeItems.map((item, i) => (
                            <Link
                              key={i}
                              to={item.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <item.icon className="h-4 w-4 text-[#085558]" />
                              <div className="flex-1">
                                <p className="font-medium text-[#063630]">{item.label}</p>
                                <p className="text-xs text-gray-600">{item.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Regular Mobile Items */}
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center gap-2 font-medium text-[#063630] hover:text-[#008737] py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Login/Register Buttons or User Profile */}
                {user ? (
                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 mt-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center gap-2 font-medium text-[#063630] hover:text-[#008737] py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 text-[#085558] font-semibold border border-[#085558] py-3 rounded-lg hover:bg-[#085558]/5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 mt-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center gap-2 text-[#008737] font-semibold border border-[#008737] py-3 rounded-lg hover:bg-[#008737]/5 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full bg-gradient-to-r from-[#008737] to-[#085558] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <LogIn className="h-4 w-4 text-white" />
                      <span className="text-white">Register</span>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar