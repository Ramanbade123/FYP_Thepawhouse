import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Home, Dog, Shield, DollarSign } from 'lucide-react';

import { C }            from '../Admin/adminConstants';
import AdminSidebar     from '../Admin/AdminSidebar';
import AdminHeader      from '../Admin/AdminHeader';
import AdminFooter      from '../Admin/AdminFooter';
import WelcomeBanner    from '../Admin/WelcomeBanner';
import StatCard         from '../Admin/StatCard';
import RecentActivity   from '../Admin/RecentActivity';
import RecentUsersTable from '../Admin/RecentUsersTable';
import PlaceholderTab   from '../Admin/PlaceholderTab';

const AdminDashboard = () => {
  const [activeTab,   setActiveTab]   = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0, totalAdopters: 0, totalRehomers: 0,
    pendingAdoptions: 24, pendingVerifications: 12, revenue: 2450.50,
  });

  // ── Fetch stats from API ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch('/api/users/dashboard/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        if (data.success) {
          setStats(prev => ({
            ...prev,
            totalUsers:    data.data.totalUsers    || 0,
            totalAdopters: data.data.totalAdopters || 0,
            totalRehomers: data.data.totalRehomers || 0,
          }));
        }
      } catch (_) {}
    })();
  }, []);

  // ── Stat card definitions (edit values/icons here) ────────────
  const statsCards = [
    { title: 'Total Users',           value: stats.totalUsers,               change: '+12.5%', positive: true,  icon: Users,      accent: C.teal    },
    { title: 'Adopters',              value: stats.totalAdopters,            change: '+8.2%',  positive: true,  icon: UserCheck,  accent: C.green   },
    { title: 'Rehomers',              value: stats.totalRehomers,            change: '+5.7%',  positive: true,  icon: Home,       accent: C.purple  },
    { title: 'Pending Adoptions',     value: stats.pendingAdoptions,         change: '-3.1%',  positive: false, icon: Dog,        accent: '#f59e0b' },
    { title: 'Pending Verifications', value: stats.pendingVerifications,     change: '+4.2%',  positive: true,  icon: Shield,     accent: '#ef4444' },
    { title: 'Monthly Revenue',       value: `$${stats.revenue.toFixed(2)}`, change: '+18.5%', positive: true,  icon: DollarSign, accent: C.green   },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
      />

      {/* Main area */}
      <div style={{ marginLeft: sidebarOpen ? 256 : 72, flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.3s ease', minHeight: '100vh' }}>

        {/* Header */}
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Page content */}
        <main style={{ flex: 1, padding: 24 }}>
          {activeTab === 'dashboard' ? (
            <>
              <WelcomeBanner
                pendingAdoptions={stats.pendingAdoptions}
                pendingVerifications={stats.pendingVerifications}
              />

              {/* 6-column stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 24 }}>
                {statsCards.map((card, i) => <StatCard key={i} {...card} />)}
              </div>

              {/* Activity feed + Users table */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: 18 }}>
                <RecentActivity />
                <RecentUsersTable onManageUsers={() => setActiveTab('users')} />
              </div>
            </>
          ) : (
            <PlaceholderTab activeTab={activeTab} />
          )}
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminDashboard;