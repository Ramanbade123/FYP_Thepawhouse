import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdopterHeader          from '../Adopter/AdopterHeader';
import AdopterFooter          from '../Adopter/AdopterFooter';
import BrowseDogsTab          from '../Adopter/tabs/BrowseDogsTab';
import FavouritesTab          from '../Adopter/tabs/FavouritesTab';
import AdopterApplicationsTab from '../Adopter/tabs/AdopterApplicationsTab';
import AdopterMessagesTab     from '../Adopter/tabs/AdopterMessagesTab';
import AdopterSettingsTab     from '../Adopter/tabs/AdopterSettingsTab';
import NearbyClinics          from '../Shared/NearbyClinics';
import HelpAndSupport         from '../Shared/HelpAndSupport';

const AdopterDashboard = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'browse');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    } else if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location]);

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
        {activeTab === 'favourites'   && <FavouritesTab />}
        {activeTab === 'applications' && <AdopterApplicationsTab />}
        {activeTab === 'vets'         && <NearbyClinics />}
        {activeTab === 'messages'     && <AdopterMessagesTab />}
        {activeTab === 'settings'     && <AdopterSettingsTab user={user} onProfileUpdate={setUser} />}
        {activeTab === 'help'         && <HelpAndSupport role="adopter" />}
      </div>

      <AdopterFooter />
    </div>
  );
};

export default AdopterDashboard;