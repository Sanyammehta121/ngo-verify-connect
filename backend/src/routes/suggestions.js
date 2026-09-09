const express = require('express');
const { db } = require('../db');

const router = express.Router();

/**
 * Submit real NGO suggestion for admin review
 */
router.post('/', (req, res) => {
  const {
    name,
    city,
    state,
    category,
    darpanId,
    registrationNumber,
    website,
    phone,
    email,
    reason,
    submitterName,
    submitterEmail
  } = req.body;

  if (!name || !city || !state || !category) {
    return res.status(400).json({ error: 'NGO name, city, state, and primary category are required.' });
  }

  const insert = db.prepare(`
    INSERT INTO suggested_ngos (
      name, city, state, category, darpan_id, registration_number,
      website, phone, email, reason, submitter_name, submitter_email,
      status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
  `);

  const result = insert.run(
    name.trim(),
    city.trim(),
    state.trim(),
    category.trim(),
    darpanId ? darpanId.trim() : null,
    registrationNumber ? registrationNumber.trim() : null,
    website ? website.trim() : null,
    phone ? phone.trim() : null,
    email ? email.trim() : null,
    reason ? reason.trim() : null,
    submitterName ? submitterName.trim() : 'Anonymous Contributor',
    submitterEmail ? submitterEmail.trim() : null
  );

  res.status(201).json({
    message: 'NGO proposal submitted successfully. Our verification officers will review public records.',
    suggestionId: Number(result.lastInsertRowid)
  });
});

module.exports = router;
