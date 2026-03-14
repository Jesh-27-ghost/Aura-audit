import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBadges, getMyTaskSubmissions } from '../api';
import { Award, Video, Trophy, ArrowRight, Shield, Briefcase } from 'lucide-react';

export default function CandidateDashboard() {
    const { user } = useAuth();
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBadges = async (isBackground = false) => {
            if (!isBackground) setLoading(true);
            try {
                const [badgesRes, tasksRes] = await Promise.all([
                    getMyBadges(),
                    getMyTaskSubmissions()
                ]);
                
                // Format task submissions to look like badges for the grid
                const formattedTasks = tasksRes.data.map(task => ({
                    ...task,
                    badgeId: task._id, // Use submission ID as route target
                    industry: `Employer Task: ${task.taskTitle}`,
                    issuedAt: task.createdAt,
                    isEmployerTask: true
                }));

                const combined = [...badgesRes.data, ...formattedTasks].sort((a, b) => 
                    new Date(b.issuedAt) - new Date(a.issuedAt)
                );

                setBadges(combined);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                if (!isBackground) setLoading(false);
            }
        };
        
        fetchBadges();

        // Auto-refresh every 10 seconds
        const interval = setInterval(() => {
            fetchBadges(true);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const getLevelClass = (level) => {
        switch (level) {
            case 'Expert': return 'badge-level-expert';
            case 'Advanced': return 'badge-level-advanced';
            case 'Intermediate': return 'badge-level-intermediate';
            default: return 'badge-level-beginner';
        }
    };

    const getScoreClass = (score) => {
        if (score >= 85) return 'score-high';
        if (score >= 70) return 'score-medium';
        return 'score-low';
    };

    return (
        <div className="dashboard" id="candidate-dashboard">
            <div className="dashboard-header">
                <h1>Welcome, {user?.name} 👋</h1>
                <p>Prove your skills. Earn verified badges. Get hired.</p>
            </div>

            {/* Stats */}
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-card-icon card-icon-purple">
                        <Award size={24} />
                    </div>
                    <div>
                        <div className="stat-card-value">{badges.length}</div>
                        <div className="stat-card-label">Verified Badges</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon card-icon-gold">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <div className="stat-card-value">
                            {badges.length > 0 ? Math.max(...badges.map(b => b.overallScore)) : 0}
                        </div>
                        <div className="stat-card-label">Highest Score</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon card-icon-emerald">
                        <Shield size={24} />
                    </div>
                    <div>
                        <div className="stat-card-value">
                            {badges.filter(b => b.skillLevel === 'Expert' || b.skillLevel === 'Advanced').length}
                        </div>
                        <div className="stat-card-label">Advanced+ Skills</div>
                    </div>
                </div>
            </div>

            {/* Quick Action */}
            <Link to="/record" className="card" id="record-task-cta" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', textDecoration: 'none' }}>
                <div className="card-icon card-icon-purple" style={{ margin: 0, flexShrink: 0 }}>
                    <Video size={28} />
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '0.25rem' }}>Record a New Skill Assessment</h3>
                    <p>Choose a skill, record your task, and let Gemini AI verify your abilities</p>
                </div>
                <ArrowRight size={24} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            </Link>

            {/* Badges Grid */}
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.5rem' }}>
                Your Badges
            </h2>

            {loading ? (
                <div className="loading-container" style={{ minHeight: '30vh' }}>
                    <div className="spinner"></div>
                    <p className="loading-text">Loading your badges...</p>
                </div>
            ) : badges.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">🏆</div>
                    <h3>No badges yet</h3>
                    <p>Complete your first skill assessment to earn a verified badge!</p>
                    <Link to="/record" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        <Video size={18} /> Record Your First Task
                    </Link>
                </div>
            ) : (
                <div className="dashboard-grid">
                    {badges.map((badge) => (
                        <Link
                            to={badge.isEmployerTask ? `/tasks/submission/${badge._id}` : `/badge/${badge.badgeId}`}
                            key={badge._id || badge.badgeId}
                            className="card dashboard-badge-card"
                            style={{ textDecoration: 'none', cursor: 'pointer', position: 'relative' }}
                        >
                            {badge.isEmployerTask && (
                                <div style={{ position: 'absolute', top: -10, right: -10, background: 'var(--accent-gold)', color: '#000', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Briefcase size={12} /> Employer Task
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div>
                                    <h3 style={{ marginBottom: '0.25rem', paddingRight: '1rem' }}>{badge.skillName}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{badge.industry}</p>
                                </div>
                                <span className={`candidate-score-badge ${getScoreClass(badge.overallScore)}`}>
                                    {badge.overallScore}
                                </span>
                            </div>
                            <span className={`badge-level ${getLevelClass(badge.skillLevel)}`}>
                                {badge.skillLevel}
                            </span>
                            <div className="badge-tags" style={{ justifyContent: 'flex-start', marginTop: '0.75rem', marginBottom: 0 }}>
                                {badge.verifiedSkills?.slice(0, 3).map((skill, i) => (
                                    <span className="skill-tag" key={i}>{skill}</span>
                                ))}
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                                Issued: {new Date(badge.issuedAt).toLocaleDateString()}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
