import React from 'react';
import { Shield, Home, Activity, Lock, Settings, Menu, Bell, User } from 'lucide-react';
import CustomCursor from './CustomCursor';

const Sidebar = () => (
  <div className="glass-card" style={{ width: '260px', height: 'calc(100vh - 40px)', margin: '20px 0 20px 20px', display: 'flex', flexDirection: 'column', padding: '24px', flexShrink: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
      <Shield color="var(--accent2)" size={32} />
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-color)', margin: 0 }}>Shield<span style={{color: 'var(--accent)'}}>Proxy</span></h2>
    </div>
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
      {[ 
        { icon: Home, label: 'Dashboard', active: true },
        { icon: Activity, label: 'Network Traffic' },
        { icon: Lock, label: 'Threat Intelligence' },
        { icon: Settings, label: 'Configuration' }
      ].map((item, idx) => (
        <button 
          key={idx}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            background: item.active ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
            border: item.active ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid transparent',
            color: item.active ? 'var(--accent2)' : 'var(--text-color)',
            borderRadius: '8px', textAlign: 'left',  transition: 'all 0.2s',
            fontWeight: item.active ? 600 : 400,
            cursor: 'none'
          }}
          className={!item.active ? 'opacity-hover' : ''}
        >
          <item.icon size={20} />
          {item.label}
        </button>
      ))}
    </nav>
    <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
      <p style={{ margin: 0, color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 600 }}>System Status</p>
      <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.8 }}>3 Active Threats Detected</p>
    </div>
    <style>{`
      .opacity-hover:hover {
        background: rgba(255,255,255,0.05) !important;
      }
    `}</style>
  </div>
);

const Topbar = () => (
  <div className="glass-card" style={{ height: '70px', margin: '20px 20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <button style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'none' }}><Menu size={24} /></button>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ position: 'relative', cursor: 'pointer' }}>
        <Bell size={20} color="var(--text-color)" />
        <span className="highlight-pulse" style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', boxShadow: '0 0 8px var(--danger)' }}></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={16} color="#fff" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>Admin</p>
        </div>
      </div>
    </div>
  </div>
);

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', gap: '20px' }}>
      <CustomCursor />
      <div className="dashboard-bg"></div>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar />
        <main className="fade-in" style={{ padding: '0 20px 20px 0', flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
