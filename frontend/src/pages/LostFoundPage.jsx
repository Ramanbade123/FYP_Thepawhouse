import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Calendar, AlertCircle, CheckCircle, Plus, X, Search, Filter, ChevronDown } from 'lucide-react';
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


const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const imgSrc = (url) => {
  if (!url) return null;
  let fullUrl = url;
  if (!url.startsWith('http') && !url.startsWith('/')) {
    fullUrl = `/uploads/${url}`; // Assuming these go to a general uploads folder or similar, /uploads/users for users
  }
  return fullUrl.startsWith('http') ? fullUrl : `${BASE_URL}${fullUrl}`;
};

const CITIES = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 'Chitwan', 'Other'];
const SIZES  = ['small', 'medium', 'large', 'extra-large'];

// ── Card ────────────────────────────────────────────────────────────────────
const ReportCard = ({ report, onResolve, currentUser }) => {
  const isLost    = report.type === 'lost';
  const isOwner   = currentUser && report.reportedBy?._id === currentUser._id;
  const isAdmin   = currentUser?.role === 'admin';
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition-all duration-200 hover:shadow-lg ${
      report.status === 'resolved' ? 'opacity-60 border-gray-100' : 'border-[#008737]/15'
    }`}>

      {/* Type badge */}
      <div className="px-4 py-2.5 flex items-center justify-between bg-[#063630]/5">
        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
          isLost ? 'bg-[#063630] text-white' : 'bg-[#008737] text-white'
        }`}>
          {isLost ? '🔴 Lost Dog' : '🟢 Found Dog'}
        </span>
        {report.status === 'resolved' && (
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            <CheckCircle className="h-3 w-3" /> Resolved
          </span>
        )}
      </div>

      {/* Photo */}
      <div className="relative h-48 bg-gray-100">
        {imgSrc(report.photo) ? (
          <img src={imgSrc(report.photo)} alt="Dog" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🐕</div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-[#063630] text-lg">
              {report.dogName || 'Unknown Name'}
            </h3>
            <p className="text-sm text-gray-500">{report.breed} · {report.color} · {report.gender}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            report.size === 'small'       ? 'bg-blue-50 text-blue-700'   :
            report.size === 'medium'      ? 'bg-purple-50 text-purple-700' :
            report.size === 'large'       ? 'bg-orange-50 text-orange-700' :
            'bg-red-50 text-red-700'
          }`}>{report.size}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
          <MapPin className="h-3.5 w-3.5 text-[#008737] flex-shrink-0" />
          <span>{report.location?.area}, {report.location?.city}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{isLost ? 'Lost on' : 'Found on'}: {new Date(report.date).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>

        {report.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>
        )}

        {/* Contact toggle */}
        <button
          onClick={() => setExpanded(p => !p)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-colors bg-[#008737]/8 text-[#008737] hover:bg-[#008737]/15"
          style={{ backgroundColor: 'rgba(0,135,55,0.07)' }}
        >
          <Phone className="h-4 w-4" />
          {expanded ? 'Hide Contact' : 'Show Contact'}
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>

        {expanded && (
          <div className="mt-3 p-3 rounded-xl space-y-1.5" style={{ backgroundColor: '#EDEDED' }}>
            <p className="font-semibold text-[#063630] text-sm">{report.contactName}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-3.5 w-3.5" />
              <a href={`tel:${report.contactPhone}`} className="hover:text-[#008737] font-medium">{report.contactPhone}</a>
            </div>
            {report.contactEmail && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-3.5 w-3.5" />
                <a href={`mailto:${report.contactEmail}`} className="hover:text-[#008737]">{report.contactEmail}</a>
              </div>
            )}
            {report.location?.details && (
              <p className="text-xs text-gray-500 mt-1">📍 {report.location.details}</p>
            )}
          </div>
        )}

        {/* Resolve button — owner or admin only */}
        {(isOwner || isAdmin) && report.status === 'active' && (
          <button
            onClick={() => onResolve(report._id)}
            className="mt-3 w-full py-2 rounded-xl text-sm font-semibold bg-[#008737]/10 text-[#008737] hover:bg-[#008737]/20 transition-colors"
          >
            ✓ Mark as Resolved
          </button>
        )}
      </div>
    </div>
  );
};

// ── Report Form ──────────────────────────────────────────────────────────────
const ReportForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    type: 'lost', dogName: '', breed: '', color: '', size: 'medium',
    gender: 'unknown', description: '', date: '',
    area: '', city: 'Kathmandu', details: '',
    contactName: '', contactPhone: '', contactEmail: '',
  });
  const [photo, setPhoto]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.color || !form.area || !form.date || !form.contactName || !form.contactPhone) {
      setError('Please fill in all required fields (colour, area, date, contact name & phone).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('type',        form.type);
      fd.append('dogName',     form.dogName);
      fd.append('breed',       form.breed || 'Unknown');
      fd.append('color',       form.color);
      fd.append('size',        form.size);
      fd.append('gender',      form.gender);
      fd.append('description', form.description);
      fd.append('date',        form.date);
      fd.append('location',    JSON.stringify({ area: form.area, city: form.city, details: form.details }));
      fd.append('contactName',  form.contactName);
      fd.append('contactPhone', form.contactPhone);
      fd.append('contactEmail', form.contactEmail);
      if (photo) fd.append('photo', photo);

      await apiFetch('POST', '/lostfound', fd, true);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-[#063630]">Post a Lost / Found Report</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-5">

          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-3">
            {['lost', 'found'].map(t => (
              <button key={t} onClick={() => set('type', t)}
                className={`py-3 rounded-xl font-bold text-sm transition-all ${
                  form.type === t
                    ? 'bg-gradient-to-r from-[#063630] to-[#085558] text-white shadow-md'
                    : 'text-[#063630]/60 hover:text-[#063630]'
                }`}
                style={form.type !== t ? { backgroundColor: '#EDEDED' } : {}}>
                {t === 'lost' ? '🔴 I Lost My Dog' : '🟢 I Found a Dog'}
              </button>
            ))}
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-semibold text-[#063630] mb-2">Dog Photo</label>
            <div
              onClick={() => document.getElementById('lf-photo').click()}
              className="border-2 border-dashed border-gray-200 rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer hover:border-[#008737] transition-colors overflow-hidden"
            >
              {preview
                ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                : <><div className="text-4xl mb-2">📷</div><p className="text-sm text-gray-400">Click to upload a photo</p></>
              }
            </div>
            <input id="lf-photo" type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>

          {/* Dog details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Dog's Name (if known)</label>
              <input value={form.dogName} onChange={e => set('dogName', e.target.value)}
                placeholder="e.g. Bruno" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Breed</label>
              <input value={form.breed} onChange={e => set('breed', e.target.value)}
                placeholder="e.g. Labrador / Mixed" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Colour <span className="text-red-500">*</span></label>
              <input value={form.color} onChange={e => set('color', e.target.value)}
                placeholder="e.g. Brown & white" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Size</label>
              <select value={form.size} onChange={e => set('size', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737] bg-white">
                {SIZES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
              <select value={form.gender} onChange={e => set('gender', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737] bg-white">
                <option value="unknown">Unknown</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Date {form.type === 'lost' ? 'Lost' : 'Found'} <span className="text-red-500">*</span></label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={3} placeholder="Any distinguishing features, collar colour, behaviour..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737] resize-none" />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Area / Neighbourhood <span className="text-red-500">*</span></label>
              <input value={form.area} onChange={e => set('area', e.target.value)}
                placeholder="e.g. Thamel, Chabahil" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
              <select value={form.city} onChange={e => set('city', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737] bg-white">
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Location Details (optional)</label>
              <input value={form.details} onChange={e => set('details', e.target.value)}
                placeholder="e.g. Near the park on Ring Road, opposite the temple"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]" />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name <span className="text-red-500">*</span></label>
              <input value={form.contactName} onChange={e => set('contactName', e.target.value)}
                placeholder="Full name" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number <span className="text-red-500">*</span></label>
              <input value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)}
                placeholder="98XXXXXXXX" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email (optional)</label>
              <input value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)}
                placeholder="your@email.com" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#085558] to-[#008737] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-60">
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const LostFoundPage = () => {
  const [reports, setReports]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterCity, setFilterCity] = useState('');
  const [search, setSearch]       = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setCurrentUser(u);
    fetchReports();
  }, []);

  const fetchReports = async (type = '', city = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: 'active', limit: 50 });
      if (type) params.append('type', type);
      if (city) params.append('city', city);
      const res = await apiFetch('GET', `/lostfound?${params}`);
      setReports(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterType = (t) => {
    setFilterType(t);
    fetchReports(t === 'all' ? '' : t, filterCity);
  };

  const handleFilterCity = (c) => {
    setFilterCity(c);
    fetchReports(filterType === 'all' ? '' : filterType, c);
  };

  const handleResolve = async (id) => {
    try {
      await apiFetch('PUT', `/lostfound/${id}/resolve`);
      fetchReports(filterType === 'all' ? '' : filterType, filterCity);
    } catch (err) {
      console.error(err);
    }
  };

  // Client-side search filter
  const filtered = reports.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.dogName?.toLowerCase().includes(q) ||
      r.breed?.toLowerCase().includes(q) ||
      r.color?.toLowerCase().includes(q) ||
      r.location?.area?.toLowerCase().includes(q) ||
      r.location?.city?.toLowerCase().includes(q)
    );
  });

  const lostCount  = reports.filter(r => r.type === 'lost').length;
  const foundCount = reports.filter(r => r.type === 'found').length;

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#EDEDED', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#063630] to-[#085558] text-white py-14 px-4 mb-10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#008737]/30 text-green-200 px-4 py-2 rounded-full mb-5 text-sm font-semibold">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            Community Board — Nepal
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ color: '#ffffff' }}>Lost &amp; Found Dogs</h1>
          <p className="text-green-200 text-lg mb-8">Help reunite dogs with their families across Nepal</p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-4xl font-bold" style={{ color: '#ffffff' }}>{lostCount}</p>
              <p className="text-sm text-green-200 mt-1">Lost Reports</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-4xl font-bold" style={{ color: '#ffffff' }}>{foundCount}</p>
              <p className="text-sm text-green-200 mt-1">Found Reports</p>
            </div>
          </div>

          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-[#008737] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#006d2c] hover:shadow-xl transition-all duration-300">
            <Plus className="h-5 w-5" /> Post a Report
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4">

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#008737]/10 p-4 mb-6 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 min-w-[180px]" style={{ backgroundColor: '#EDEDED' }}>
            <Search className="h-4 w-4 text-[#063630]/40" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, breed, area..."
              className="bg-transparent text-sm focus:outline-none w-full text-[#063630] placeholder-[#063630]/40" />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1 rounded-xl p-1" style={{ backgroundColor: '#EDEDED' }}>
            {['all', 'lost', 'found'].map(t => (
              <button key={t} onClick={() => handleFilterType(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filterType === t
                    ? 'bg-[#063630] text-white shadow-sm'
                    : 'text-[#063630]/60 hover:text-[#063630]'
                }`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* City filter */}
          <select value={filterCity} onChange={e => handleFilterCity(e.target.value)}
            className="border border-[#008737]/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737] bg-white text-[#063630]">
            <option value="">All Cities</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#008737] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐕</div>
            <h3 className="text-xl font-bold text-[#063630] mb-2">No reports found</h3>
            <p className="text-[#063630]/60 mb-6">Be the first to post a lost or found report in your area.</p>
            <button onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#008737] to-[#085558] text-white font-bold px-7 py-3.5 rounded-xl hover:shadow-lg transition-all">
              <Plus className="h-4 w-4" /> Post a Report
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(r => (
              <ReportCard key={r._id} report={r} onResolve={handleResolve} currentUser={currentUser} />
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <ReportForm
          onClose={() => setShowForm(false)}
          onSuccess={() => fetchReports(filterType === 'all' ? '' : filterType, filterCity)}
        />
      )}
    </div>
  );
};

export default LostFoundPage;