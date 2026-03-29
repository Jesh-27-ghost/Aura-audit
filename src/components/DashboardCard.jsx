import React from 'react';

const DashboardCard = ({ title, value, subtitle, icon: Icon, trend }) => {
  return (
    <div className="glass-card fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-color)', opacity: 0.8, margin: 0, fontWeight: 500 }}>{title}</h3>
          <h1 style={{ fontSize: '2rem', color: '#fff', margin: '8px 0 4px 0' }}>{value}</h1>
          {subtitle && <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', opacity: 0.6, margin: 0 }}>{subtitle}</p>}
        </div>
        {Icon && (
          <div style={{ padding: '12px', background: 'rgba(34, 211, 238, 0.1)', borderRadius: '12px', color: 'var(--accent2)' }}>
            <Icon size={24} />
          </div>
        )}
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <span style={{ 
            color: trend.isPositive ? 'var(--success)' : 'var(--danger)', 
            background: trend.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            padding: '4px 8px', borderRadius: '4px', fontWeight: 600
          }}>
            {trend.value}
          </span>
          <span style={{ opacity: 0.7 }}>vs last week</span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
