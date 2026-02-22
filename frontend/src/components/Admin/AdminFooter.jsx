import React from 'react';
import { C } from './adminConstants';

const AdminFooter = () => (
  <footer style={{
    background: C.white,
    borderTop: '1px solid #e2e8f0',
    padding: '13px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <span style={{ fontSize: 12, color: '#94a3b8' }}>
      © {new Date().getFullYear()} The Paw House. All rights reserved.
    </span>
    <div style={{ display: 'flex', gap: 18 }}>
      {['Privacy Policy', 'Terms of Service', 'Help Center'].map(l => (
        <a
          key={l}
          href="#"
          style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseEnter={e => e.target.style.color = C.green}
          onMouseLeave={e => e.target.style.color = '#94a3b8'}
        >
          {l}
        </a>
      ))}
    </div>
  </footer>
);

export default AdminFooter;
