import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle, Eye, CheckCircle, XCircle, Search, Filter,
  Shield, User, Mail, Phone, ChevronLeft, ChevronRight, MapPin
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

const STATUS_STYLES = {
  pending:  { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  verified: { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  rejected: { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500'    },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text} capitalize`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

// ── Detail Modal ───────────────────────────────────────────────────────────────
const VerificationModal = ({ user, onClose, onUpdate, updating }) => {
  const [notes, setNotes] = useState(user?.verificationNotes || '');

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h3 className="text-lg font-bold text-[#063630]">Verification Details</h3>
            <p className="text-xs text-gray-400 mt-0.5">User ID: #{user._id?.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-5">
          {/* User Info Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={user.profileImage?.startsWith('http') ? user.profileImage : `${BASE_URL}${user.profileImage}`} 
                alt={user.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name); }}
              />
              <div>
                <h4 className="text-xl font-bold text-[#063630]">{user.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold capitalize">
                    {user.role} ({user.userType})
                  </span>
                  <StatusBadge status={user.verificationStatus} />
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> Contact Profile
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400"/> {user.email}</p>
              <p className="text-sm text-gray-700 flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400"/> {user.phone}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Address
              </p>
              <p className="text-sm font-semibold text-gray-700">{user.address?.street}</p>
              <p className="text-sm text-gray-600">{user.address?.city}{(user.address?.state || user.address?.zipCode) && ','} {user.address?.state} {user.address?.zipCode}</p>
              <p className="text-sm text-gray-500">{user.address?.country}</p>
            </div>
          </div>

          {/* Documents */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1">
               <Shield className="h-3.5 w-3.5" /> Verification Documents
            </p>
            {user.verificationDocuments && user.verificationDocuments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.verificationDocuments.map((doc, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden group relative bg-gray-50">
                    <a href={doc.startsWith('http') ? doc : `${BASE_URL}${doc}`} target="_blank" rel="noopener noreferrer" className="block p-2 text-center text-sm font-medium text-[#008737] hover:underline">
                       View Document {idx + 1}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-700">
                No verification documents uploaded.
              </div>
            )}
          </div>

          {/* Admin Notes */}
          <div className="border border-gray-200 rounded-xl p-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Admin Notes (visible to user on rejection)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              rows={3} placeholder="Add notes (e.g. 'ID is blurry, please re-upload')"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737] resize-none" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex flex-wrap gap-2 justify-between sticky bottom-0 bg-white rounded-b-2xl">
           <div className="flex gap-2">
             <button onClick={onClose}
               className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
               Cancel
             </button>
           </div>
           <div className="flex gap-2">
             <button onClick={() => onUpdate(user._id, 'rejected', notes)} disabled={updating}
               className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50">
               <XCircle className="h-4 w-4" /> Reject
             </button>
             <button onClick={() => onUpdate(user._id, 'verified', notes)} disabled={updating}
               className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-50">
               <CheckCircle className="h-4 w-4" /> Approve
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const AdminVerificationsTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [flash, setFlash] = useState('');
  const LIMIT = 15;

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (statusFilter) params.set('verificationStatus', statusFilter);
      // If we are looking for pending, we typically want users who have at least uploaded documents,
      // but to keep it simple we just query by verificationStatus
      if (roleFilter) params.set('role', roleFilter);
      
      const data = await apiFetch('GET', `/users?${params}`);
      
      // We'll filter clientside if they search, but fetch server side
      const filteredData = data.data.filter(u => u.verificationDocuments && u.verificationDocuments.length > 0 || u.verificationStatus !== 'pending');
      
      setUsers(filteredData || []);
      setTotal(data.total || 0); // Note: server total won't match frontend exact if filtered like above
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, roleFilter]);

  useEffect(() => { fetchVerifications(); }, [fetchVerifications]);

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(''), 3000); };

  const handleUpdate = async (id, status, notes) => {
    setUpdating(true);
    try {
      await apiFetch('PUT', `/users/${id}`, { 
        verificationStatus: status, 
        isVerified: status === 'verified',
        verificationNotes: notes 
      });
      showFlash(`User successfully ${status}.`);
      setSelected(null);
      fetchVerifications();
    } catch (e) { showFlash(`Error: ${e.message}`); }
    finally { setUpdating(false); }
  };

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  const timeAgo = (d) => {
    if (!d) return 'N/A';
    const diff = (Date.now() - new Date(d)) / 1000;
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div>
      {/* Flash */}
      {flash && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium transition-all">
          {flash}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-gray-200 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="flex-1 text-sm outline-none bg-transparent" />
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-sm outline-none bg-transparent">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="text-sm outline-none bg-transparent capitalize">
            <option value="">All Roles</option>
            <option value="adopter">Adopter</option>
            <option value="rehomer">Rehomer</option>
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
            <Shield className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No verifications found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {['User Info', 'Role', 'Status', 'Submitted', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={u.profileImage?.startsWith('http') ? u.profileImage : `${BASE_URL}${u.profileImage}`} 
                          alt="" 
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.name); }}
                        />
                        <div>
                          <p className="font-medium text-[#063630] text-sm">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full capitalize">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={u.verificationStatus} />
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {timeAgo(u.updatedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(u)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#008737] bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <Eye className="h-3.5 w-3.5" /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination - omitted complex logic for this simplified file, but controls remain */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">
                <ChevronLeft className="h-4 w-4" /> Prev
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
        <VerificationModal
          user={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
          updating={updating}
        />
      )}
    </div>
  );
};

export default AdminVerificationsTab;
