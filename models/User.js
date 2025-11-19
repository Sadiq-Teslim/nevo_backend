const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password_hash: String,
  role: { type: String, enum: ['student', 'teacher', 'parent', 'admin'] },
});

module.exports = mongoose.model('User', userSchema);