import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Home, Dog, FileText, MessageSquare, 
  Settings, User, Calendar, Shield,
  TrendingUp, Clock, CheckCircle, 
  XCircle, PawPrint, ChevronRight,
  Plus, Edit, Trash2, Filter,
  Upload, DollarSign, Bell
} from 'lucide-react';

const RehomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    dogsListed: 2,
    applicationsCount: 5,
    dogsRehomed: 1,
    pendingMatches: 3
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

  const listedDogs = [
    {
      id: 1,
      name: "Max",
      breed: "Golden Retriever Mix",
      age: "3 years",
      status: "active",
      applications: 3,
      date: "2024-01-20",
      color: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      name: "Bella",
      breed: "Local Breed",
      age: "2 years",
      status: "pending",
      applications: 1,
      date: "2024-01-18",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 3,
      name: "Charlie",
      breed: "Street Dog",
      age: "4 years",
      status: "inactive",
      applications: 0,
      date: "2024-01-15",
      color: "bg-gray-100 text-gray-800"
    }
  ];

  const applications = [
    {
      id: 1,
      applicantName: "John Doe",
      dogName: "Max",
      status: "pending",
      date: "2024-01-21",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 2,
      applicantName: "Sarah Smith",
      dogName: "Max",
      status: "approved",
      date: "2024-01-20",
      color: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      applicantName: "Mike Johnson",
      dogName: "Bella",
      status: "review",
      date: "2024-01-19",
      color: "bg-blue-100 text-blue-800"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Listed",
      dogName: "Max",
      time: "2 days ago",
      icon: Dog
    },
    {
      id: 2,
      action: "Received application for",
      dogName: "Max",
      time: "1 day ago",
      icon: FileText
    },
    {
      id: 3,
      action: "Message from",
      person: "John Doe",
      time: "12 hours ago",
      icon: MessageSquare
    }
  ];

  const rehomingSteps = [
    { step: 1, title: "Complete Profile", completed: true },
    { step: 2, title: "List Your Dog", completed: true },
    { step: 3, title: "Review Applications", completed: false },
    { step: 4, title: "Meet Potential Adopters", completed: false },
    { step: 5, title: "Finalize Adoption", completed: false }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EDEDED] to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#085558] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
                <div className="w-10 h-10 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center">
                  <PawPrint className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#063630]">The Paw House</h1>
                  <p className="text-sm text-[#085558]">Rehomer Dashboard</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-[#085558] relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="font-semibold text-[#063630]">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-600">Rehomer</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white font-semibold">
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
          {['dashboard', 'my-dogs', 'applications', 'messages', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#085558] to-[#008737] text-white shadow-lg'
                  : 'bg-white text-[#063630] hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-[#085558]/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#085558]/10 rounded-lg">
                <Dog className="h-6 w-6 text-[#085558]" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-[#063630] mb-2">{stats.dogsListed}</h3>
            <p className="text-gray-600">Dogs Listed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-[#008737]/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#008737]/10 rounded-lg">
                <FileText className="h-6 w-6 text-[#008737]" />
              </div>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <h3 className="text-3xl font-bold text-[#063630] mb-2">{stats.applicationsCount}</h3>
            <p className="text-gray-600">Applications</p>
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
            <h3 className="text-3xl font-bold text-[#063630] mb-2">{stats.dogsRehomed}</h3>
            <p className="text-gray-600">Dogs Rehomed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-[#085558]/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#085558]/10 rounded-lg">
                <Shield className="h-6 w-6 text-[#085558]" />
              </div>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-[#063630] mb-2">{stats.pendingMatches}</h3>
            <p className="text-gray-600">Pending Matches</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Your Listed Dogs */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#063630]">Your Listed Dogs</h2>
                <Link 
                  to="/rehoming-process" 
                  className="bg-gradient-to-r from-[#085558] to-[#008737] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  List New Dog
                </Link>
              </div>

              <div className="space-y-4">
                {listedDogs.map((dog) => (
                  <motion.div
                    key={dog.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-[#085558] to-[#008737] opacity-10"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#063630]">{dog.name}</h3>
                        <p className="text-gray-600 text-sm">{dog.breed} • {dog.age}</p>
                        <p className="text-gray-500 text-xs">{new Date(dog.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${dog.color}`}>
                            {dog.status.charAt(0).toUpperCase() + dog.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {dog.applications} application{dog.applications !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#085558]">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Rehoming Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-[#063630] mb-6">Rehoming Progress</h2>
              
              {/* Progress Steps */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  {rehomingSteps.map((step, index) => (
                    <div key={step.step} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        step.completed 
                          ? 'bg-gradient-to-r from-[#085558] to-[#008737] text-white' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.completed ? <CheckCircle className="h-5 w-5" /> : step.step}
                      </div>
                      <span className="text-xs font-medium text-gray-600">{step.title}</span>
                      {index < rehomingSteps.length - 1 && (
                        <div className={`h-1 w-16 absolute mt-5 ml-12 ${step.completed ? 'bg-gradient-to-r from-[#085558] to-[#008737]' : 'bg-gray-200'}`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Details */}
              <div className="bg-gradient-to-r from-[#085558]/5 to-[#008737]/5 p-4 rounded-lg">
                <h3 className="font-bold text-[#063630] mb-2">Next Steps</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete your dog's profile and start receiving applications from potential adopters.
                </p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-lg text-sm font-medium">
                    Upload More Photos
                  </button>
                  <button className="px-4 py-2 border border-[#085558] text-[#085558] rounded-lg text-sm font-medium">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#063630]">Recent Applications</h2>
                <span className="text-sm text-gray-500">{applications.length} total</span>
              </div>

              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-[#063630]">{app.applicantName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.color}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Applied for: <span className="font-medium">{app.dogName}</span></p>
                    <p className="text-gray-500 text-xs">{new Date(app.date).toLocaleDateString()}</p>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 py-1 bg-[#085558]/10 text-[#085558] rounded text-xs font-medium">
                        View Profile
                      </button>
                      <button className="flex-1 py-1 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded text-xs font-medium">
                        Respond
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#085558] to-[#008737] rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/rehoming-process"
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    <span>Rehoming Guide</span>
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
                  to="/rehome"
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Dog className="h-5 w-5" />
                    <span>List Another Dog</span>
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

            {/* Support Information */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-[#063630] mb-4">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Our rehoming specialists are available to help you through the process.
              </p>
              <button className="w-full py-2 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-lg font-medium">
                Schedule a Call
              </button>
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
                © {new Date().getFullYear()} The Paw House Rehomer Dashboard
              </p>
            </div>
            <div className="flex gap-6">
              <Link to="/terms" className="text-sm text-gray-600 hover:text-[#085558]">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-[#085558]">
                Privacy
              </Link>
              <Link to="/help" className="text-sm text-gray-600 hover:text-[#085558]">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RehomerDashboard;