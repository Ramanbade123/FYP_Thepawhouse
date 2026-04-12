import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dog, FileText, MessageSquare, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusColor = {
  pending:   'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  approved:  'bg-green-100 text-green-800',
  rejected:  'bg-red-100 text-red-800',
};

const RehomerOverviewTab = ({ user, setActiveTab }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDogs: 0,
    activeApps: 0,
    totalConversations: 0
  });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch user's dogs & applications
        const dogsRes = await fetch(`${API}/pets/rehomer/my-listings`, { headers });
        const dogsData = await dogsRes.json();
        
        let tDogs = 0;
        let tActiveApps = 0;
        let allApps = [];

        if (dogsData.success && dogsData.data) {
          tDogs = dogsData.data.length;
          
          dogsData.data.forEach(dog => {
            if (dog.applications && dog.applications.length > 0) {
              const activeAppsForDog = dog.applications.filter(a => a.status === 'pending' || a.status === 'reviewing');
              tActiveApps += activeAppsForDog.length;
              
              const mappedApps = dog.applications.map(app => ({
                ...app,
                petName: dog.name,
                petImage: dog.primaryImage
              }));
              allApps = [...allApps, ...mappedApps];
            }
          });
          
          // Sort applications by date (newest first)
          allApps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
          setRecentApps(allApps.slice(0, 5)); // Top 5 recent apps
        }

        // 2. Fetch conversations (for count)
        const msgsRes = await fetch(`${API}/messages`, { headers });
        const msgsData = await msgsRes.json();
        let tConvos = 0;
        if (msgsData.success && msgsData.data) {
          tConvos = msgsData.data.length;
        }

        setStats({
          totalDogs: tDogs,
          activeApps: tActiveApps,
          totalConversations: tConvos
        });

      } catch (err) {
        console.error("Failed to fetch overview data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#085558] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer flex items-center justify-between group transition-all"
    >
      <div>
        <p className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-[#063630] group-hover:text-[#008737] transition-colors">{value}</h3>
      </div>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#063630] to-[#008737] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">Welcome back, {user?.name?.split(' ')[0] || 'Rehomer'}!</h1>
          <p className="text-white/90 max-w-lg mb-6 text-lg">
            Here's a quick overview of your posted dogs and adoption applications.
          </p>
          <div className="flex justify-center gap-4 w-full">
            <button 
              onClick={() => navigate('/list-dog')}
              className="px-6 py-2.5 bg-white text-[#063630] rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              List a New Dog
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Dogs Listed" 
          value={stats.totalDogs} 
          icon={<Dog className="w-7 h-7 text-[#085558]" />} 
          color="bg-[#085558]/10"
          onClick={() => setActiveTab('my-dogs')}
        />
        <StatCard 
          title="Active Applications" 
          value={stats.activeApps} 
          icon={<FileText className="w-7 h-7 text-blue-600" />} 
          color="bg-blue-50"
          onClick={() => setActiveTab('applications')}
        />
        <StatCard 
          title="Active Messages" 
          value={stats.totalConversations} 
          icon={<MessageSquare className="w-7 h-7 text-purple-600" />} 
          color="bg-purple-50"
          onClick={() => setActiveTab('messages')}
        />
      </div>

      {/* Recent Applications Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#063630]">Recent Applications</h2>
          <button 
            onClick={() => setActiveTab('applications')}
            className="text-sm font-semibold text-[#008737] hover:underline"
          >
            View All
          </button>
        </div>
        
        {recentApps.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-700">No applications yet</p>
            <p className="text-sm">When someone applies for your dogs, they'll appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentApps.map((app, i) => (
              <div key={app._id} className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {app.petImage ? (
                      <img src={app.petImage.startsWith('http') ? app.petImage : `http://localhost:5000/uploads/pets/${app.petImage.replace(/^\/uploads\/pets\//, '')}`} alt="pet" className="w-full h-full object-cover" />
                    ) : (
                      <Dog className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{app.adopter?.name || 'Unknown User'}</h4>
                    <p className="text-sm text-gray-500">Applied for <span className="font-semibold text-[#008737]">{app.petName}</span></p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[app.status] || 'bg-gray-100 text-gray-600'}`}>
                    {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(app.appliedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RehomerOverviewTab;
