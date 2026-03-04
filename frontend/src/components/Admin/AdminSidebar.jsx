import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Dog, Home,
  Settings, LogOut, X, PawPrint,
  BarChart3, Shield, MessageSquare, Calendar
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'users',         label: 'User Management',icon: Users           },
  { id: 'pets',          label: 'Pet Management', icon: Dog             },
  { id: 'adoptions',     label: 'Adoptions',      icon: Home            },
  { id: 'reports',       label: 'Reports',        icon: BarChart3       },
  { id: 'verifications', label: 'Verifications',  icon: Shield          },
  { id: 'messages',      label: 'Messages',       icon: MessageSquare   },
  { id: 'calendar',      label: 'Calendar',       icon: Calendar        },
  { id: 'settings',      label: 'Settings',       icon: Settings        },
];

const AdminSidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col
        bg-gradient-to-b from-[#063630] to-[#085558]
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto
      `}>

        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <PawPrint className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">The Paw House</h2>
              <p className="text-white/60 text-xs">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-semibold text-sm truncate">{user?.name || 'Administrator'}</p>
              <p className="text-white/50 text-xs truncate">{user?.email || 'admin@pawhouse.com'}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span className="text-green-400 text-xs">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}>
                <Icon className="h-5 w-5 flex-shrink-0" style={{ color: 'inherit' }} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-red-500/20 rounded-xl text-sm font-medium transition-all">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;