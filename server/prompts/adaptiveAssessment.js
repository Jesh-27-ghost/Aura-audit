/**
 * Prompt for generating adaptive skill assessments based on candidate profile
 */
const getAdaptiveAssessmentPrompt = (candidateProfile, selectedSkills, testConfig) => {
    const { testType = 'Mixed', numberOfQuestions = 5 } = testConfig || {};

    // Build skill context from the profile
    const skillContext = selectedSkills.map(skill => {
        const profileSkill = candidateProfile.skills?.find(
            s => s.skillName.toLowerCase() === skill.toLowerCase()
        );
        if (profileSkill) {
            return `- ${profileSkill.skillName}: ${profileSkill.estimatedYears} years exp, ${profileSkill.proficiencyLevel} level. Evidence: "${profileSkill.evidenceFromCV}"`;
        }
        return `- ${skill}: Not found in profile (Assumed Beginner)`;
    }).join('\n');

    return `
You are a senior technical interviewer designing a custom skill assessment.
Generate ${numberOfQuestions} questions of type "${testType}" tailored to the candidate's specific background.

### CANDIDATE PROFILE:
- Name: ${candidateProfile.name}
- Role: ${candidateProfile.primaryRole}
- Total Experience: ${candidateProfile.totalYearsExperience} years

### SKILLS TO ASSESS:
${skillContext}

### DIFFICULTY MAPPING RULES (STRICTLY FOLLOW):
- 0-1 year (Beginner): Basic MCQ, Terminology, Simple Concepts
- 1-3 years (Junior): Conceptual Questions, Simple Practical Tasks
- 3-5 years (Intermediate): Scenario-Based Questions, Debugging Tasks, Applied Problems
- 5-8 years (Advanced): Complex Problem Solving, System Design Basics, Optimization Challenges
- 8+ years (Expert): Architecture Design, Strategy Questions, Advanced Case Studies

### QUESTION TYPES TO INCLUDE:
Choose based on "${testType}" and candidate level: Conceptual, Scenarios, Coding, Debugging, architecture, or Problem-solving.

### REQUIRED OUTPUT FORMAT (JSON ONLY):
{
  "skill": "${selectedSkills.join(', ')}",
  "difficultyLevel": "Adaptive",
  "questions": [
    {
      "questionType": "MCQ | Coding | Scenario | Debugging | Case Study",
      "question": "string",
      "expectedSkillsEvaluated": "string",
      "difficulty": "Beginner | Intermediate | Advanced | Expert"
    }
  ]
}

### RULES:
- Ensure questions evaluate both theoretical knowledge and practical application.
- Adjust complexity dynamically based on the tiers above.
- Return ONLY valid JSON. No markdown fences.
`;
};

module.exports = { getAdaptiveAssessmentPrompt };
