const express = require('express');
const { db } = require('../db');

const router = express.Router();

/**
 * Submit fraud / suspicious activity report for an NGO
 */
router.post('/', (req, res) => {
  const { ngoId, reporterName, reporterEmail, reason, details } = req.body;

  if (!ngoId || !reason || !details) {
    return res.status(400).json({ error: 'NGO ID, reason, and detailed explanation are required.' });
  }

  const ngo = db.prepare('SELECT id, name FROM ngos WHERE id = ?').get(ngoId);
  if (!ngo) {
    return res.status(404).json({ error: 'NGO not found.' });
  }

  const insert = db.prepare(`
    INSERT INTO fraud_reports (ngo_id, reporter_name, reporter_email, reason, details, status, created_at)
    VALUES (?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
  `);

  const result = insert.run(
    ngoId,
    reporterName ? reporterName.trim() : 'Anonymous Whistleblower',
    reporterEmail ? reporterEmail.trim() : null,
    reason.trim(),
    details.trim()
  );

  const reportId = Number(result.lastInsertRowid);
  const ticket = `REP-2026-${String(reportId).padStart(4, '0')}`;

  res.status(201).json({
    message: 'Report filed successfully with platform verification desk.',
    ticket,
    reportId
  });
});

module.exports = router;
