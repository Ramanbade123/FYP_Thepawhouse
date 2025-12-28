import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Mail, Lock, User, PawPrint, Heart, Home, Eye, EyeOff } from 'lucide-react'

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [userType, setUserType] = useState('adopter')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  })

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isLoginMode) {
      // Mock login
      const mockUser = {
        name: "Demo User",
        email: formData.email,
        role: userType,
        phone: "+977 9876543210",
        address: "Kathmandu, Nepal"
      }
      onLoginSuccess(mockUser)
      onClose()
      alert(`Welcome back! Logged in as ${userType === 'adopter' ? 'Pet Adopter' : 'Pet Rehomer'}`)
    } else {
      // Mock registration
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!')
        return
      }
      
      const newUser = {
        name: formData.name,
        email: formData.email,
        role: userType,
        phone: formData.phone,
        address: formData.address
      }
      onLoginSuccess(newUser)
      onClose()
      alert(`Account created successfully! Welcome as ${userType === 'adopter' ? 'Pet Adopter' : 'Pet Rehomer'}`)
    }
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: ''
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white rounded-t-2xl p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <PawPrint className="h-8 w-8 text-[#008737]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#008737] to-[#085558] rounded-full opacity-10 blur-sm"></div>
            </div>
            <h2 className="text-2xl font-bold text-[#063630]">
              {isLoginMode ? 'Welcome Back' : 'Join The Paw House'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* User Type Selection - Only for Registration */}
          {!isLoginMode && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#063630] mb-4 text-center">
                Select Your Role
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('adopter')}
                  className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                    userType === 'adopter'
                      ? 'border-[#008737] bg-gradient-to-br from-[#008737]/5 to-[#085558]/5'
                      : 'border-gray-200 hover:border-[#008737]/30 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-full mb-3 transition-colors ${
                      userType === 'adopter'
                        ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Heart className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-[#063630] text-base">Adopt a Pet</span>
                    <span className="text-sm text-gray-600 mt-1 text-center">
                      Find your new furry friend
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType('rehomer')}
                  className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                    userType === 'rehomer'
                      ? 'border-[#008737] bg-gradient-to-br from-[#008737]/5 to-[#085558]/5'
                      : 'border-gray-200 hover:border-[#008737]/30 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-full mb-3 transition-colors ${
                      userType === 'rehomer'
                        ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Home className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-[#063630] text-base">Rehome a Pet</span>
                    <span className="text-sm text-gray-600 mt-1 text-center">
                      Find a loving home for your pet
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field - Only for Registration */}
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-[#063630] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required={!isLoginMode}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#008737] focus:border-transparent text-[#063630] placeholder-gray-400"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#063630] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#008737] focus:border-transparent text-[#063630] placeholder-gray-400"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#063630] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#008737] focus:border-transparent text-[#063630] placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#063630]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password - Only for Registration */}
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-[#063630] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required={!isLoginMode}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#008737] focus:border-transparent text-[#063630] placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Additional Fields for Registration */}
            {!isLoginMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#063630] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#008737] focus:border-transparent text-[#063630] placeholder-gray-400"
                    placeholder="+977 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#063630] mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#008737] focus:border-transparent text-[#063630] placeholder-gray-400"
                    placeholder="Kathmandu"
                  />
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password - Only for Login */}
            {isLoginMode && (
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 text-[#008737] focus:ring-[#008737]" 
                  />
                  <span className="ml-2.5 text-sm text-gray-600 select-none">Remember me</span>
                </label>
                <button 
                  type="button" 
                  className="text-sm font-medium text-[#008737] hover:text-[#085558] hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Terms Agreement - Only for Registration */}
            {!isLoginMode && (
              <div className="flex items-start pt-2">
                <input
                  type="checkbox"
                  required
                  className="h-4 w-4 mt-1 rounded border-gray-300 text-[#008737] focus:ring-[#008737]"
                  id="terms"
                />
                <label htmlFor="terms" className="ml-2.5 text-sm text-gray-600 leading-tight">
                  I agree to the{' '}
                  <button type="button" className="text-[#008737] font-medium hover:underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-[#008737] font-medium hover:underline">
                    Privacy Policy
                  </button>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#008737] to-[#085558] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 mt-6"
            >
              {isLoginMode ? 'Sign In' : `Join as ${userType === 'adopter' ? 'Adopter' : 'Rehomer'}`}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Toggle between Login/Register */}
          <div className="text-center">
            <p className="text-gray-600">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode)
                  // Reset form when switching modes
                  if (isLoginMode) {
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                      phone: '',
                      address: ''
                    })
                  }
                }}
                className="text-[#008737] font-bold hover:underline transition-all duration-300"
              >
                {isLoginMode ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginModal