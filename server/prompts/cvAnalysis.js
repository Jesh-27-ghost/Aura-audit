/**
 * Prompt for AI-powered CV parsing and skill extraction
 */
const getCVAnalysisPrompt = (cvText) => {
    return `
You are an expert technical recruiter and AI HR analyst with 15+ years of experience.
Analyze the following CV/resume text and extract a comprehensive, optimized, and structured skill profile.

### CV TEXT:
"""
${cvText}
"""

### INSTRUCTIONS:
1. **Skill Extraction & Normalization**: Extract skills, technologies, and certifications. Normalize skill names (e.g., "ReactJS" -> "React.js").
2. **Experience Estimation**: For each skill, estimate years of experience based on project timelines, work history, and complexity of tasks described.
3. **Proficiency Categorization**: Classify each skill into a standardized tier based on years of experience:
   - **Beginner** (0-1 year): Basic MCQ, Terminology, Simple Concepts
   - **Junior** (1-3 years): Conceptual Questions, Simple Practical Tasks
   - **Intermediate** (3-5 years): Scenario-Based Questions, Debugging Tasks, Applied Problems
   - **Advanced** (5-8 years): Complex Problem Solving, System Design Basics, Optimization Challenges
   - **Expert** (8+ years): Architecture Design, Strategy Questions, Advanced Case Studies
4. **Evidence Collection**: Provide a short brief of supporting evidence from the CV for each skill assessment.
5. **Role Identification**: Identify the candidate's primary role and total years of professional experience.

### REQUIRED OUTPUT FORMAT (JSON ONLY):
{
  "name": "Candidate's name",
  "primaryRole": "e.g., Senior Full Stack Developer",
  "totalYearsExperience": number,
  "skills": [
    {
      "skillName": "string",
      "estimatedYears": number,
      "proficiencyLevel": "Beginner | Intermediate | Advanced | Expert",
      "evidenceFromCV": "Brief description of projects/roles where this skill was used"
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string"
    }
  ],
  "certifications": ["list of strings"],
  "notableProjects": [
    {
      "name": "string",
      "technologies": ["string"],
      "description": "string"
    }
  ],
  "industryDomain": "string"
}

### CRITICAL RULES:
- Return ONLY valid JSON.
- No markdown formatting.
- Be precise and objective.
`;
};

module.exports = { getCVAnalysisPrompt };
