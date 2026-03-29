import { useState, useMemo, useEffect } from 'react';
import {
  Bell, AlertTriangle, ShieldAlert, Activity, Clock,
  Server, Search, Filter, CheckCircle, ChevronDown,
  ChevronUp, X, Scan, Zap,
} from 'lucide-react';
import { generateAlerts } from '../data/mockData';
import './Alerts.css';

const SEVERITY_CONFIG = {
  critical: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: ShieldAlert },
  high: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', icon: AlertTriangle },
  medium: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: Activity },
  low: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: Clock },
};

const ICON_MAP = {
  'alert-triangle': AlertTriangle,
  'scan': Scan,
  'shield-alert': ShieldAlert,
  'activity': Activity,
  'clock': Clock,
  'server': Server,
};

export default function Alerts() {
  const [alerts, setAlerts] = useState(generateAlerts(20));
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');

  // Simulate real-time incoming alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlerts = generateAlerts(1);
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 30));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (filter !== 'all' && a.severity !== filter) return false;
      if (statusFilter === 'resolved' && !a.resolved) return false;
      if (statusFilter === 'active' && a.resolved) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) &&
          !a.client.toLowerCase().includes(search.toLowerCase()) &&
          !a.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [alerts, filter, statusFilter, search]);

  const severityCounts = useMemo(() => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    alerts.forEach(a => { if (!a.resolved) counts[a.severity]++; });
    return counts;
  }, [alerts]);

  const handleResolve = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1><Bell size={24} style={{ color: 'var(--accent-purple)' }} /> Security <span className="text-gradient">Alerts</span></h1>
        <p>Real-time threat notifications and security event monitoring</p>
      </div>

      {/* Severity Summary Cards */}
      <div className="grid-stats fade-in-up">
        {Object.entries(SEVERITY_CONFIG).map(([sev, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={sev}
              className={`glass-card severity-summary-card ${filter === sev ? 'active' : ''}`}
              onClick={() => setFilter(filter === sev ? 'all' : sev)}
              data-cursor-hover
            >
              <div className="sev-icon" style={{ background: config.bg, border: `1px solid ${config.color}30` }}>
                <Icon size={20} style={{ color: config.color }} />
              </div>
              <div className="sev-info">
                <span className="sev-count" style={{ color: config.color }}>{severityCounts[sev]}</span>
                <span className="sev-label">{sev}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="alerts-toolbar fade-in-up">
        <div className="search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search alerts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-toggles">
          {['all', 'active', 'resolved'].map(s => (
            <button
              key={s}
              className={`sort-btn ${statusFilter === s ? 'active' : ''}`}
              onClick={() => setStatusFilter(s)}
              data-cursor-hover
            >
              {s === 'all' ? 'All' : s === 'active' ? 'Active' : 'Resolved'}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed */}
      <div className="alerts-feed fade-in-up">
        {filteredAlerts.length === 0 ? (
          <div className="alerts-empty glass-card">
            <CheckCircle size={40} style={{ color: 'var(--accent-green)' }} />
            <h3>All Clear</h3>
            <p>No alerts match your current filters.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isExpanded = expandedId === alert.id;
            const AlertIcon = ICON_MAP[alert.icon] || AlertTriangle;
            const sevConfig = SEVERITY_CONFIG[alert.severity];
            
            return (
              <div
                key={alert.id}
                className={`alert-card glass-card ${alert.resolved ? 'resolved' : ''} ${isExpanded ? 'expanded' : ''}`}
              >
                <div
                  className="alert-main"
                  onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                  data-cursor-hover
                >
                  <div className="alert-left">
                    <div
                      className="alert-icon-wrap"
                      style={{ background: sevConfig.bg, border: `1px solid ${sevConfig.color}30` }}
                    >
                      <AlertIcon size={20} style={{ color: sevConfig.color }} />
                    </div>
                    <div className="alert-info">
                      <div className="alert-title-row">
                        <h4>{alert.title}</h4>
                        <span className={`badge badge-${alert.severity}`}>{alert.severity}</span>
                        {alert.resolved && (
                          <span className="badge badge-allowed">resolved</span>
                        )}
                      </div>
                      <p className="alert-desc">{alert.description}</p>
                      <div className="alert-meta">
                        <span className="alert-client">{alert.client}</span>
                        <span className="alert-time">{alert.timeStr}</span>
                      </div>
                    </div>
                  </div>
                  <div className="alert-expand">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="alert-details">
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Attack Count</span>
                        <span className="detail-value">{alert.details.attackCount}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Blocked</span>
                        <span className="detail-value">{alert.details.blockedCount}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Source IPs</span>
                        <span className="detail-value">{alert.details.sourceIPs}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Category</span>
                        <span className="detail-value">{alert.details.category}</span>
                      </div>
                    </div>
                    <div className="detail-recommendation">
                      <Zap size={16} style={{ color: '#f59e0b' }} />
                      <div>
                        <span className="rec-title">Recommendation</span>
                        <p>{alert.details.recommendation}</p>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <button
                        className="btn-gradient resolve-btn"
                        onClick={(e) => { e.stopPropagation(); handleResolve(alert.id); }}
                        data-cursor-hover
                      >
                        <CheckCircle size={16} />
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
