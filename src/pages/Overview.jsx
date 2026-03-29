import { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert, Clock, Users, TrendingUp, TrendingDown,
  Activity, AlertTriangle, Zap, RefreshCw,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  generateThreatFeed, generateStats, generateThreatDistribution,
  generateVolumeData, generateThreatLog,
} from '../data/mockData';
import './Overview.css';

const CHART_COLORS = ['#7c3aed', '#06b6d4', '#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#f97316', '#6366f1', '#a78bfa', '#14b8a6'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <span className="tooltip-label">{payload[0].name || payload[0].dataKey}</span>
      <span className="tooltip-value">{payload[0].value?.toLocaleString()}</span>
    </div>
  );
}

export default function Overview() {
  const [stats, setStats] = useState(generateStats());
  const [threats, setThreats] = useState(generateThreatFeed(15));
  const [distribution, setDistribution] = useState(generateThreatDistribution());
  const [volumeData, setVolumeData] = useState(generateVolumeData(24));
  const [isLive, setIsLive] = useState(true);
  const feedRef = useRef(null);

  // Simulate live WebSocket updates
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const newThreat = generateThreatLog();
      setThreats(prev => [newThreat, ...prev.slice(0, 19)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Refresh stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(generateStats());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const blockRateValue = parseFloat(stats.blockRate);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (blockRateValue / 100) * circumference;

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="header-row">
          <div>
            <h1>Dashboard <span className="text-gradient">Overview</span></h1>
            <p>Real-time threat monitoring and analysis</p>
          </div>
          <div className="header-actions">
            <button
              className={`live-toggle ${isLive ? 'active' : ''}`}
              onClick={() => setIsLive(!isLive)}
              data-cursor-hover
            >
              <span className={`live-dot ${isLive ? '' : 'paused'}`} />
              {isLive ? 'LIVE' : 'PAUSED'}
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setStats(generateStats());
                setDistribution(generateThreatDistribution());
                setVolumeData(generateVolumeData(24));
              }}
              data-cursor-hover
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-stats fade-in-up">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <ShieldAlert size={22} style={{ color: '#f87171' }} />
          </div>
          <div className="stat-value">{stats.threatsBlocked.toLocaleString()}</div>
          <div className="stat-label">Threats Blocked</div>
          <div className="stat-trend up">
            <TrendingUp size={14} /> +{stats.threatsBlockedDelta}% from yesterday
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
            <Clock size={22} style={{ color: '#67e8f9' }} />
          </div>
          <div className="stat-value">{stats.avgLatency}ms</div>
          <div className="stat-label">Average Latency</div>
          <div className="stat-trend up">
            <TrendingDown size={14} /> {stats.avgLatencyDelta}% improvement
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(124, 58, 237, 0.12)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
            <Users size={22} style={{ color: '#a78bfa' }} />
          </div>
          <div className="stat-value">{stats.activeClients}</div>
          <div className="stat-label">Active Clients</div>
          <div className="stat-trend up">
            <TrendingUp size={14} /> +{stats.activeClientsDelta}% growth
          </div>
        </div>

        {/* Block Rate Circular */}
        <div className="glass-card stat-card block-rate-card">
          <div className="block-rate-content">
            <div className="circular-metric glow-ring">
              <svg width="128" height="128">
                <circle
                  cx="64" cy="64" r="54"
                  fill="none"
                  stroke="rgba(124, 58, 237, 0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="64" cy="64" r="54"
                  fill="none"
                  stroke="url(#blockRateGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
                <defs>
                  <linearGradient id="blockRateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="metric-value">
                {stats.blockRate}%
                <span>Block Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2 fade-in-up" style={{ marginBottom: '28px' }}>
        {/* Volume Chart */}
        <div className="glass-card chart-card">
          <div className="chart-header">
            <h3><Activity size={18} /> Request Volume</h3>
            <span className="chart-period">Last 24 hours</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6b6b8d' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b6b8d' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="requests" stroke="#7c3aed" fill="url(#colorRequests)" strokeWidth={2} />
                <Area type="monotone" dataKey="blocked" stroke="#ef4444" fill="url(#colorBlocked)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Distribution */}
        <div className="glass-card chart-card">
          <div className="chart-header">
            <h3><AlertTriangle size={18} /> Threat Distribution</h3>
            <span className="chart-period">All categories</span>
          </div>
          <div className="chart-body donut-container">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-legend">
              {distribution.slice(0, 5).map((item, i) => (
                <div key={i} className="legend-item">
                  <span className="legend-dot" style={{ background: CHART_COLORS[i] }} />
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-val">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Interception Feed */}
      <div className="glass-card feed-card fade-in-up">
        <div className="chart-header">
          <h3>
            <Zap size={18} style={{ color: '#f59e0b' }} />
            Live Interception Feed
          </h3>
          <div className="feed-status">
            <span className={`live-dot ${isLive ? '' : 'paused'}`} />
            {threats.length} events
          </div>
        </div>
        <div className="feed-table-wrap" ref={feedRef}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Client</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Latency</th>
                <th>Source IP</th>
              </tr>
            </thead>
            <tbody>
              {threats.map((t, i) => (
                <tr key={t.id} className={i === 0 && isLive ? 'new-row' : ''}>
                  <td className="mono-text">{t.timeStr}</td>
                  <td>{t.client}</td>
                  <td>{t.category}</td>
                  <td><span className={`badge badge-${t.severity}`}>{t.severity}</span></td>
                  <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                  <td className="mono-text">{t.latency}ms</td>
                  <td className="mono-text">{t.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
