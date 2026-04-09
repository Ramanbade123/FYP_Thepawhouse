import { useState, useEffect } from 'react';
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

// Modal to view application detail + approve/reject
const InfoRow = ({ label, value }) => value ? (
  <div className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
    <span className="text-gray-400 text-xs">{label}</span>
    <span className="text-gray-700 text-xs font-medium text-right max-w-[60%]">{value}</span>
  </div>
) : null;

const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    green:  'bg-green-100 text-green-700',
    blue:   'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    gray:   'bg-gray-100 text-gray-600',
    teal:   'bg-teal-100 text-teal-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

const SectionCard = ({ title, icon, children }) => (
  <div className="bg-gray-50 rounded-xl p-3.5">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
      <span>{icon}</span>{title}
    </p>
    {children}
  </div>
);
const AppDetailModal = ({ app, petId, onClose, onAction, onMessage }) => {
  const [loading, setLoading] = useState(false);
  const a = app.adopter || {};
  const prefs = a.adoptionPreferences || {};

  const act = async (status) => {
    setLoading(true);
    await onAction(petId, app._id, status);
    setLoading(false);
    onClose();
  };

  const handleMessage = async () => {
    setLoading(true);
    await onMessage(petId, a._id);
    setLoading(false);
    onClose();
  };

  const fullAddress = [a.address?.street, a.address?.city, a.address?.state]
    .filter(Boolean).join(', ');

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header banner */}
        <div className="bg-gradient-to-r from-[#085558] to-[#008737] p-5 flex items-center gap-4">
          {a.profileImage && a.profileImage.trim() !== '' && a.profileImage !== 'default-profile.jpg' ? (
            <img src={imgSrc(a.profileImage)} alt={a.name}
              className="w-16 h-16 rounded-full object-cover border-3 border-white/30 flex-shrink-0 shadow-lg" />
          ) : (
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white/30">
              <span className="text-white font-bold text-2xl">
                {a.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg leading-tight">{a.name || 'Unknown Applicant'}</h3>
            <p className="text-white/70 text-sm truncate">{a.email}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {a.userType && <Badge color="teal">{a.userType.charAt(0).toUpperCase() + a.userType.slice(1)}</Badge>}
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[app.status]}`}>
                {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3 max-h-[65vh] overflow-y-auto">

          {/* Application info */}
          <SectionCard title="Application Details" icon="📋">
            <InfoRow label="Applied for"  value={app.petName} />
            <InfoRow label="Applied on"   value={new Date(app.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
            <InfoRow label="Member since" value={a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null} />
            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-400 text-xs">Payment Status</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                app.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                app.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-gray-100 text-gray-500'
              }`}>
                {app.paymentStatus || 'unpaid'}
              </span>
            </div>
          </SectionCard>

          {/* Contact info */}
          <SectionCard title="Contact Information" icon="📞">
            <InfoRow label="Phone"   value={a.phone} />
            <InfoRow label="Email"   value={a.email} />
            <InfoRow label="Address" value={fullAddress || null} />
            {!fullAddress && <p className="text-xs text-gray-300 italic">No address provided</p>}
          </SectionCard>

          {/* Living situation */}
          {(prefs.houseType || prefs.activityLevel || prefs.experienceLevel) && (
            <SectionCard title="Living Situation" icon="🏠">
              <InfoRow label="Home type"       value={prefs.houseType ? prefs.houseType.charAt(0).toUpperCase() + prefs.houseType.slice(1) : null} />
              <InfoRow label="Activity level"  value={prefs.activityLevel ? prefs.activityLevel.charAt(0).toUpperCase() + prefs.activityLevel.slice(1) : null} />
              <InfoRow label="Experience"      value={prefs.experienceLevel ? prefs.experienceLevel.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()) : null} />
              <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-100">
                {prefs.hasYard       && <Badge color="green">Has Yard</Badge>}
                {prefs.hasOtherPets  && <Badge color="orange">Has Other Pets</Badge>}
                {prefs.hasChildren   && <Badge color="blue">Has Children</Badge>}
                {!prefs.hasYard && !prefs.hasOtherPets && !prefs.hasChildren &&
                  <span className="text-xs text-gray-300 italic">No lifestyle tags</span>}
              </div>
            </SectionCard>
          )}

          {/* Message */}
          {app.message && (
            <SectionCard title="Message from Applicant" icon="💬">
              <p className="text-sm text-gray-600 italic leading-relaxed">"{app.message}"</p>
            </SectionCard>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 p-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose}
            className="flex-1 min-w-[100px] py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition-colors text-sm">
            Close
          </button>
          
          <button onClick={handleMessage} disabled={loading}
            className="flex-1 min-w-[100px] py-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl font-medium hover:bg-blue-100 disabled:opacity-60 transition-colors text-sm flex items-center justify-center gap-1.5">
            <MessageSquare className="h-4 w-4" /> Message
          </button>

          {(app.status === 'pending' || app.status === 'reviewing') && (
            <>
              <button onClick={() => act('rejected')} disabled={loading}
                className="flex-[1.5] py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-60 transition-colors text-sm flex items-center justify-center gap-1.5">
                <XCircle className="h-4 w-4" /> Reject
              </button>
              <button onClick={() => act('approved')} disabled={loading}
                className="flex-[1.5] py-2.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-medium hover:shadow-md disabled:opacity-60 transition-all text-sm flex items-center justify-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> Approve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ApplicationsTab = ({ setActiveTab }) => {
  const [pets, setPets]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null); // { app, petId, petName }
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

      {selected && (
        <AppDetailModal
          app={selected.app}
          petId={selected.petId}
          onClose={() => setSelected(null)}
          onAction={handleAction}
          onMessage={handleMessage}
        />
      )}

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
                        onClick={() => setSelected({ app, petId: app.petId })}
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