import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadCV, getMyCVProfile } from '../api';
import toast from 'react-hot-toast';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Award, Briefcase, ChevronRight, Star, Clock } from 'lucide-react';

export default function CandidateCVUpload() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchProfile = async () => {
        try {
            const { data } = await getMyCVProfile();
            setProfile(data.parsedData);
        } catch (err) {
            // 404 just means they haven't uploaded yet
            if (err.response?.status !== 404) {
                console.error("Failed to fetch CV profile", err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        const toastId = toast.loading('Uploading and analyzing CV with Gemini AI...');

        const formData = new FormData();
        formData.append('cvFile', file);

        try {
            const { data } = await uploadCV(formData);
            setProfile(data.profile.parsedData);
            toast.success('CV analyzed successfully!', { id: toastId });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to analyze CV', { id: toastId });
            console.error("CV Upload error:", err);
        } finally {
            setUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt']
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024 // 5MB
    });

    const getProficiencyColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'expert': return 'var(--accent-primary)';
            case 'advanced': return '#10b981';
            case 'intermediate': return 'var(--accent-secondary)';
            default: return 'var(--text-muted)';
        }
    };

    const getProficiencyWidth = (level) => {
        switch (level?.toLowerCase()) {
            case 'expert': return '100%';
            case 'advanced': return '75%';
            case 'intermediate': return '50%';
            default: return '25%';
        }
    };

    if (loading) {
        return (
            <div className="loading-container" style={{ minHeight: '60vh' }}>
                <div className="spinner"></div>
                <p className="loading-text">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="dashboard" id="cv-upload-page">
            <div className="dashboard-header">
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={28} /> AI Skill Profile
                </h1>
                <p>Upload your CV and let Gemini AI build your verified skill profile</p>
            </div>

            {/* Upload Zone */}
            <div 
                {...getRootProps()} 
                className={`cv-dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''} ${uploading ? 'uploading' : ''}`}
            >
                <input {...getInputProps()} />
                
                {uploading ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <div className="spinner" style={{ width: '40px', height: '40px', marginBottom: '1rem', margin: '0 auto' }}></div>
                        <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Analyzing your CV...</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gemini is extracting your skills, experience, and proficiency levels. This takes about 10-15 seconds.</p>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <UploadCloud size={48} style={{ color: isDragActive ? 'var(--accent-primary)' : 'var(--text-muted)', marginBottom: '1rem', transition: 'color 0.3s' }} />
                        <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
                            {isDragActive ? 'Drop your CV here...' : 'Upload your updated CV'}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Supported formats: PDF, DOCX, TXT (Max 5MB)
                        </p>
                        <button className="btn btn-primary" type="button" style={{ pointerEvents: 'none' }}>
                            Select File
                        </button>
                    </div>
                )}
            </div>

            {/* AI Profile Display */}
            {profile && (
                <div className="cv-profile-container mt-8" style={{ marginTop: '3rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '4px solid var(--accent-primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>{profile.name}</h2>
                                <p style={{ fontSize: '1.1rem', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                    <Briefcase size={18} /> {profile.primaryRole}
                                </p>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '800px' }}>
                                    {profile.summary}
                                </p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                                    {profile.totalYearsExperience}+
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '1px' }}>
                                    Years Experience
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>
                        <Award size={20} color="var(--accent-primary)" />
                        Extracted Technical Skills
                    </h3>

                    <div className="dashboard-grid">
                        {profile.skills?.sort((a, b) => b.estimatedYears - a.estimatedYears).map((skill, idx) => (
                            <div className="task-card" key={idx} style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                            {skill.skillName}
                                        </h4>
                                        <span className="skill-tag" style={{ border: 'none', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', fontSize: '0.75rem' }}>
                                            {skill.category}
                                        </span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: getProficiencyColor(skill.proficiencyLevel), fontWeight: 600, fontSize: '0.9rem' }}>
                                            {skill.proficiencyLevel}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
                                            <Clock size={12} /> {skill.estimatedYears} yrs
                                        </div>
                                    </div>
                                </div>

                                {/* Proficiency Bar */}
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
                                    <div style={{ 
                                        height: '100%', 
                                        width: getProficiencyWidth(skill.proficiencyLevel),
                                        background: getProficiencyColor(skill.proficiencyLevel),
                                        borderRadius: '3px',
                                        transition: 'width 1s ease-out'
                                    }}></div>
                                </div>

                                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '8px', borderLeft: `2px solid ${getProficiencyColor(skill.proficiencyLevel)}` }}>
                                    <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Evidence from CV:</span>
                                    "{skill.evidenceFromCV}"
                                </div>
                            </div>
                        ))}
                    </div>

                    {profile.notableProjects?.length > 0 && (
                        <div style={{ marginTop: '3rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>
                                <Briefcase size={20} color="var(--accent-secondary)" />
                                Notable Projects
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {profile.notableProjects.map((project, idx) => (
                                    <div key={idx} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid var(--accent-secondary)' }}>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{project.name}</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                                            {project.description}
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {project.technologies?.map(tech => (
                                                <span key={tech} className="skill-tag" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
