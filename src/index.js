
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// Allow CORS for frontend dev
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const { signup, login, authMiddleware } = require('./auth');
const {
  linkStudentToTeacher,
  linkStudentToParent,
  linkTeacherToStudent,
  getLinkedUsers
} = require('./linking');
const {
  submitAssessment,
  getAssessmentResult
} = require('./diagnosis');
const {
  uploadLesson,
  listLessons,
  getLesson,
  personalizeLesson,
  getPersonalizedLessons
} = require('./lesson');
const {
  getParentStudents,
  getStudentProgress
} = require('./parent');
const {
  getStudentLessons,
  getStudentLearningStyle
} = require('./student');

app.get('/', (req, res) => {
  res.send('NEVO Backend is running!');
});

app.post('/signup', signup);
app.post('/login', login);

app.post('/link/student-to-teacher', authMiddleware(['student']), linkStudentToTeacher);
app.post('/link/student-to-parent', authMiddleware(['student']), linkStudentToParent);
app.post('/link/teacher-to-student', authMiddleware(['teacher']), linkTeacherToStudent);
app.get('/linked-users', authMiddleware(), getLinkedUsers);

app.post('/assessment/submit', authMiddleware(['student']), submitAssessment);
app.get('/assessment/result', authMiddleware(['student']), getAssessmentResult);

app.post('/lesson/upload', authMiddleware(['teacher']), uploadLesson);
app.get('/lesson/list', authMiddleware(['teacher']), listLessons);
app.get('/lesson/:id', authMiddleware(), getLesson);
app.post('/lesson/:id/personalize-for-student', authMiddleware(['student']), personalizeLesson);
app.get('/student/:id/personalized-lessons', authMiddleware(['student']), getPersonalizedLessons);

app.get('/parent/:id/students', authMiddleware(['parent']), getParentStudents);
app.get('/student/:id/progress', authMiddleware(['parent', 'student']), getStudentProgress);

app.get('/student/:id/lessons', authMiddleware(['student']), getStudentLessons);
app.get('/student/:id/learning-style', authMiddleware(['student']), getStudentLearningStyle);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
