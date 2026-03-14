import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { runCode, submitCodeChallenge, getSkills } from '../api';
import toast from 'react-hot-toast';
import { 
    Play, Square, Upload, Terminal, AlertTriangle, 
    Monitor, Camera, Shield, Search, ChevronDown, List
} from 'lucide-react';
import AIAnalysisOverlay from '../components/AIAnalysisOverlay';

const LANGUAGES = [
    { id: 'python', name: 'Python', defaultValue: 'def solution():\n    # Write your code here\n    print("Hello, SkillBuster!")\n\nsolution()' },
    { id: 'javascript', name: 'JavaScript', defaultValue: 'function solution() {\n    // Write your code here\n    console.log("Hello, SkillBuster!");\n}\n\nsolution();' },
    { id: 'cpp', name: 'C++', defaultValue: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, SkillBuster!" << std::endl;\n    return 0;\n}' },
    { id: 'node', name: 'Node.js', defaultValue: 'console.log("Hello, SkillBuster!");' },
    { id: 'sql', name: 'SQL', defaultValue: '-- Write your SQL query here\nSELECT "Hello, SkillBuster!" as message;' }
];

export default function SkillProofEditor() {
    const navigate = useNavigate();
    const [language, setLanguage] = useState(LANGUAGES[0]);
    const [code, setCode] = useState(language.defaultValue);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    
    // Anti-cheating state
    const [suspicionScore, setSuspicionScore] = useState({
        tabSwitches: 0,
        blurEvents: 0,
        copyPastes: 0
    });
    
    // Recording state
    const [isRecording, setIsRecording] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timer, setTimer] = useState(0);
    
    const mediaRecorderRef = useRef(null);
    const screenStreamRef = useRef(null);
    const cameraStreamRef = useRef(null);
    const combinedStreamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    
    // UI state
    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState('');
    const [challenge, setChallenge] = useState({
        title: 'Solve the Coding Challenge',
        description: 'Implement a function that demonstrates your proficiency in the selected language. Your coding process is being recorded for verification.'
    });

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const { data } = await getSkills();
                setSkills(data);
                if (data.length > 0) setSelectedSkill(data[0].name);
            } catch (err) {
                console.error('Failed to fetch skills:', err);
            }
        };
        fetchSkills();

        // Setup Anti-cheating listeners
        const handleVisibilityChange = () => {
            if (document.hidden && isRecording) {
                setSuspicionScore(prev => ({ ...prev, tabSwitches: prev.tabSwitches + 1 }));
                toast.error('Warning: Tab switch detected! (Anti-cheating active)', { icon: '🛡️' });
            }
        };

        const handleBlur = () => {
            if (isRecording) {
                setSuspicionScore(prev => ({ ...prev, blurEvents: prev.blurEvents + 1 }));
            }
        };

        const handlePaste = (e) => {
            if (isRecording) {
                setSuspicionScore(prev => ({ ...prev, copyPastes: prev.copyPastes + 1 }));
                // We don't block paste, but we log it
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('paste', handlePaste);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('paste', handlePaste);
            stopAllStreams();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRecording]);

    const stopAllStreams = () => {
        [screenStreamRef.current, cameraStreamRef.current, combinedStreamRef.current].forEach(s => {
            if (s) s.getTracks().forEach(t => t.stop());
        });
    };

    const startRecording = async () => {
        try {
            // Get Screen Stream
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });
            screenStreamRef.current = screenStream;

            // Get Camera Stream for "Face-in-face" verification
            const cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 320, height: 240 },
                audio: false
            });
            cameraStreamRef.current = cameraStream;

            // In a real app we might composite these, but here we'll just record the primary screen stream
            // for the hackathon MVP while showing the camera in a corner overlay.
            const mediaRecorder = new MediaRecorder(screenStream, {
                mimeType: 'video/webm;codecs=vp9'
            });

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            mediaRecorder.start(1000);
            setIsRecording(true);
            setTimer(0);

            timerRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);

            toast.success('Recording started! Coding environment unlocked.');
        } catch (err) {
            console.error('Recording error:', err);
            toast.error('Failed to start recording. Permissions required.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRecording(false);
        stopAllStreams();
    };

    const handleRunCode = async () => {
        if (!code.trim()) return;
        setIsRunning(true);
        setOutput('Executing code...\n');
        try {
            const { data } = await runCode({ language: language.id, code });
            setOutput(data.output || 'No output produced.');
        } catch (err) {
            setOutput(`Error: ${err.response?.data?.details || err.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (isRecording) stopRecording();
        if (chunksRef.current.length === 0) {
            toast.error('No recording captured.');
            return;
        }

        setIsSubmitting(true);
        const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        
        const formData = new FormData();
        formData.append('video', videoBlob, 'skill-code-recording.webm');
        formData.append('skillName', selectedSkill);
        formData.append('code', code);
        formData.append('output', output);
        formData.append('suspicionScore', JSON.stringify(suspicionScore));

        try {
            const { data } = await submitCodeChallenge(formData);
            toast.success('Challenge submitted successfully!');
            navigate(`/results/${data.assessment._id}`);
        } catch (err) {
            toast.error('Submission failed.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <div className="dashboard" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                
                {/* Main Content Area */}
                <div>
                    <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Shield className="text-accent" size={32} />
                            <h1>SkillProof Code Editor</h1>
                        </div>
                        <p>Complete the task below. Your session is monitored for authenticity.</p>
                    </div>

                    {/* Problem Statement Area */}
                    <div className="candidate-card" style={{ marginBottom: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>Problem: {selectedSkill} Proficiency</h3>
                            <div className="badge-tags">
                                <span className="skill-tag">Complexity: Medium</span>
                                <span className="skill-tag">Time: 10 mins</span>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {challenge.description}
                        </p>
                    </div>

                    {/* Editor Controls */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '12px 1rem', 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px solid var(--border-color)',
                        borderBottom: 'none',
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px'
                    }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <select 
                                className="form-select" 
                                style={{ width: '160px', padding: '6px 10px', fontSize: '0.9rem' }}
                                value={language.id}
                                onChange={(e) => {
                                    const lang = LANGUAGES.find(l => l.id === e.target.value);
                                    setLanguage(lang);
                                    setCode(lang.defaultValue);
                                }}
                            >
                                {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                            
                            {isRecording && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4444', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <div className="recording-dot" style={{ position: 'static' }}></div>
                                    REC {formatTime(timer)}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                className="btn btn-secondary btn-sm" 
                                disabled={!isRecording || isRunning}
                                onClick={handleRunCode}
                            >
                                <Play size={14} /> Run Code
                            </button>
                            {!isRecording ? (
                                <button className="btn btn-primary btn-sm" onClick={startRecording}>
                                    <Monitor size={14} /> Start Task
                                </button>
                            ) : (
                                <button className="btn btn-gold btn-sm" onClick={handleSubmit}>
                                    <Upload size={14} /> Submit Solution
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Monaco Editor Container */}
                    <div style={{ height: '450px', border: '1px solid var(--border-color)', overflow: 'hidden', position: 'relative' }}>
                        {!isRecording && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.8)',
                                zIndex: 10,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(4px)'
                            }}>
                                <Shield size={48} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
                                <h3 style={{ color: 'white' }}>Environment Locked</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Start recording to unlock the editor</p>
                            </div>
                        )}
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={language.id === 'sql' ? 'sql' : language.id}
                            value={code}
                            onChange={(val) => setCode(val)}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                padding: { top: 16 },
                                automaticLayout: true,
                                readOnly: !isRecording
                            }}
                        />
                    </div>

                    {/* Output Console */}
                    <div style={{ marginTop: '1rem' }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            color: 'var(--text-secondary)', 
                            fontSize: '0.85rem', 
                            marginBottom: '6px',
                            fontWeight: 600 
                        }}>
                            <Terminal size={14} /> Output Console
                        </div>
                        <div style={{ 
                            background: '#0d1117', 
                            color: '#e6edf3', 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            minHeight: '120px', 
                            maxHeight: '200px',
                            overflowY: 'auto',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            whiteSpace: 'pre-wrap',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {output || 'Click "Run Code" to see output here...'}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Suspicion Tracker & Settings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Camera Preview / Identity */}
                    <div className="candidate-card" style={{ padding: '0.5rem', overflow: 'hidden' }}>
                        <div style={{ 
                            aspectRatio: '4/3', 
                            background: '#000', 
                            borderRadius: '8px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            position: 'relative'
                        }}>
                             {isRecording ? (
                                 <video 
                                    autoPlay 
                                    muted 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    ref={(ref) => {
                                        if (ref && cameraStreamRef.current) ref.srcObject = cameraStreamRef.current;
                                    }}
                                 />
                             ) : (
                                 <Camera size={40} style={{ color: 'rgba(255,255,255,0.2)' }} />
                             )}
                             <div style={{ 
                                position: 'absolute', 
                                bottom: '10px', 
                                left: '10px', 
                                background: 'rgba(0,0,0,0.5)', 
                                padding: '2px 8px', 
                                borderRadius: '4px',
                                fontSize: '0.7rem'
                            }}>
                                Verified Identity
                             </div>
                        </div>
                    </div>

                    {/* Anti-Cheating Monitor */}
                    <div className="candidate-card">
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                            <Shield size={16} className="text-gold" /> Anti-Cheating
                        </h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Tab Switches</span>
                                <span style={{ fontWeight: 600, color: suspicionScore.tabSwitches > 0 ? '#ff4444' : 'inherit' }}>
                                    {suspicionScore.tabSwitches}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Focus Loss</span>
                                <span style={{ fontWeight: 600 }}>{suspicionScore.blurEvents}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Paste Events</span>
                                <span style={{ fontWeight: 600 }}>{suspicionScore.copyPastes}</span>
                            </div>
                        </div>

                        {suspicionScore.tabSwitches > 2 && (
                            <div style={{ 
                                marginTop: '1rem', 
                                padding: '8px', 
                                background: 'rgba(255,68,68,0.1)', 
                                borderRadius: '6px',
                                color: '#ff4444',
                                fontSize: '0.75rem',
                                display: 'flex',
                                gap: '6px'
                            }}>
                                <AlertTriangle size={14} /> Suspicious activity detected
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="candidate-card" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Instructions</h4>
                        <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <li>Stay focused on this tab during the duration of the task.</li>
                            <li>Narrate your thought process if possible.</li>
                            <li>Run the code frequently to verify logic.</li>
                            <li>Click Submit when you are finished.</li>
                        </ul>
                    </div>

                </div>
            </div>
            
            <AIAnalysisOverlay visible={isSubmitting} />
        </div>
    );
}
