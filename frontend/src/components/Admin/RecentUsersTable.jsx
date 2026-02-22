import React from 'react';
import { ChevronRight, Eye, Edit } from 'lucide-react';
import { C } from './adminConstants';
import StatusBadge from './StatusBadge';

// Edit this array to populate with real users from your API
const mockUsers = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', role: 'Adopter',  status: 'active',   joined: '2 hours ago', avatar: 'SJ' },
  { id: 2, name: 'Mike Chen',     email: 'mike@email.com',  role: 'Rehomer',  status: 'pending',  joined: '5 hours ago', avatar: 'MC' },
  { id: 3, name: 'Emma Davis',    email: 'emma@email.com',  role: 'Adopter',  status: 'active',   joined: '1 day ago',   avatar: 'ED' },
  { id: 4, name: 'James Wilson',  email: 'james@email.com', role: 'Rehomer',  status: 'verified', joined: '2 days ago',  avatar: 'JW' },
  { id: 5, name: 'Lisa Park',     email: 'lisa@email.com',  role: 'Adopter',  status: 'active',   joined: '3 days ago',  avatar: 'LP' },
];

const RecentUsersTable = ({ onManageUsers }) => (
  <div style={{ background: C.white, borderRadius: 16, padding: 22, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(6,54,48,0.06)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: 0 }}>Recent Users</h2>
      <button
        onClick={onManageUsers}
        style={{ fontSize: 12, color: C.green, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
      >
        Manage Users <ChevronRight size={12} />
      </button>
    </div>

    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
            <th key={h} style={{ textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {mockUsers.map(u => (
          <tr key={u.id}>
            <td style={{ padding: '11px 0', borderBottom: '1px solid #f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg, ${C.green}, ${C.teal})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>{u.avatar}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{u.email}</div>
                </div>
              </div>
            </td>
            <td style={{ padding: '11px 0', borderBottom: '1px solid #f8fafc' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>{u.role}</span>
            </td>
            <td style={{ padding: '11px 0', borderBottom: '1px solid #f8fafc' }}>
              <StatusBadge status={u.status} />
            </td>
            <td style={{ padding: '11px 0', borderBottom: '1px solid #f8fafc' }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{u.joined}</span>
            </td>
            <td style={{ padding: '11px 0', borderBottom: '1px solid #f8fafc' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {[Eye, Edit].map((Ic, i) => (
                  <button
                    key={i}
                    style={{ width: 27, height: 27, borderRadius: 7, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = i === 0 ? C.teal : C.green; e.currentTarget.style.color = i === 0 ? C.teal : C.green; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
                  >
                    <Ic size={12} />
                  </button>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RecentUsersTable;
