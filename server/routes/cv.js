const express = require('express');
const multer = require('multer');
const { protect, authorize } = require('../middleware/auth');
const { 
    uploadCV, 
    getMyCVProfile, 
    generateAdaptiveTest, 
    getAllCVProfiles 
} = require('../controllers/cvController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Candidate routes
router.post('/upload', protect, authorize('candidate'), upload.single('cvFile'), uploadCV);
router.get('/profile', protect, authorize('candidate'), getMyCVProfile);

// Employer routes
router.get('/profiles', protect, authorize('employer'), getAllCVProfiles);
router.post('/generate-test', protect, authorize('employer'), generateAdaptiveTest);

module.exports = router;
