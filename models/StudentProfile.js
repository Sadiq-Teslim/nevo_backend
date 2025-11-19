const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  diagnosis: String,
  learningStyle: String,
  assessmentScoreSummary: String
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);