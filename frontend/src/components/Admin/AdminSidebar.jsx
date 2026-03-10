import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Dog, Home,
  Settings, LogOut, X,
  Shield, MessageSquare, Search, PawPrint, BarChart3
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard',     label: 'Dashboard',       icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'users',         label: 'User Management', icon: <Users className="h-5 w-5" /> },
    { id: 'pets',          label: 'Pet Management',  icon: <Dog className="h-5 w-5" /> },
    { id: 'adoptions',     label: 'Adoptions',       icon: <Home className="h-5 w-5" /> },
    { id: 'community',     label: 'Lost & Found',    icon: <Search className="h-5 w-5" /> },
    { id: 'reports',       label: 'Reports',         icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'verifications', label: 'Verifications',   icon: <Shield className="h-5 w-5" /> },
    { id: 'messages',      label: 'Messages',        icon: <MessageSquare className="h-5 w-5" /> },
    { id: 'settings',      label: 'Settings',        icon: <Settings className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = user.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col
          bg-[#063630] text-white
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-auto
        `}
      >
        {/* Logo / Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-[#008737] to-[#085558] rounded-xl flex items-center justify-center shadow-lg">
                <PawPrint className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-tight">The Paw House</h2>
                <p className="text-xs text-white/50 mt-0.5">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-3">
            <div className="h-10 w-10 bg-gradient-to-br from-[#008737] to-[#085558] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name || 'Administrator'}</p>
              <p className="text-xs text-white/50 truncate">{user.email || 'admin@pawhouse.com'}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-[#008737] rounded-full" title="Online" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${activeTab === item.id
                  ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <span className={activeTab === item.id ? 'text-white' : 'text-white/50'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/10 space-y-0.5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 text-white" />
            <span className="text-white">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;