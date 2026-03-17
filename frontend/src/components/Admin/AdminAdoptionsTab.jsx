import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, RefreshCw, Eye, CheckCircle, XCircle, Clock,
  User, Dog, Phone, Mail, MapPin, MessageSquare, Calendar,
  TrendingUp, X
} from 'lucide-react';

const API      = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
const imgSrc   = (url) => { if (!url) return null; return url.startsWith('http') ? url : `${BASE_URL}${url}`; };

const STATUS_STYLES = {
  pending:   'bg-yellow-100 text-yellow-800 border border-yellow-200',
  reviewing: 'bg-blue-100   text-blue-800   border border-blue-200',
  approved:  'bg-green-100  text-green-800  border border-green-200',
  rejected:  'bg-red-100    text-red-800    border border-red-200',
};

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString();
};

// ── Detail Modal ──────────────────────────────────────────────
const ApplicationModal = ({ app, onClose, onAction }) => {
  const [loading, setLoading] = useState(false);
  const [note, setNote]       = useState('');

  const act = async (status) => {
    setLoading(true);
    await onAction(app.pet._id, app._id, status);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#063630] to-[#085558] p-5 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">Application Details</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          {/* Adopter */}
          <div className="flex items-center gap-4">
            {app.adopter?.profileImage ? (
              <img src={imgSrc(app.adopter.profileImage)} alt={app.adopter.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#008737]/20 flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#085558] to-[#008737] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {app.adopter?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            <div>
              <p className="font-bold text-[#063630] text-lg">{app.adopter?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{app.adopter?.email || '—'}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{app.adopter?.phone || '—'}</p>
              {app.adopter?.location?.city && (
                <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{app.adopter.location.city}, Nepal</p>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Pet info */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
            {imgSrc(app.pet?.primaryImage) ? (
              <img src={imgSrc(app.pet.primaryImage)} alt={app.pet.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-[#008737]/10 flex items-center justify-center flex-shrink-0">
                <Dog className="h-8 w-8 text-[#008737]" />
              </div>
            )}
            <div>
              <p className="font-bold text-[#063630]">{app.pet?.name}</p>
              <p className="text-sm text-[#008737]">{app.pet?.breed}</p>
              <p className="text-xs text-gray-500">Rehomer: {app.rehomer?.name || '—'}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Applied</p>
              <p className="font-semibold text-[#063630] flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#008737]" />
                {new Date(app.appliedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Status</p>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[app.status]}`}>
                {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
              </span>
            </div>
          </div>

          {/* Message */}
          {app.message && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" /> Message from Applicant
              </p>
              <p className="text-sm text-gray-700 bg-blue-50 rounded-xl p-3 italic border border-blue-100">
                "{app.message}"
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50">
            Close
          </button>
          {(app.status === 'pending' || app.status === 'reviewing') && (
            <>
              <button onClick={() => act('rejected')} disabled={loading}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-60 flex items-center justify-center gap-1"
                style={{ color: '#fff' }}>
                <XCircle className="h-4 w-4" /> Reject
              </button>
              <button onClick={() => act('approved')} disabled={loading}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-xl font-medium hover:shadow-md disabled:opacity-60 flex items-center justify-center gap-1"
                style={{ color: '#fff' }}>
                <CheckCircle className="h-4 w-4" /> Approve
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Tab ──────────────────────────────────────────────────
const AdminAdoptionsTab = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('all');
  const [selected, setSelected]         = useState(null);
  const [total, setTotal]               = useState(0);
  const [search, setSearch]             = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token  = localStorage.getItem('token');
      const params = new URLSearchParams({ limit: 100 });
      if (filter !== 'all') params.set('status', filter);
      const res  = await fetch(`${API}/pets/admin/applications?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
        setTotal(data.total);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications(); }, [filter]);

  const handleAction = async (petId, appId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/pets/admin/applications/${petId}/${appId}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status }),
      });
      fetchApplications();
    } catch (err) { console.error(err); }
  };

  const counts = {
    all:       applications.length,
    pending:   applications.filter(a => a.status === 'pending').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    approved:  applications.filter(a => a.status === 'approved').length,
    rejected:  applications.filter(a => a.status === 'rejected').length,
  };

  const filtered = applications.filter(app => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      app.adopter?.name?.toLowerCase().includes(q) ||
      app.adopter?.email?.toLowerCase().includes(q) ||
      app.pet?.name?.toLowerCase().includes(q) ||
      app.pet?.breed?.toLowerCase().includes(q)
    );
  });

  const statCards = [
    { label: 'Total Applications', value: total,          icon: Heart,       iconColor: 'text-[#008737]', bg: 'bg-white', border: 'border-gray-100', textColor: 'text-[#063630]', subColor: 'text-gray-400' },
    { label: 'Pending',            value: counts.pending,  icon: Clock,       iconColor: 'text-amber-500', bg: 'bg-white', border: 'border-gray-100', textColor: 'text-[#063630]', subColor: 'text-gray-400' },
    { label: 'Approved',           value: counts.approved, icon: CheckCircle, iconColor: 'text-[#008737]', bg: 'bg-white', border: 'border-gray-100', textColor: 'text-[#063630]', subColor: 'text-gray-400' },
    { label: 'Rejected',           value: counts.rejected, icon: XCircle,     iconColor: 'text-red-400',   bg: 'bg-white', border: 'border-gray-100', textColor: 'text-[#063630]', subColor: 'text-gray-400' },
  ];

  return (
    <div>
      {selected && (
        <ApplicationModal
          app={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, iconColor, bg, border, textColor, subColor }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-sm font-medium ${subColor}`}>{label}</p>
              <div className="w-9 h-9 bg-[#008737]/8 rounded-lg flex items-center justify-center">
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
            </div>
            <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by adopter name, email, or dog..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008737]"
        />
        <div className="flex flex-wrap gap-2">
          {['all','pending','reviewing','approved','rejected'].map(key => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === key
                  ? 'bg-gradient-to-r from-[#085558] to-[#008737] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#085558]'
              }`}>
              {key} {key !== 'all' && <span className="opacity-70">({counts[key]})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#008737] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 text-center border border-gray-100">
          <Heart className="h-14 w-14 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-400 mb-2">No applications yet</h3>
          <p className="text-gray-400 text-sm">Adoption applications will appear here once submitted.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 text-center border border-gray-100">
          <h3 className="text-lg font-bold text-gray-400 mb-2">No applications found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Applicant</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Dog</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Rehomer</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Applied</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((app, i) => (
                <motion.tr key={app._id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-gray-50 transition-colors">

                  {/* Applicant */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {app.adopter?.profileImage ? (
                        <img src={imgSrc(app.adopter.profileImage)} alt={app.adopter.name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#085558] to-[#008737] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {app.adopter?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{app.adopter?.name || 'Unknown'}</p>
                        <p className="text-gray-400 text-xs">{app.adopter?.email || ''}</p>
                      </div>
                    </div>
                  </td>

                  {/* Dog */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {imgSrc(app.pet?.primaryImage) ? (
                        <img src={imgSrc(app.pet.primaryImage)} alt={app.pet.name}
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[#008737]/10 flex items-center justify-center flex-shrink-0">
                          <Dog className="h-4 w-4 text-[#008737]" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#063630]">{app.pet?.name}</p>
                        <p className="text-xs text-gray-400">{app.pet?.breed}</p>
                      </div>
                    </div>
                  </td>

                  {/* Rehomer */}
                  <td className="px-5 py-3 text-gray-600 text-sm">{app.rehomer?.name || '—'}</td>

                  {/* Date */}
                  <td className="px-5 py-3 text-gray-400 text-xs">{timeAgo(app.appliedAt)}</td>

                  {/* Status */}
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[app.status]}`}>
                      {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-3">
                    <button onClick={() => setSelected(app)}
                      className="flex items-center gap-1 px-3 py-1.5 text-[#085558] border border-[#085558]/30 rounded-lg hover:bg-[#085558]/10 transition-colors text-xs font-medium">
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAdoptionsTab;