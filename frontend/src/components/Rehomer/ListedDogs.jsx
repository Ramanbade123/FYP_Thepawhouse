import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Dog, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';


const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusColor = {
  available: 'bg-green-100 text-green-800',
  pending:   'bg-yellow-100 text-yellow-800',
  adopted:   'bg-blue-100 text-blue-800',
  inactive:  'bg-gray-100 text-gray-800',
};

const approvalBadge = {
  pending:  { cls: 'bg-yellow-50 text-yellow-700 border border-yellow-200', icon: Clock,       label: 'Awaiting Admin Approval' },
  approved: { cls: 'bg-green-50  text-green-700  border border-green-200',  icon: CheckCircle, label: 'Approved'                },
  rejected: { cls: 'bg-red-50    text-red-700    border border-red-200',    icon: XCircle,     label: 'Rejected by Admin'       },
};

const ListedDogs = ({ onStatsChange }) => {
  const navigate = useNavigate();
  const [dogs, setDogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [editDog, setEditDog] = useState(null);

  const fetchMyDogs = async () => {
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/pets/rehomer/my-listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDogs(data.data);
      if (onStatsChange) onStatsChange(data.stats);
    } catch (err) {
      setError(err.message || 'Failed to load your listings');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchMyDogs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this listing permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/pets/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDogs(prev => prev.filter(d => d._id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <>
      {editDog && (
        <EditDogForm
          dog={editDog}
          onClose={() => setEditDog(null)}
          onSuccess={() => { fetchMyDogs(); setEditDog(null); }}
        />
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#063630]">Your Listed Dogs</h2>
          <div className="flex items-center gap-2">
            <button onClick={fetchMyDogs}
              className="p-2 text-gray-400 hover:text-[#085558] rounded-lg hover:bg-gray-100 transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/list-dog')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-lg font-medium hover:shadow-md transition-shadow"
              style={{ color: '#ffffff' }}
            >
              <Plus className="h-4 w-4" style={{ color: '#ffffff' }} /> List New Dog
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3 mb-5 text-sm text-blue-700">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>New listings must be <strong>approved by an admin</strong> before they appear to adopters.</span>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#085558] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-3">{error}</p>
            <button onClick={fetchMyDogs} className="text-[#085558] underline text-sm">Try again</button>
          </div>
        )}

        {!loading && !error && dogs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#085558]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dog className="h-8 w-8 text-[#085558]" />
            </div>
            <h3 className="font-bold text-[#063630] mb-2">No dogs listed yet</h3>
            <p className="text-gray-500 text-sm mb-4">List your first dog to find them a loving home.</p>
            <button
              onClick={() => navigate('/list-dog')}
              className="px-6 py-2 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-lg font-medium"
              style={{ color: '#ffffff' }}
            >
              List a Dog
            </button>
          </div>
        )}

        {!loading && !error && dogs.length > 0 && (
          <div className="space-y-4">
            {dogs.map((dog, i) => {
              const badge    = approvalBadge[dog.adminApproval] || approvalBadge.pending;
              const BadgeIcon = badge.icon;
              return (
                <motion.div key={dog._id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-[#085558]/20 to-[#008737]/20 flex items-center justify-center flex-shrink-0">
                      {dog.primaryImage
                        ? <img src={dog.primaryImage} alt={dog.name} className="w-full h-full object-cover" />
                        : <Dog className="h-7 w-7 text-[#085558]" />
                      }
                    </div>
                    <div>
                      <h3 className="font-bold text-[#063630]">{dog.name}</h3>
                      <p className="text-gray-600 text-sm">{dog.breed} • {dog.age?.value} {dog.age?.unit}</p>
                      <p className="text-gray-400 text-xs">{[dog.location?.city, dog.location?.state].filter(Boolean).join(', ')}</p>
                      <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
                        <BadgeIcon className="h-3 w-3" /> {badge.label}
                      </span>
                      {dog.adminApproval === 'rejected' && dog.adminNote && (
                        <p className="text-red-600 text-xs mt-1">Note: {dog.adminNote}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[dog.status] || 'bg-gray-100 text-gray-800'}`}>
                        {dog.status?.charAt(0).toUpperCase() + dog.status?.slice(1)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {dog.applications?.length || 0} application{dog.applications?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setEditDog(dog)}
                        className="p-2 text-gray-400 hover:text-[#085558] rounded-lg hover:bg-[#085558]/10 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(dog._id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ListedDogs;