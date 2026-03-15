import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FileText, Upload, CheckCircle, Briefcase, Award, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CVUpload = () => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/cv/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
        } catch (err) {
            // No profile yet, that's fine
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('cvFile', file);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/cv/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setProfile(res.data.profile);
            toast.success('CV analyzed successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload CV');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="dashboard-loading"><div className="spinner"></div></div>;

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>AI-Powered <span className="gradient-text">CV Analysis</span></h1>
                <p>Upload your resume to generate an optimized skill profile and unlock adaptive assessments.</p>
            </div>

            {!profile ? (
                <div className="card-glass upload-container text-center" style={{ padding: '4rem 2rem' }}>
                    <div className="card-icon card-icon-purple mx-auto">
                        <FileText size={32} />
                    </div>
                    <h2 className="mt-4">Extract Your Potential</h2>
                    <p className="mb-8" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
                        Our AI analyzes your experience, projects, and certifications to build a verified skill profile.
                    </p>

                    <form onSubmit={handleUpload} className="upload-box mt-4">
                        <label className={`file-drop-zone ${file ? 'has-file' : ''}`}>
                            <input type="file" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
                            <div className="drop-zone-content">
                                <Upload size={48} className="mb-3 text-accent" />
                                {file ? (
                                    <div className="selected-file">
                                        <p className="font-bold text-primary">{file.name}</p>
                                        <p className="text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="font-semibold">Click to upload or drag & drop</p>
                                        <p className="text-sm text-muted">Supports PDF, DOCX, TXT (Max 5MB)</p>
                                    </>
                                )}
                            </div>
                        </label>

                        <button 
                            type="submit" 
                            className="btn btn-primary mt-6 btn-lg" 
                            disabled={!file || uploading}
                            style={{ width: '100%', maxWidth: '300px' }}
                        >
                            {uploading ? (
                                <><div className="spinner-sm"></div> Analyzing...</>
                            ) : (
                                <><Upload size={20} /> Analyze My CV</>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="profile-view-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                    {/* Left Column - Summary */}
                    <div className="profile-sidebar">
                        <div className="card" style={{ position: 'sticky', top: '100px' }}>
                            <div className="text-center mb-6">
                                <div className="card-icon card-icon-gold mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                                    <h1 style={{ margin: 0 }}>{profile.candidateName?.charAt(0)}</h1>
                                </div>
                                <h2>{profile.parsedData.name}</h2>
                                <p className="text-accent font-semibold">{profile.parsedData.primaryRole}</p>
                            </div>

                            <div className="stats-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <span className="text-secondary">Exp. Years</span>
                                    <span className="font-bold">{profile.parsedData.totalYearsExperience}</span>
                                </div>
                                <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <span className="text-secondary">Domain</span>
                                    <span className="font-bold">{profile.parsedData.industryDomain}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <p className="text-sm text-secondary mb-4" style={{ fontStyle: 'italic' }}>
                                    {profile.parsedData.summary}
                                </p>
                                <button onClick={() => setProfile(null)} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                                    Re-upload CV
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Skills & Detailed Info */}
                    <div className="profile-main">
                        <div className="card mb-6">
                            <h3 className="mb-4 d-flex align-items-center gap-2">
                                <Award className="text-accent" /> Verified Skill Tiers
                            </h3>
                            <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {profile.parsedData.skills.map((skill, idx) => (
                                    <div key={idx} className="skill-tier-card" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h4 style={{ margin: 0 }}>{skill.skillName}</h4>
                                            <span className={`badge-pill tint-${skill.proficiencyLevel.toLowerCase()}`}>
                                                {skill.proficiencyLevel}
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 text-sm text-secondary mb-3">
                                            <Clock size={14} /> {skill.estimatedYears} Years Professional Experience
                                        </div>
                                        <p className="text-sm" style={{ opacity: 0.8 }}>{skill.evidenceFromCV}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {profile.parsedData.notableProjects?.length > 0 && (
                            <div className="card">
                                <h3 className="mb-4 d-flex align-items-center gap-2">
                                    <Briefcase className="text-accent" /> Key Projects
                                </h3>
                                <div className="projects-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {profile.parsedData.notableProjects.map((project, idx) => (
                                        <div key={idx} className="project-item" style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '1.5rem' }}>
                                            <h4>{project.name}</h4>
                                            <p className="text-sm text-secondary mb-2">{project.description}</p>
                                            <div className="tech-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {project.technologies.map((tech, tIdx) => (
                                                    <span key={tIdx} className="tech-tag">{tech}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CVUpload;
