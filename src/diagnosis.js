
const axios = require('axios');
const StudentProfile = require('../models/StudentProfile');

function ruleBasedDiagnosis(answers) {
  let scores = { ADHD: 0, ASD: 0, Dyslexia: 0 };
  answers.forEach(ans => {
    if (ans.type === 'attention') scores.ADHD += ans.value;
    if (ans.type === 'social') scores.ASD += ans.value;
    if (ans.type === 'reading') scores.Dyslexia += ans.value;
  });
  return scores;
}

async function aiLearningStyle(answers) {
  const prompt = `Classify the student's learning style based on these answers: ${JSON.stringify(answers)}`;
  const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + process.env.GEMINI_API_KEY, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  return response.data.candidates[0].content.parts[0].text.trim();
}

// POST /assessment/submit
async function submitAssessment(req, res) {
  const { answers } = req.body;
  const scores = ruleBasedDiagnosis(answers);
  const learningStyle = await aiLearningStyle(answers);

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const secondary = sorted[1][0];

  // Save to student profile (if authenticated)
  if (req.user) {
    await StudentProfile.findOneAndUpdate(
      { userId: req.user.userId },
      {
        diagnosis: primary,
        learningStyle,
        assessmentScoreSummary: JSON.stringify(scores)
      },
      { upsert: true, new: true }
    );
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
  const profile = await StudentProfile.findOne({ userId: req.user.userId });
  res.json({
    diagnosis: profile?.diagnosis,
    learningStyle: profile?.learningStyle,
    assessmentScoreSummary: profile?.assessmentScoreSummary
  });
}

module.exports = { submitAssessment, getAssessmentResult };
