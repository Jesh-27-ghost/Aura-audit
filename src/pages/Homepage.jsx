import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Lock, Zap, Globe, Eye, ChevronRight } from 'lucide-react';
import './Homepage.css';

const FEATURES = [
  {
    icon: Lock,
    title: 'Drop-in Integration',
    desc: 'Change one base_url and you\'re protected. No SDK, no code rewrite.',
    color: '#7c3aed',
  },
  {
    icon: Zap,
    title: '<100ms Latency',
    desc: 'Military-grade filtering without compromising your user experience.',
    color: '#06b6d4',
  },
  {
    icon: Globe,
    title: 'Hinglish Detection',
    desc: 'First firewall that catches Hindi-English mixed prompt injection attacks.',
    color: '#3b82f6',
  },
  {
    icon: Eye,
    title: 'Real-time Monitoring',
    desc: 'Live dashboard tracking every prompt, every threat, every millisecond.',
    color: '#ec4899',
  },
];

export default function Homepage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/overview');
  };

  return (
    <div className="homepage">
      <div className="animated-bg" />
      
      {/* Gradient mesh overlay */}
      <div className="homepage-mesh" />

      {/* Navbar */}
      <header className="home-header">
        <div className="home-logo">
          <div className="home-logo-icon">
            <Shield size={22} strokeWidth={2.5} />
          </div>
          <span className="home-logo-text">ShieldProxy</span>
        </div>
        <nav className="home-nav">
          <a href="#features" className="home-nav-link" data-cursor-hover>Features</a>
          <a href="#security" className="home-nav-link" data-cursor-hover>Security</a>
          <a href="#login" className="home-nav-link" data-cursor-hover>Login</a>
        </nav>
      </header>

      <main className="homepage-content">
        {/* Left Section */}
        <div className="home-left">
          <div className="home-tagline-badge">
            <Zap size={14} />
            <span>AI Security Infrastructure</span>
          </div>

          <h1 className="home-title">
            <span className="title-line">Every Indian startup</span>
            <span className="title-line">is building AI chatbots.</span>
            <span className="title-line title-accent shimmer-text">None of them are secure.</span>
          </h1>

          <div className="home-problem">
            <div className="problem-card">
              <div className="problem-icon problem-red">
                <span>⚠</span>
              </div>
              <div>
                <h3>The Problem</h3>
                <p>AI chatbots are vulnerable to prompt injection, jailbreaks, and system prompt leaks. One attack can cause PR disasters, financial abuse, and data breaches.</p>
              </div>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon problem-green">
                <span>🛡</span>
              </div>
              <div>
                <h3>The Solution</h3>
                <p>ShieldProxy acts as a reverse proxy that filters all prompts before reaching your LLMs. Drop-in integration with &lt;100ms latency and Hinglish attack detection.</p>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="home-features" id="features">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-chip" data-cursor-hover>
                <f.icon size={16} style={{ color: f.color }} />
                <span>{f.title}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="home-stats">
            <div className="home-stat">
              <span className="home-stat-val">15K+</span>
              <span className="home-stat-label">Threats Blocked</span>
            </div>
            <div className="home-stat-divider" />
            <div className="home-stat">
              <span className="home-stat-val">&lt;45ms</span>
              <span className="home-stat-label">Avg Latency</span>
            </div>
            <div className="home-stat-divider" />
            <div className="home-stat">
              <span className="home-stat-val">97.2%</span>
              <span className="home-stat-label">Block Rate</span>
            </div>
          </div>
        </div>

        {/* Right Section — Login */}
        <div className="home-right" id="login">
          <div className="login-card glass-card">
            <div className="login-glow" />
            
            <div className="login-header">
              <div className="login-shield">
                <Shield size={28} />
              </div>
              <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p>{isLogin ? 'Sign in to your ShieldProxy dashboard' : 'Get started with ShieldProxy security'}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="fullname">Full Name</label>
                  <input
                    id="fullname"
                    type="text"
                    className="input-field"
                    placeholder="Enter your name"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {isLogin && (
                <div className="form-extras">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-link" data-cursor-hover>Forgot password?</a>
                </div>
              )}

              <button type="submit" className="btn-gradient login-btn" data-cursor-hover>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </button>

              <div className="login-divider">
                <span>or</span>
              </div>

              <button
                type="button"
                className="btn-outline login-switch"
                onClick={() => setIsLogin(!isLogin)}
                data-cursor-hover
              >
                {isLogin ? 'Create a new account' : 'Already have an account? Login'}
                <ChevronRight size={16} />
              </button>
            </form>

            <div className="login-footer">
              <Lock size={12} />
              <span>Protected by ShieldProxy Security</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
