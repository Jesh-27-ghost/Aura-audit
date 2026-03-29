import { useState, useMemo } from 'react';
import {
  BarChart3, Globe, Clock, Activity, TrendingUp,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, BarChart, Bar, Cell,
  PieChart, Pie,
} from 'recharts';
import {
  generateVolumeData, generateAttackBreakdown,
  generateLatencyDistribution, generateGeoData,
} from '../data/mockData';
import WorldMap from '../components/WorldMap';
import './Analytics.css';

const CHART_COLORS = ['#7c3aed', '#06b6d4', '#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#f97316', '#6366f1', '#a78bfa', '#14b8a6'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <span className="tooltip-label">{label || payload[0].name || payload[0]?.payload?.name || payload[0].dataKey}</span>
      <span className="tooltip-value">{payload[0].value?.toLocaleString()}</span>
    </div>
  );
}

export default function Analytics() {
  const [volumeData] = useState(generateVolumeData(24));
  const [attackBreakdown] = useState(generateAttackBreakdown());
  const [latencyDist] = useState(generateLatencyDistribution());
  const [geoData] = useState(generateGeoData());

  const maxGeoAttacks = useMemo(() => Math.max(...geoData.map(g => g.attacks)), [geoData]);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1><BarChart3 size={24} style={{ color: 'var(--accent-purple)' }} /> <span className="text-gradient">Analytics</span></h1>
        <p>Deep-dive into security metrics, attack patterns, and performance data</p>
      </div>

      {/* Request Volume */}
      <div className="glass-card chart-card analytics-chart fade-in-up">
        <div className="chart-header">
          <h3><Activity size={18} /> Request Volume</h3>
          <span className="chart-period">Last 24 hours</span>
        </div>
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="areaGrad3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6b6b8d' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b6b8d' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="requests" stroke="#7c3aed" fill="url(#areaGrad1)" strokeWidth={2} name="Total Requests" />
              <Area type="monotone" dataKey="blocked" stroke="#ef4444" fill="url(#areaGrad2)" strokeWidth={2} name="Blocked" />
              <Area type="monotone" dataKey="allowed" stroke="#10b981" fill="url(#areaGrad3)" strokeWidth={1.5} name="Allowed" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="chart-legends">
            <span className="chart-legend"><span className="legend-line" style={{ background: '#7c3aed' }} /> Total</span>
            <span className="chart-legend"><span className="legend-line" style={{ background: '#ef4444' }} /> Blocked</span>
            <span className="chart-legend"><span className="legend-line" style={{ background: '#10b981' }} /> Allowed</span>
          </div>
        </div>
      </div>

      <div className="grid-2 fade-in-up" style={{ marginTop: '24px' }}>
        {/* Attack Category Breakdown */}
        <div className="glass-card chart-card">
          <div className="chart-header">
            <h3><TrendingUp size={18} /> Attack Category Breakdown</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={attackBreakdown} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6b6b8d' }} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  tick={{ fontSize: 11, fill: '#a0a0c0' }}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                  {attackBreakdown.map((entry, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency Distribution */}
        <div className="glass-card chart-card">
          <div className="chart-header">
            <h3><Clock size={18} /> Latency Distribution</h3>
            <span className="chart-period">Response time histogram</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={latencyDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#6b6b8d' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b6b8d' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={36}>
                  {latencyDist.map((_, index) => (
                    <Cell key={index} fill={`hsl(${180 + index * 25}, 70%, 55%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Geo Distribution */}
      <div className="glass-card chart-card geo-card fade-in-up" style={{ marginTop: '24px' }}>
        <div className="chart-header">
          <h3><Globe size={18} /> Attack Geo-Distribution</h3>
          <span className="chart-period">Global threat origin map</span>
        </div>
        <div className="geo-content">
          {/* World Map Heatmap */}
          <div className="geo-map-container">
            <WorldMap geoData={geoData} />
          </div>
          
          {/* Country List */}
          <div className="geo-list">
            <h4>Top Attack Origins</h4>
            {geoData.map((loc, i) => (
              <div key={i} className="geo-row">
                <span className="geo-rank">{i + 1}</span>
                <span className="geo-dot-sm" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="geo-country">{loc.country}</span>
                <div className="geo-bar-wrap">
                  <div
                    className="geo-bar-fill"
                    style={{
                      width: `${(loc.attacks / maxGeoAttacks) * 100}%`,
                      background: CHART_COLORS[i % CHART_COLORS.length],
                    }}
                  />
                </div>
                <span className="geo-attacks mono-text">{loc.attacks.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
