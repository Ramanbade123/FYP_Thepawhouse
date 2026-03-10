import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, MapPin, Phone, Mail, Calendar,
  CheckCircle, Trash2, Eye, X, RefreshCw, Dog,
  AlertTriangle, Clock, ChevronLeft, ChevronRight
} from 'lucide-react';

const API = 'http://localhost:5000/api';

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

const BASE_URL = API.replace('/api', '');
const imgSrc = (url) => (!url ? null : url.startsWith('http') ? url : `${BASE_URL}${url}`);

// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
    status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
    {status === 'active' ? 'Active' : 'Resolved'}
  </span>
);

// ── Type Badge ────────────────────────────────────────────────────────────────
const TypeBadge = ({ type }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
    type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
  }`}>
    {type === 'lost' ? 'Lost' : 'Found'}
  </span>
);

// ── Detail Modal ──────────────────────────────────────────────────────────────
const DetailModal = ({ report, onClose, onResolve, onDelete }) => {
  if (!report) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#063630] to-[#085558] p-5 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Dog className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{report.dogName || 'Unknown Dog'}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <TypeBadge type={report.type} />
                  <StatusBadge status={report.status} />
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
              <X className="h-4 w-4 text-white" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Photo */}
            {imgSrc(report.photo) && (
              <img src={imgSrc(report.photo)} alt="Dog" className="w-full h-52 object-cover rounded-xl border border-gray-100" />
            )}

            {/* Dog Details */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Breed', value: report.breed || 'Unknown' },
                { label: 'Color', value: report.color },
                { label: 'Size', value: report.size },
                { label: 'Gender', value: report.gender },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-[#063630] mt-0.5 capitalize">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {report.description && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-gray-700">{report.description}</p>
              </div>
            )}

            {/* Location & Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-[#008737]" />
                <span>{report.location?.area}, {report.location?.city}</span>
              </div>
              {report.location?.details && (
                <p className="text-xs text-gray-400 pl-6">{report.location.details}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-[#008737]" />
                <span>{new Date(report.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#008737]/5 border border-[#008737]/15 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-[#063630] uppercase tracking-wide mb-2">Contact Info</p>
              <p className="text-sm font-semibold text-[#063630]">{report.contactName}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-3.5 w-3.5 text-[#008737]" />
                <span>{report.contactPhone}</span>
              </div>
              {report.contactEmail && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-3.5 w-3.5 text-[#008737]" />
                  <span>{report.contactEmail}</span>
                </div>
              )}
            </div>

            {/* Posted */}
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Posted {new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              {report.reportedBy?.name && ` by ${report.reportedBy.name}`}
            </p>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {report.status === 'active' && (
                <button onClick={() => onResolve(report._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#008737] to-[#085558] text-white text-sm font-semibold hover:shadow-md transition-all">
                  <CheckCircle className="h-4 w-4" /> Mark Resolved
                </button>
              )}
              <button onClick={() => onDelete(report._id)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors border border-red-100">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminCommunityTab = () => {
  const [reports, setReports]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [selected, setSelected]     = useState(null);
  const [search, setSearch]         = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [stats, setStats]           = useState({ total: 0, lost: 0, found: 0, active: 0, resolved: 0 });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (filterType !== 'all')   params.set('type', filterType);
      if (filterStatus !== 'all') params.set('status', filterStatus);

      const data = await apiFetch('GET', `/lostfound?${params}`);
      setReports(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, filterType, filterStatus]);

  const fetchStats = useCallback(async () => {
    try {
      const [all, lost, found, resolved] = await Promise.all([
        apiFetch('GET', '/lostfound?limit=1'),
        apiFetch('GET', '/lostfound?type=lost&limit=1'),
        apiFetch('GET', '/lostfound?type=found&limit=1'),
        apiFetch('GET', '/lostfound?status=resolved&limit=1'),
      ]);
      setStats({
        total:    all.total    || 0,
        lost:     lost.total   || 0,
        found:    found.total  || 0,
        resolved: resolved.total || 0,
        active:   (all.total || 0) - (resolved.total || 0),
      });
    } catch (_) {}
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);
  useEffect(() => { fetchStats(); },  [fetchStats]);

  const handleResolve = async (id) => {
    try {
      await apiFetch('PUT', `/lostfound/${id}/resolve`);
      setSelected(null);
      fetchReports();
      fetchStats();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report permanently?')) return;
    try {
      await apiFetch('DELETE', `/lostfound/${id}`);
      setSelected(null);
      fetchReports();
      fetchStats();
    } catch (err) { alert(err.message); }
  };

  // Client-side search filter
  const filtered = reports.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (r.dogName  || '').toLowerCase().includes(q) ||
      (r.breed    || '').toLowerCase().includes(q) ||
      (r.location?.area || '').toLowerCase().includes(q) ||
      (r.location?.city || '').toLowerCase().includes(q) ||
      (r.contactName    || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Reports', value: stats.total,    color: 'text-[#063630]', bg: 'bg-gray-50',    border: 'border-gray-200' },
          { label: 'Lost Dogs',     value: stats.lost,     color: 'text-red-600',   bg: 'bg-red-50',     border: 'border-red-100'  },
          { label: 'Found Dogs',    value: stats.found,    color: 'text-blue-600',  bg: 'bg-blue-50',    border: 'border-blue-100' },
          { label: 'Active',        value: stats.active,   color: 'text-green-600', bg: 'bg-green-50',   border: 'border-green-100'},
          { label: 'Resolved',      value: stats.resolved, color: 'text-gray-600',  bg: 'bg-gray-50',    border: 'border-gray-200' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, breed, location..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 outline-none transition-all"
          />
        </div>
        <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#008737] outline-none text-gray-700 bg-white">
          <option value="all">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#008737] outline-none text-gray-700 bg-white">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
        </select>
        {(filterType !== 'all' || filterStatus !== 'all' || search) && (
          <button onClick={() => { setFilterType('all'); setFilterStatus('all'); setSearch(''); setPage(1); }}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#008737]/30 border-t-[#008737] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <AlertTriangle className="h-10 w-10 text-red-400 mb-3" />
            <p className="text-red-600 font-medium">{error}</p>
            <button onClick={fetchReports} className="mt-3 text-sm text-[#008737] hover:underline">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <Dog className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No reports found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Dog', 'Type', 'Location', 'Date', 'Contact', 'Posted By', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((r, i) => (
                    <motion.tr key={r._id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Dog */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {imgSrc(r.photo) ? (
                            <img src={imgSrc(r.photo)} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Dog className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-[#063630]">{r.dogName || 'Unknown'}</p>
                            <p className="text-xs text-gray-400 capitalize">{r.breed} · {r.color}</p>
                          </div>
                        </div>
                      </td>
                      {/* Type */}
                      <td className="px-4 py-3"><TypeBadge type={r.type} /></td>
                      {/* Location */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3.5 w-3.5 text-[#008737] flex-shrink-0" />
                          <span className="truncate max-w-32">{r.location?.area}, {r.location?.city}</span>
                        </div>
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      {/* Contact */}
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-700">{r.contactName}</p>
                        <p className="text-xs text-gray-400">{r.contactPhone}</p>
                      </td>
                      {/* Posted By */}
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {r.reportedBy?.name || <span className="text-gray-300 italic">Guest</span>}
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelected(r)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#063630]/5 hover:bg-[#063630]/10 text-[#063630] transition-colors" title="View details">
                            <Eye className="h-4 w-4" />
                          </button>
                          {r.status === 'active' && (
                            <button onClick={() => handleResolve(r._id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors" title="Mark resolved">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(r._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                <p className="text-sm text-gray-500">
                  Showing {((page - 1) * 10) + 1}–{Math.min(page * 10, total)} of {total} reports
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40 hover:border-[#008737] hover:text-[#008737] transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-700">{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40 hover:border-[#008737] hover:text-[#008737] transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <DetailModal
          report={selected}
          onClose={() => setSelected(null)}
          onResolve={handleResolve}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminCommunityTab;