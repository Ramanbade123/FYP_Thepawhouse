import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dog, CheckCircle, XCircle, Clock, Eye, Trash2,
  RefreshCw, Search, Filter, ChevronDown, X,
  AlertTriangle, MapPin, User
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// ── Detail / Approval Modal ────────────────────────────────
const PetDetailModal = ({ pet, onClose, onAction }) => {
  const [note, setNote]       = useState(pet.adminNote || '');
  const [loading, setLoading] = useState(false);

  const act = async (decision) => {
    setLoading(true);
    await onAction(pet._id, decision, note);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#085558] to-[#008737] rounded-xl flex items-center justify-center">
              <Dog className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#063630]">{pet.name}</h2>
              <p className="text-sm text-gray-500">{pet.breed} • {pet.age?.value} {pet.age?.unit}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5 text-gray-500" /></button>
        </div>

        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Image */}
          {pet.primaryImage && (
            <img src={pet.primaryImage} alt={pet.name}
              className="w-full h-48 object-cover rounded-xl" />
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ['Gender',       pet.gender],
              ['Size',         pet.size],
              ['Color',        pet.color || '—'],
              ['Activity',     pet.activityLevel],
              ['Fee',          pet.rehomingFee ? `NPR ${pet.rehomingFee}` : 'Free'],
              ['Urgency',      pet.urgency],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-500 text-xs">{label}</span>
                <p className="font-semibold text-[#063630] capitalize mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          {/* Health */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Health</p>
            <div className="flex gap-2 flex-wrap">
              {pet.vaccinated   && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">✓ Vaccinated</span>}
              {pet.neutered     && <span className="px-2 py-1 bg-blue-100  text-blue-700  text-xs rounded-full">✓ Neutered</span>}
              {pet.microchipped && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">✓ Microchipped</span>}
              {!pet.vaccinated && !pet.neutered && !pet.microchipped && <span className="text-gray-400 text-xs">No health info provided</span>}
            </div>
          </div>

          {/* Good with */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Good with</p>
            <div className="flex gap-2 flex-wrap">
              {pet.goodWithKids && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">👶 Kids</span>}
              {pet.goodWithDogs && <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">🐕 Dogs</span>}
              {pet.goodWithCats && <span className="px-2 py-1 bg-pink-100   text-pink-700   text-xs rounded-full">🐈 Cats</span>}
              {!pet.goodWithKids && !pet.goodWithDogs && !pet.goodWithCats && <span className="text-gray-400 text-xs">Not specified</span>}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Description</p>
            <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3">{pet.description}</p>
          </div>

          {/* Reason */}
          {pet.reason && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Reason for Rehoming</p>
              <p className="text-gray-600 text-sm bg-amber-50 rounded-lg p-3">{pet.reason}</p>
            </div>
          )}

          {/* Rehomer info */}
          <div className="bg-[#085558]/5 rounded-lg p-4">
            <p className="text-sm font-semibold text-[#063630] mb-2 flex items-center gap-2">
              <User className="h-4 w-4" /> Rehomer
            </p>
            <p className="text-sm text-gray-700">{pet.rehomer?.name}</p>
            <p className="text-xs text-gray-500">{pet.rehomer?.email}</p>
            <p className="text-xs text-gray-500">{pet.rehomer?.phone}</p>
          </div>

          {/* Location */}
          {(pet.location?.city || pet.location?.state) && (
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              {[pet.location.city, pet.location.state].filter(Boolean).join(', ')}
            </p>
          )}

          {/* Admin note box */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Admin Note <span className="font-normal text-gray-400">(shown to rehomer if rejected)</span>
            </label>
            <textarea
              value={note} onChange={e => setNote(e.target.value)} rows={3}
              placeholder="Optional: explain why you're approving or rejecting this listing..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#085558] resize-none"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => act('rejected')} disabled={loading}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ color: '#ffffff' }}>
            <XCircle className="h-4 w-4" style={{ color: '#ffffff' }} />
            {loading ? 'Saving...' : 'Reject'}
          </button>
          <button onClick={() => act('approved')} disabled={loading}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-medium hover:shadow-md transition-shadow disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ color: '#ffffff' }}>
            <CheckCircle className="h-4 w-4" style={{ color: '#ffffff' }} />
            {loading ? 'Saving...' : 'Approve'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────
const AdminPetManagement = () => {
  const [pets, setPets]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [summary, setSummary]       = useState({ pending: 0, approved: 0, rejected: 0 });
  const [selectedPet, setSelectedPet] = useState(null);
  const [filterApproval, setFilterApproval] = useState('');
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast]           = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchPets = async () => {
    setLoading(true);
    try {
      const token  = localStorage.getItem('token');
      const params = new URLSearchParams({ page, limit: 15 });
      if (filterApproval) params.set('adminApproval', filterApproval);
      if (search)         params.set('breed', search);

      const res  = await fetch(`${API}/pets/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPets(data.data);
        setSummary(data.summary);
        setTotalPages(data.totalPages);
      }
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPets(); }, [filterApproval, page]);

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
      fetchPets();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (petId) => {
    if (!window.confirm('Permanently delete this listing?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/pets/${petId}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(prev => prev.filter(p => p._id !== petId));
      showToast('Listing deleted');
    } catch { showToast('Delete failed'); }
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

      {/* Detail modal */}
      {selectedPet && (
        <PetDetailModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onAction={handleAction}
        />
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pet Listings</h2>
          <p className="text-gray-500 text-sm mt-1">Review and approve rehomer submissions</p>
        </div>
        <button onClick={fetchPets}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Review', count: summary.pending,  color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock,       key: 'pending'  },
          { label: 'Approved',       count: summary.approved, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  icon: CheckCircle, key: 'approved' },
          { label: 'Rejected',       count: summary.rejected, color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    icon: XCircle,     key: 'rejected' },
        ].map(({ label, count, color, bg, border, icon: Icon, key }) => (
          <button key={key}
            onClick={() => { setFilterApproval(filterApproval === key ? '' : key); setPage(1); }}
            className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
              filterApproval === key ? `${bg} ${border}` : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className={`h-5 w-5 ${color}`} />
              {filterApproval === key && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Active filter</span>}
            </div>
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
            <p className="text-gray-600 text-sm">{label}</p>
          </button>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, breed or rehomer..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#085558]" />
        </div>
        <select value={filterApproval} onChange={e => { setFilterApproval(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#085558]">
          <option value="">All Statuses</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Dog</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Rehomer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Location</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Applications</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Approval</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Listed</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPets.map((pet) => (
                <tr key={pet._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-[#085558]/20 to-[#008737]/20 flex items-center justify-center flex-shrink-0">
                        {pet.primaryImage
                          ? <img src={pet.primaryImage} alt={pet.name} className="w-full h-full object-cover" />
                          : <Dog className="h-5 w-5 text-[#085558]/40" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{pet.name}</p>
                        <p className="text-gray-500 text-xs">{pet.breed} • {pet.age?.value} {pet.age?.unit} • {pet.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-700">{pet.rehomer?.name || '—'}</p>
                    <p className="text-gray-400 text-xs">{pet.rehomer?.phone || ''}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {[pet.location?.city, pet.location?.state].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-[#085558]">{pet.applications?.length || 0}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${approvalColors[pet.adminApproval]}`}>
                      {pet.adminApproval}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(pet.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedPet(pet)}
                        title="Review & approve/reject"
                        className="p-2 text-gray-400 hover:text-[#085558] hover:bg-[#085558]/10 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      {pet.adminApproval === 'pending' && (
                        <>
                          <button onClick={() => handleAction(pet._id, 'approved', '')}
                            title="Quick approve"
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleAction(pet._id, 'rejected', '')}
                            title="Quick reject"
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(pet._id)}
                        title="Delete listing"
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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