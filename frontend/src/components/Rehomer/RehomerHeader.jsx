import { Link } from 'react-router-dom';
import { PawPrint, Bell, Home, Dog, FileText, MessageSquare, Settings } from 'lucide-react';

const tabs = [
  { id: 'dashboard',    label: 'Dashboard',    icon: Home          },
  { id: 'my-dogs',      label: 'My Dogs',      icon: Dog           },
  { id: 'applications', label: 'Applications', icon: FileText      },
  { id: 'messages',     label: 'Messages',     icon: MessageSquare },
  { id: 'settings',     label: 'Settings',     icon: Settings      },
];

const RehomerHeader = ({ user, activeTab, setActiveTab }) => {
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
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
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

          {/* Right — Bell + User */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="p-2 text-gray-500 hover:text-[#085558] relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <p className="font-semibold text-[#063630] text-sm leading-tight">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 leading-tight">Rehomer</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'R'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default RehomerHeader;