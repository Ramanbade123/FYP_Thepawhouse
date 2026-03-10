import { useState, useEffect, useCallback } from 'react';
import {
  Dog, User, CheckCircle, XCircle, Clock, Eye,
  Search, Filter, RefreshCw, ChevronLeft, ChevronRight,
  Mail, Phone, Calendar, MessageSquare
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');
const token = () => localStorage.getItem('token');

const apiFetch = async (method, url, body = null) => {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

const imgSrc = (url) => (!url ? null : url.startsWith('http') ? url : `${BASE_URL}${url}`);

const timeAgo = (dateStr) => {
  if (!dateStr) return '—';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const STATUS_STYLES = {
  pending:   { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  reviewing: { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-400'   },
  approved:  { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  rejected:  { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-400'    },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

// ── Detail Modal ───────────────────────────────────────────────────────────────
const ApplicationModal = ({ app, onClose, onStatusChange, updating }) => {
  if (!app) return null;
  const adopter = app.adopter || {};
  const pet     = app.pet     || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-lg font-bold text-[#063630]">Application Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Pet info */}
          <div className="flex items-center gap-4 bg-[#008737]/5 rounded-xl p-4">
            {imgSrc(pet.primaryImage) ? (
              <img src={imgSrc(pet.primaryImage)} alt={pet.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-[#008737]/10 flex items-center justify-center flex-shrink-0">
                <Dog className="h-8 w-8 text-[#008737]" />
              </div>
            )}
            <div>
              <p className="font-bold text-[#063630] text-lg">{pet.name || '—'}</p>
              <p className="text-[#008737] font-medium text-sm">{pet.breed}</p>
              <StatusBadge status={pet.status} />
            </div>
          </div>

          {/* Adopter info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Applicant</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#085558] to-[#008737] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {adopter.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-semibold text-[#063630]">{adopter.name || '—'}</p>
              </div>
            </div>
            <div className="space-y-2">
              {adopter.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>{adopter.email}</span>
                </div>
              )}
              {adopter.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>{adopter.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Rehomer info */}
          {app.rehomer && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Listed By (Rehomer)</p>
              <p className="font-semibold text-[#063630]">{app.rehomer.name}</p>
              <p className="text-sm text-gray-500">{app.rehomer.email}</p>
            </div>
          )}

          {/* Message */}
          {app.message && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" /> Message from Applicant
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{app.message}</p>
            </div>
          )}

          {/* Current status */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">Current Status:</span>
            <StatusBadge status={app.status} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 border-t border-gray-100 flex flex-wrap gap-2 justify-end sticky bottom-0 bg-white rounded-b-2xl">
          {app.status !== 'reviewing' && (
            <button onClick={() => onStatusChange(app.pet._id, app._id, 'reviewing')} disabled={updating}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors disabled:opacity-50">
              <Clock className="h-4 w-4" /> Mark Reviewing
            </button>
          )}
          {app.status !== 'approved' && (
            <button onClick={() => onStatusChange(app.pet._id, app._id, 'approved')} disabled={updating}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors disabled:opacity-50">
              <CheckCircle className="h-4 w-4" /> Approve
            </button>
          )}
          {app.status !== 'rejected' && (
            <button onClick={() => onStatusChange(app.pet._id, app._id, 'rejected')} disabled={updating}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50">
              <XCircle className="h-4 w-4" /> Reject
            </button>
          )}
          <button onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const AdminAdoptionsTab = () => {
  const [applications, setApplications] = useState([]);
  const [summary,      setSummary]      = useState({ total: 0, pending: 0, reviewing: 0, approved: 0, rejected: 0 });
  const [loading,      setLoading]      = useState(true);
  const [updating,     setUpdating]     = useState(false);
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search,       setSearch]       = useState('');
  const [selected,     setSelected]     = useState(null);
  const [flash,        setFlash]        = useState('');
  const LIMIT = 15;

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (statusFilter) params.set('status', statusFilter);
      const data = await apiFetch('GET', `/pets/admin/applications?${params}`);
      setApplications(data.data || []);
      setSummary(data.summary || {});
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(''), 3000); };

  const handleStatusChange = async (petId, appId, status) => {
    setUpdating(true);
    try {
      await apiFetch('PUT', `/pets/${petId}/applications/${appId}`, { status });
      showFlash(`Application ${status}.`);
      setSelected(null);
      fetchApplications();
    } catch (e) {
      showFlash(`Error: ${e.message}`);
    } finally {
      setUpdating(false);
    }
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
    { label: 'Total',     value: summary.total,     color: 'border-gray-200   bg-gray-50    text-gray-700'   },
    { label: 'Pending',   value: summary.pending,   color: 'border-yellow-200 bg-yellow-50  text-yellow-700' },
    { label: 'Reviewing', value: summary.reviewing, color: 'border-blue-200   bg-blue-50    text-blue-700'   },
    { label: 'Approved',  value: summary.approved,  color: 'border-green-200  bg-green-50   text-green-700'  },
    { label: 'Rejected',  value: summary.rejected,  color: 'border-red-200    bg-red-50     text-red-700'    },
  ];

  return (
    <div>
      {/* Flash */}
      {flash && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
          {flash}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {statCards.map(s => (
          <button key={s.label}
            onClick={() => { setStatusFilter(s.label === 'Total' ? '' : s.label.toLowerCase()); setPage(1); }}
            className={`rounded-xl p-4 border text-left transition-all hover:shadow-sm ${s.color} ${
              (statusFilter === s.label.toLowerCase() || (s.label === 'Total' && !statusFilter))
                ? 'ring-2 ring-[#008737]' : ''
            }`}>
            <p className="text-2xl font-bold">{s.value ?? 0}</p>
            <p className="text-xs font-semibold mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-gray-200 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by adopter, pet name, breed..."
            className="flex-1 text-sm outline-none bg-transparent" />
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-sm outline-none bg-transparent">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#008737] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Dog className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No applications found</p>
            <p className="text-sm mt-1">Try changing your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {['Pet', 'Applicant', 'Rehomer', 'Message', 'Status', 'Applied', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(app => (
                  <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Pet */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {imgSrc(app.pet?.primaryImage) ? (
                          <img src={imgSrc(app.pet.primaryImage)} alt={app.pet.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#008737]/10 flex items-center justify-center flex-shrink-0">
                            <Dog className="h-5 w-5 text-[#008737]" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#063630]">{app.pet?.name || '—'}</p>
                          <p className="text-xs text-gray-400">{app.pet?.breed}</p>
                        </div>
                      </div>
                    </td>

                    {/* Adopter */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#085558] to-[#008737] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {app.adopter?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-[#063630]">{app.adopter?.name || '—'}</p>
                          <p className="text-xs text-gray-400">{app.adopter?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Rehomer */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#063630] text-sm">{app.rehomer?.name || '—'}</p>
                      <p className="text-xs text-gray-400">{app.rehomer?.email}</p>
                    </td>

                    {/* Message */}
                    <td className="px-5 py-4 max-w-[160px]">
                      <p className="text-xs text-gray-500 truncate">{app.message || <span className="italic text-gray-300">No message</span>}</p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Applied */}
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {timeAgo(app.appliedAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(app)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#008737] hover:bg-green-50 transition-colors"
                          title="View details">
                          <Eye className="h-4 w-4" />
                        </button>
                        {app.status !== 'approved' && (
                          <button onClick={() => handleStatusChange(app.pet._id, app._id, 'approved')}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                            title="Approve">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button onClick={() => handleStatusChange(app.pet._id, app._id, 'rejected')}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Reject">
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <ApplicationModal
          app={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}
    </div>
  );
};

export default AdminAdoptionsTab;