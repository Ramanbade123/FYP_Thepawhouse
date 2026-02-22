import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { C } from './adminConstants';

const StatCard = ({ title, value, change, positive, icon: Icon, accent }) => (
  <div
    style={{
      background: C.white, borderRadius: 16, padding: 24,
      border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 12,
      boxShadow: '0 1px 4px rgba(6,54,48,0.06)', transition: 'all 0.2s', cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(6,54,48,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(6,54,48,0.06)'; e.currentTarget.style.transform = 'none'; }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color={accent} />
      </div>
      <span style={{
        fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 20,
        background: positive ? '#dcfce7' : '#fee2e2',
        color: positive ? '#166534' : '#991b1b',
        display: 'flex', alignItems: 'center', gap: 3,
      }}>
        {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {change}
      </span>
    </div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 800, color: C.dark, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{title}</div>
    </div>
    <div style={{ height: 4, borderRadius: 4, background: '#f1f5f9', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: '70%', borderRadius: 4, background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />
    </div>
  </div>
);

export default StatCard;
