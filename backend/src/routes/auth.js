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

// Google Sign-In authentication endpoint with verified token support
router.post('/google', (req, res) => {
  let { email, name, avatar, googleId, credential } = req.body;

  // Support official Google Identity Services (GSI) credential token
  let emailVerified = true;
  if (credential && typeof credential === 'string') {
    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
        const payload = JSON.parse(payloadStr);
        if (payload.email) {
          email = payload.email;
          name = payload.name || name;
          avatar = payload.picture || avatar;
          googleId = payload.sub || googleId;
          emailVerified = payload.email_verified !== false;
        }
      }
    } catch (e) {
      console.warn('Failed to parse Google JWT credential payload, falling back to body fields:', e.message);
    }
  }

  if (!email) {
    return res.status(400).json({ error: 'Google email is required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const userName = (name && name.trim()) || normalizedEmail.split('@')[0];
  const userAvatar = avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`;
  const verifiedFlag = emailVerified ? 1 : 0;

  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  if (!user) {
    // Register new citizen user via Google
    const randomSecret = require('node:crypto').randomBytes(16).toString('hex');
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(randomSecret, salt);

    const insert = db.prepare(
      'INSERT INTO users (name, email, password, role, provider, avatar, google_id, email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const result = insert.run(userName, normalizedEmail, hashedPassword, 'citizen', 'google', userAvatar, googleId || null, verifiedFlag);
    
    user = {
      id: Number(result.lastInsertRowid),
      name: userName,
      email: normalizedEmail,
      role: 'citizen',
      provider: 'google',
      avatar: userAvatar,
      google_id: googleId || null,
      email_verified: verifiedFlag
    };
  } else {
    // Update existing user with avatar and google provider
    try {
      db.prepare('UPDATE users SET avatar = ?, provider = "google", google_id = COALESCE(?, google_id), email_verified = 1 WHERE id = ?')
        .run(userAvatar, googleId || null, user.id);
      user.avatar = userAvatar;
      user.provider = 'google';
      user.google_id = googleId || user.google_id;
      user.email_verified = 1;
    } catch (e) {}
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, isGoogleVerified: true },
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
      avatar: user.avatar || userAvatar,
      isGoogleVerified: true,
      emailVerified: true
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
