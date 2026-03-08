import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, PawPrint, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Contains number', pass: /\d/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['bg-red-400', 'bg-yellow-400', 'bg-[#008737]'];
  const labels = ['Weak', 'Fair', 'Strong'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${score === 3 ? 'text-[#008737]' : score === 2 ? 'text-yellow-600' : 'text-red-500'}`}>
        {labels[score - 1] || 'Too weak'}
      </p>
      <div className="space-y-1">
        {checks.map((c, i) => (
          <p key={i} className={`text-xs flex items-center gap-1.5 ${c.pass ? 'text-[#008737]' : 'text-gray-400'}`}>
            <span>{c.pass ? '✓' : '○'}</span> {c.label}
          </p>
        ))}
      </div>
    </div>
  );
};

const ResetPassword = () => {
  const { resettoken }            = useParams();
  const navigate                  = useNavigate();
  const [form, setForm]           = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPw] = useState(false);
  const [showConfirm, setShowCf]  = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.password || !form.confirmPassword) { setError('Please fill in all fields'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true);
    try {
      await axios.put(`${API}/auth/resetpassword/${resettoken}`, {
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset link is invalid or has expired. Please request a new one.');
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
            <p className="text-[#085558] text-sm mt-1">Set a new password</p>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {!success ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#008737]/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-[#008737]" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#063630] mb-2 text-center">Reset Password</h2>
              <p className="text-[#063630]/60 text-sm text-center mb-8">
                Choose a strong new password for your account.
              </p>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-[#063630] mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#085558]" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(''); }}
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all duration-200 text-[#063630]"
                      required
                    />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {showPassword
                        ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      }
                    </button>
                  </div>
                  <PasswordStrength password={form.password} />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-[#063630] mb-2">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#085558]" />
                    </div>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={e => { setForm(p => ({ ...p, confirmPassword: e.target.value })); setError(''); }}
                      placeholder="Confirm new password"
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-200 text-[#063630] focus:ring-2 focus:ring-[#008737]/20 focus:outline-none ${
                        form.confirmPassword && form.password !== form.confirmPassword
                          ? 'border-red-400 focus:border-red-400'
                          : form.confirmPassword && form.password === form.confirmPassword
                          ? 'border-[#008737] focus:border-[#008737]'
                          : 'border-gray-300 focus:border-[#008737]'
                      }`}
                      required
                    />
                    <button type="button" onClick={() => setShowCf(p => !p)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {showConfirm
                        ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      }
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1.5">Passwords do not match</p>
                  )}
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <p className="text-xs text-[#008737] mt-1.5 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Passwords match
                    </p>
                  )}
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
                      Resetting...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5" />
                      Reset Password
                    </>
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            /* Success */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-20 h-20 bg-[#008737]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-[#008737]" />
              </div>
              <h2 className="text-2xl font-bold text-[#063630] mb-3">Password Reset!</h2>
              <p className="text-[#063630]/60 text-sm mb-8">
                Your password has been successfully updated. You can now log in with your new password.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-[#008737] to-[#085558] text-white hover:shadow-lg transition-all duration-300"
              >
                Go to Login
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
