import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dog, CheckCircle, XCircle, Clock, Eye, Trash2,
  RefreshCw, Search, Filter, ChevronDown, X,
  AlertTriangle, MapPin, User
} from 'lucide-react';
import ConfirmDeleteModal from '../Shared/ConfirmDeleteModal';

const API      = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');

const imgSrc = (url) => !url ? null : url.startsWith('http') ? url : `${BASE_URL}${url}`;

const approvalColors = {
  pending:  'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100  text-green-800  border-green-200',
  rejected: 'bg-red-100    text-red-800    border-red-200',
};

const statusColors = {
  available: 'bg-blue-100   text-blue-800',
  pending:   'bg-yellow-100 text-yellow-800',
  adopted:   'bg-purple-100 text-purple-800',
  inactive:  'bg-gray-100   text-gray-800',
};

// ── Main Component ─────────────────────────────────────────
const AdminPetManagement = () => {
  const navigate = useNavigate();
  const [pets, setPets]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filterApproval, setFilterApproval] = useState('');
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast]           = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchPets = async (p = 1) => {
    setLoading(true);
    try {
      const token  = localStorage.getItem('token');
      const params = new URLSearchParams({ page: p, limit: 15 });
      if (filterApproval) params.set('adminApproval', filterApproval);
      if (search)         params.set('breed', search);

      const res  = await fetch(`${API}/pets/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPets(data.data);
        setTotalPages(data.totalPages);
        setPage(data.currentPage);
      }
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPets(page); }, [filterApproval, page]);

  const handleAction = async (petId, decision, adminNote) => {
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/pets/admin/${petId}/approval`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ adminApproval: decision, adminNote }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast(`Pet ${decision} successfully`);
      fetchPets(page);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/pets/${deleteTarget}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Delete failed'); return; }
      setPets(prev => prev.filter(p => p._id !== deleteTarget));
      showToast('Listing deleted');
    } catch { showToast('Delete failed'); } finally { setDeleteTarget(null); }
  };

  const filteredPets = pets.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.breed.toLowerCase().includes(search.toLowerCase()) ||
    p.rehomer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#063630] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDeleteModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Listing?"
        message="This action cannot be undone. Are you sure you want to permanently delete this listing?"
      />







      {/* Search + filter bar */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-4 items-center mb-6">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, breed or rehomer..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#085558]" />
        </div>
        <select value={filterApproval} onChange={e => { setFilterApproval(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#008737] bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors">
          <option value="">All Statuses</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#085558] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-16">
            <Dog className="h-14 w-14 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No listings found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Dog</th>
                <th className="text-left px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Rehomer</th>
                <th className="text-left px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Location</th>
                <th className="text-left px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Applications</th>
                <th className="text-left px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Approval</th>
                <th className="text-left px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Status</th>
                <th className="text-left px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Listed</th>
                <th className="text-left px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPets.map((pet) => (
                <tr key={pet._id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-[#085558]/20 to-[#008737]/20 flex items-center justify-center flex-shrink-0 shadow-sm border border-white">
                        {pet.primaryImage
                          ? <img src={imgSrc(pet.primaryImage)} alt={pet.name} className="w-full h-full object-cover" />
                          : <Dog className="h-5 w-5 text-[#085558]/40" />
                        }
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{pet.name}</p>
                        <p className="text-gray-500 text-xs font-medium mt-0.5">{pet.breed.split(' ')[0]} • {pet.age?.value}{pet.age?.unit[0]} • {pet.gender.slice(0,1).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-700">{pet.rehomer?.name || '—'}</p>
                    <p className="text-gray-400 text-xs font-medium mt-0.5">{pet.rehomer?.phone || ''}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium text-sm">
                    {[pet.location?.city, pet.location?.state].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#085558] bg-[#085558]/10 px-3 py-1 rounded-lg">{pet.applications?.length || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border capitalize ${approvalColors[pet.adminApproval]}`}>
                      {pet.adminApproval}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider capitalize ${statusColors[pet.status] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                      {pet.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium text-sm">
                    {new Date(pet.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <button onClick={() => navigate(`/admin/pets/${pet._id}`)}
                        title="Review & Audit Details"
                        className="p-2.5 text-gray-400 hover:text-[#085558] hover:bg-[#085558]/10 rounded-xl transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      {pet.adminApproval === 'pending' && (
                        <>
                          <button onClick={() => handleAction(pet._id, 'approved', '')}
                            title="Quick approve"
                            className="p-2.5 text-gray-400 hover:text-[#008737] hover:bg-[#008737]/10 rounded-xl transition-colors">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleAction(pet._id, 'rejected', '')}
                            title="Quick reject"
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => setDeleteTarget(pet._id)}
                        title="Delete listing"
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                Previous
              </button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPetManagement;