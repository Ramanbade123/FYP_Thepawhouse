import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Home, Eye, EyeOff, AlertCircle, CheckCircle, Heart, PawPrint } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'adopter',
    userType: 'individual',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1 = Role Selection, 2 = Personal Info, 3 = Password
  const navigate = useNavigate();

  const { name, email, phone, password, confirmPassword, role, address } = formData;

  const onChange = (e) => {
    if (e.target.name.startsWith('address.')) {
      const field = e.target.name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...address, [field]: e.target.value }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setError('');
  };

  const validateStep1 = () => {
    return true; // Role selection always valid
  };

  const validateStep2 = () => {
    if (!name || !email || !phone) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setError('');
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      setError('');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      nextStep();
      return;
    }

    if (step === 2) {
      nextStep();
      return;
    }

    if (!validateStep3()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Prepare data for API
      const userData = {
        name,
        email,
        phone,
        password,
        role,
        userType: formData.userType,
        address: {
          ...address,
          country: 'Nepal'
        }
      };

      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        userData,
        config
      );

      if (response.data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        
        // Store token if returned
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        err.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#063630] mb-4 text-center">
              Choose Your Role
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Select how you want to use The Paw House
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Adopter Card */}
              <button
                type="button"
                onClick={() => {
                  setFormData({...formData, role: 'adopter'});
                  nextStep();
                }}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                  role === 'adopter'
                    ? 'border-[#008737] bg-[#008737]/5 shadow-lg'
                    : 'border-gray-200 hover:border-[#008737]/50 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    role === 'adopter'
                      ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#063630]">Adopter</h4>
                    <p className="text-sm text-gray-600">I want to adopt a dog</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Browse available dogs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Submit adoption applications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Save favorite pets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Get adoption support</span>
                  </li>
                </ul>
              </button>

              {/* Rehomer Card */}
              <button
                type="button"
                onClick={() => {
                  setFormData({...formData, role: 'rehomer'});
                  nextStep();
                }}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                  role === 'rehomer'
                    ? 'border-[#085558] bg-[#085558]/5 shadow-lg'
                    : 'border-gray-200 hover:border-[#085558]/50 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    role === 'rehomer'
                      ? 'bg-gradient-to-r from-[#085558] to-[#008737] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Home className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#063630]">Rehomer</h4>
                    <p className="text-sm text-gray-600">I want to rehome a dog</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Find loving homes for dogs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Get rehoming guidance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Safe screening process</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>24/7 support</span>
                  </li>
                </ul>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#063630] mb-4 text-center">
              Personal Information
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {role === 'adopter' 
                ? 'Tell us about yourself as an adopter' 
                : 'Tell us about yourself as a rehomer'}
            </p>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-[#063630] mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#085558]" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all duration-200 text-[#063630]"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#063630] mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#085558]" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all duration-200 text-[#063630]"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-[#063630] mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-[#085558]" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all duration-200 text-[#063630]"
                  placeholder="9876543210"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">10-digit number without spaces or dashes</p>
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-[#063630] mb-2">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['individual', 'family', 'organization', 'shelter'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, userType: type})}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      formData.userType === type
                        ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Address Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#063630] flex items-center gap-2">
                <Home className="h-5 w-5 text-[#085558]" />
                Address (Optional)
              </h3>
              
              <input
                type="text"
                name="address.street"
                value={address.street}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all duration-200 text-[#063630]"
                placeholder="Street Address"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="address.city"
                  value={address.city}
                  onChange={onChange}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all duration-200 text-[#063630]"
                  placeholder="City"
                />
                <input
                  type="text"
                  name="address.state"
                  value={address.state}
                  onChange={onChange}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all duration-200 text-[#063630]"
                  placeholder="State"
                />
              </div>
              
              <input
                type="text"
                name="address.zipCode"
                value={address.zipCode}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all duration-200 text-[#063630]"
                placeholder="Zip Code"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#063630] mb-4 text-center">
              Account Security
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Create a secure password for your account
            </p>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#063630] mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#085558]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={onChange}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all duration-200 text-[#063630]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#063630] mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#085558]" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all duration-200 text-[#063630]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="terms"
                className="mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-[#008737] hover:underline font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[#008737] hover:underline font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDEDED] to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#008737] to-[#085558] rounded-full flex items-center justify-center">
                <PawPrint className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#063630]">The Paw House</h1>
            <p className="text-[#085558] text-sm mt-1">Create your {role} account</p>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNum 
                    ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step > stepNum ? <CheckCircle className="h-6 w-6" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`h-1 w-12 ${step > stepNum ? 'bg-gradient-to-r from-[#008737] to-[#085558]' : 'bg-gray-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <span className="text-sm font-medium text-[#063630]">
            Step {step} of 3
          </span>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-[#063630] mb-6 text-center">
            {step === 1 ? 'Choose Your Role' : 
             step === 2 ? 'Personal Information' : 
             'Account Security'}
          </h2>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
            >
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-green-700 text-sm">{success}</p>
            </motion.div>
          )}

          <form onSubmit={onSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-3 px-4 border-2 border-[#085558] text-[#085558] rounded-xl font-semibold hover:bg-[#085558]/5 transition-all duration-300"
                >
                  Back
                </button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#008737] to-[#085558] hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>{step === 3 ? 'Create Account' : 'Continue'}</span>
                )}
              </motion.button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-[#008737] hover:text-[#085558] font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            By creating an account, you confirm that all information provided is accurate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;