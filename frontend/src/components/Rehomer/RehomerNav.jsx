import { Home, Dog, FileText, MessageSquare, Settings } from 'lucide-react';

const tabs = [
  { id: 'dashboard',     label: 'Dashboard',     icon: Home         },
  { id: 'my-dogs',      label: 'My Dogs',       icon: Dog          },
  { id: 'applications', label: 'Applications',  icon: FileText     },
  { id: 'messages',     label: 'Messages',      icon: MessageSquare},
  { id: 'settings',     label: 'Settings',      icon: Settings     },
];

const RehomerNav = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-[#085558] to-[#008737] text-white shadow-lg'
                : 'bg-white text-[#063630] hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default RehomerNav;
