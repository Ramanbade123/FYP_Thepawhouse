import React from 'react';
import { 
  LayoutDashboard, Users, Dog, Home, 
  Settings, LogOut, Menu, X,
  FileText, Shield, Bell, HelpCircle,
  BarChart3, Calendar, MessageSquare
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'users', label: 'User Management', icon: <Users className="h-5 w-5" /> },
    { id: 'adoptions', label: 'Adoptions', icon: <Dog className="h-5 w-5" /> },
    { id: 'pets', label: 'Pet Management', icon: <Home className="h-5 w-5" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'verifications', label: 'Verifications', icon: <Shield className="h-5 w-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Dog className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">The Paw House</h2>
                <p className="text-sm text-gray-400">Admin Panel</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold">A</span>
            </div>
            <div>
              <h3 className="font-semibold">Administrator</h3>
              <p className="text-sm text-gray-400">admin@pawhouse.com</p>
              <div className="flex items-center mt-1">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                transition-colors duration-200
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-800 mt-auto">
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-4 w-4" />
                <span className="text-sm">Notifications</span>
              </div>
              <span className="bg-red-500 text-xs px-2 py-1 rounded-full">3</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">Help & Support</span>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;