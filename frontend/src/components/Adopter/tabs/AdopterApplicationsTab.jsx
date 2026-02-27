import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, XCircle, Dog } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusStyle = {
  pending:   { cls: 'bg-yellow-100 text-yellow-800', icon: Clock,         label: 'Pending'  },
  reviewing: { cls: 'bg-blue-100 text-blue-800',     icon: Clock,         label: 'Reviewing'},
  approved:  { cls: 'bg-green-100 text-green-800',   icon: CheckCircle,   label: 'Approved' },
  rejected:  { cls: 'bg-red-100 text-red-800',       icon: XCircle,       label: 'Rejected' },
};

const AdopterApplicationsTab = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res   = await fetch(`${API}/pets/adopter/my-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setApplications(data.data);
      } catch (err) {
        setError(err.message || 'Failed to load applications');
      } finally { setLoading(false); }
    };
    fetchApplications();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-[#008737] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="text-center py-16"><p className="text-red-500">{error}</p></div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#063630]">My Applications</h2>
        <p className="text-gray-500 mt-1">Track the status of your adoption applications.</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-[#008737]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-[#008737]" />
          </div>
          <h3 className="text-lg font-bold text-[#063630] mb-2">No applications yet</h3>
          <p className="text-gray-500 text-sm">Browse dogs and apply to adopt one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app, i) => {
            const s = statusStyle[app.status] || statusStyle.pending;
            const Icon = s.icon;
            return (
              <motion.div key={app._id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#085558]/20 to-[#008737]/20 flex-shrink-0 flex items-center justify-center">
                    {app.pet?.primaryImage
                      ? <img src={app.pet.primaryImage} alt={app.pet.name} crossOrigin="anonymous" className="w-full h-full object-cover" />
                      : <Dog className="h-7 w-7 text-[#085558]/40" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#063630]">{app.pet?.name}</h3>
                    <p className="text-gray-500 text-sm">{app.pet?.breed} • {app.pet?.ageDisplay}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${s.cls}`}>
                  <Icon className="h-3.5 w-3.5" /> {s.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdopterApplicationsTab;
