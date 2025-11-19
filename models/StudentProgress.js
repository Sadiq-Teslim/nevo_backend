const mongoose = require('mongoose');

const studentProgressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  progress: String // You can expand this as needed
});

module.exports = mongoose.model('StudentProgress', studentProgressSchema);