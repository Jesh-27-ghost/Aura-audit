import { useState, useMemo } from 'react';
import {
  Users, Search, X, ArrowUpRight, ArrowDownRight,
  Activity, ShieldAlert, Clock, BarChart3, ChevronRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, BarChart, Bar, Cell,
} from 'recharts';
import { generateClients } from '../data/mockData';
import './Clients.css';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <span className="tooltip-label">{payload[0].name || payload[0].dataKey}</span>
      <span className="tooltip-value">{payload[0].value?.toLocaleString()}</span>
    </div>
  );
}

export default function Clients() {
  const [clients] = useState(generateClients());
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [sortBy, setSortBy] = useState('requests');

  const filteredClients = useMemo(() => {
    let list = clients.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.apiKey.toLowerCase().includes(search.toLowerCase())
    );
    list.sort((a, b) => {
      if (sortBy === 'requests') return b.requests - a.requests;
      if (sortBy === 'blockRate') return parseFloat(b.blockRate) - parseFloat(a.blockRate);
      if (sortBy === 'latency') return a.avgLatency - b.avgLatency;
      return 0;
    });
    return list;
  }, [clients, search, sortBy]);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1><Users size={24} style={{ color: 'var(--accent-purple)' }} /> API <span className="text-gradient">Clients</span></h1>
        <p>Monitor and manage connected API clients and their threat profiles</p>
      </div>

      {/* Search & Filters */}
      <div className="clients-toolbar fade-in-up">
        <div className="search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search clients by name or API key..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} data-cursor-hover>
              <X size={16} />
            </button>
          )}
        </div>
        <div className="sort-group">
          <span className="sort-label">Sort by:</span>
          {['requests', 'blockRate', 'latency'].map(s => (
            <button
              key={s}
              className={`sort-btn ${sortBy === s ? 'active' : ''}`}
              onClick={() => setSortBy(s)}
              data-cursor-hover
            >
              {s === 'requests' ? 'Volume' : s === 'blockRate' ? 'Block Rate' : 'Latency'}
            </button>
          ))}
        </div>
      </div>

      {/* Client Table */}
      <div className="glass-card clients-table-card fade-in-up">
        <div className="clients-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>API Key</th>
                <th>Requests</th>
                <th>Blocked</th>
                <th>Block Rate</th>
                <th>Avg Latency</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="client-row"
                  onClick={() => setSelectedClient(client)}
                  data-cursor-hover
                >
                  <td>
                    <div className="client-name-cell">
                      <div className="client-avatar">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <span className="client-name">{client.name}</span>
                        <span className="client-country">{client.country}</span>
                      </div>
                    </div>
                  </td>
                  <td><code className="api-key-code">{client.apiKey}</code></td>
                  <td className="mono-text">{client.requests.toLocaleString()}</td>
                  <td className="mono-text">{client.blocked.toLocaleString()}</td>
                  <td>
                    <div className="block-rate-cell">
                      <div className="mini-bar">
                        <div
                          className="mini-bar-fill"
                          style={{
                            width: `${client.blockRate}%`,
                            background: parseFloat(client.blockRate) > 15 ? '#ef4444' : parseFloat(client.blockRate) > 8 ? '#f59e0b' : '#10b981'
                          }}
                        />
                      </div>
                      <span className="mono-text">{client.blockRate}%</span>
                    </div>
                  </td>
                  <td className="mono-text">{client.avgLatency}ms</td>
                  <td>
                    <span className={`badge ${client.status === 'active' ? 'badge-allowed' : 'badge-info'}`}>
                      {client.status}
                    </span>
                  </td>
                  <td>
                    <ChevronRight size={16} className="row-chevron" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="modal-overlay" onClick={() => setSelectedClient(null)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <div className="client-avatar large">
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h2>{selectedClient.name}</h2>
                  <code className="api-key-code">{selectedClient.apiKey}</code>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelectedClient(null)} data-cursor-hover>
                <X size={20} />
              </button>
            </div>

            {/* Modal Stats */}
            <div className="modal-stats">
              <div className="modal-stat">
                <Activity size={18} style={{ color: '#7c3aed' }} />
                <div>
                  <span className="modal-stat-val">{selectedClient.requests.toLocaleString()}</span>
                  <span className="modal-stat-label">Total Requests</span>
                </div>
              </div>
              <div className="modal-stat">
                <ShieldAlert size={18} style={{ color: '#ef4444' }} />
                <div>
                  <span className="modal-stat-val">{selectedClient.blocked.toLocaleString()}</span>
                  <span className="modal-stat-label">Blocked</span>
                </div>
              </div>
              <div className="modal-stat">
                <BarChart3 size={18} style={{ color: '#f59e0b' }} />
                <div>
                  <span className="modal-stat-val">{selectedClient.blockRate}%</span>
                  <span className="modal-stat-label">Block Rate</span>
                </div>
              </div>
              <div className="modal-stat">
                <Clock size={18} style={{ color: '#06b6d4' }} />
                <div>
                  <span className="modal-stat-val">{selectedClient.avgLatency}ms</span>
                  <span className="modal-stat-label">Avg Latency</span>
                </div>
              </div>
            </div>

            {/* Usage Chart */}
            <div className="modal-section">
              <h3>Usage Over Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={selectedClient.usageData}>
                  <defs>
                    <linearGradient id="modalArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#6b6b8d' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#6b6b8d' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="requests" stroke="#7c3aed" fill="url(#modalArea)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Attacks */}
            <div className="modal-section">
              <h3>Top Attack Categories</h3>
              <div className="attack-bars">
                {selectedClient.topAttacks.map((atk, i) => (
                  <div key={i} className="attack-bar-row">
                    <span className="attack-bar-label">{atk.category}</span>
                    <div className="attack-bar-track">
                      <div
                        className="attack-bar-fill"
                        style={{ width: `${(atk.count / 500) * 100}%` }}
                      />
                    </div>
                    <span className="attack-bar-val mono-text">{atk.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Threats */}
            <div className="modal-section">
              <h3>Recent Requests</h3>
              <div className="modal-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Category</th>
                      <th>Severity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClient.recentRequests.slice(0, 5).map((r, i) => (
                      <tr key={i}>
                        <td className="mono-text">{r.timeStr}</td>
                        <td>{r.category}</td>
                        <td><span className={`badge badge-${r.severity}`}>{r.severity}</span></td>
                        <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
