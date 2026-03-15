import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Menu, X, 
  User, Settings, HelpCircle, ChevronDown, LogOut
} from 'lucide-react';

const API      = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');
const imgSrc   = (url) => {
  if (!url || url === 'default-profile.jpg') return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

const AdminHeader = ({ sidebarOpen, setSidebarOpen, setActiveTab }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));

  // Re-read user from localStorage whenever storage changes (e.g. after profile save)
  useEffect(() => {
    const sync = () => setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    window.addEventListener('storage', sync);
    // Also poll every second to catch same-tab updates
    const interval = setInterval(() => {
      const fresh = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(prev => JSON.stringify(prev) !== JSON.stringify(fresh) ? fresh : prev);
    }, 1000);
    return () => { window.removeEventListener('storage', sync); clearInterval(interval); };
  }, []);

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'A';
  const avatar   = imgSrc(user?.profileImage);

  const [notifications] = useState([
    { id: 1, title: 'New adoption request',      time: '2 min ago',   read: false },
    { id: 2, title: 'User verification pending',  time: '15 min ago',  read: false },
    { id: 3, title: 'System update completed',    time: '1 hour ago',  read: true  },
  ]);
  const unread = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center space-x-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-600 hover:text-gray-900">
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
            <Search className="h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search users, pets, adoptions..."
              className="bg-transparent border-none outline-none px-3 w-full text-sm" />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-3">

          {/* Bell */}
          <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 relative">
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {/* User menu */}
          <div className="relative">
            <button onClick={() => setShowUserMenu(s => !s)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              {/* Avatar */}
              {avatar ? (
                <img src={`${avatar}?t=${user?.updatedAt ? new Date(user.updatedAt).getTime() : ''}`}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-[#008737]/20" />
              ) : (
                <div className="h-8 w-8 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{initials}</span>
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <p className="font-semibold text-gray-800 text-sm truncate">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                </div>
                <div className="p-2">
                  <button onClick={() => { setShowUserMenu(false); setActiveTab && setActiveTab('settings'); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
                    <Settings className="h-4 w-4 text-[#008737]" /> Account Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
                    <HelpCircle className="h-4 w-4 text-gray-400" /> Help & Support
                  </button>
                </div>
                <div className="p-2 border-t border-gray-100">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;