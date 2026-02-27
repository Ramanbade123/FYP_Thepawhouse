import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdopterHeader          from '../Adopter/AdopterHeader';
import AdopterFooter          from '../Adopter/AdopterFooter';
import BrowseDogsTab          from '../Adopter/tabs/BrowseDogsTab';
import AdopterApplicationsTab from '../Adopter/tabs/AdopterApplicationsTab';
import AdopterMessagesTab     from '../Adopter/tabs/AdopterMessagesTab';
import AdopterSettingsTab     from '../Adopter/tabs/AdopterSettingsTab';

const AdopterDashboard = () => {
  const navigate   = useNavigate();
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!storedUser) { navigate('/login'); return; }
    setUser(storedUser);
    setLoading(false);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#EDEDED] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#085558] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#063630] font-medium">Loading your dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDEDED] to-gray-100 flex flex-col">
      <AdopterHeader user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="container mx-auto px-4 py-8 flex-1">
        {activeTab === 'browse'       && <BrowseDogsTab />}
        {activeTab === 'applications' && <AdopterApplicationsTab />}
        {activeTab === 'messages'     && <AdopterMessagesTab />}
        {activeTab === 'settings'     && <AdopterSettingsTab user={user} />}
      </div>

      <AdopterFooter />
    </div>
  );
};

export default AdopterDashboard;