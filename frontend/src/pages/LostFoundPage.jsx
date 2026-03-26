import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Calendar, AlertCircle, CheckCircle, Plus, X, Search, ChevronDown, Camera, ShieldAlert } from 'lucide-react';
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
        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
          isLost ? 'bg-[#063630] text-white' : 'bg-[#008737] text-white'
        }`}>
          {isLost ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
          {isLost ? 'Lost Dog' : 'Found Dog'}
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
          <div className="w-full h-full flex flex-col items-center justify-center text-[#063630]/20 bg-[#EDEDED]">
            <Camera className="w-12 h-12 mb-2" />
            <span className="text-sm font-medium">No Photo</span>
          </div>
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
              <div className="flex items-start gap-1 text-xs text-gray-500 mt-1.5">
                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{report.location.details}</span>
              </div>
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

// Report Form has been moved to PostLostFoundPage.jsx

// ── Main Page ────────────────────────────────────────────────────────────────
const LostFoundPage = () => {
  const navigate = useNavigate();
  const [reports, setReports]     = useState([]);
  const [loading, setLoading]     = useState(true);
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

          <button onClick={() => navigate('/post-lost-found')}
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
            <div className="w-16 h-16 mx-auto mb-4 bg-[#063630]/5 text-[#008737] rounded-full flex items-center justify-center">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#063630] mb-2">No reports found</h3>
            <p className="text-[#063630]/60 mb-6">Be the first to post a lost or found report in your area.</p>
            <button onClick={() => navigate('/post-lost-found')}
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


    </div>
  );
};

export default LostFoundPage;