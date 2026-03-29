import React from 'react';

const threats = [
  { id: 'TH-001', type: 'DDoS Attack', source: '192.168.1.104', status: 'Blocked', severity: 'High' },
  { id: 'TH-002', type: 'SQL Injection', source: '45.33.12.1', status: 'Mitigated', severity: 'Critical' },
  { id: 'TH-003', type: 'Port Scan', source: '10.0.0.5', status: 'Monitoring', severity: 'Low' },
  { id: 'TH-004', type: 'Malware Payload', source: 'Unknown', status: 'Blocked', severity: 'High' },
];

const DataTable = () => {
  return (
    <div className="glass-card slide-up" style={{ padding: '24px', overflowX: 'auto', animationDelay: '0.2s' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Recent Threats</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(229, 231, 235, 0.1)' }}>
            <th style={{ padding: '12px 16px', color: 'var(--text-color)', opacity: 0.7, fontWeight: 500, fontSize: '0.9rem' }}>ID</th>
            <th style={{ padding: '12px 16px', color: 'var(--text-color)', opacity: 0.7, fontWeight: 500, fontSize: '0.9rem' }}>Type</th>
            <th style={{ padding: '12px 16px', color: 'var(--text-color)', opacity: 0.7, fontWeight: 500, fontSize: '0.9rem' }}>Source IP</th>
            <th style={{ padding: '12px 16px', color: 'var(--text-color)', opacity: 0.7, fontWeight: 500, fontSize: '0.9rem' }}>Severity</th>
            <th style={{ padding: '12px 16px', color: 'var(--text-color)', opacity: 0.7, fontWeight: 500, fontSize: '0.9rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {threats.map((threat, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid rgba(229, 231, 235, 0.05)', transition: 'background 0.2s' }} className="table-row-hover">
              <td style={{ padding: '16px', fontSize: '0.95rem' }}>{threat.id}</td>
              <td style={{ padding: '16px', fontSize: '0.95rem', fontWeight: 500 }}>{threat.type}</td>
              <td style={{ padding: '16px', fontSize: '0.95rem', fontFamily: 'monospace', opacity: 0.8 }}>{threat.source}</td>
              <td style={{ padding: '16px' }}>
                <span style={{ 
                  color: threat.severity === 'Critical' ? '#fff' : (threat.severity === 'High' ? 'var(--danger)' : 'var(--text-color)'),
                  background: threat.severity === 'Critical' ? 'var(--danger)' : (threat.severity === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)'),
                  padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600
                }}>
                  {threat.severity}
                </span>
              </td>
              <td style={{ padding: '16px' }}>
                <span style={{ 
                  color: threat.status === 'Blocked' ? 'var(--success)' : (threat.status === 'Mitigated' ? 'var(--accent2)' : 'var(--accent)'),
                  display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 500
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                  {threat.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.03);
        }
      `}</style>
    </div>
  );
};

export default DataTable;
