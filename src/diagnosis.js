const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

// Rule-based scoring for ADHD, ASD, Dyslexia
function ruleBasedDiagnosis(answers) {
  let scores = { ADHD: 0, ASD: 0, Dyslexia: 0 };
  // Example rules (replace with real ones)
  answers.forEach(ans => {
    if (ans.type === 'attention') scores.ADHD += ans.value;
    if (ans.type === 'social') scores.ASD += ans.value;
    if (ans.type === 'reading') scores.Dyslexia += ans.value;
  });
  return scores;
}

// AI model for learning style (OpenAI API example)
async function aiLearningStyle(answers) {
  const prompt = `Classify the student's learning style based on these answers: ${JSON.stringify(answers)}`;
  const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  // Extract learning style from Gemini response
  return response.data.candidates[0].content.parts[0].text.trim();
}

// POST /assessment/submit
async function submitAssessment(req, res) {
  const { answers } = req.body;
  const scores = ruleBasedDiagnosis(answers);
  const learningStyle = await aiLearningStyle(answers);

  // Determine primary/secondary neurodivergence
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const secondary = sorted[1][0];

  // Save to student profile (if authenticated)
  if (req.user) {
    await prisma.studentProfile.update({
      where: { userId: req.user.userId },
      data: {
        diagnosis: primary,
        learningStyle,
        assessmentScoreSummary: JSON.stringify(scores)
      }
    });
  }

  res.json({
    primary,
    secondary,
    recommendedLearningMethod: learningStyle,
    lessonInstructions: `Build lessons for ${learningStyle} learners`
  });
}

// GET /assessment/result
async function getAssessmentResult(req, res) {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: req.user.userId }
  });
  res.json({
    diagnosis: profile.diagnosis,
    learningStyle: profile.learningStyle,
    assessmentScoreSummary: profile.assessmentScoreSummary
  });
}

module.exports = { submitAssessment, getAssessmentResult };
