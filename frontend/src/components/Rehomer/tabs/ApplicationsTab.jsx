import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dog, RefreshCw, CheckCircle, XCircle, Eye, Clock, User } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusColor = {
  pending:   'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100   text-blue-800',
  approved:  'bg-green-100  text-green-800',
  rejected:  'bg-red-100    text-red-800',
};

// Modal to view application detail + approve/reject
const AppDetailModal = ({ app, petId, onClose, onAction }) => {
  const [loading, setLoading] = useState(false);

  const act = async (status) => {
    setLoading(true);
    await onAction(petId, app._id, status);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#063630]">{app.adopter?.name}</h3>
            <p className="text-sm text-gray-500">{app.adopter?.email}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Applied for</span><span className="font-semibold text-[#063630]">{app.petName}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Phone</span><span>{app.adopter?.phone || '—'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Applied on</span><span>{new Date(app.appliedAt).toLocaleDateString()}</span></div>
          <div className="flex justify-between items-center"><span className="text-gray-500">Status</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[app.status]}`}>
              {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
            </span>
          </div>
        </div>

        {app.message && (
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-1">Message from applicant</p>
            <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3 italic">"{app.message}"</p>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50">
            Close
          </button>
          {app.status === 'pending' || app.status === 'reviewing' ? (
            <>
              <button onClick={() => act('rejected')} disabled={loading}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-60"
                style={{ color: '#ffffff' }}>
                <XCircle className="h-4 w-4 inline mr-1" style={{ color: '#ffffff' }} />
                Reject
              </button>
              <button onClick={() => act('approved')} disabled={loading}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-medium hover:shadow-md disabled:opacity-60"
                style={{ color: '#ffffff' }}>
                <CheckCircle className="h-4 w-4 inline mr-1" style={{ color: '#ffffff' }} />
                Approve
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ApplicationsTab = () => {
  const [pets, setPets]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null); // { app, petId, petName }
  const [filter, setFilter]     = useState('all');

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
      {selected && (
        <AppDetailModal
          app={selected.app}
          petId={selected.petId}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#063630]">Applications</h2>
          <p className="text-gray-500 mt-1">Review and respond to adoption requests for your dogs.</p>
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
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-16 text-center border border-gray-100">
          <Dog className="h-14 w-14 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-400 mb-2">No applications yet</h3>
          <p className="text-gray-400 text-sm">Applications from adopters will appear here once your dogs are approved and listed.</p>
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
                      <div className="w-8 h-8 bg-gradient-to-br from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {app.adopter?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
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
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[app.status]}`}>
                      {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setSelected({ app, petId: app.petId })}
                      className="flex items-center gap-1 px-3 py-1.5 text-[#085558] border border-[#085558]/30 rounded-lg hover:bg-[#085558]/10 transition-colors text-xs font-medium"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
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