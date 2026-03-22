import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle, Eye, Trash2, RefreshCw, Search, Filter,
  CheckCircle, Clock, XCircle, MapPin, Phone, Mail, User, ChevronLeft, ChevronRight
} from 'lucide-react';
import ConfirmDeleteModal from '../Shared/ConfirmDeleteModal';

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

const URGENCY_STYLES = {
  low:      'bg-gray-100 text-gray-600',
  medium:   'bg-yellow-100 text-yellow-700',
  high:     'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const STATUS_STYLES = {
  pending:      { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  'under-review': { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-400'   },
  resolved:     { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  dismissed:    { bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400'   },
};

const CATEGORY_LABELS = {
  abuse:            'Abuse',
  neglect:          'Neglect',
  abandonment:      'Abandonment',
  'health-hazard':  'Health Hazard',
  'illegal-breeding': 'Illegal Breeding',
  other:            'Other',
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status?.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
    </span>
  );
};

const UrgencyBadge = ({ urgency }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${URGENCY_STYLES[urgency] || URGENCY_STYLES.medium}`}>
    {urgency}
  </span>
);

// ── Detail Modal ───────────────────────────────────────────────────────────────
const ReportModal = ({ report, onClose, onUpdate, onDelete, updating }) => {
  const [status,    setStatus]    = useState(report?.status    || 'pending');
  const [urgency,   setUrgency]   = useState(report?.urgency   || 'medium');
  const [adminNote, setAdminNote] = useState(report?.adminNote || '');

  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h3 className="text-lg font-bold text-[#063630]">Report Details</h3>
            <p className="text-xs text-gray-400 mt-0.5">#{report._id?.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Title & Category */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-[#063630]/10 text-[#063630] rounded-full text-xs font-semibold">
                {CATEGORY_LABELS[report.category] || report.category}
              </span>
              <UrgencyBadge urgency={report.urgency} />
              <StatusBadge status={report.status} />
            </div>
            <h4 className="text-xl font-bold text-[#063630]">{report.title}</h4>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{report.description}</p>
          </div>

          {/* Photo */}
          {report.photo && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Photo Evidence</p>
              <img
                src={report.photo.startsWith('http') ? report.photo : `${BASE_URL}${report.photo}`}
                alt="Report evidence"
                className="w-full max-h-64 object-cover rounded-xl border border-gray-100"
              />
            </div>
          )}

          {/* Location */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Location
            </p>
            <p className="text-sm font-semibold text-[#063630]">{report.location?.area}</p>
            <p className="text-sm text-gray-500">{report.location?.city}</p>
            {report.location?.details && <p className="text-xs text-gray-400 mt-1">{report.location.details}</p>}
          </div>

          {/* Reporter */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> Reporter
            </p>
            {report.anonymous ? (
              <p className="text-sm text-gray-500 italic">Anonymous report</p>
            ) : (
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-[#063630]">{report.reporterName}</p>
                {report.reporterEmail && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" /> {report.reporterEmail}
                  </div>
                )}
                {report.reporterPhone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" /> {report.reporterPhone}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Suspect description */}
          {report.suspectDescription && (
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-2">Suspect Description</p>
              <p className="text-sm text-gray-700">{report.suspectDescription}</p>
            </div>
          )}

          {/* Admin Actions */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Admin Actions</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Update Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]">
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Urgency</label>
                <select value={urgency} onChange={e => setUrgency(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Admin Note</label>
              <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)}
                rows={3} maxLength={500} placeholder="Add a note about this report..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737] resize-none" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex flex-wrap gap-2 justify-between sticky bottom-0 bg-white rounded-b-2xl">
          <button onClick={() => onDelete(report._id)} disabled={updating}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50">
            <Trash2 className="h-4 w-4" /> Delete Report
          </button>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={() => onUpdate(report._id, { status, urgency, adminNote })} disabled={updating}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all disabled:opacity-50">
              <CheckCircle className="h-4 w-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const AdminReportsTab = () => {
  const [reports,      setReports]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [updating,     setUpdating]     = useState(false);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [catFilter,    setCatFilter]    = useState('');
  const [search,       setSearch]       = useState('');
  const [selected,     setSelected]     = useState(null);
  const [flash,        setFlash]        = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const LIMIT = 15;

  // Summary counts
  const summary = {
    total,
    pending:      reports.filter(r => r.status === 'pending').length,
    underReview:  reports.filter(r => r.status === 'under-review').length,
    resolved:     reports.filter(r => r.status === 'resolved').length,
    critical:     reports.filter(r => r.urgency === 'critical').length,
  };

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (statusFilter) params.set('status', statusFilter);
      if (catFilter)    params.set('category', catFilter);
      const data = await apiFetch('GET', `/reports?${params}`);
      setReports(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / LIMIT));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, catFilter]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(''), 3000); };

  const handleUpdate = async (id, body) => {
    setUpdating(true);
    try {
      await apiFetch('PUT', `/reports/${id}`, body);
      showFlash('Report updated successfully.');
      setSelected(null);
      fetchReports();
    } catch (e) { showFlash(`Error: ${e.message}`); }
    finally { setUpdating(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setUpdating(true);
    try {
      await apiFetch('DELETE', `/reports/${deleteTarget}`);
      showFlash('Report deleted.');
      setSelected(null);
      fetchReports();
    } catch (e) { showFlash(`Error: ${e.message}`); }
    finally { setUpdating(false); setDeleteTarget(null); }
  };

  const filtered = reports.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.title?.toLowerCase().includes(q) ||
      r.reporterName?.toLowerCase().includes(q) ||
      r.location?.area?.toLowerCase().includes(q) ||
      r.location?.city?.toLowerCase().includes(q)
    );
  });

  const timeAgo = (d) => {
    const diff = (Date.now() - new Date(d)) / 1000;
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div>
      {/* Flash */}
      {flash && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
          {flash}
        </div>
      )}

      <ConfirmDeleteModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Report?"
        message="This action cannot be undone. Are you sure you want to permanently delete this report?"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total',        value: total,              color: 'border-gray-200   bg-gray-50    text-gray-700',   filter: '' },
          { label: 'Pending',      value: summary.pending,    color: 'border-yellow-200 bg-yellow-50  text-yellow-700', filter: 'pending' },
          { label: 'Under Review', value: summary.underReview,color: 'border-blue-200   bg-blue-50    text-blue-700',   filter: 'under-review' },
          { label: 'Resolved',     value: summary.resolved,   color: 'border-green-200  bg-green-50   text-green-700',  filter: 'resolved' },
          { label: '🚨 Critical',  value: summary.critical,   color: 'border-red-200    bg-red-50     text-red-700',    filter: '' },
        ].map(s => (
          <button key={s.label}
            onClick={() => { if (s.filter !== undefined) { setStatusFilter(s.filter); setPage(1); } }}
            className={`rounded-xl p-4 border text-left transition-all hover:shadow-sm ${s.color} ${
              statusFilter === s.filter && s.filter !== '' ? 'ring-2 ring-[#008737]' : ''
            }`}>
            <p className="text-2xl font-bold">{s.value ?? 0}</p>
            <p className="text-xs font-semibold mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-gray-200 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, reporter, location..."
            className="flex-1 text-sm outline-none bg-transparent" />
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-sm outline-none bg-transparent">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under-review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
          <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}
            className="text-sm outline-none bg-transparent">
            <option value="">All Categories</option>
            <option value="abuse">Abuse</option>
            <option value="neglect">Neglect</option>
            <option value="abandonment">Abandonment</option>
            <option value="health-hazard">Health Hazard</option>
            <option value="illegal-breeding">Illegal Breeding</option>
            <option value="other">Other</option>
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
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No reports found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {['Title & Category', 'Reporter', 'Location', 'Urgency', 'Status', 'Submitted', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(report => (
                  <tr key={report._id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Title */}
                    <td className="px-5 py-4 max-w-[200px]">
                      <p className="font-semibold text-[#063630] truncate">{report.title}</p>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {CATEGORY_LABELS[report.category] || report.category}
                      </span>
                    </td>

                    {/* Reporter */}
                    <td className="px-5 py-4">
                      {report.anonymous ? (
                        <span className="text-xs text-gray-400 italic">Anonymous</span>
                      ) : (
                        <div>
                          <p className="font-medium text-[#063630] text-sm">{report.reporterName}</p>
                          <p className="text-xs text-gray-400">{report.reporterEmail || report.reporterPhone || '—'}</p>
                        </div>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-[#063630] font-medium">{report.location?.area}</p>
                          <p className="text-xs text-gray-400">{report.location?.city}</p>
                        </div>
                      </div>
                    </td>

                    {/* Urgency */}
                    <td className="px-5 py-4">
                      <UrgencyBadge urgency={report.urgency} />
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={report.status} />
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {timeAgo(report.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(report)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#008737] hover:bg-green-50 transition-colors"
                          title="View & Edit">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(report._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
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
            <p className="text-sm text-gray-500">Page {page} of {totalPages} — {total} total reports</p>
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
        <ReportModal
          report={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
          onDelete={(id) => setDeleteTarget(id)}
          updating={updating}
        />
      )}
    </div>
  );
};

export default AdminReportsTab;