const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const fs = require('fs');

// Upload lesson (text only for MVP)
async function uploadLesson(req, res) {
  const { title, content } = req.body;
  const teacherId = req.user.userId;
  const lesson = await prisma.lesson.create({
    data: { title, content, teacherId }
  });
  res.json({ lesson });
}

// List lessons for teacher
async function listLessons(req, res) {
  const teacherId = req.user.userId;
  const lessons = await prisma.lesson.findMany({ where: { teacherId } });
  res.json({ lessons });
}

// Get lesson by id
async function getLesson(req, res) {
  const lessonId = parseInt(req.params.id);
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  res.json({ lesson });
}

// Personalize lesson for student (AI)
async function personalizeLesson(req, res) {
  const lessonId = parseInt(req.params.id);
  const studentId = req.user.userId;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  const studentProfile = await prisma.studentProfile.findUnique({ where: { userId: studentId } });
  const style = studentProfile.learningStyle;

  // AI prompt for personalization
  const prompt = `Rewrite this lesson for a ${style} learner: ${lesson.content}`;
  const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  const personalizedContent = response.data.candidates[0].content.parts[0].text.trim();

  // Save personalized lesson
  const personalizedLesson = await prisma.personalizedLesson.create({
    data: {
      lessonId,
      studentId,
      personalizedContent,
      learningStyleUsed: style
    }
  });
  res.json({ personalizedLesson });
}

// Get personalized lessons for student
async function getPersonalizedLessons(req, res) {
  const studentId = req.user.userId;
  const lessons = await prisma.personalizedLesson.findMany({ where: { studentId } });
  res.json({ lessons });
}

module.exports = {
  uploadLesson,
  listLessons,
  getLesson,
  personalizeLesson,
  getPersonalizedLessons
};
