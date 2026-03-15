import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchCandidates, getCVProfiles, generateAdaptiveTest } from '../api';
import { QRCodeSVG } from 'qrcode.react';
import {
    Search, Users, Award, TrendingUp, AlertTriangle,
    Mail, X, ExternalLink, Filter, Briefcase, ChevronDown,
    FileText, Zap, Loader2, ClipboardCheck
} from 'lucide-react';

const skillLevels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const skillOptions = [
    '', 'React Frontend Development', 'Node.js API Development',
    'JavaScript Debugging', 'SQL Database Querying',
    'Python Scripting', 'DevOps / Docker'
];

export default function EmployerDashboard() {
    const { user } = useAuth();
    const [candidates, setCandidates] = useState([]);
    const [cvProfiles, setCvProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchSkill, setSearchSkill] = useState('');
    const [minScore, setMinScore] = useState('');
    const [level, setLevel] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [activeTab, setActiveTab] = useState('badges'); // 'badges' or 'cv'
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedTest, setGeneratedTest] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {};
            if (searchSkill) params.skill = searchSkill;
            if (minScore) params.minScore = minScore;
            if (level) params.level = level;

            const [{ data: badgeData }, { data: cvData }] = await Promise.all([
                searchCandidates(params),
                getCVProfiles().catch(() => ({ data: [] }))
            ]);
            
            setCandidates(badgeData);
            setCvProfiles(cvData);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData();
    };

    const handleGenerateTest = async (candidateId, skills) => {
        setIsGenerating(true);
        setGeneratedTest(null);
        try {
            const { data } = await generateAdaptiveTest({
                candidateId,
                selectedSkills: skills,
                testConfig: { testType: 'Mixed', numberOfQuestions: 5 }
            });
            setGeneratedTest(data.assessment);
        } catch (err) {
            console.error('Failed to generate test:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const getScoreClass = (score) => {
        if (score >= 85) return 'score-high';
        if (score >= 70) return 'score-medium';
        return 'score-low';
    };

    const getScoreColor = (score) => {
        if (score >= 85) return 'var(--accent-emerald)';
        if (score >= 70) return 'var(--accent-gold)';
        return 'var(--accent-rose)';
    };

    const getBarGradient = (score) => {
        if (score >= 85) return 'linear-gradient(90deg, #10b981, #34d399)';
        if (score >= 70) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        return 'linear-gradient(90deg, #ef4444, #f87171)';
    };

    return (
        <div className="dashboard" id="employer-dashboard">
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <h1>Employer Dashboard</h1>
                <p>Find verified candidates and generate adaptive assessments</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-bar" id="candidate-search" style={{ marginBottom: '2rem' }}>
                <select
                    className="form-select"
                    value={searchSkill}
                    onChange={(e) => setSearchSkill(e.target.value)}
                    id="search-skill"
                >
                    <option value="">All Skills</option>
                    {skillOptions.filter(Boolean).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <input
                    type="number"
                    className="form-input"
                    placeholder="Min Score (0-100)"
                    value={minScore}
                    onChange={(e) => setMinScore(e.target.value)}
                    min="0"
                    max="100"
                    id="search-min-score"
                />
                <select
                    className="form-select"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    id="search-level"
                >
                    <option value="">All Levels</option>
                    {skillLevels.filter(Boolean).map(l => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
                <button type="submit" className="btn btn-primary" id="search-submit">
                    <Search size={18} /> Search
                </button>
            </form>

            {/* Tabs */}
            <div className="tabs" style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <button 
                    className={`tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
                    onClick={() => setActiveTab('badges')}
                    style={{ 
                        padding: '1rem 0.5rem', 
                        background: 'none', 
                        border: 'none', 
                        color: activeTab === 'badges' ? 'var(--accent-primary)' : 'var(--text-muted)', 
                        borderBottom: activeTab === 'badges' ? '2px solid var(--accent-primary)' : 'none', 
                        cursor: 'pointer', 
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <Award size={18} /> Verified Badges
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'cv' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cv')}
                    style={{ 
                        padding: '1rem 0.5rem', 
                        background: 'none', 
                        border: 'none', 
                        color: activeTab === 'cv' ? 'var(--accent-primary)' : 'var(--text-muted)', 
                        borderBottom: activeTab === 'cv' ? '2px solid var(--accent-primary)' : 'none', 
                        cursor: 'pointer', 
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <FileText size={18} /> AI CV Profiles
                </button>
            </div>

            {loading ? (
                <div className="loading-container" style={{ minHeight: '30vh' }}>
                    <div className="spinner"></div>
                    <p className="loading-text">Loading candidates...</p>
                </div>
            ) : activeTab === 'badges' ? (
                <>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        <Users size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        {candidates.length} verified candidate{candidates.length !== 1 ? 's' : ''} found
                    </p>

                    {candidates.length === 0 ? (
                        <div className="empty-state">
                            <div className="icon"><Search size={48} /></div>
                            <h3>No candidates found</h3>
                            <p>Try adjusting your search filters</p>
                        </div>
                    ) : (
                        <div className="dashboard-grid">
                            {candidates.map((item, i) => (
                                <div className="candidate-card card" key={i}>
                                    <div className="candidate-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div className="candidate-info">
                                            <h3 style={{ margin: 0 }}>{item.candidate.name}</h3>
                                            <p className="candidate-skill text-accent" style={{ fontSize: '0.9rem', marginTop: '4px' }}>{item.assessment.skillName}</p>
                                        </div>
                                        <span className={`candidate-score-badge ${getScoreClass(item.assessment.overallScore)}`}>
                                            {item.assessment.overallScore}
                                        </span>
                                    </div>

                                    <span className={`badge-level badge-level-${item.assessment.skillLevel?.toLowerCase()}`}>
                                        {item.assessment.skillLevel}
                                    </span>

                                    <div className="badge-tags" style={{ justifyContent: 'flex-start', marginTop: '1rem', marginBottom: '1rem' }}>
                                        {item.assessment.verifiedSkills?.slice(0, 3).map((skill, j) => (
                                            <span className="skill-tag" key={j}>{skill}</span>
                                        ))}
                                    </div>

                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem', fontStyle: 'italic' }}>
                                        "{item.assessment.employerSummary}"
                                    </p>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => setSelectedCandidate(item)}
                                            style={{ flex: 1 }}
                                        >
                                            View Report
                                        </button>
                                        {item.badgeId && (
                                            <Link to={`/verify/${item.badgeId}`} className="btn btn-secondary btn-sm">
                                                <ExternalLink size={14} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        <FileText size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        {cvProfiles.length} candidate CV profile{cvProfiles.length !== 1 ? 's' : ''} available
                    </p>

                    {cvProfiles.length === 0 ? (
                        <div className="empty-state">
                            <div className="icon"><FileText size={48} /></div>
                            <h3>No CV profiles found</h3>
                            <p>Candidates need to upload their CVs first</p>
                        </div>
                    ) : (
                        <div className="dashboard-grid">
                            {cvProfiles.map((profile, i) => (
                                <div className="candidate-card card" key={i}>
                                    <div className="candidate-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div className="candidate-info">
                                            <h3 style={{ margin: 0 }}>{profile.parsedData.name}</h3>
                                            <p className="candidate-skill text-accent" style={{ fontSize: '0.9rem', marginTop: '4px' }}>{profile.parsedData.primaryRole}</p>
                                        </div>
                                        <div className="exp-badge" style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                                            {profile.parsedData.totalYearsExperience}Y Exp
                                        </div>
                                    </div>
                                    
                                    <div className="badge-tags" style={{ justifyContent: 'flex-start', marginTop: '1rem', marginBottom: '1rem' }}>
                                        {profile.parsedData.skills?.slice(0, 4).map((s, j) => (
                                            <span className="skill-tag" key={j} style={{ fontSize: '0.75rem' }}>{s.skillName}</span>
                                        ))}
                                    </div>

                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem', height: '3.6em', overflow: 'hidden' }}>
                                        {profile.parsedData.summary}
                                    </p>

                                    <button 
                                        className="btn btn-gold btn-sm" 
                                        style={{ width: '100%' }}
                                        onClick={() => handleGenerateTest(profile.candidateId, profile.parsedData.skills.slice(0, 2).map(s => s.skillName))}
                                    >
                                        <Zap size={14} /> Generate Adaptive Test
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Assessment Detail Modal */}
            {selectedCandidate && (
                <div className="modal-overlay" onClick={() => setSelectedCandidate(null)}>
                    <div className="modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: '2.5rem' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2>{selectedCandidate.candidate.name}</h2>
                            <button className="modal-close" onClick={() => setSelectedCandidate(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                            <div className="score-display text-center">
                                <div style={{ fontSize: '3rem', fontWeight: 900, color: getScoreColor(selectedCandidate.assessment.overallScore) }}>
                                    {selectedCandidate.assessment.overallScore}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Score</div>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '4px' }}>{selectedCandidate.assessment.skillName}</h4>
                                <span className={`badge-level badge-level-${selectedCandidate.assessment.skillLevel?.toLowerCase()}`}>
                                    {selectedCandidate.assessment.skillLevel}
                                </span>
                            </div>
                        </div>

                        <div className="modal-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <a href={`mailto:${selectedCandidate.candidate.email}`} className="btn btn-primary flex-1">
                                <Mail size={18} /> Contact Candidate
                            </a>
                            <button className="btn btn-secondary" onClick={() => setSelectedCandidate(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Generated Test Modal */}
            {generatedTest && (
                <div className="modal-overlay" onClick={() => setGeneratedTest(null)}>
                    <div className="modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', padding: '2.5rem' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ marginBottom: '4px' }}>Custom <span className="gradient-text">Adaptive Assessment</span></h2>
                                <p className="text-sm text-secondary">Tailored for {generatedTest.candidateName} profile</p>
                            </div>
                            <button className="modal-close" onClick={() => setGeneratedTest(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="test-questions" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem' }}>
                            {generatedTest.questions.map((q, idx) => (
                                <div key={idx} className="question-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-gold)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)' }}>Q{idx + 1} • {q.questionType}</span>
                                        <span className={`badge-pill tint-${q.difficulty.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>{q.difficulty}</span>
                                    </div>
                                    <h4 style={{ marginBottom: '1rem', lineHeight: 1.4 }}>{q.question}</h4>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <ClipboardCheck size={14} /> Evaluates: {q.expectedSkillsEvaluated}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="modal-footer" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="btn btn-secondary" onClick={() => setGeneratedTest(null)}>Close</button>
                            <button className="btn btn-primary" onClick={() => window.print()}>
                                <FileText size={18} /> Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isGenerating && (
                <div className="modal-overlay">
                    <div className="card-glass text-center p-8" style={{ width: '400px', padding: '3rem' }}>
                        <Loader2 size={48} className="spinner mx-auto mb-4 text-accent" />
                        <h3 className="mb-2">Synthesizing Assessment...</h3>
                        <p className="text-secondary text-sm">Gemini AI is analyzing candidate proficiency and mapping difficulty tiers.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
