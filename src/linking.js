
const User = require('../models/User');
const Relationship = require('../models/Relationship');

// Helper: send invite email (placeholder)
async function sendInviteEmail(email) {
  // Integrate with email service (e.g., SendGrid, Supabase, etc.)
  console.log(`Invite email sent to ${email}`);
}

// Link Student to Teacher
async function linkStudentToTeacher(req, res) {
  const { studentEmail, teacherEmail } = req.body;
  const student = await User.findOne({ email: studentEmail });
  const teacher = await User.findOne({ email: teacherEmail });

  if (student && teacher) {
    await Relationship.create({ studentId: student._id, teacherId: teacher._id });
    return res.json({ message: 'Linked successfully' });
  }

  if (!teacher) {
    await sendInviteEmail(teacherEmail);
    await Relationship.create({ studentId: student ? student._id : null, teacherId: null });
    return res.json({ message: 'Teacher invited, pending link' });
  }

  res.status(400).json({ error: 'Student not found' });
}

// Link Student to Parent
async function linkStudentToParent(req, res) {
  const { studentEmail, parentEmail } = req.body;
  const student = await User.findOne({ email: studentEmail });
  const parent = await User.findOne({ email: parentEmail });

  if (student && parent) {
    await Relationship.create({ studentId: student._id, parentId: parent._id });
    return res.json({ message: 'Linked successfully' });
  }

  if (!parent) {
    await sendInviteEmail(parentEmail);
    await Relationship.create({ studentId: student ? student._id : null, parentId: null });
    return res.json({ message: 'Parent invited, pending link' });
  }

  res.status(400).json({ error: 'Student not found' });
}

// Link Teacher to Student
async function linkTeacherToStudent(req, res) {
  const { teacherEmail, studentEmail } = req.body;
  const teacher = await User.findOne({ email: teacherEmail });
  const student = await User.findOne({ email: studentEmail });

  if (teacher && student) {
    await Relationship.create({ teacherId: teacher._id, studentId: student._id });
    return res.json({ message: 'Linked successfully' });
  }

  if (!student) {
    await sendInviteEmail(studentEmail);
    await Relationship.create({ teacherId: teacher ? teacher._id : null, studentId: null });
    return res.json({ message: 'Student invited, pending link' });
  }

  res.status(400).json({ error: 'Teacher not found' });
}

// Get linked users for a user
async function getLinkedUsers(req, res) {
  const userId = req.user.userId;
  const relationships = await Relationship.find({
    $or: [
      { studentId: userId },
      { teacherId: userId },
      { parentId: userId }
    ]
  }).populate('studentId teacherId parentId');
  res.json({ relationships });
}

module.exports = {
  linkStudentToTeacher,
  linkStudentToParent,
  linkTeacherToStudent,
  getLinkedUsers
};
