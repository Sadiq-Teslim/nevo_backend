
const PersonalizedLesson = require('../models/PersonalizedLesson');
const Lesson = require('../models/Lesson');
const StudentProfile = require('../models/StudentProfile');

// GET /student/:id/lessons
async function getStudentLessons(req, res) {
  const studentId = req.params.id;
  // Find lessons linked to student via personalized lessons
  const personalizedLessons = await PersonalizedLesson.find({ studentId }).populate('lessonId');
  const lessons = personalizedLessons.map(pl => {
    if (!pl.lessonId) return null;
    const obj = pl.lessonId.toObject();
    obj.id = obj._id;
    delete obj._id;
    if (!obj.slides) obj.slides = [];
    return obj;
  }).filter(Boolean);
  res.json({ lessons });
}

// GET /student/:id/learning-style
async function getStudentLearningStyle(req, res) {
  const studentId = req.params.id;
  const profile = await StudentProfile.findOne({ userId: studentId });
  res.json({ learningStyle: profile?.learningStyle });
}

module.exports = { getStudentLessons, getStudentLearningStyle };
