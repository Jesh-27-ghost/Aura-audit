import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  Users,
  Bell,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Zap,
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/overview', label: 'Overview', icon: LayoutDashboard },
  { path: '/simulator', label: 'Simulator', icon: Zap },
  { path: '/clients', label: 'Clients', icon: Users },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Shield size={24} strokeWidth={2.5} />
          <div className="logo-pulse" />
        </div>
        {!collapsed && (
          <div className="logo-text">
            <span className="logo-name">ShieldProxy</span>
            <span className="logo-tag">LLM Firewall</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">{!collapsed && 'DASHBOARD'}</div>
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            data-cursor-hover
          >
            <div className="nav-icon-wrap">
              <Icon size={20} />
            </div>
            {!collapsed && <span className="nav-label">{label}</span>}
            {!collapsed && path === '/alerts' && (
              <span className="nav-badge">5</span>
            )}
            {location.pathname === path && <div className="nav-active-indicator" />}
          </NavLink>
        ))}
      </nav>

      {/* Status */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="system-status">
            <div className="status-dot" />
            <span>System Active</span>
            <Zap size={14} className="status-zap" />
          </div>
        )}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          data-cursor-hover
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
