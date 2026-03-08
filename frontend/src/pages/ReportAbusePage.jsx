import { useState } from 'react';
import { AlertTriangle, MapPin, User, Phone, Mail, Camera, X, ChevronDown, CheckCircle } from 'lucide-react';
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


const CATEGORIES = [
  { value: 'abuse',            label: 'Physical Abuse',      color: '#d62828' },
  { value: 'neglect',          label: 'Neglect',             color: '#e85d04' },
  { value: 'abandonment',      label: 'Abandonment',         color: '#7209b7' },
  { value: 'health-hazard',    label: 'Health Hazard',       color: '#0077b6' },
  { value: 'illegal-breeding', label: 'Illegal Breeding',    color: '#6a0572' },
  { value: 'other',            label: 'Other',               color: '#555'    },
];

const URGENCIES = [
  { value: 'low',      label: 'Low',      bg: 'bg-gray-100',   text: 'text-gray-700'  },
  { value: 'medium',   label: 'Medium',   bg: 'bg-yellow-100', text: 'text-yellow-700'},
  { value: 'high',     label: 'High',     bg: 'bg-orange-100', text: 'text-orange-700'},
  { value: 'critical', label: 'Critical', bg: 'bg-red-100',    text: 'text-red-700'   },
];

const CITIES = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 'Chitwan', 'Other'];

