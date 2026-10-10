const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * 1. Simple Email & Password Login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(trimmedEmail);

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'citizen',
      provider: 'local',
      avatar: user.avatar || null
    };

    const token = generateToken(userPayload);
    res.json({
      message: 'Signed in successfully',
      user: userPayload,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

/**
 * 2. Simple Email & Password Registration (Directly active)
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(trimmedEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insert = db.prepare(`
      INSERT INTO users (name, email, password, role, provider, email_verified)
      VALUES (?, ?, ?, 'citizen', 'local', 1)
    `);
    const result = insert.run(name.trim(), trimmedEmail, hashedPassword);

    const newUser = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      email: trimmedEmail,
      role: 'citizen',
      provider: 'local',
      avatar: null
    };

    const token = generateToken(newUser);
    res.status(201).json({
      message: 'Account created successfully',
      user: newUser,
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

/**
 * 3. One-Click Demo Login (Citizen or Admin)
 */
router.post('/demo', async (req, res) => {
  try {
    const { role } = req.body; // 'citizen' or 'admin'
    const targetRole = role === 'admin' ? 'admin' : 'citizen';

    let user;
    if (targetRole === 'admin') {
      user = db.prepare("SELECT * FROM users WHERE email = 'admin@ngoverify.org'").get();
      if (!user) {
        const hash = await bcrypt.hash('Admin@123', 10);
        const insert = db.prepare(`
          INSERT INTO users (name, email, password, role, provider, email_verified)
          VALUES ('Admin Officer', 'admin@ngoverify.org', ?, 'admin', 'local', 1)
        `);
        const result = insert.run(hash);
        user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
      }
    } else {
      user = db.prepare("SELECT * FROM users WHERE email = 'aarav.sharma@gmail.com'").get();
      if (!user) {
        user = db.prepare("SELECT * FROM users WHERE email = 'citizen@example.com'").get();
      }
      if (!user) {
        const hash = await bcrypt.hash('Password@123', 10);
        const insert = db.prepare(`
          INSERT INTO users (name, email, password, role, provider, email_verified)
          VALUES ('Aarav Sharma', 'aarav.sharma@gmail.com', ?, 'citizen', 'local', 1)
        `);
        const result = insert.run(hash);
        user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
      }
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || targetRole,
      provider: 'local',
      avatar: user.avatar || null
    };

    const token = generateToken(userPayload);
    res.json({
      message: `Logged in as ${targetRole === 'admin' ? 'Demo Admin' : 'Demo Citizen'}`,
      user: userPayload,
      token
    });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ error: 'Server error during demo login.' });
  }
});

/**
 * 4. Get Current User Session
 */
router.get('/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, provider, avatar, created_at, email_verified FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const reviewsCount = db.prepare('SELECT COUNT(*) as count FROM reviews WHERE user_id = ?').get(user.id)?.count || 0;
  const reportsCount = db.prepare('SELECT COUNT(*) as count FROM fraud_reports WHERE user_id = ?').get(user.id)?.count || 0;

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider || 'local',
      avatar: user.avatar || null,
      createdAt: user.created_at,
      emailVerified: Boolean(user.email_verified),
      activity: {
        reviewsSubmitted: reviewsCount,
        reportsFiled: reportsCount
      }
    }
  });
});

module.exports = router;
