const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /student/:id/lessons
async function getStudentLessons(req, res) {
  const studentId = parseInt(req.params.id);
  // Find lessons linked to student via relationships or personalized lessons
  const personalizedLessons = await prisma.personalizedLesson.findMany({
    where: { studentId },
    include: { lesson: true }
  });
  const lessons = personalizedLessons.map(pl => pl.lesson);
  res.json({ lessons });
}

// GET /student/:id/learning-style
async function getStudentLearningStyle(req, res) {
  const studentId = parseInt(req.params.id);
  const profile = await prisma.studentProfile.findUnique({ where: { userId: studentId } });
  res.json({ learningStyle: profile.learningStyle });
}

module.exports = { getStudentLessons, getStudentLearningStyle };
