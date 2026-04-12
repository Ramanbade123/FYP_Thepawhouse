import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Users, Dog, Home, Settings,
  UserCheck, Calendar, ChevronRight, Clock,
  Shield, CreditCard
} from 'lucide-react';

import AdminSidebar       from '../Admin/AdminSidebar';
import AdminHeader        from '../Admin/AdminHeader';
import RecentActivity     from '../Admin/RecentActivity';
import RecentUsersTable   from '../Admin/RecentUsersTable';
import AdminPetManagement from '../Admin/AdminPetManagement';
import AdminCommunityTab  from '../Admin/AdminCommunityTab';
import AdminMessagesTab   from '../Admin/AdminMessagesTab';
import AdminReportsTab    from '../Admin/AdminReportsTab';
import AdminSettingsTab   from '../Admin/AdminSettingsTab';
import AdminPendingPets   from '../Admin/AdminPendingPets';
import AdminPaymentsTab  from '../Admin/AdminPaymentsTab';

const API = 'http://localhost:5000/api';

const DashStatCard = ({ title, value, change, icon: Icon, iconColor, bgColor, borderColor, gradient }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 hover:border-[#085558]/30 transition-all duration-300 flex flex-col gap-5 relative overflow-hidden group`}>
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110`} />
    <div className="flex items-center justify-between relative z-10">
      <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center shadow-sm border border-white`}>
        <Icon className={`h-7 w-7 ${iconColor}`} />
      </div>
      <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm ${
        change === 'Action needed' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-green-100 text-[#008737] border border-green-200'
      }`}>{change}</span>
    </div>
    <div className="relative z-10 mt-2">
      <p className="text-4xl font-extrabold text-[#063630] tracking-tight">{value}</p>
      <p className="text-gray-500 text-sm font-medium mt-1">{title}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab]     = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0, totalAdopters: 0, totalRehomers: 0,
    pendingVerifications: 0, pendingPets: 0,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Sync state back to URL for 'Go Back' support
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') !== activeTab) {
      navigate(`/admin/dashboard?tab=${activeTab}`, { replace: true });
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const [userRes, petRes] = await Promise.all([
          fetch(`${API}/users/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/pets/admin/all?limit=1`,  { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const userData = await userRes.json();
        const petData  = await petRes.json();
        setStats(prev => ({
          ...prev,
          ...(userData.success ? {
            totalUsers:    userData.data.totalUsers    || 0,
            totalAdopters: userData.data.totalAdopters || 0,
            totalRehomers: userData.data.totalRehomers || 0,
            pendingVerifications: userData.data.pendingVerifications || 0,
          } : {}),
          ...(petData.success ? { pendingPets: petData.summary?.pending || 0 } : {}),
        }));
      } catch (err) { console.error('Stats fetch error:', err); }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Users',           value: stats.totalUsers,           change: '+12.5%',        icon: Users,     iconColor: 'text-[#085558]',   bgColor: 'bg-[#085558]/10', gradient: 'from-[#085558] to-transparent' },
    { title: 'Adopters',              value: stats.totalAdopters,        change: '+8.2%',         icon: UserCheck, iconColor: 'text-[#008737]',   bgColor: 'bg-[#008737]/10', gradient: 'from-[#008737] to-transparent' },
    { title: 'Rehomers',              value: stats.totalRehomers,        change: '+5.7%',         icon: Home,      iconColor: 'text-indigo-600',  bgColor: 'bg-indigo-50',    gradient: 'from-indigo-500 to-transparent' },
    { title: 'Pets Pending Review',   value: stats.pendingPets,          change: 'Action needed', icon: Dog,       iconColor: 'text-amber-600',   bgColor: 'bg-amber-50',     gradient: 'from-amber-500 to-transparent' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab} setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
      />

      {/* Main — takes remaining width */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-6">

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Urgent Action: Pending Pets */}
              <AdminPendingPets onManagePets={() => setActiveTab('pets')} />

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map(card => <DashStatCard key={card.title} {...card} />)}
              </div>

              {/* Activity + Overview */}
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <div className="xl:col-span-3 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#063630]">Recent Activity</h2>
                    <span className="text-[#085558] text-sm font-semibold hover:underline cursor-pointer">View all log</span>
                  </div>
                  <RecentActivity />
                </div>
                <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-100">
                  <h2 className="text-xl font-bold text-[#063630] mb-8">Platform Overview</h2>
                  <div className="space-y-6">
                    {[
                      { label: 'Total Users',  value: stats.totalUsers,    max: stats.totalUsers || 1,  color: 'from-[#085558] to-[#063630]' },
                      { label: 'Adopters',     value: stats.totalAdopters, max: stats.totalUsers || 1,  color: 'from-[#008737] to-[#046e30]'  },
                      { label: 'Rehomers',     value: stats.totalRehomers, max: stats.totalUsers || 1,  color: 'from-indigo-400 to-indigo-600' },
                      { label: 'Pets Pending', value: stats.pendingPets,   max: Math.max(stats.pendingPets, 10), color: 'from-amber-400 to-amber-600' },
                    ].map(({ label, value, max, color }) => (
                      <div key={label} className="group">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 font-medium">{label}</span>
                          <span className="font-bold text-[#063630]">{value}</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-100">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#063630]">Recently Joined Users</h2>
                    <button onClick={() => setActiveTab('users')} className="text-sm font-semibold text-[#008737] bg-[#008737]/10 px-4 py-2 rounded-xl hover:bg-[#008737]/20 transition-colors">
                      Manage all users
                    </button>
                 </div>
                <RecentUsersTable preview={true} onManageUsers={() => setActiveTab('users')} />
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
              <RecentUsersTable preview={false} />
            </div>
          )}

          {activeTab === 'pets' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
               <AdminPetManagement />
            </div>
          )}

          {activeTab === 'community' && <AdminCommunityTab />}
          {activeTab === 'messages'  && <AdminMessagesTab />}

          {activeTab === 'reports' && <AdminReportsTab />}
          {activeTab === 'payments' && <AdminPaymentsTab />}
          {activeTab === 'settings' && <AdminSettingsTab />}

          {!['dashboard','users','pets','community','messages','reports','settings', 'payments'].includes(activeTab) && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">{activeTab}</h2>
              <p className="text-gray-500">Coming soon.</p>
            </div>
          )}
        </main>

        <footer className="bg-white border-t border-gray-200 py-4 px-6 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>© {new Date().getFullYear()} The Paw House. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#085558]">Privacy Policy</a>
              <a href="#" className="hover:text-[#085558]">Terms of Service</a>
              <a href="#" className="hover:text-[#085558]">Help Center</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;