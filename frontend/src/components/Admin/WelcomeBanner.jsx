import React from 'react';
import { C } from './adminConstants';

const WelcomeBanner = ({ pendingAdoptions, pendingVerifications }) => (
  <div style={{
    background: `linear-gradient(135deg, ${C.dark} 0%, ${C.teal} 55%, ${C.green} 100%)`,
    borderRadius: 20, padding: '28px 32px', marginBottom: 24,
    position: 'relative', overflow: 'hidden',
  }}>
    {/* Decorative circles */}
    <div style={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
    <div style={{ position: 'absolute', right: 80, bottom: -50, width: 120, height: 120, borderRadius: '50%', background: 'rgba(132,138,255,0.12)' }} />

    <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800, margin: 0 }}>Welcome back, Admin! 👋</h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', margin: '8px 0 0', fontSize: 14 }}>
          Here's what's happening with The Paw House today.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { label: 'Pending', value: pendingAdoptions,    color: 'white'   },
          { label: 'Verify',  value: pendingVerifications, color: C.purple },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 12, padding: '10px 18px', textAlign: 'center' }}>
            <div style={{ color, fontWeight: 800, fontSize: 22 }}>{value}</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default WelcomeBanner;
