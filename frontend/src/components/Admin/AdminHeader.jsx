import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Bell, Menu, X, Check,
        User, Settings, ChevronDown, LogOut
} from 'lucide-react';

const API      = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');
const imgSrc   = (url) => {
  if (!url || url === 'default-profile.jpg') return null;
  return url.startsWith('http')
    ? url
    : url.startsWith('/')
      ? `${BASE_URL}${url}`
      : `${BASE_URL}/uploads/users/${url}`;
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

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const token = localStorage.getItem('token');
        if(!token) return;
        const res = await fetch(`${API}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if(data.success) {
          setNotifications(data.data || []);
          setUnread(data.unreadCount || 0);
        }
      } catch(e) { console.error('Error fetching notifications:', e); }
    };
    fetchNotifs();
    const intv = setInterval(fetchNotifs, 15000);
    return () => clearInterval(intv);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnread(u => Math.max(0, u - 1));
    } catch(e) {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnread(0);
      setShowNotifications(false);
    } catch(e) {}
  };

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
          <div className="relative" ref={notifRef}>
            <button onClick={() => { setShowNotifications(s => !s); setShowUserMenu(false); }}
              className={`p-2 rounded-lg transition-colors relative ${showNotifications ? 'bg-gray-100 text-[#008737]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between sticky top-0">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  {unread > 0 && (
                    <button onClick={handleMarkAllAsRead} className="text-xs text-[#008737] hover:underline font-medium">Mark all read</button>
                  )}
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No notifications yet</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n._id} onClick={() => { if(!n.read) handleMarkAsRead(n._id); }}
                        className={`p-3 rounded-lg text-left transition-colors cursor-pointer ${n.read ? 'bg-transparent hover:bg-gray-50' : 'bg-[#008737]/5 hover:bg-[#008737]/10'}`}>
                        <div className="flex justify-between items-start mb-1">
                           <p className={`text-sm ${n.read ? 'text-gray-700 font-medium' : 'text-[#063630] font-bold'}`}>{n.title}</p>
                           {!n.read && <span className="h-2 w-2 rounded-full bg-[#008737] flex-shrink-0 mt-1"></span>}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
                           {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative" ref={userRef}>
            <button onClick={() => { setShowUserMenu(s => !s); setShowNotifications(false); }}
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