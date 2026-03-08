import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, PawPrint, CheckCircle, AlertCircle, Send } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ForgotPassword = () => {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address'); return; }

    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/auth/forgotpassword`, { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#EDEDED' }}>

      {/* Back Button */}
      <button onClick={() => navigate('/login')}
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 group">
        <ArrowLeft className="h-4 w-4 text-[#063630] group-hover:text-[#008737] transition-colors" />
        <span className="text-sm font-medium text-[#063630] group-hover:text-[#008737] transition-colors">Back to Login</span>
      </button>

      <div className="max-w-md w-full">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#008737] to-[#085558] rounded-full flex items-center justify-center">
                <PawPrint className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#063630]">The Paw House</h1>
            <p className="text-[#085558] text-sm mt-1">Password Recovery</p>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {!sent ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#008737]/10 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-[#008737]" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#063630] mb-2 text-center">Forgot Password?</h2>
              <p className="text-[#063630]/60 text-sm text-center mb-8">
                No worries! Enter your registered email and we'll send you a reset link.
              </p>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#063630] mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#085558]" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all duration-200 text-[#063630]"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-white ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#008737] to-[#085558] hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Reset Link
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Remember your password?{' '}
                  <Link to="/login" className="text-[#008737] hover:text-[#085558] font-semibold">Sign in</Link>
                </p>
              </div>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-20 h-20 bg-[#008737]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-[#008737]" />
              </div>
              <h2 className="text-2xl font-bold text-[#063630] mb-3">Check Your Email</h2>
              <p className="text-[#063630]/60 text-sm mb-2">
                We've sent a password reset link to:
              </p>
              <p className="font-semibold text-[#063630] mb-6">{email}</p>
              <div className="bg-[#008737]/5 border border-[#008737]/15 rounded-xl p-4 mb-6 text-left space-y-2">
                <p className="text-sm text-[#063630]/70 flex items-start gap-2">
                  <span className="text-[#008737] mt-0.5">•</span> Check your inbox and spam folder
                </p>
                <p className="text-sm text-[#063630]/70 flex items-start gap-2">
                  <span className="text-[#008737] mt-0.5">•</span> The link expires in <strong>10 minutes</strong>
                </p>
                <p className="text-sm text-[#063630]/70 flex items-start gap-2">
                  <span className="text-[#008737] mt-0.5">•</span> Don't share this link with anyone
                </p>
              </div>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="text-sm text-[#008737] hover:text-[#085558] font-medium transition-colors"
              >
                Didn't receive it? Send again
              </button>
              <div className="mt-4">
                <Link to="/login"
                  className="inline-flex items-center gap-2 text-sm text-[#063630]/60 hover:text-[#063630] transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
