const mongoose = require('mongoose');

const personalizedLessonSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  personalizedContent: String,
  learningStyleUsed: String
});

module.exports = mongoose.model('PersonalizedLesson', personalizedLessonSchema);