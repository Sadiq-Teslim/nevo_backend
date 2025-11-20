
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

async function signup(req, res) {
  const { name, email, password, role } = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  try {
    const user = new User({ name, email, password_hash, role });
    await user.save();
    // Issue token on signup for immediate login
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
}

function authMiddleware(roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('authMiddleware: Authorization header:', authHeader);
    if (!authHeader) {
      console.log('authMiddleware: No token provided');
      return res.status(401).json({ error: 'No token' });
    }
    const token = authHeader.split(' ')[1];
    console.log('authMiddleware: Extracted token:', token);
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      console.log('authMiddleware: Decoded payload:', payload);
      req.user = payload;
      if (roles.length && !roles.includes(payload.role)) {
        console.log('authMiddleware: Forbidden role:', payload.role);
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch (err) {
      console.log('authMiddleware: Token verification error:', err.message);
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = { signup, login, authMiddleware };
