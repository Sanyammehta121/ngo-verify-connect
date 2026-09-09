const express = require('express');
const { db, computeTrustScore } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Submit star rating and written review (Requires authenticated login)
 */
router.post('/', authenticateToken, (req, res) => {
  const { ngoId, rating, comment } = req.body;

  if (!ngoId || !rating || !comment) {
    return res.status(400).json({ error: 'NGO ID, rating, and written comment are required.' });
  }

  const numericRating = parseInt(rating, 10);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'Rating must be an integer between 1 and 5 stars.' });
  }

  const ngo = db.prepare('SELECT * FROM ngos WHERE id = ?').get(ngoId);
  if (!ngo) {
    return res.status(404).json({ error: 'NGO not found' });
  }

  // Insert review (automatically approved for clean demo, or queued for admin review)
  const insert = db.prepare(`
    INSERT INTO reviews (ngo_id, user_id, user_name, rating, comment, status, created_at)
    VALUES (?, ?, ?, ?, ?, 'approved', CURRENT_TIMESTAMP)
  `);

  const result = insert.run(
    ngoId,
    req.user.id,
    req.user.name || 'Verified Citizen',
    numericRating,
    comment.trim()
  );

  // Recalculate NGO dynamic trust score
  const allReviews = db.prepare("SELECT * FROM reviews WHERE ngo_id = ? AND status = 'approved'").all(ngoId);
  const { trustScore, trustPercentage } = computeTrustScore(ngo, allReviews);

  db.prepare('UPDATE ngos SET trust_score = ?, trust_percentage = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(trustScore, trustPercentage, ngoId);

  res.status(201).json({
    message: 'Review and rating submitted successfully!',
    review: {
      id: Number(result.lastInsertRowid),
      ngoId,
      userName: req.user.name,
      rating: numericRating,
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    },
    updatedTrustScore: trustScore,
    updatedTrustPercentage: trustPercentage
  });
});

/**
 * Get reviews for a specific NGO
 */
router.get('/ngo/:ngoId', (req, res) => {
  const ngoId = parseInt(req.params.ngoId, 10);
  const reviews = db.prepare(`
    SELECT r.id, r.user_id, r.user_name, r.rating, r.comment, r.status, r.created_at
    FROM reviews r
    WHERE r.ngo_id = ? AND r.status = 'approved'
    ORDER BY r.created_at DESC
  `).all(ngoId);

  res.json({ reviews });
});

module.exports = router;