const ReportAbusePage = () => {
  const [form, setForm] = useState({
    category: '', title: '', description: '', urgency: 'medium',
    area: '', city: 'Kathmandu', details: '',
    suspectDescription: '',
    reporterName: '', reporterPhone: '', reporterEmail: '',
    anonymous: false,
  });
  const [photo, setPhoto]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.category || !form.title || !form.description || !form.area || !form.reporterName) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'area' || k === 'city' || k === 'details') return;
        fd.append(k, v);
      });
      fd.append('location', JSON.stringify({ area: form.area, city: form.city, details: form.details }));
      if (photo) fd.append('photo', photo);

      await apiFetch('POST', '/reports', fd, true);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit. Please try again.');
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
        <h2 className="text-2xl font-bold text-[#063630] mb-3">Report Submitted</h2>
        <p className="text-[#063630]/60 mb-6">Thank you for reporting. Our team will review it and take appropriate action. Your report helps keep dogs safe.</p>
        <button onClick={() => { setSubmitted(false); setForm({ category: '', title: '', description: '', urgency: 'medium', area: '', city: 'Kathmandu', details: '', suspectDescription: '', reporterName: '', reporterPhone: '', reporterEmail: '', anonymous: false }); setPhoto(null); setPreview(null); }}
          className="w-full py-3 bg-gradient-to-r from-[#063630] to-[#085558] text-white font-bold rounded-xl hover:shadow-lg transition-all">
          Submit Another Report
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#EDEDED', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#063630] to-[#085558] text-white py-14 px-4 mb-10">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#008737]/30 text-green-200 px-4 py-2 rounded-full mb-5 text-sm font-semibold">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            Animal Protection — Nepal
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ color: '#ffffff' }}>Report Animal Abuse</h1>
          <p className="text-green-200 text-lg">Help us protect dogs from neglect, abuse, and cruelty in Nepal</p>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#008737]/10 overflow-hidden">

          {/* Info banner */}
          <div className="border-b border-[#063630]/8 px-6 py-4 flex gap-3" style={{ backgroundColor: 'rgba(6,54,48,0.04)' }}>
            <AlertTriangle className="h-5 w-5 text-[#008737] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#063630]/80">All reports are reviewed by our team. In life-threatening emergencies, please also contact local authorities directly. You may report anonymously.</p>
          </div>

          <div className="p-6 space-y-6">

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-[#063630] mb-3">Type of Incident <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map(c => (
                  <button key={c.value} onClick={() => set('category', c.value)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      form.category === c.value
                        ? 'border-transparent text-white'
                        : 'border-[#008737]/20 text-[#063630]/60 hover:border-[#008737]'
                    }`}
                    style={form.category === c.value ? { backgroundColor: c.color } : {}}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-bold text-[#063630] mb-3">Urgency Level</label>
              <div className="flex gap-2">
                {URGENCIES.map(u => (
                  <button key={u.value} onClick={() => set('urgency', u.value)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                      form.urgency === u.value
                        ? `${u.bg} ${u.text} border-transparent`
                        : 'border-[#008737]/20 text-[#063630]/60 hover:border-[#008737]'
                    }`}>
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-[#063630] mb-1">Incident Title <span className="text-red-500">*</span></label>
              <input value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="Brief title of the incident"
                className="w-full border border-[#008737]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737]" />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-[#063630] mb-1">Describe the Incident <span className="text-red-500">*</span></label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={5} placeholder="Please describe what you witnessed in as much detail as possible..."
                className="w-full border border-[#008737]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737] resize-none" />
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-bold text-[#063630] mb-2">Evidence Photo (optional)</label>
              <div onClick={() => document.getElementById('report-photo').click()}
                className="border-2 border-dashed border-[#008737]/20 rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer hover:border-[#008737] transition-colors overflow-hidden relative">
                {preview
                  ? <><img src={preview} alt="evidence" className="w-full h-full object-cover" /><button onClick={e => { e.stopPropagation(); setPhoto(null); setPreview(null); }} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"><X className="h-4 w-4 text-gray-600" /></button></>
                  : <><Camera className="h-8 w-8 text-gray-300 mb-2" /><p className="text-sm text-gray-400">Upload photo evidence</p></>
                }
              </div>
              <input id="report-photo" type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-[#063630] mb-1">Area <span className="text-red-500">*</span></label>
                <input value={form.area} onChange={e => set('area', e.target.value)}
                  placeholder="e.g. Thamel, Chabahil"
                  className="w-full border border-[#008737]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#063630] mb-1">City</label>
                <select value={form.city} onChange={e => set('city', e.target.value)}
                  className="w-full border border-[#008737]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737] bg-white">
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-[#063630] mb-1">Location Details (optional)</label>
                <input value={form.details} onChange={e => set('details', e.target.value)}
                  placeholder="Landmark, street name, etc."
                  className="w-full border border-[#008737]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737]" />
              </div>
            </div>

            {/* Suspect */}
            <div>
              <label className="block text-sm font-bold text-[#063630] mb-1">Description of Person/Place (optional)</label>
              <textarea value={form.suspectDescription} onChange={e => set('suspectDescription', e.target.value)}
                rows={2} placeholder="Any description of the person or location responsible..."
                className="w-full border border-[#008737]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737] resize-none" />
            </div>

            {/* Reporter */}
            <div className="border-t border-[#008737]/10 pt-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-[#063630]">Your Contact Details</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.anonymous} onChange={e => set('anonymous', e.target.checked)} className="w-4 h-4 accent-red-600" />
                  <span className="text-sm text-gray-600">Report anonymously</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Your Name <span className="text-red-500">*</span></label>
                  <input value={form.reporterName} onChange={e => set('reporterName', e.target.value)}
                    placeholder="Full name" disabled={form.anonymous}
                    className="w-full border border-[#008737]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737] disabled:bg-gray-50 disabled:text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone</label>
                  <input value={form.reporterPhone} onChange={e => set('reporterPhone', e.target.value)}
                    placeholder="98XXXXXXXX" disabled={form.anonymous}
                    className="w-full border border-[#008737]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737] disabled:bg-gray-50 disabled:text-gray-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Email (optional)</label>
                  <input value={form.reporterEmail} onChange={e => set('reporterEmail', e.target.value)}
                    placeholder="your@email.com" disabled={form.anonymous}
                    className="w-full border border-[#008737]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737] disabled:bg-gray-50 disabled:text-gray-400" />
                </div>
              </div>
              {form.anonymous && (
                <p className="text-xs text-gray-400 mt-2">Your identity will be kept confidential. Contact info will not be stored.</p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#063630] to-[#085558] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 text-base">
              {loading ? 'Submitting Report...' : 'Submit Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAbusePage;