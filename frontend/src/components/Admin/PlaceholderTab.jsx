import React from 'react';
import { C, navItems, tabAccents } from './adminConstants';

const PlaceholderTab = ({ activeTab }) => {
  const tab    = navItems.find(n => n.id === activeTab);
  const Icon   = tab?.icon;
  const accent = tabAccents[activeTab] || C.green;

  return (
    <div style={{ background: C.white, borderRadius: 20, padding: 48, textAlign: 'center', border: '1px solid #e2e8f0' }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
        {Icon && <Icon size={28} color={accent} />}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: '0 0 10px' }}>
        {tab?.label}
      </h2>
      <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
        This section is coming soon. Content will appear here.
      </p>
    </div>
  );
};

export default PlaceholderTab;
