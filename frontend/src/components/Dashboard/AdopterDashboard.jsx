import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, Search, Home, Calendar, 
  MessageSquare, Settings, User, 
  Dog, Star, Shield, Bell, Filter,
  TrendingUp, Clock, CheckCircle, 
  XCircle, PawPrint, ChevronRight
} from 'lucide-react';

const AdopterDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    favoritesCount: 5,
    applicationsCount: 3,
    adoptedCount: 1,
    pendingApprovals: 2
  });

  // Mock user data - replace with API call
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const applications = [
    {
      id: 1,
      dogName: "Buddy",
      breed: "Golden Retriever Mix",
      status: "pending",
      date: "2024-01-20",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 2,
      dogName: "Kali",
      breed: "Local Breed",
      status: "approved",
      date: "2024-01-15",
      color: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      dogName: "Sheru",
      breed: "Street Dog",
      status: "rejected",
      date: "2024-01-10",
      color: "bg-red-100 text-red-800"
    }
  ];

  const favoriteDogs = [
    {
      id: 1,
      name: "Max",
      breed: "Labrador Mix",
      age: "2 years",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop",
      status: "Available"
    },
    {
      id: 2,
      name: "Luna",
      breed: "Pariah Dog",
      age: "1.5 years",
      image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400&auto=format&fit=crop",
      status: "Available"
    },
    {
      id: 3,
      name: "Rocky",
      breed: "Nepali Kukur",
      age: "3 years",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop",
      status: "Reserved"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Saved",
      dogName: "Max",
      time: "2 hours ago",
      icon: Heart
    },
    {
      id: 2,
      action: "Applied for",
      dogName: "Buddy",
      time: "1 day ago",
      icon: Dog
    },
    {
      id: 3,
      action: "Message sent to",
      person: "Adoption Specialist",
      time: "2 days ago",
      icon: MessageSquare
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EDEDED] to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#008737] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#063630]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDEDED] to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-[#008737] to-[#085558] rounded-full flex items-center justify-center">
                  <PawPrint className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#063630]">The Paw House</h1>
                  <p className="text-sm text-[#085558]">Adopter Dashboard</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-[#008737] relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="font-semibold text-[#063630]">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-600">Adopter</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-[#008737] to-[#085558] rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {['dashboard', 'favorites', 'applications', 'messages', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white shadow-lg'
                  : 'bg-white text-[#063630] hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-[#008737]/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#008737]/10 rounded-lg">
                <Heart className="h-6 w-6 text-[#008737]" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-[#063630] mb-2">{stats.favoritesCount}</h3>
            <p className="text-gray-600">Favorite Dogs</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-[#085558]/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#085558]/10 rounded-lg">
                <Dog className="h-6 w-6 text-[#085558]" />
              </div>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <h3 className="text-3xl font-bold text-[#063630] mb-2">{stats.applicationsCount}</h3>
            <p className="text-gray-600">Active Applications</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-[#063630]/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#063630]/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-[#063630]" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-[#063630] mb-2">{stats.adoptedCount}</h3>
            <p className="text-gray-600">Dogs Adopted</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-[#008737]/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#008737]/10 rounded-lg">
                <Shield className="h-6 w-6 text-[#008737]" />
              </div>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-[#063630] mb-2">{stats.pendingApprovals}</h3>
            <p className="text-gray-600">Pending Approvals</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#063630]">Your Applications</h2>
                <Link to="/adopt" className="text-[#008737] hover:text-[#085558] font-medium flex items-center gap-1">
                  Browse more dogs
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {applications.map((app) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-[#008737] to-[#085558] opacity-10"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#063630]">{app.dogName}</h3>
                        <p className="text-gray-600 text-sm">{app.breed}</p>
                        <p className="text-gray-500 text-xs">{new Date(app.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.color}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Favorite Dogs */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-[#063630] mb-6">Your Favorite Dogs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteDogs.map((dog) => (
                  <motion.div
                    key={dog.id}
                    whileHover={{ y: -5 }}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="h-32 bg-gradient-to-br from-[#008737] to-[#085558] relative">
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dog.status === 'Available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {dog.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#063630] mb-1">{dog.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{dog.breed} • {dog.age}</p>
                      <button className="w-full py-2 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-lg text-sm font-medium hover:shadow-md transition-shadow">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
              <h2 className="text-xl font-bold text-[#063630] mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#008737]/10 rounded-full flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[#008737]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#063630]">
                          {activity.action} <span className="font-semibold">{activity.dogName || activity.person}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#008737] to-[#085558] rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/adopt"
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5" />
                    <span>Browse Dogs</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                
                <Link
                  to="/adoption-process"
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Dog className="h-5 w-5" />
                    <span>Adoption Process</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                
                <Link
                  to="/contact"
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5" />
                    <span>Contact Support</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                
                <Link
                  to="/settings"
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    <span>Account Settings</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} The Paw House Adopter Dashboard
              </p>
            </div>
            <div className="flex gap-6">
              <Link to="/terms" className="text-sm text-gray-600 hover:text-[#008737]">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-[#008737]">
                Privacy
              </Link>
              <Link to="/help" className="text-sm text-gray-600 hover:text-[#008737]">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdopterDashboard;