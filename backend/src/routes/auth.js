const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  // Admin accounts require an authorized clearance passkey; public accounts are always citizen/donor
  const adminSecret = process.env.ADMIN_INVITE_CODE || 'GOV-ADMIN-2026';
  const userRole = (role === 'admin' && req.body.adminCode === adminSecret) ? 'admin' : 'citizen';

  const insert = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
  const result = insert.run(name.trim(), email.toLowerCase().trim(), hashedPassword, userRole);

  const token = jwt.sign(
    { id: Number(result.lastInsertRowid), name: name.trim(), email: email.toLowerCase().trim(), role: userRole },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    message: 'Registration successful',
    token,
    user: {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: userRole
    }
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// 1-Click Demo Login (for easy evaluation)
router.post('/demo-login', (req, res) => {
  const { role } = req.body; // 'admin' or 'citizen'
  const email = role === 'admin' ? 'admin@ngoverify.org' : 'citizen@example.com';
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user) {
    return res.status(404).json({ error: 'Demo user not found. Run seed script first.' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: `Logged in as demo ${user.role}`,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Google Sign-In authentication endpoint
router.post('/google', (req, res) => {
  const { email, name, avatar, googleId } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Google email is required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const userName = (name && name.trim()) || normalizedEmail.split('@')[0];
  const userAvatar = avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`;

  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  if (!user) {
    // Register new citizen user via Google
    const randomSecret = require('node:crypto').randomBytes(16).toString('hex');
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(randomSecret, salt);

    const insert = db.prepare(
      'INSERT INTO users (name, email, password, role, provider, avatar) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = insert.run(userName, normalizedEmail, hashedPassword, 'citizen', 'google', userAvatar);
    
    user = {
      id: Number(result.lastInsertRowid),
      name: userName,
      email: normalizedEmail,
      role: 'citizen',
      provider: 'google',
      avatar: userAvatar
    };
  } else {
    // Update existing user with avatar and google provider
    try {
      db.prepare('UPDATE users SET avatar = ?, provider = "google" WHERE id = ?').run(userAvatar, user.id);
      user.avatar = userAvatar;
      user.provider = 'google';
    } catch (e) {}
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Google authentication successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: 'google',
      avatar: user.avatar || userAvatar
    }
  });
});

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, provider, avatar, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

module.exports = router;
