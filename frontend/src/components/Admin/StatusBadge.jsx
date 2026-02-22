import React from 'react';

const statusMap = {
  active:   { bg: '#dcfce7', color: '#166534', label: 'Active'   },
  pending:  { bg: '#fef9c3', color: '#854d0e', label: 'Pending'  },
  verified: { bg: '#dbeafe', color: '#1e40af', label: 'Verified' },
};

const StatusBadge = ({ status }) => {
  const s = statusMap[status] || statusMap.active;
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
      background: s.bg, color: s.color,
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {s.label}
    </span>
  );
};

export default StatusBadge;
