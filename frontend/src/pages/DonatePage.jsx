import { useState, useEffect } from 'react';
import { HandHeart, CheckCircle, AlertCircle, Heart, Utensils, Stethoscope, Home, Syringe, Shield } from 'lucide-react';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authHeaders = (extra = {}) => {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extra };
};
const apiFetch = async (method, url, body = null, isForm = false) => {
  const token = localStorage.getItem('token');
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  if (!isForm && body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${url}`, { method, headers, body: isForm ? body : (body ? JSON.stringify(body) : undefined) });
  const data = await res.json();
  if (!res.ok) throw { response: { data } };
  return { data };
};


const PURPOSES = [
  { value: 'general',     label: 'General Fund',     icon: Heart,       color: '#e85d04', desc: 'Support overall shelter operations' },
  { value: 'medical',     label: 'Medical Care',      icon: Stethoscope, color: '#d62828', desc: 'Fund surgeries & treatments' },
  { value: 'food',        label: 'Food & Nutrition',  icon: Utensils,    color: '#008737', desc: 'Feed dogs in shelters' },
  { value: 'shelter',     label: 'Shelter Building',  icon: Home,        color: '#085558', desc: 'Improve shelter facilities' },
  { value: 'vaccination', label: 'Vaccination',       icon: Syringe,     color: '#7209b7', desc: 'Vaccinate stray dogs' },
  { value: 'rescue',      label: 'Rescue Operations', icon: Shield,      color: '#0077b6', desc: 'Fund rescue missions' },
];

const AMOUNTS = [100, 250, 500, 1000, 2500, 5000];
const PAYMENT_METHODS = [
  { value: 'esewa',         label: 'eSewa'         },
  { value: 'khalti',        label: 'Khalti'        },
  { value: 'bank-transfer', label: 'Bank Transfer' },
  { value: 'cash',          label: 'Cash'          },
];

const DonatePage = () => {
  const [form, setForm] = useState({
    donorName: '', donorEmail: '', donorPhone: '',
    amount: 500, customAmount: '',
    purpose: 'general', paymentMethod: 'esewa',
    message: '', anonymous: false,
  });
  const [useCustom, setUseCustom]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [stats, setStats]           = useState({ totalRaised: 0, totalDonors: 0 });
  const [error, setError]           = useState('');

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    // Pre-fill if logged in
    if (user) setForm(p => ({ ...p, donorName: user.name || '', donorEmail: user.email || '', donorPhone: user.phone || '' }));
    // Fetch public stats
    apiFetch('GET', '/donations/stats').then(res => setStats(res.data.data)).catch(() => {});
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const finalAmount = useCustom ? Number(form.customAmount) : form.amount;

  const handleSubmit = async () => {
    if (!form.donorName || !finalAmount || finalAmount < 1) {
      setError('Please provide your name and a valid donation amount.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiFetch('POST', '/donations', {
        donorName:     form.anonymous ? 'Anonymous' : form.donorName,
        donorEmail:    form.donorEmail,
        donorPhone:    form.donorPhone,
        amount:        finalAmount,
        purpose:       form.purpose,
        paymentMethod: form.paymentMethod,
        message:       form.message,
        anonymous:     form.anonymous,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#063630] mb-2">Thank You! 🐾</h2>
        <p className="text-gray-500 mb-2">Your donation of <span className="font-bold text-[#063630]">NPR {finalAmount.toLocaleString()}</span> has been recorded.</p>
        <p className="text-gray-400 text-sm mb-8">Your generosity helps dogs in Nepal find safety, food, and love.</p>
        <button onClick={() => setSubmitted(false)}
          className="w-full py-3 bg-gradient-to-r from-[#e85d04] to-[#e07c3a] text-white font-bold rounded-xl">
          Donate Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#e85d04] to-[#c1440e] text-white py-10 px-4 mb-10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <HandHeart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Support The Paw House</h1>
          <p className="text-orange-100 text-lg mb-6">Every rupee helps a dog in Nepal find safety and love</p>
          <div className="flex items-center justify-center gap-8">
            <div><p className="text-3xl font-bold">NPR {stats.totalRaised.toLocaleString()}</p><p className="text-orange-200 text-sm">Total Raised</p></div>
            <div className="w-px h-10 bg-white/20" />
            <div><p className="text-3xl font-bold">{stats.totalDonors}</p><p className="text-orange-200 text-sm">Generous Donors</p></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 space-y-6">

            {/* Purpose */}
            <div>
              <label className="block text-sm font-bold text-[#063630] mb-3">What would you like to support?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PURPOSES.map(p => {
                  const Icon = p.icon;
                  return (
                    <button key={p.value} onClick={() => set('purpose', p.value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        form.purpose === p.value ? 'border-transparent' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={form.purpose === p.value ? { borderColor: p.color, backgroundColor: p.color + '10' } : {}}>
                      <Icon className="h-5 w-5 mb-1.5" style={{ color: p.color }} />
                      <p className="text-xs font-bold text-[#063630]">{p.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-bold text-[#063630] mb-3">Donation Amount (NPR)</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {AMOUNTS.map(a => (
                  <button key={a} onClick={() => { set('amount', a); setUseCustom(false); }}
                    className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      !useCustom && form.amount === a
                        ? 'bg-[#e85d04] text-white border-transparent'
                        : 'border-gray-200 text-gray-700 hover:border-orange-300'
                    }`}>
                    NPR {a.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number" min="1"
                  placeholder="Enter custom amount"
                  value={form.customAmount}
                  onChange={e => { set('customAmount', e.target.value); setUseCustom(true); }}
                  onFocus={() => setUseCustom(true)}
                  className={`flex-1 border-2 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all ${
                    useCustom ? 'border-[#e85d04]' : 'border-gray-200'
                  }`}
                />
                {useCustom && <span className="text-sm text-gray-500 font-medium">NPR</span>}
              </div>
            </div>

            {/* Payment method */}
            <div>
              <label className="block text-sm font-bold text-[#063630] mb-3">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map(m => (
                  <button key={m.value} onClick={() => set('paymentMethod', m.value)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      form.paymentMethod === m.value
                        ? 'bg-[#e85d04]/10 border-[#e85d04] text-[#e85d04]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Donor details */}
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-[#063630]">Your Details</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.anonymous} onChange={e => set('anonymous', e.target.checked)} className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm text-gray-600">Donate anonymously</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Full Name *</label>
                  <input value={form.donorName} onChange={e => set('donorName', e.target.value)}
                    placeholder="Your name" disabled={form.anonymous}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 disabled:bg-gray-50 disabled:text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone</label>
                  <input value={form.donorPhone} onChange={e => set('donorPhone', e.target.value)}
                    placeholder="98XXXXXXXX" disabled={form.anonymous}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 disabled:bg-gray-50 disabled:text-gray-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Email</label>
                  <input value={form.donorEmail} onChange={e => set('donorEmail', e.target.value)}
                    placeholder="your@email.com" disabled={form.anonymous}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 disabled:bg-gray-50 disabled:text-gray-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Message (optional)</label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)}
                    rows={2} placeholder="Leave a message of support..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
              </div>
            )}

            {/* Summary */}
            <div className="bg-orange-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Donating to <span className="font-semibold text-[#063630]">{PURPOSES.find(p => p.value === form.purpose)?.label}</span></p>
                <p className="text-xs text-gray-400 mt-0.5">via {PAYMENT_METHODS.find(m => m.value === form.paymentMethod)?.label}</p>
              </div>
              <p className="text-2xl font-bold text-[#e85d04]">NPR {(finalAmount || 0).toLocaleString()}</p>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#e85d04] to-[#c1440e] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 text-base flex items-center justify-center gap-2">
              <HandHeart className="h-5 w-5" />
              {loading ? 'Processing...' : `Donate NPR ${(finalAmount || 0).toLocaleString()}`}
            </button>

            <p className="text-center text-xs text-gray-400">🔒 Your donation is secure. All funds go directly to dog welfare in Nepal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;