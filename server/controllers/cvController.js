const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const { store } = require('../store');
const { getCVAnalysisPrompt } = require('../prompts/cvAnalysis');
const { getAdaptiveAssessmentPrompt } = require('../prompts/adaptiveAssessment');

const MODEL_NAME = 'gemini-1.5-flash';

/**
 * Helper to call Gemini AI
 */
async function callGemini(prompt) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean markdown if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('AI processing failed');
    }
}

/**
 * Handle CV Upload & Analysis
 * POST /api/cv/upload
 */
const uploadCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No CV file provided' });
        }

        let extractedText = '';
        if (req.file.mimetype === 'application/pdf') {
            const data = await pdfParse(req.file.buffer);
            extractedText = data.text;
        } else {
            extractedText = req.file.buffer.toString('utf8');
        }

        if (!extractedText || extractedText.trim().length < 50) {
            return res.status(400).json({ message: 'Could not extract enough text from CV' });
        }

        console.log(`🧠 Analyzing CV for ${req.user.name}...`);
        const profileData = await callGemini(getCVAnalysisPrompt(extractedText));

        // Upsert profile
        const existing = store.findOne('cv_profiles', p => p.candidateId === req.user._id);
        let profile;
        if (existing) {
            profile = store.updateById('cv_profiles', existing._id, {
                parsedData: profileData,
                updatedAt: new Date().toISOString()
            });
        } else {
            profile = store.insert('cv_profiles', {
                candidateId: req.user._id,
                candidateName: req.user.name,
                parsedData: profileData
            });
        }

        res.status(200).json({ message: 'CV analyzed successfully', profile });
    } catch (error) {
        console.error('CV Upload Error:', error);
        res.status(500).json({ message: 'Failed to process CV', error: error.message });
    }
};

/**
 * Get current candidate's CV profile
 * GET /api/cv/profile
 */
const getMyCVProfile = (req, res) => {
    try {
        const profile = store.findOne('cv_profiles', p => p.candidateId === req.user._id);
        if (!profile) return res.status(404).json({ message: 'No CV profile found' });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

/**
 * Generate Adaptive Assessment
 * POST /api/cv/generate-test
 */
const generateAdaptiveTest = async (req, res) => {
    try {
        const { candidateId, selectedSkills, testConfig } = req.body;
        
        const profile = store.findOne('cv_profiles', p => p.candidateId === candidateId);
        if (!profile) return res.status(404).json({ message: 'Candidate profile not found' });

        console.log(`🎮 Generating assessment for ${profile.candidateName}...`);
        const assessment = await callGemini(getAdaptiveAssessmentPrompt(profile.parsedData, selectedSkills, testConfig));

        res.json({ message: 'Assessment generated', assessment });
    } catch (error) {
        console.error('Test Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate assessment' });
    }
};

/**
 * Get all available profiles (Employer)
 * GET /api/cv/profiles
 */
const getAllCVProfiles = (req, res) => {
    try {
        const profiles = store.find('cv_profiles');
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profiles' });
    }
};

module.exports = {
    uploadCV,
    getMyCVProfile,
    generateAdaptiveTest,
    getAllCVProfiles
};
