import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, LogOut, Home, PawPrint, Heart, Settings, Bell, ChevronRight, 
  Users, Shield, FileText, Calendar, MapPin, Phone, Mail, Edit,
  Dog, Home as HomeIcon, BarChart, CheckCircle, Clock, Star, AlertCircle
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchDashboardStats(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchDashboardStats = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { icon: PawPrint, label: 'Browse Dogs', path: '/adopt', color: 'from-[#008737] to-[#085558]' },
      { icon: Heart, label: 'My Favorites', path: '/favorites', color: 'from-[#FF6B6B] to-[#FF8E8E]' },
      { icon: User, label: 'My Profile', path: '/profile', color: 'from-[#4ECDC4] to-[#44A08D]' },
      { icon: Settings, label: 'Settings', path: '/settings', color: 'from-[#FFD93D] to-[#FF9F1A]' },
    ];

    if (user?.role === 'adopter') {
      baseItems.unshift(
        { icon: FileText, label: 'My Applications', path: '/adoption-applications', color: 'from-[#6366F1] to-[#8B5CF6]' }
      );
    } else if (user?.role === 'rehomer') {
      baseItems.unshift(
        { icon: HomeIcon, label: 'My Dogs', path: '/my-dogs', color: 'from-[#F59E0B] to-[#D97706]' },
        { icon: FileText, label: 'Rehoming Requests', path: '/rehoming-requests', color: 'from-[#6366F1] to-[#8B5CF6]' }
      );
    } else if (user?.role === 'admin') {
      return [
        { icon: Users, label: 'All Users', path: '/admin/users', color: 'from-[#6366F1] to-[#8B5CF6]' },
        { icon: PawPrint, label: 'All Dogs', path: '/admin/dogs', color: 'from-[#008737] to-[#085558]' },
        { icon: FileText, label: 'Applications', path: '/admin/applications', color: 'from-[#F59E0B] to-[#D97706]' },
        { icon: BarChart, label: 'Analytics', path: '/admin/analytics', color: 'from-[#EC4899] to-[#8B5CF6]' },
        { icon: Shield, label: 'Admin Panel', path: '/admin', color: 'from-[#EF4444] to-[#DC2626]' },
        { icon: Settings, label: 'Settings', path: '/admin/settings', color: 'from-[#6B7280] to-[#374151]' },
      ];
    }

    return baseItems;
  };

  // Role-based dashboard content
  const renderDashboardContent = () => {
    if (!user || !stats) return null;

    switch (user.role) {
      case 'adopter':
        return renderAdopterDashboard();
      case 'rehomer':
        return renderRehomerDashboard();
      case 'admin':
        return renderAdminDashboard();
      default:
        return renderDefaultDashboard();
    }
  };

  const renderAdopterDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#008737] to-[#085558] rounded-2xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
            <p className="text-white/80">Ready to find your perfect furry companion?</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Adopter Account</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <Link
            to="/adopt"
            className="bg-white text-[#008737] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Browse Available Dogs
          </Link>
        </div>
      </motion.div>

      {/* Adopter Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Applications Submitted</p>
              <p className="text-3xl font-bold text-[#063630]">0</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/adoption-applications" className="text-blue-600 text-sm font-medium hover:underline">
              View Applications →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Favorite Dogs</p>
              <p className="text-3xl font-bold text-[#063630]">{stats?.favoritePets || 0}</p>
            </div>
            <div className="p-3 bg-pink-100 rounded-full">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/favorites" className="text-pink-600 text-sm font-medium hover:underline">
              View Favorites →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Dogs Adopted</p>
              <p className="text-3xl font-bold text-[#063630]">{stats?.adoptedPets || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Dog className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/adopted-pets" className="text-green-600 text-sm font-medium hover:underline">
              View History →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions for Adopters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-[#063630] mb-6">Quick Actions for Adopters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/complete-profile"
            className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#008737] hover:bg-[#008737]/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#008737]/10">
                <User className="h-5 w-5 text-gray-600 group-hover:text-[#008737]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#063630]">Complete Your Profile</h4>
                <p className="text-sm text-gray-500">Increase adoption chances</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/adoption-preferences"
            className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#085558] hover:bg-[#085558]/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#085558]/10">
                <Settings className="h-5 w-5 text-gray-600 group-hover:text-[#085558]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#063630]">Set Preferences</h4>
                <p className="text-sm text-gray-500">Get better matches</p>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );

  const renderRehomerDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#085558] to-[#0a7a8c] rounded-2xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h2>
            <p className="text-white/80">Thank you for helping dogs find loving homes</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <HomeIcon className="h-5 w-5" />
                <span className="text-sm">Rehomer Account</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <Link
            to="/rehome"
            className="bg-white text-[#085558] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Start Rehoming Process
          </Link>
        </div>
      </motion.div>

      {/* Rehomer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Dogs Listed</p>
              <p className="text-3xl font-bold text-[#063630]">0</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Dog className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/my-dogs" className="text-blue-600 text-sm font-medium hover:underline">
              Manage Dogs →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Requests</p>
              <p className="text-3xl font-bold text-[#063630]">0</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/rehoming-requests" className="text-orange-600 text-sm font-medium hover:underline">
              View Requests →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Successfully Rehomed</p>
              <p className="text-3xl font-bold text-[#063630]">{stats?.rehomedPets || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/rehomed-pets" className="text-green-600 text-sm font-medium hover:underline">
              View History →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Rehoming Info */}
      {stats?.rehomingInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#063630]">Rehoming Information</h3>
            <Link to="/edit-rehoming-info" className="text-[#085558] hover:underline flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Reason for Rehoming</p>
              <p className="font-medium text-[#063630]">{stats.rehomingInfo.reason || 'Not specified'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Urgency Level</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  stats.rehomingInfo.urgency === 'emergency' ? 'bg-red-500' :
                  stats.rehomingInfo.urgency === 'high' ? 'bg-orange-500' :
                  stats.rehomingInfo.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <p className="font-medium text-[#063630] capitalize">{stats.rehomingInfo.urgency || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-8">
      {/* Admin Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-2xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            </div>
            <p className="text-white/80">Welcome back, Administrator {user.name}</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">System Status: Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Last login: {new Date(user.lastLogin).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/users"
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold transition-colors backdrop-blur-sm"
            >
              Manage Users
            </Link>
            <Link
              to="/admin/analytics"
              className="bg-white text-[#6366F1] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Admin Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-[#063630]">{stats.totalUsers || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500">Adopters</p>
                <p className="font-bold text-[#063630]">{stats.totalAdopters || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Rehomers</p>
                <p className="font-bold text-[#063630]">{stats.totalRehomers || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Dogs</p>
                <p className="text-3xl font-bold text-[#063630]">0</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Dog className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Available for adoption</span>
                <span className="font-bold text-[#063630]">0</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Applications</p>
                <p className="text-3xl font-bold text-[#063630]">0</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/applications" className="text-orange-600 text-sm font-medium hover:underline">
                Review Applications →
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">System Health</p>
                <p className="text-3xl font-bold text-green-600">98%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BarChart className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
                <span className="text-xs text-gray-500">Optimal</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Quick Admin Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-[#063630] mb-6">Quick Admin Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/users/new"
            className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#063630]">Add New User</h4>
                <p className="text-sm text-gray-500">Create user account</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/dogs/new"
            className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Dog className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#063630]">Add New Dog</h4>
                <p className="text-sm text-gray-500">Register a new dog</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/reports"
            className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#063630]">Generate Reports</h4>
                <p className="text-sm text-gray-500">View system reports</p>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );

  const renderDefaultDashboard = () => (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#008737] to-[#085558] rounded-2xl p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
        <p className="text-white/80">Your dashboard is being prepared...</p>
      </motion.div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDEDED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#008737] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#063630]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDEDED]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#008737] to-[#085558] text-white px-4 py-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <PawPrint className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className="text-white/80 text-sm">
                  {user?.role === 'admin' ? 'Administrator Panel' : 
                   user?.role === 'adopter' ? 'Adopter Dashboard' : 
                   user?.role === 'rehomer' ? 'Rehomer Dashboard' : 'User Dashboard'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-white/70 capitalize">{user?.role}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Tabs */}
        <div className="flex overflow-x-auto mb-8 gap-2 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#008737] text-white'
                : 'bg-white text-[#063630] hover:bg-gray-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-[#008737] text-white'
                : 'bg-white text-[#063630] hover:bg-gray-50'
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'bg-[#008737] text-white'
                : 'bg-white text-[#063630] hover:bg-gray-50'
            }`}
          >
            Notifications
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-[#008737] text-white'
                  : 'bg-white text-[#063630] hover:bg-gray-50'
              }`}
            >
              Admin Tools
            </button>
          )}
        </div>

        {/* Dashboard Content */}
        {activeTab === 'overview' ? (
          <>
            {renderDashboardContent()}
            
            {/* Quick Menu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden mt-8"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-[#063630]">Quick Navigation</h3>
                <p className="text-gray-600 text-sm">Access your most used features</p>
              </div>
              <div className="divide-y divide-gray-100">
                {getMenuItems().map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#063630]">{item.label}</h3>
                        <p className="text-sm text-gray-500">Click to access</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#008737] transition-colors" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        ) : activeTab === 'activity' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-[#063630] mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-[#008737]/10 rounded-full flex items-center justify-center">
                  <Bell className="h-5 w-5 text-[#008737]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#063630] font-medium">Welcome to The Paw House!</p>
                  <p className="text-sm text-gray-500">Your account has been successfully created</p>
                </div>
                <span className="text-xs text-gray-400">Just now</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[#063630] font-medium">Complete your profile</p>
                  <p className="text-sm text-gray-500">Add more details to get personalized matches</p>
                </div>
                <span className="text-xs text-gray-400">Pending</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-[#063630] mb-6">Notifications</h3>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">No notifications yet</p>
                    <p className="text-sm text-yellow-700">You'll see important updates here</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;