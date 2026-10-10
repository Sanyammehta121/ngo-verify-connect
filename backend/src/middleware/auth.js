const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'truengo_national_secret_key_2026';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'citizen',
      provider: 'local',
      avatar: user.avatar || null
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Please sign in to access this feature.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Session expired. Please sign in again.' });
    }
    req.user = decoded;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access restricted to admin.' });
  }
  next();
}

const requireVerifiedEmail = (req, res, next) => next();

module.exports = {
  JWT_SECRET,
  generateToken,
  authenticateToken,
  requireAdmin,
  requireVerifiedEmail
};
