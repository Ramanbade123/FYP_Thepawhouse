import { useState, useEffect } from 'react';
import {
  Users, Dog, Home, Settings,
  UserCheck, Calendar, ChevronRight, Clock
} from 'lucide-react';

import AdminSidebar       from '../Admin/AdminSidebar';
import AdminHeader        from '../Admin/AdminHeader';
import RecentActivity     from '../Admin/RecentActivity';
import RecentUsersTable   from '../Admin/RecentUsersTable';
import AdminPetManagement from '../Admin/AdminPetManagement';
import AdminCommunityTab  from '../Admin/AdminCommunityTab';
import AdminMessagesTab   from '../Admin/AdminMessagesTab';
import AdminAdoptionsTab  from '../Admin/AdminAdoptionsTab';
import AdminReportsTab    from '../Admin/AdminReportsTab';
import AdminVerificationsTab from '../Admin/AdminVerificationsTab';
import AdminSettingsTab   from '../Admin/AdminSettingsTab';
import AdminPendingPets   from '../Admin/AdminPendingPets';

const API = 'http://localhost:5000/api';

const DashStatCard = ({ title, value, change, icon: Icon, iconColor, bgColor, borderColor }) => (
  <div className={`bg-white rounded-xl p-6 shadow-sm border ${borderColor} flex flex-col gap-4`}>
    <div className="flex items-center justify-between">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
        change === 'Action needed' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
      }`}>{change}</span>
    </div>
    <div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{title}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab]     = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0, totalAdopters: 0, totalRehomers: 0,
    pendingVerifications: 0, pendingPets: 0,
  });

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
    { title: 'Total Users',           value: stats.totalUsers,           change: '+12.5%',        icon: Users,     iconColor: 'text-blue-600',   bgColor: 'bg-blue-50',   borderColor: 'border-blue-100'   },
    { title: 'Adopters',              value: stats.totalAdopters,        change: '+8.2%',         icon: UserCheck, iconColor: 'text-green-600',  bgColor: 'bg-green-50',  borderColor: 'border-green-100'  },
    { title: 'Rehomers',              value: stats.totalRehomers,        change: '+5.7%',         icon: Home,      iconColor: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-100' },
    { title: 'Pets Pending Review',   value: stats.pendingPets,          change: 'Action needed', icon: Dog,       iconColor: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-100' },
    { title: 'Pending Verifications', value: stats.pendingVerifications, change: '+4.2%',         icon: UserCheck, iconColor: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-100' },
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
            <>
              {/* Urgent Action: Pending Pets */}
              <AdminPendingPets onManagePets={() => setActiveTab('pets')} />

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {statCards.map(card => <DashStatCard key={card.title} {...card} />)}
              </div>

              {/* Activity + Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                  <RecentActivity />
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Platform Overview</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Total Users',  value: stats.totalUsers,    max: stats.totalUsers || 1,  color: 'bg-blue-500'   },
                      { label: 'Adopters',     value: stats.totalAdopters, max: stats.totalUsers || 1,  color: 'bg-green-500'  },
                      { label: 'Rehomers',     value: stats.totalRehomers, max: stats.totalUsers || 1,  color: 'bg-purple-500' },
                      { label: 'Pets Pending', value: stats.pendingPets,   max: Math.max(stats.pendingPets, 10), color: 'bg-yellow-500' },
                    ].map(({ label, value, max, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{label}</span>
                          <span className="font-semibold text-gray-800">{value}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full transition-all`}
                            style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <RecentUsersTable preview={true} onManageUsers={() => setActiveTab('users')} />
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
              <RecentUsersTable preview={false} />
            </div>
          )}

          {activeTab === 'pets' && <AdminPetManagement />}

          {activeTab === 'community' && <AdminCommunityTab />}
          {activeTab === 'messages'  && <AdminMessagesTab />}

          {activeTab === 'adoptions' && <AdminAdoptionsTab />}

          {activeTab === 'reports' && <AdminReportsTab />}

          {activeTab === 'verifications' && <AdminVerificationsTab />}

          {activeTab === 'settings' && <AdminSettingsTab />}

          {!['dashboard','users','pets','adoptions','community','messages','reports','verifications','settings'].includes(activeTab) && (
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