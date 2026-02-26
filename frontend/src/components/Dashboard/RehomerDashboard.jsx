import { useState, useEffect } from 'react';

import RehomerHeader   from '../Rehomer/RehomerHeader';
import RehomerFooter   from '../Rehomer/RehomerFooter';
import ListedDogs      from '../Rehomer/ListedDogs';
import ApplicationsTab from '../Rehomer/tabs/ApplicationsTab';
import MessagesTab     from '../Rehomer/tabs/MessagesTab';
import SettingsTab     from '../Rehomer/tabs/SettingsTab';

const RehomerDashboard = () => {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDEDED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#085558] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#063630] font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDEDED] to-gray-100 flex flex-col">
      <RehomerHeader user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="container mx-auto px-4 py-8 flex-1">
        {(activeTab === 'dashboard' || activeTab === 'my-dogs') && <ListedDogs />}
        {activeTab === 'applications' && <ApplicationsTab />}
        {activeTab === 'messages'     && <MessagesTab user={user} />}
        {activeTab === 'settings'     && <SettingsTab user={user} />}
      </div>

      <RehomerFooter />
    </div>
  );
};

export default RehomerDashboard;