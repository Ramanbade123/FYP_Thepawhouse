import { useState, useEffect } from 'react';

// ── Components ──────────────────────────────────────────────
import RehomerHeader         from '../Rehomer/RehomerHeader';
import RehomerNav            from '../Rehomer/RehomerNav';
import RehomerStatsCards     from '../Rehomer/RehomerStatsCards';
import ListedDogs            from '../Rehomer/ListedDogs';
import RehomingProgress      from '../Rehomer/RehomingProgress';
import RecentApplications    from '../Rehomer/RecentApplications';
import RehomerQuickActions   from '../Rehomer/RehomerQuickActions';
import RehomerSupport        from '../Rehomer/RehomerSupport';
import RehomerFooter         from '../Rehomer/RehomerFooter';
import RehomerTabPlaceholder from '../Rehomer/RehomerTabPlaceholder';

// ── Mock data ────────────────────────────────────────────────
const LISTED_DOGS = [
  { id: 1, name: 'Max',     breed: 'Golden Retriever Mix', age: '3 years', status: 'active',   applications: 3, date: '2024-01-20', color: 'bg-green-100 text-green-800'   },
  { id: 2, name: 'Bella',   breed: 'Local Breed',          age: '2 years', status: 'pending',  applications: 1, date: '2024-01-18', color: 'bg-yellow-100 text-yellow-800' },
  { id: 3, name: 'Charlie', breed: 'Street Dog',           age: '4 years', status: 'inactive', applications: 0, date: '2024-01-15', color: 'bg-gray-100 text-gray-800'     },
];

const APPLICATIONS = [
  { id: 1, applicantName: 'John Doe',     dogName: 'Max',   status: 'pending',  date: '2024-01-21', color: 'bg-yellow-100 text-yellow-800' },
  { id: 2, applicantName: 'Sarah Smith',  dogName: 'Max',   status: 'approved', date: '2024-01-20', color: 'bg-green-100 text-green-800'   },
  { id: 3, applicantName: 'Mike Johnson', dogName: 'Bella', status: 'review',   date: '2024-01-19', color: 'bg-blue-100 text-blue-800'     },
];

// ── Main Dashboard ────────────────────────────────────────────
const RehomerDashboard = () => {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats] = useState({
    dogsListed:        2,
    applicationsCount: 5,
    dogsRehomed:       1,
    pendingMatches:    3,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
    setTimeout(() => setLoading(false), 800);
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
    <div className="min-h-screen bg-gradient-to-b from-[#EDEDED] to-gray-100">
      <RehomerHeader user={user} />

      <div className="container mx-auto px-4 py-6">
        <RehomerNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'dashboard' && (
          <>
            <RehomerStatsCards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ListedDogs dogs={LISTED_DOGS} />
                <RehomingProgress />
              </div>
              <div>
                <RecentApplications applications={APPLICATIONS} />
                <RehomerQuickActions />
                <RehomerSupport />
              </div>
            </div>
          </>
        )}

        {activeTab !== 'dashboard' && (
          <RehomerTabPlaceholder activeTab={activeTab} />
        )}
      </div>

      <RehomerFooter />
    </div>
  );
};

export default RehomerDashboard;