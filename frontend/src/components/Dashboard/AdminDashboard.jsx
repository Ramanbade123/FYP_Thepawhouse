import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Dog, Home, Settings, 
  UserCheck, UserX, TrendingUp, DollarSign,
  Calendar, MessageSquare, Bell, Search,
  Filter, Download, Eye, Edit, Trash2,
  ChevronRight, ChevronLeft, MoreVertical
} from 'lucide-react';
import AdminSidebar from '../AdminSidebar';
import AdminHeader from '../AdminHeader';
import StatsCard from '../StatsCard';
import RecentActivity from '../RecentActivity';
import UserManagement from '../UserManagement';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdopters: 0,
    totalRehomers: 0,
    pendingAdoptions: 24,
    pendingVerifications: 12,
    monthlyGrowth: 15.3,
    revenue: 2450.50
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/users/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setStats({
            totalUsers: data.data.totalUsers || 0,
            totalAdopters: data.data.totalAdopters || 0,
            totalRehomers: data.data.totalRehomers || 0,
            pendingAdoptions: 24,
            pendingVerifications: 12,
            monthlyGrowth: 15.3,
            revenue: 2450.50
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: '+12.5%',
      icon: <Users className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Adopters',
      value: stats.totalAdopters,
      change: '+8.2%',
      icon: <UserCheck className="h-6 w-6 text-green-500" />,
      color: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Rehomers',
      value: stats.totalRehomers,
      change: '+5.7%',
      icon: <Home className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Pending Adoptions',
      value: stats.pendingAdoptions,
      change: '-3.1%',
      icon: <Dog className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingVerifications,
      change: '+4.2%',
      icon: <UserCheck className="h-6 w-6 text-orange-500" />,
      color: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.revenue.toFixed(2)}`,
      change: '+18.5%',
      icon: <DollarSign className="h-6 w-6 text-emerald-500" />,
      color: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <AdminHeader 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' ? (
            <>
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Welcome back, Admin! 👋</h1>
                    <p className="text-blue-100 mt-2">
                      Here's what's happening with The Paw House today.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {statsCards.map((card, index) => (
                  <StatsCard key={index} {...card} />
                ))}
              </div>

              {/* Recent Activity - now full width */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View All
                  </button>
                </div>
                <RecentActivity />
              </div>

              {/* User Management Preview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Manage Users
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <UserManagement preview={true} />
              </div>
            </>
          ) : activeTab === 'users' ? (
            <UserManagement preview={false} />
          ) : activeTab === 'adoptions' ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Adoption Management</h2>
              <p className="text-gray-600">Adoption management content goes here...</p>
            </div>
          ) : activeTab === 'pets' ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Pet Management</h2>
              <p className="text-gray-600">Pet management content goes here...</p>
            </div>
          ) : activeTab === 'settings' ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
              <p className="text-gray-600">Settings content goes here...</p>
            </div>
          ) : null}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© {new Date().getFullYear()} The Paw House. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
              <a href="#" className="hover:text-blue-600">Help Center</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;