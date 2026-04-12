import { useState, useEffect } from 'react';
import { RefreshCw, ChevronRight, Trash2, ChevronLeft, Search, Ban, ShieldCheck } from 'lucide-react';
import ConfirmDeleteModal from '../Shared/ConfirmDeleteModal';

const API      = 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');

const imgSrc = (url, updatedAt) => {
  if (!url || url === 'default-profile.jpg') return null;
  let fullUrl = url;
  if (!url.startsWith('http') && !url.startsWith('/')) {
    fullUrl = `/uploads/users/${url}`;
  }
  const base = fullUrl.startsWith('http') ? fullUrl : `${BASE_URL}${fullUrl}`;
  const bust = updatedAt ? new Date(updatedAt).getTime() : Date.now();
  return `${base}?t=${bust}`;
};

const roleColor = {
  adopter: 'bg-blue-100 text-blue-700',
  rehomer: 'bg-purple-100 text-purple-700',
  admin:   'bg-red-100 text-red-700',
};

const RecentUsersTable = ({ preview = true, onManageUsers }) => {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const [deleting, setDeleting]   = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

  const fetchUsers = async (p = 1, s = search, r = roleFilter) => {
    setLoading(true); setError('');
    try {
      const token  = localStorage.getItem('token');
      const params = new URLSearchParams({ page: p, limit: preview ? 5 : 10 });
      if (r) params.set('role', r);
      const res  = await fetch(`${API}/users?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      // client-side name search
      const filtered = s
        ? data.data.filter(u => u.name?.toLowerCase().includes(s.toLowerCase()) || u.email?.toLowerCase().includes(s.toLowerCase()))
        : data.data;
      setUsers(filtered);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setPage(p);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/users/${deleteTarget.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data  = await res.json();
      if (!data.success) throw new Error(data.error);
      fetchUsers(page);
    } catch (err) { alert(err.message); }
    finally { setDeleting(null); setDeleteTarget(null); }
  };

  const handleToggleStatus = async (userId) => {
    setStatusLoading(userId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      fetchUsers(page);
    } catch (err) { alert(err.message); }
    finally { setStatusLoading(userId === statusLoading ? null : statusLoading); }
  };

  return (
    <div>
      <ConfirmDeleteModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete User?"
        message={`This action cannot be undone. Are you sure you want to permanently delete user "${deleteTarget?.name}"?`}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        {preview ? (
          <>
            <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
            <button onClick={onManageUsers} className="text-sm text-[#085558] hover:text-[#063630] flex items-center gap-1 font-medium">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search name or email..." value={search}
                  onChange={e => { setSearch(e.target.value); fetchUsers(1, e.target.value, roleFilter); }}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] w-56" />
              </div>
              {/* Role filter */}
              <select value={roleFilter}
                onChange={e => { setRoleFilter(e.target.value); fetchUsers(1, search, e.target.value); }}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737]">
                <option value="">All Roles</option>
                <option value="adopter">Adopters</option>
                <option value="rehomer">Rehomers</option>
                <option value="admin">Admins</option>
              </select>
              <button onClick={() => fetchUsers(page)} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50">
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-10"><RefreshCw className="h-6 w-6 text-gray-300 animate-spin" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm py-4 text-center">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-gray-400 text-sm py-8 text-center">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['User', 'Role', 'Joined', 'Status', ...(preview ? [] : ['Actions'])].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 border-t border-gray-100">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="py-4 pr-4 pl-2">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#085558] to-[#008737] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm overflow-hidden">
                        {imgSrc(u.profileImage, u.updatedAt)
                          ? <img src={imgSrc(u.profileImage, u.updatedAt)} alt={u.name} className="w-full h-full object-cover" />
                          : u.name?.slice(0,2).toUpperCase()
                        }
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                      u.role === 'adopter' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      u.role === 'rehomer' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>{u.role}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm font-medium text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${u.isActive !== false ? 'bg-[#008737]' : 'bg-red-500'}`}></div>
                      <span className={`text-sm font-semibold ${u.isActive !== false ? 'text-[#063630]' : 'text-gray-500'}`}>
                        {u.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  {!preview && (
                    <td className="py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleToggleStatus(u._id)} 
                          disabled={statusLoading === u._id}
                          title={u.isActive !== false ? 'Ban User' : 'Unban User'}
                          className={`p-2 rounded-xl transition-all ${
                            u.isActive !== false 
                            ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50' 
                            : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                          }`}
                        >
                          {statusLoading === u._id ? <RefreshCw className="h-4 w-4 animate-spin" /> : (
                            u.isActive !== false ? <Ban className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />
                          )}
                        </button>
                        <button onClick={() => setDeleteTarget({ id: u._id, name: u.name })} disabled={deleting === u._id}
                          title="Delete Permanently"
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40">
                          {deleting === u._id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination (full view only) */}
      {!preview && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => fetchUsers(page - 1)}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button disabled={page === totalPages} onClick={() => fetchUsers(page + 1)}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentUsersTable;