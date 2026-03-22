import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, Bell, Search, FileText, MessageSquare, Settings, ChevronDown, User, LogOut, Stethoscope, HelpCircle } from 'lucide-react';

const API      = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');
const imgSrc   = (url, updatedAt) => {
  if (!url || url === 'default-profile.jpg') return null;
  // url can be a full URL, a /path, or a bare filename (e.g. "user_123.jpg") from multer
  const base = url.startsWith('http')
    ? url
    : url.startsWith('/')
      ? `${BASE_URL}${url}`
      : `${BASE_URL}/uploads/users/${url}`;
  const bust  = updatedAt ? new Date(updatedAt).getTime() : '';
  return bust ? `${base}?t=${bust}` : base;
};

const tabs = [
  { id: 'browse',       label: 'Browse Dogs',  icon: Search        },
  { id: 'applications', label: 'Applications', icon: FileText      },
  { id: 'vets',         label: 'Veterinary Care', icon: Stethoscope},
  { id: 'messages',     label: 'Messages',     icon: MessageSquare },
  { id: 'settings',     label: 'Settings',     icon: Settings      },
];

const AdopterHeader = ({ user, activeTab, setActiveTab }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center">
              <PawPrint className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#063630] leading-tight">The Paw House</h1>
              <p className="text-xs text-[#085558] leading-tight">Adopter Dashboard</p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive ? 'bg-gradient-to-r from-[#085558] to-[#008737] text-white shadow-md' : 'text-[#063630] hover:bg-gray-100'
                  }`}
                  style={isActive ? { color: '#ffffff' } : {}}>
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="p-2 text-gray-500 hover:text-[#085558] relative">
              <Bell className="h-5 w-5" />
            </button>

            {/* User dropdown */}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setShowMenu(p => !p)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                  {imgSrc(user?.profileImage, user?.updatedAt)
                    ? <img src={imgSrc(user.profileImage, user.updatedAt)} alt={user.name} className="w-full h-full object-cover" />
                    : user?.name?.charAt(0)?.toUpperCase() || 'A'
                  }
                </div>
                <div className="text-left hidden md:block">
                  <p className="font-semibold text-[#063630] text-sm leading-tight">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 leading-tight">Adopter</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button onClick={() => { setActiveTab('settings'); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
                      <User className="h-4 w-4" /> My Profile
                    </button>
                    <button onClick={() => { setActiveTab('settings'); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
                      <Settings className="h-4 w-4" /> Settings
                    </button>
                    <button onClick={() => { setActiveTab('help'); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
                      <HelpCircle className="h-4 w-4" /> Help & Support
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
      </div>
    </header>
  );
};

export default AdopterHeader;