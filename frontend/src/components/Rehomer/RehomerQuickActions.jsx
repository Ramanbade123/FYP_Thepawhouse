import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Dog, Settings, ChevronRight } from 'lucide-react';

const actions = [
  { to: '/rehoming-process', icon: FileText,     label: 'Rehoming Guide'   },
  { to: '/contact',          icon: MessageSquare, label: 'Contact Support'  },
  { to: '/rehome',           icon: Dog,           label: 'List Another Dog' },
  { to: '/settings',         icon: Settings,      label: 'Account Settings' },
];

const RehomerQuickActions = () => {
  return (
    <div className="bg-gradient-to-br from-[#085558] to-[#008737] rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-white">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-white" />
              <span className="text-white font-medium">{label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-white/70" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RehomerQuickActions;
