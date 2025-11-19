const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: send invite email (placeholder)
async function sendInviteEmail(email) {
  // Integrate with email service (e.g., SendGrid, Supabase, etc.)
  console.log(`Invite email sent to ${email}`);
}

// Link Student to Teacher
async function linkStudentToTeacher(req, res) {
  const { studentEmail, teacherEmail } = req.body;
  const student = await prisma.user.findUnique({ where: { email: studentEmail } });
  const teacher = await prisma.user.findUnique({ where: { email: teacherEmail } });

  if (student && teacher) {
    await prisma.relationship.create({ data: { studentId: student.id, teacherId: teacher.id } });
    return res.json({ message: 'Linked successfully' });
  }

  if (!teacher) {
    await sendInviteEmail(teacherEmail);
    await prisma.relationship.create({ data: { studentId: student ? student.id : null, teacherId: null } });
    return res.json({ message: 'Teacher invited, pending link' });
  }

  res.status(400).json({ error: 'Student not found' });
}

// Link Student to Parent
async function linkStudentToParent(req, res) {
  const { studentEmail, parentEmail } = req.body;
  const student = await prisma.user.findUnique({ where: { email: studentEmail } });
  const parent = await prisma.user.findUnique({ where: { email: parentEmail } });

  if (student && parent) {
    await prisma.relationship.create({ data: { studentId: student.id, parentId: parent.id } });
    return res.json({ message: 'Linked successfully' });
  }

  if (!parent) {
    await sendInviteEmail(parentEmail);
    await prisma.relationship.create({ data: { studentId: student ? student.id : null, parentId: null } });
    return res.json({ message: 'Parent invited, pending link' });
  }

  res.status(400).json({ error: 'Student not found' });
}

// Link Teacher to Student
async function linkTeacherToStudent(req, res) {
  const { teacherEmail, studentEmail } = req.body;
  const teacher = await prisma.user.findUnique({ where: { email: teacherEmail } });
  const student = await prisma.user.findUnique({ where: { email: studentEmail } });

  if (teacher && student) {
    await prisma.relationship.create({ data: { teacherId: teacher.id, studentId: student.id } });
    return res.json({ message: 'Linked successfully' });
  }

  if (!student) {
    await sendInviteEmail(studentEmail);
    await prisma.relationship.create({ data: { teacherId: teacher ? teacher.id : null, studentId: null } });
    return res.json({ message: 'Student invited, pending link' });
  }

  res.status(400).json({ error: 'Teacher not found' });
}

// Get linked users for a user
async function getLinkedUsers(req, res) {
  const userId = req.user.userId;
  const relationships = await prisma.relationship.findMany({
    where: {
      OR: [
        { studentId: userId },
        { teacherId: userId },
        { parentId: userId }
      ]
    },
    include: {
      student: true,
      teacher: true,
      parent: true
    }
  });
  res.json({ relationships });
}

module.exports = {
  linkStudentToTeacher,
  linkStudentToParent,
  linkTeacherToStudent,
  getLinkedUsers
};
