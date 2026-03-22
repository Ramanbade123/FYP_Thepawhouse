import { useState, useEffect } from 'react';
import { RefreshCw, ChevronRight, Trash2, ChevronLeft, Search } from 'lucide-react';

const API      = 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');

const imgSrc = (url, updatedAt) => {
  if (!url || url === 'default-profile.jpg') return null;
  const base = url.startsWith('http')
    ? url
    : url.startsWith('/')
      ? `${BASE_URL}${url}`
      : `${BASE_URL}/uploads/users/${url}`;
  const bust  = updatedAt ? new Date(updatedAt).getTime() : Date.now();
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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data  = await res.json();
      if (!data.success) throw new Error(data.error);
      fetchUsers(page);
    } catch (err) { alert(err.message); }
    finally { setDeleting(null); }
  };

  return (
    <div>
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
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#085558] to-[#008737] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                        {imgSrc(u.profileImage, u.updatedAt)
                          ? <img src={imgSrc(u.profileImage, u.updatedAt)} alt={u.name} className="w-full h-full object-cover" />
                          : u.name?.slice(0,2).toUpperCase()
                        }
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${roleColor[u.role] || 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {u.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {!preview && (
                    <td className="py-3">
                      <button onClick={() => handleDelete(u._id, u.name)} disabled={deleting === u._id}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                        {deleting === u._id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
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