import React, { useState, useEffect } from 'react';
import {
  Users, Dog, Home, Settings,
  UserCheck, TrendingUp, DollarSign,
  Calendar, ChevronRight, Clock,
  ArrowUp, ArrowDown
} from 'lucide-react';

import AdminSidebar       from '../Admin/AdminSidebar';
import AdminHeader        from '../Admin/AdminHeader';
import RecentActivity     from '../Admin/RecentActivity';
import RecentUsersTable   from '../Admin/RecentUsersTable';
import AdminPetManagement from '../Admin/AdminPetManagement';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Self-contained stat card (no dependency on StatCard component) ──
const DashStatCard = ({ title, value, change, icon: Icon, iconColor, bgColor, borderColor }) => (
  <div className={`bg-white rounded-xl p-6 shadow-sm border ${borderColor} flex flex-col gap-4`}>
    <div className="flex items-center justify-between">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
        change === 'Action needed'
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-green-100 text-green-700'
      }`}>
        {change}
      </span>
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
    pendingVerifications: 0, revenue: 2450.50, pendingPets: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const [userRes, petRes] = await Promise.all([
          fetch('/api/users/dashboard/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/pets/admin/all?limit=1`,{ headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const userData = await userRes.json();
        const petData  = await petRes.json();
        setStats(prev => ({
          ...prev,
          ...(userData.success ? {
            totalUsers:    userData.data.totalUsers    || 0,
            totalAdopters: userData.data.totalAdopters || 0,
            totalRehomers: userData.data.totalRehomers || 0,
          } : {}),
          ...(petData.success ? { pendingPets: petData.summary?.pending || 0 } : {}),
        }));
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Users',           value: stats.totalUsers,          change: '+12.5%',        icon: Users,     iconColor: 'text-blue-600',   bgColor: 'bg-blue-50',   borderColor: 'border-blue-100'   },
    { title: 'Adopters',              value: stats.totalAdopters,       change: '+8.2%',         icon: UserCheck, iconColor: 'text-green-600',  bgColor: 'bg-green-50',  borderColor: 'border-green-100'  },
    { title: 'Rehomers',              value: stats.totalRehomers,       change: '+5.7%',         icon: Home,      iconColor: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-100' },
    { title: 'Pets Pending Review',   value: stats.pendingPets,         change: 'Action needed', icon: Dog,       iconColor: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-100' },
    { title: 'Pending Verifications', value: stats.pendingVerifications, change: '+4.2%',        icon: UserCheck, iconColor: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-100' },
    { title: 'Monthly Revenue',       value: `$${stats.revenue.toFixed(2)}`, change: '+18.5%',  icon: DollarSign,iconColor: 'text-emerald-600',bgColor: 'bg-emerald-50',borderColor: 'border-emerald-100'},
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6">

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome banner */}
              <div className="bg-gradient-to-r from-[#063630] to-[#085558] rounded-xl p-6 mb-6 text-white">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h1 className="text-2xl font-bold">Welcome back, Admin! 👋</h1>
                    <p className="text-white/70 mt-1">Here's what's happening with The Paw House today.</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {stats.pendingPets > 0 && (
                      <button
                        onClick={() => setActiveTab('pets')}
                        className="flex items-center gap-2 bg-yellow-400 text-[#063630] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition-colors"
                      >
                        <Clock className="h-4 w-4" />
                        {stats.pendingPets} pet{stats.pendingPets !== 1 ? 's' : ''} awaiting review
                      </button>
                    )}
                    <div className="bg-white/10 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {statCards.map((card) => (
                  <DashStatCard key={card.title} {...card} />
                ))}
              </div>

              {/* Content row */}
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

              {/* Recent users */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
                  <button onClick={() => setActiveTab('users')}
                    className="text-sm text-[#085558] hover:text-[#063630] flex items-center gap-1 font-medium">
                    View All <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <RecentUsersTable preview={true} />
              </div>
            </>
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
              <RecentUsersTable preview={false} />
            </div>
          )}

          {/* ── PETS ── */}
          {activeTab === 'pets' && <AdminPetManagement />}

          {/* ── ADOPTIONS ── */}
          {activeTab === 'adoptions' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Adoption Management</h2>
              <p className="text-gray-500">Coming soon.</p>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
              <p className="text-gray-500">Coming soon.</p>
            </div>
          )}
        </main>

        <footer className="bg-white border-t border-gray-200 py-4 px-6">
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