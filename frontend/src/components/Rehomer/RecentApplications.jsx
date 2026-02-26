import { useState, useEffect } from 'react';
import { User, Dog, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusConfig = {
  pending:   { cls: 'bg-yellow-100 text-yellow-800', icon: Clock        },
  reviewing: { cls: 'bg-blue-100   text-blue-800',   icon: Eye          },
  approved:  { cls: 'bg-green-100  text-green-800',  icon: CheckCircle  },
  rejected:  { cls: 'bg-red-100    text-red-800',    icon: XCircle      },
};

const RecentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = localStorage.getItem('token');
        const res   = await fetch(`${API}/pets/rehomer/my-listings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          // Flatten all applications from all pets, most recent first
          const all = data.data.flatMap(pet =>
            pet.applications.map(app => ({
              ...app,
              petName:  pet.name,
              petImage: pet.primaryImage,
              petId:    pet._id,
            }))
          ).sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
           .slice(0, 5); // show latest 5
          setApplications(all);
        }
      } catch {}
      finally { setLoading(false); }
    };
    fetch_();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-[#063630]">Recent Applications</h2>
        <span className="text-sm text-gray-400">{applications.length} recent</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-4 border-[#085558] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-8">
          <Dog className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No applications yet.</p>
          <p className="text-gray-300 text-xs mt-1">They'll appear here once adopters apply.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const cfg  = statusConfig[app.status] || statusConfig.pending;
            const Icon = cfg.icon;
            return (
              <div key={app._id}
                className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {app.adopter?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="font-semibold text-[#063630] text-sm">
                      {app.adopter?.name || 'Applicant'}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
                    <Icon className="h-3 w-3" />
                    {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mb-2 ml-9">
                  Applied for <span className="font-medium text-[#085558]">{app.petName}</span>
                  {' · '}{new Date(app.appliedAt).toLocaleDateString()}
                </p>
                {app.message && (
                  <p className="text-gray-400 text-xs italic ml-9 truncate">"{app.message}"</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentApplications;