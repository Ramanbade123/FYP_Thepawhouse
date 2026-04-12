import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dog, RefreshCw, CheckCircle, XCircle, Eye, Clock, User, Trash2, MessageSquare } from 'lucide-react';
import ConfirmDeleteModal from '../../Shared/ConfirmDeleteModal';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
const imgSrc = (url) => {
  if (!url || url.trim() === '') return null;
  let fullUrl = url;
  if (!url.startsWith('http') && !url.startsWith('/')) {
    fullUrl = `/uploads/users/${url}`; // mostly user profiles here
  }
  return fullUrl.startsWith('http') ? fullUrl : `${BASE_URL}${fullUrl}`;
};

const statusColor = {
  pending:   'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100   text-blue-800',
  approved:  'bg-green-100  text-green-800',
  rejected:  'bg-red-100    text-red-800',
};



const ApplicationsTab = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const [pets, setPets]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null); // { petId, appId }

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/pets/rehomer/my-listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        // Flatten: attach petName to each application
        const enriched = data.data.map(pet => ({
          petId:   pet._id,
          petName: pet.name,
          petImage: pet.primaryImage,
          apps: pet.applications.map(a => ({ ...a, petName: pet.name, petId: pet._id })),
        })).filter(p => p.apps.length > 0);
        setPets(enriched);
      }
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleAction = async (petId, appId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/pets/${petId}/applications/${appId}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status }),
      });
      fetchApplications();
    } catch {}
  };

  const handleMessage = async (petId, adopterId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/messages/start-rehomer`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ petId, adopterId }),
      });
      const data = await res.json();
      if (data.success) {
        if (setActiveTab) setActiveTab('messages');
      } else {
        alert(data.error || 'Failed to start conversation');
      }
    } catch (err) {
      alert('Network error while starting conversation');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/pets/${deleteTarget.petId}/applications/${deleteTarget.appId}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchApplications();
    } catch {} finally {
      setDeleteTarget(null);
    }
  };

  // Flatten all apps for filtering
  const allApps = pets.flatMap(p => p.apps);
  const filtered = filter === 'all' ? allApps : allApps.filter(a => a.status === filter);

  const counts = {
    all:       allApps.length,
    pending:   allApps.filter(a => a.status === 'pending').length,
    reviewing: allApps.filter(a => a.status === 'reviewing').length,
    approved:  allApps.filter(a => a.status === 'approved').length,
    rejected:  allApps.filter(a => a.status === 'rejected').length,
  };

  return (
    <div>
      <ConfirmDeleteModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Application?"
        message="This action cannot be undone. Are you sure you want to remove this application permanently?"
      />



      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#063630]">Applications</h2>
        </div>
        <button onClick={fetchApplications}
          className="p-2 text-gray-400 hover:text-[#085558] rounded-lg hover:bg-gray-100 transition-colors">
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all',       label: 'All'       },
          { key: 'pending',   label: 'Pending'   },
          { key: 'reviewing', label: 'Reviewing' },
          { key: 'approved',  label: 'Approved'  },
          { key: 'rejected',  label: 'Rejected'  },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === key
                ? 'bg-gradient-to-r from-[#085558] to-[#008737] text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#085558]'
            }`}>
            {label} <span className="ml-1 opacity-70">({counts[key]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#085558] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : allApps.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-16 text-center border border-gray-100">
          <Dog className="h-14 w-14 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-400 mb-2">No applications yet</h3>
          <p className="text-gray-400 text-sm">Applications from adopters will appear here once your dogs are approved and listed.</p>
        </div>
      ) : filtered.length === 0 ? (
         <div className="bg-white rounded-xl shadow-lg p-16 text-center border border-gray-100">
          <h3 className="text-lg font-bold text-gray-400 mb-2">No applications found</h3>
          <p className="text-gray-400 text-sm">There are no applications matching the selected filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Applicant</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Dog</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Message</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Payment</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((app, i) => (
                <motion.tr key={app._id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {app.adopter?.profileImage && app.adopter.profileImage.trim() !== '' ? (
                        <img src={imgSrc(app.adopter.profileImage)} alt={app.adopter.name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {app.adopter?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{app.adopter?.name || 'Unknown'}</p>
                        <p className="text-gray-400 text-xs">{app.adopter?.email || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium text-[#063630]">{app.petName}</td>
                  <td className="px-5 py-3 text-gray-500 max-w-xs truncate">
                    {app.message || <span className="italic text-gray-300">No message</span>}
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      app.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                      app.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {app.paymentStatus || 'unpaid'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[app.status]}`}>
                      {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate('/application/review', { state: { app, petId: app.petId } })}
                        className="flex items-center gap-1 px-3 py-1.5 text-[#085558] border border-[#085558]/30 rounded-lg hover:bg-[#085558]/10 transition-colors text-xs font-medium"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ petId: app.petId, appId: app._id })}
                        className="flex items-center gap-1 px-3 py-1.5 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-xs font-medium"
                        title="Delete Application"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
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

export default ApplicationsTab;