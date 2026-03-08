import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, Menu, X,
  User, Settings, HelpCircle, LogOut,
  ChevronDown, PawPrint
} from 'lucide-react';

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu]           = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'New adoption request',      time: '2 min ago',   read: false },
    { id: 2, title: 'User verification pending', time: '15 min ago',  read: false },
    { id: 3, title: 'System update completed',   time: '1 hour ago',  read: true  },
  ]);

  const unread = notifications.filter(n => !n.read).length;
  const user   = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = user.name ? user.name.charAt(0).toUpperCase() : 'A';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
      <div className="flex items-center justify-between gap-4">

        {/* Left — hamburger + search */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#063630] hover:bg-[#063630]/5 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-80 focus-within:border-[#008737] focus-within:ring-2 focus-within:ring-[#008737]/20 transition-all">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search users, pets, adoptions..."
              className="bg-transparent border-none outline-none text-sm text-[#063630] placeholder-gray-400 w-full"
            />
          </div>
        </div>

        {/* Right — notifications + user */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(p => !p); setShowUserMenu(false); }}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#063630] hover:bg-[#063630]/5 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                  {unread}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#063630] to-[#085558]">
                  <h3 className="font-semibold text-white text-sm">Notifications</h3>
                  <p className="text-xs text-white/60 mt-0.5">{unread} unread</p>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-[#008737]/5' : ''}`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-[#063630]">{n.title}</p>
                        {!n.read && <div className="w-2 h-2 bg-[#008737] rounded-full flex-shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-[#008737] hover:text-[#085558] font-medium transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => { setShowUserMenu(p => !p); setShowNotifications(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#063630]/5 transition-colors"
            >
              <div className="h-8 w-8 bg-gradient-to-br from-[#008737] to-[#085558] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{initials}</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-[#063630] leading-tight">{user.name || 'Administrator'}</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-[#063630]">{user.name || 'Administrator'}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email || 'admin@pawhouse.com'}</p>
                </div>
                <div className="p-2 space-y-0.5">
                  {[
                    { icon: <User className="h-4 w-4" />,      label: 'My Profile'       },
                    { icon: <Settings className="h-4 w-4" />,  label: 'Account Settings' },
                    { icon: <HelpCircle className="h-4 w-4" />,label: 'Help & Support'   },
                  ].map(({ icon, label }) => (
                    <button key={label}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#063630] hover:bg-[#063630]/5 rounded-xl transition-colors">
                      <span className="text-[#008737]">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-100">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden mt-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm text-[#063630] placeholder-gray-400 w-full" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;