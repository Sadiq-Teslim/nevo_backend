
const Relationship = require('../models/Relationship');
const User = require('../models/User');
const StudentProgress = require('../models/StudentProgress');

// GET /parent/:id/students
async function getParentStudents(req, res) {
  const parentId = req.params.id;
  const relationships = await Relationship.find({ parentId }).populate('studentId');
  const students = relationships.map(r => r.studentId);
  res.json({ students });
}

// GET /student/:id/progress
async function getStudentProgress(req, res) {
  const studentId = req.params.id;
  const progress = await StudentProgress.find({ studentId });
  res.json({ progress });
}

module.exports = { getParentStudents, getStudentProgress };
