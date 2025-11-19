const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Lesson', lessonSchema);