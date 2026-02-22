import React, { useState } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { C } from './adminConstants';

const notifications = [
  { text: 'New adoption request received', time: '2 min ago',  unread: true  },
  { text: 'User verification pending',     time: '15 min ago', unread: true  },
  { text: 'System update completed',       time: '1 hour ago', unread: false },
];

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  return (
    <header style={{
      height: 64,
      background: C.white,
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(6,54,48,0.05)',
    }}>

      {/* ── Left: Toggle + Search ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={() => setSidebarOpen(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: C.dark, display: 'flex' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <Menu size={20} />
        </button>

        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search users, pets..."
            style={{ padding: '7px 12px 7px 34px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', width: 210, color: C.dark, background: '#f8fafc', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = C.green}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
      </div>

      {/* ── Right: Date + Bell + Avatar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* Date pill */}
        <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}25`, borderRadius: 20, padding: '5px 13px', fontSize: 12, fontWeight: 600, color: C.teal }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(v => !v)}
            style={{ width: 36, height: 36, borderRadius: 10, border: '1.5px solid #e2e8f0', background: notifOpen ? '#f1f5f9' : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
          >
            <Bell size={16} color={C.dark} />
            <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: C.green, border: '1.5px solid white' }} />
          </button>

          {notifOpen && (
            <div style={{ position: 'absolute', right: 0, top: 46, width: 290, background: C.white, borderRadius: 14, boxShadow: '0 12px 40px rgba(6,54,48,0.15)', border: '1px solid #e2e8f0', zIndex: 200, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.dark }}>Notifications</div>
                <div style={{ fontSize: 12, color: C.green, marginTop: 2 }}>2 new notifications</div>
              </div>
              {notifications.map((n, i) => (
                <div key={i} style={{ padding: '12px 18px', borderBottom: '1px solid #f8fafc', display: 'flex', gap: 10, alignItems: 'flex-start', background: n.unread ? '#f0fdf4' : 'white' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: n.unread ? C.green : 'transparent', marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, color: C.dark, fontWeight: n.unread ? 600 : 400 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: '10px 18px', textAlign: 'center' }}>
                <button style={{ fontSize: 12, color: C.green, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${C.green}, ${C.teal})`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 12 }}>A</span>
        </div>
      </div>

      {/* Close notif when clicking elsewhere */}
      {notifOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setNotifOpen(false)} />
      )}
    </header>
  );
};

export default AdminHeader;
