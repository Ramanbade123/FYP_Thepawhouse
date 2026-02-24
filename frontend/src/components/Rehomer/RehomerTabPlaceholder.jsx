import { Dog, FileText, MessageSquare, Settings } from 'lucide-react';

const iconMap = {
  'my-dogs':      { icon: Dog,           color: '#085558' },
  'applications': { icon: FileText,      color: '#008737' },
  'messages':     { icon: MessageSquare, color: '#085558' },
  'settings':     { icon: Settings,      color: '#64748b' },
};

const RehomerTabPlaceholder = ({ activeTab }) => {
  const entry = iconMap[activeTab] || iconMap['settings'];
  const Icon = entry.icon;
  const label = activeTab.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ background: `${entry.color}18` }}
      >
        <Icon className="h-8 w-8" style={{ color: entry.color }} />
      </div>
      <h2 className="text-2xl font-bold text-[#063630] mb-2">{label}</h2>
      <p className="text-gray-500">This section is coming soon. Content will appear here.</p>
    </div>
  );
};

export default RehomerTabPlaceholder;
