import React from 'react';
import { PawPrint, LogOut } from 'lucide-react';
import { C, navItems } from './adminConstants';

const AdminSidebar = ({ activeTab, setActiveTab, sidebarOpen }) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <aside style={{
      width: sidebarOpen ? 256 : 72,
      minHeight: '100vh',
      background: C.dark,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      zIndex: 100,
      overflow: 'hidden',
    }}>

      {/* ── Logo ── */}
      <div style={{ padding: '22px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, minHeight: 68 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.green}, ${C.teal})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <PawPrint size={18} color="white" />
        </div>
        {sidebarOpen && (
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>The Paw House</div>
            <div style={{ color: C.green, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</div>
          </div>
        )}
      </div>

      {/* ── Nav Links ── */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: sidebarOpen ? '9px 14px' : '9px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                background: active ? `${C.green}22` : 'transparent',
                borderLeft: `3px solid ${active ? C.green : 'transparent'}`,
                color: active ? C.green : 'rgba(255,255,255,0.5)',
                transition: 'all 0.2s',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                width: '100%',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {sidebarOpen && (
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── User + Logout ── */}
      <div style={{ padding: '14px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {sidebarOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', marginBottom: 4 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg, ${C.green}, ${C.teal})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 11 }}>A</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: 'white', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Administrator</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>admin@pawhouse.com</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: sidebarOpen ? '9px 14px' : '9px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,0.35)', width: '100%', justifyContent: sidebarOpen ? 'flex-start' : 'center', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
        >
          <LogOut size={15} />
          {sidebarOpen && <span style={{ fontSize: 13 }}>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
