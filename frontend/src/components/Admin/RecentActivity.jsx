import React from 'react';
import { Heart, UserCheck, PawPrint, Shield, MessageSquare, ChevronRight } from 'lucide-react';
import { C } from './adminConstants';

// Edit this array to update the activity feed
const activityData = [
  { icon: Heart,         color: C.green,  text: 'New adoption request from Sarah J.',     time: '2 min ago'  },
  { icon: UserCheck,     color: C.purple, text: "Mike Chen's rehomer profile verified",   time: '15 min ago' },
  { icon: PawPrint,      color: C.teal,   text: 'Buddy the Labrador listed for rehoming', time: '1 hr ago'   },
  { icon: Shield,        color: C.green,  text: 'System security check completed',        time: '2 hr ago'   },
  { icon: MessageSquare, color: C.purple, text: '3 new messages in support queue',        time: '3 hr ago'   },
  { icon: UserCheck,     color: C.green,  text: 'Adoption completed: Luna → Emma D.',     time: '5 hr ago'   },
];

const RecentActivity = () => (
  <div style={{ background: C.white, borderRadius: 16, padding: 22, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(6,54,48,0.06)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: 0 }}>Recent Activity</h2>
      <button style={{ fontSize: 12, color: C.green, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
        View All <ChevronRight size={12} />
      </button>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {activityData.map(({ icon: Icon, color, text, time }, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 0', borderBottom: i < activityData.length - 1 ? '1px solid #f1f5f9' : 'none', alignItems: 'flex-start' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={14} color={color} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.dark, fontWeight: 500, lineHeight: 1.4 }}>{text}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RecentActivity;
