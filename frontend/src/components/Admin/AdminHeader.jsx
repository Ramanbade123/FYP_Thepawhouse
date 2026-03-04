import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react';

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-800 lg:hidden">
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-80">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Search users, pets..."
              className="bg-transparent border-none outline-none px-3 w-full text-sm" />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Date */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>

          {/* Bell — no mock notifications */}
          <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors relative">
            <Bell className="h-5 w-5" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button onClick={() => setShowUserMenu(p => !p)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name || 'Administrator'}</p>
                <p className="text-xs text-gray-500 leading-tight">Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
                    <User className="h-4 w-4" /> My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
                    <Settings className="h-4 w-4" /> Settings
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