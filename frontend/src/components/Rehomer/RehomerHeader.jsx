import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, Bell, Home, Dog, FileText, MessageSquare, Settings, ChevronDown, LogOut, User } from 'lucide-react';

const API      = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');
const imgSrc   = (url, updatedAt) => {
  if (!url || url === 'default-profile.jpg') return null;
  const base = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const bust  = updatedAt ? new Date(updatedAt).getTime() : '';
  return bust ? `${base}?t=${bust}` : base;
};

const tabs = [
  { id: 'dashboard',    label: 'Dashboard',    icon: Home          },
  { id: 'my-dogs',      label: 'My Dogs',      icon: Dog           },
  { id: 'applications', label: 'Applications', icon: FileText      },
  { id: 'messages',     label: 'Messages',     icon: MessageSquare },
  { id: 'settings',     label: 'Settings',     icon: Settings      },
];

const RehomerHeader = ({ user, activeTab, setActiveTab }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'R';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Left — Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center">
              <PawPrint className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#063630] leading-tight">The Paw House</h1>
              <p className="text-xs text-[#085558] leading-tight">Rehomer Dashboard</p>
            </div>
          </Link>

          {/* Center — Nav tabs */}
          <nav className="flex items-center gap-1">
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#085558] to-[#008737] text-white shadow-md'
                      : 'text-[#063630] hover:bg-gray-100'
                  }`}
                  style={isActive ? { color: '#ffffff' } : {}}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Right — Bell + User dropdown */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="p-2 text-gray-500 hover:text-[#085558] relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(v => !v)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="text-right hidden md:block">
                  <p className="font-semibold text-[#063630] text-sm leading-tight">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 leading-tight">Rehomer</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                  {imgSrc(user?.profileImage, user?.updatedAt)
                    ? <img src={imgSrc(user.profileImage, user.updatedAt)} alt={user.name} className="w-full h-full object-cover" />
                    : initials
                  }
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-[#063630] text-sm">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                  </div>

                  {/* Menu items */}
                  <div className="p-1">
                    <button
                      onClick={() => { setActiveTab('settings'); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <User className="h-4 w-4 text-gray-400" /> My Profile
                    </button>
                    <button
                      onClick={() => { setActiveTab('settings'); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4 text-gray-400" /> Settings
                    </button>
                  </div>

                  <div className="p-1 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default RehomerHeader;