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
      if (form.paymentMethod === 'khalti') {
        const res = await apiFetch('POST', '/donations/khalti/initiate', {
          donorName:     form.anonymous ? 'Anonymous' : form.donorName,
          donorEmail:    form.donorEmail,
          donorPhone:    form.donorPhone,
          amount:        finalAmount,
          purpose:       form.purpose,
          message:       form.message,
          anonymous:     form.anonymous,
        });
        if (res.data.success && res.data.payment_url) {
          window.location.href = res.data.payment_url;
          return;
        }
      }

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
    <div className="min-h-screen pt-24 flex items-center justify-center px-4" style={{ backgroundColor: '#EDEDED' }}>
      <div className="bg-white rounded-2xl shadow-sm border border-[#008737]/10 p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(0,135,55,0.1)' }}>
          <CheckCircle className="h-10 w-10 text-[#008737]" />
        </div>
        <h2 className="text-2xl font-bold text-[#063630] mb-2">Thank You! 🐾</h2>
        <p className="text-[#063630]/60 mb-2">Your donation of <span className="font-bold text-[#063630]">NPR {finalAmount.toLocaleString()}</span> has been recorded.</p>
        <p className="text-[#063630]/40 text-sm mb-8">Your generosity helps dogs in Nepal find safety, food, and love.</p>
        <button onClick={() => setSubmitted(false)}
          className="w-full py-3 bg-gradient-to-r from-[#008737] to-[#085558] text-white font-bold rounded-xl hover:shadow-lg transition-all">
          Donate Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#EDEDED]">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#063630] to-[#085558] text-white py-14 px-4 mb-10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#008737]/30 text-green-200 px-4 py-2 rounded-full mb-5 text-sm font-semibold">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            Make a Difference — Nepal
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <HandHeart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Support The Paw House</h1>
          <p className="text-base text-green-200 mb-8 text-longform mx-auto">Every rupee helps a dog in Nepal find safety and love</p>
          <div className="flex items-center justify-center gap-8">
            <div><p className="text-4xl font-bold" style={{ color: '#ffffff' }}>NPR {stats.totalRaised.toLocaleString()}</p><p className="text-green-200 text-sm mt-1">Total Raised</p></div>
            <div className="w-px h-12 bg-white/20" />
            <div><p className="text-4xl font-bold" style={{ color: '#ffffff' }}>{stats.totalDonors}</p><p className="text-green-200 text-sm mt-1">Generous Donors</p></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#008737]/10 overflow-hidden">
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
                        form.purpose === p.value ? 'border-transparent' : 'border-[#008737]/15 hover:border-[#008737]/40'
                      }`}
                      style={form.purpose === p.value ? { borderColor: p.color, backgroundColor: p.color + '10' } : {}}>
                      <Icon className="h-5 w-5 mb-1.5" style={{ color: p.color }} />
                      <h3 className="text-[#063630] font-bold text-sm lg:text-base mt-2">{p.label}</h3>
                      <p className="text-[#063630]/60 text-xs mt-1">{p.desc}</p>
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
                        ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white border-transparent shadow-sm'
                        : 'border-[#008737]/20 text-[#063630] hover:border-[#008737]'
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
                  className={`flex-1 border-2 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all text-[#063630] ${
                    useCustom ? 'border-[#008737]' : 'border-[#008737]/20'
                  }`}
                />
                {useCustom && <span className="text-sm text-[#063630]/60 font-medium">NPR</span>}
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
                        ? 'bg-[#008737]/8 border-[#008737] text-[#008737]'
                        : 'border-[#008737]/20 text-[#063630]/60 hover:border-[#008737]'
                    }`}
                    style={form.paymentMethod === m.value ? { backgroundColor: 'rgba(0,135,55,0.07)' } : {}}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Donor details */}
            <div className="border-t border-[#008737]/10 pt-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-[#063630]">Your Details</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.anonymous} onChange={e => set('anonymous', e.target.checked)} className="w-4 h-4 accent-[#008737]" />
                  <span className="text-sm text-[#063630]/60">Donate anonymously</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#063630]/60 mb-1">Full Name *</label>
                  <input value={form.donorName} onChange={e => set('donorName', e.target.value)}
                    placeholder="Your name" disabled={form.anonymous}
                    className="w-full border border-[#008737]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737] text-[#063630] disabled:opacity-50" />
                </div>
                <div>
                  <label className="block text-xs text-[#063630]/60 mb-1">Phone</label>
                  <input value={form.donorPhone} onChange={e => set('donorPhone', e.target.value)}
                    placeholder="98XXXXXXXX" disabled={form.anonymous}
                    className="w-full border border-[#008737]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737] text-[#063630] disabled:opacity-50" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-[#063630]/60 mb-1">Email</label>
                  <input value={form.donorEmail} onChange={e => set('donorEmail', e.target.value)}
                    placeholder="your@email.com" disabled={form.anonymous}
                    className="w-full border border-[#008737]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737] text-[#063630] disabled:opacity-50" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-[#063630]/60 mb-1">Message (optional)</label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)}
                    rows={2} placeholder="Leave a message of support..."
                    className="w-full border border-[#008737]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737] text-[#063630] resize-none" />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
              </div>
            )}

            {/* Summary */}
            <div className="rounded-xl p-4 flex items-center justify-between border border-[#008737]/15" style={{ backgroundColor: 'rgba(0,135,55,0.05)' }}>
              <div>
                <p className="text-sm text-[#063630]/70">Donating to <span className="font-semibold text-[#063630]">{PURPOSES.find(p => p.value === form.purpose)?.label}</span></p>
                <p className="text-xs text-[#063630]/40 mt-0.5">via {PAYMENT_METHODS.find(m => m.value === form.paymentMethod)?.label}</p>
              </div>
              <p className="text-2xl font-bold text-[#008737]">NPR {(finalAmount || 0).toLocaleString()}</p>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#008737] to-[#085558] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 text-base flex items-center justify-center gap-2">
              <HandHeart className="h-5 w-5" />
              {loading ? 'Processing...' : `Donate NPR ${(finalAmount || 0).toLocaleString()}`}
            </button>

            <p className="text-center text-xs text-[#063630]/40">🔒 Your donation is secure. All funds go directly to dog welfare in Nepal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;