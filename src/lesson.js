
const axios = require('axios');
const Lesson = require('../models/Lesson');
const StudentProfile = require('../models/StudentProfile');
const PersonalizedLesson = require('../models/PersonalizedLesson');

// Upload lesson (text only for MVP)
async function uploadLesson(req, res) {
  const { title, content } = req.body;
  const teacherId = req.user.userId;
  const lesson = new Lesson({ title, content, teacherId });
  await lesson.save();
  const lessonObj = lesson.toObject();
  lessonObj.id = lessonObj._id;
  delete lessonObj._id;
  if (!lessonObj.slides) lessonObj.slides = [];
  res.json({ lesson: lessonObj });
}

// List lessons for teacher
async function listLessons(req, res) {
  const teacherId = req.user.userId;
  const lessons = await Lesson.find({ teacherId });
  const lessonsMapped = lessons.map(l => {
    const obj = l.toObject();
    obj.id = obj._id;
    delete obj._id;
    if (!obj.slides) obj.slides = [];
    return obj;
  });
  res.json({ lessons: lessonsMapped });
}

// Get lesson by id
async function getLesson(req, res) {
  const lessonId = req.params.id;
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const lessonObj = lesson.toObject();
  lessonObj.id = lessonObj._id;
  delete lessonObj._id;
  if (!lessonObj.slides) lessonObj.slides = [];
  res.json({ lesson: lessonObj });
}

// Personalize lesson for student (AI)
async function personalizeLesson(req, res) {
  const lessonId = req.params.id;
  const studentId = req.user.userId;
  const lesson = await Lesson.findById(lessonId);
  const studentProfile = await StudentProfile.findOne({ userId: studentId });
  const style = studentProfile?.learningStyle || 'default';

  // AI prompt for personalization
  const prompt = `Rewrite this lesson for a ${style} learner: ${lesson.content}`;
  const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + process.env.GEMINI_API_KEY, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  const personalizedContent = response.data.candidates[0].content.parts[0].text.trim();

  // Save personalized lesson
  const personalizedLesson = new PersonalizedLesson({
    lessonId,
    studentId,
    personalizedContent,
    learningStyleUsed: style
  });
  await personalizedLesson.save();
  res.json({ personalizedLesson });
}

// Get personalized lessons for student
async function getPersonalizedLessons(req, res) {
  const studentId = req.user.userId;
  const lessons = await PersonalizedLesson.find({ studentId });
  res.json({ lessons });
}
// Update lesson by id
async function updateLesson(req, res) {
  const lessonId = req.params.id;
  const update = req.body;
  const lesson = await Lesson.findByIdAndUpdate(lessonId, update, { new: true });
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const lessonObj = lesson.toObject();
  lessonObj.id = lessonObj._id;
  delete lessonObj._id;
  if (!lessonObj.slides) lessonObj.slides = [];
  res.json({ lesson: lessonObj });
}

module.exports = {
  uploadLesson,
  listLessons,
  getLesson,
  personalizeLesson,
  getPersonalizedLessons,
  updateLesson,
};
