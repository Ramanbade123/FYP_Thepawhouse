import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Menu, X, 
  User, Settings, HelpCircle, 
  Sun, Moon, ChevronDown
} from 'lucide-react';

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setNotifications(data.data || []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id, link) => {
    try {
      const token = localStorage.getItem('token');
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await fetch(`${API}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setShowNotifications(false);
      if (link) navigate(link);
    } catch {}
  };

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, pets, adoptions..."
              className="bg-transparent border-none outline-none px-3 w-full"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 relative"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm">
                  <h3 className="font-bold text-[#063630] text-sm">Notifications</h3>
                  {unreadNotifications > 0 && (
                    <span className="text-[10px] bg-[#008737]/10 text-[#008737] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                      {unreadNotifications} New
                    </span>
                  )}
                </div>
                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <Bell className="h-8 w-8 text-gray-200 mb-2" />
                      <p className="text-sm text-gray-500 font-medium">No notifications yet.</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => handleMarkAsRead(notification._id, notification.link)}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 transition-colors ${
                          !notification.read ? 'bg-[#f0fdf4]' : 'bg-white'
                        }`}
                      >
                        <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${!notification.read ? 'bg-[#008737] shadow-[0_0_8px_rgba(0,135,55,0.4)]' : 'bg-transparent'}`} />
                        <div className="text-left w-full">
                          <h4 className={`text-sm mb-1 ${!notification.read ? 'font-bold text-[#063630]' : 'font-semibold text-gray-700'}`}>
                            {notification.title || notification.type}
                          </h4>
                          <p className={`text-xs leading-relaxed ${!notification.read ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-2 block font-medium">
                            {notification.createdAt ? new Date(notification.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : notification.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">Administrator</p>
                <p className="text-xs text-gray-600">Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-medium text-gray-800">admin@pawhouse.com</p>
                  <p className="text-sm text-gray-600">Administrator</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    <User className="h-4 w-4" />
                    <span className="text-sm">My Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Account Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-sm">Help & Support</span>
                  </button>
                </div>
                <div className="p-2 border-t border-gray-200">
                  <button className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden mt-4">
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none px-3 w-full"
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;