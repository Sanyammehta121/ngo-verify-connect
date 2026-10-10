const express = require('express');
const { db } = require('../db');
const { authenticateToken, requireVerifiedEmail } = require('../middleware/auth');

const router = express.Router();

/**
 * Submit fraud / suspicious activity report for an NGO
 * Requires authentication and verified email to prevent frivolous or impersonated reports.
 */
router.post('/', authenticateToken, requireVerifiedEmail, (req, res) => {
  const { ngoId, reason, details } = req.body;

  if (!ngoId || !reason || !details) {
    return res.status(400).json({ error: 'NGO ID, reason, and detailed explanation are required.' });
  }

  const ngo = db.prepare('SELECT id, name FROM ngos WHERE id = ?').get(ngoId);
  if (!ngo) {
    return res.status(404).json({ error: 'NGO not found.' });
  }

  // Prevent impersonation: strictly bind to authenticated user session
  const userId = req.user.id;
  const reporterName = req.user.name || 'Verified Citizen';
  const reporterEmail = req.user.email;

  const insert = db.prepare(`
    INSERT INTO fraud_reports (ngo_id, user_id, reporter_name, reporter_email, reason, details, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
  `);

  const result = insert.run(
    ngoId,
    userId,
    reporterName,
    reporterEmail,
    reason.trim(),
    details.trim()
  );

  const reportId = Number(result.lastInsertRowid);
  const ticket = `REP-2026-${String(reportId).padStart(4, '0')}`;

  res.status(201).json({
    message: 'Report filed successfully with platform verification desk.',
    ticket,
    reportId,
    userId
  });
});

module.exports = router;
