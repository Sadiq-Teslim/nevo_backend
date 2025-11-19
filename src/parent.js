const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /parent/:id/students
async function getParentStudents(req, res) {
  const parentId = parseInt(req.params.id);
  const relationships = await prisma.relationship.findMany({
    where: { parentId },
    include: { student: true }
  });
  const students = relationships.map(r => r.student);
  res.json({ students });
}

// GET /student/:id/progress
async function getStudentProgress(req, res) {
  const studentId = parseInt(req.params.id);
  const progress = await prisma.studentProgress.findMany({
    where: { studentId }
  });
  res.json({ progress });
}

module.exports = { getParentStudents, getStudentProgress };
