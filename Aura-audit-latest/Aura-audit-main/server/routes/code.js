const express = require('express');
const router = express.Router();
const axios = require('axios');

// Map frontend language keys to Piston API language names and optional versions
const LANGUAGE_MAP = {
    'python': { language: 'python', version: '3.10.0' },
    'javascript': { language: 'javascript', version: '18.15.0' },
    'cpp': { language: 'cpp', version: '10.2.0' },
    'node': { language: 'javascript', version: '18.15.0' },
    'sql': { language: 'sqlite3', version: '3.36.0' } // Using sqlite3 for SQL demos
};

router.post('/run', async (req, res) => {
    const { language, code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    const langConfig = LANGUAGE_MAP[language] || { language: 'python', version: '3.10.0' };

    try {
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
            language: langConfig.language,
            version: langConfig.version,
            files: [
                {
                    content: code
                }
            ]
        });

        res.json({
            output: response.data.run.output,
            stdout: response.data.run.stdout,
            stderr: response.data.run.stderr,
            code: response.data.run.code,
            signal: response.data.run.signal
        });
    } catch (error) {
        console.error('Execution Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to execute code', 
            details: error.response?.data || error.message 
        });
    }
});

module.exports = router;
