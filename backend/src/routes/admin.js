const express = require('express');
const { db, computeTrustScore } = require('../db');
const { authenticateToken, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Require admin for all routes in this router
router.use(authenticateToken, adminOnly);

/**
 * Platform stats summary
 */
router.get('/stats', (req, res) => {
  const totalNgos = db.prepare('SELECT COUNT(*) as count FROM ngos').get().count;
  const verifiedNgos = db.prepare("SELECT COUNT(*) as count FROM ngos WHERE verification_status = 'Verified'").get().count;
  const pendingNgos = db.prepare("SELECT COUNT(*) as count FROM ngos WHERE verification_status = 'Pending'").get().count;
  const totalReviews = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
  const pendingReports = db.prepare("SELECT COUNT(*) as count FROM fraud_reports WHERE status = 'pending'").get().count;
  const pendingSuggestions = db.prepare("SELECT COUNT(*) as count FROM suggested_ngos WHERE status = 'pending'").get().count;

  res.json({
    totalNgos,
    verifiedNgos,
    pendingNgos,
    totalReviews,
    pendingReports,
    pendingSuggestions
  });
});

/**
 * List all NGOs for administration
 */
router.get('/ngos', (req, res) => {
  const rows = db.prepare('SELECT * FROM ngos ORDER BY id ASC').all();
  const formatted = rows.map(n => {
    let cats = [];
    try { cats = JSON.parse(n.categories); } catch (e) {}
    return {
      id: n.id,
      name: n.name,
      city: n.city,
      state: n.state,
      categories: cats,
      registrationNumber: n.registration_number,
      panNumber: n.pan_number,
      darpanId: n.darpan_id,
      status12A: n.status_12a,
      status80G: n.status_80g,
      statusFCRA: n.status_fcra,
      verificationStatus: n.verification_status,
      trustScore: n.trust_score,
      trustPercentage: n.trust_percentage,
      donationLink: n.donation_link,
      lastVerifiedOn: n.last_verified_on
    };
  });
  res.json({ ngos: formatted });
});

/**
 * Update Government Document statuses (12A, 80G, FCRA, Darpan) and recalculate trust score
 */
router.put('/ngos/:id/documents', (req, res) => {
  const ngoId = parseInt(req.params.id, 10);
  const {
    status12A,
    status80G,
    statusFCRA,
    fcraNumber,
    darpanId,
    verificationStatus,
    lastVerifiedOn
  } = req.body;

  const existing = db.prepare('SELECT * FROM ngos WHERE id = ?').get(ngoId);
  if (!existing) {
    return res.status(404).json({ error: 'NGO not found' });
  }

  const updatedNgo = {
    ...existing,
    status_12a: status12A || existing.status_12a,
    status_80g: status80G || existing.status_80g,
    status_fcra: statusFCRA || existing.status_fcra,
    fcra_number: fcraNumber !== undefined ? fcraNumber : existing.fcra_number,
    darpan_id: darpanId !== undefined ? darpanId : existing.darpan_id,
    verification_status: verificationStatus || existing.verification_status,
    last_verified_on: lastVerifiedOn || new Date().toISOString().split('T')[0]
  };

  const reviews = db.prepare("SELECT * FROM reviews WHERE ngo_id = ? AND status = 'approved'").all(ngoId);
  const { trustScore, trustPercentage } = computeTrustScore(updatedNgo, reviews);

  db.prepare(`
    UPDATE ngos SET
      status_12a = ?,
      status_80g = ?,
      status_fcra = ?,
      fcra_number = ?,
      darpan_id = ?,
      verification_status = ?,
      trust_score = ?,
      trust_percentage = ?,
      last_verified_on = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    updatedNgo.status_12a,
    updatedNgo.status_80g,
    updatedNgo.status_fcra,
    updatedNgo.fcra_number,
    updatedNgo.darpan_id,
    updatedNgo.verification_status,
    trustScore,
    trustPercentage,
    updatedNgo.last_verified_on,
    ngoId
  );

  res.json({
    message: 'Document verification statuses updated successfully!',
    trustScore,
    trustPercentage,
    lastVerifiedOn: updatedNgo.last_verified_on
  });
});

/**
 * Create or update general NGO record
 */
router.post('/ngos', (req, res) => {
  const {
    name,
    logo,
    description,
    categories,
    city,
    state,
    address,
    latitude,
    longitude,
    phone,
    email,
    website,
    registrationNumber,
    panNumber,
    darpanId,
    status12A,
    status80G,
    statusFCRA,
    donationLink,
    donationUpi
  } = req.body;

  if (!name || !city || !state) {
    return res.status(400).json({ error: 'Name, city, and state are required.' });
  }

  const initialNgoData = {
    status_12a: status12A || 'Pending',
    status_80g: status80G || 'Pending',
    status_fcra: statusFCRA || 'Unverified',
    darpan_id: darpanId || null,
    donation_link: donationLink || null,
    last_verified_on: new Date().toISOString().split('T')[0]
  };

  const { trustScore, trustPercentage } = computeTrustScore(initialNgoData, []);
  const categoriesJson = JSON.stringify(Array.isArray(categories) ? categories : [categories || 'General Welfare']);

  const insert = db.prepare(`
    INSERT INTO ngos (
      name, logo, description, categories, city, state, address,
      latitude, longitude, phone, email, website, registration_number,
      pan_number, status_12a, status_80g, status_fcra, darpan_id,
      verification_status, trust_score, trust_percentage,
      donation_link, donation_upi, last_verified_on
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      'Verified', ?, ?,
      ?, ?, ?
    )
  `);

  const result = insert.run(
    name.trim(),
    logo || null,
    description || '',
    categoriesJson,
    city.trim(),
    state.trim(),
    address || '',
    latitude ? parseFloat(latitude) : 28.6139,
    longitude ? parseFloat(longitude) : 77.2090,
    phone || '',
    email || '',
    website || '',
    registrationNumber || '',
    panNumber || '',
    initialNgoData.status_12a,
    initialNgoData.status_80g,
    initialNgoData.status_fcra,
    initialNgoData.darpan_id,
    trustScore,
    trustPercentage,
    initialNgoData.donation_link,
    donationUpi || null,
    initialNgoData.last_verified_on
  );

  res.status(201).json({
    message: 'NGO created successfully',
    id: Number(result.lastInsertRowid)
  });
});

/**
 * Delete NGO record
 */
router.delete('/ngos/:id', (req, res) => {
  const ngoId = parseInt(req.params.id, 10);
  db.prepare('DELETE FROM ngos WHERE id = ?').run(ngoId);
  res.json({ message: 'NGO record deleted' });
});

/**
 * List all reviews for moderation
 */
router.get('/reviews', (req, res) => {
  const reviews = db.prepare(`
    SELECT r.*, n.name as ngo_name
    FROM reviews r
    LEFT JOIN ngos n ON r.ngo_id = n.id
    ORDER BY r.created_at DESC
  `).all();
  res.json({ reviews });
});

/**
 * Moderate review (Approve or Reject)
 */
router.put('/reviews/:id/status', (req, res) => {
  const reviewId = parseInt(req.params.id, 10);
  const { status } = req.body; // 'approved' or 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be approved or rejected' });
  }

  const review = db.prepare('SELECT ngo_id FROM reviews WHERE id = ?').get(reviewId);
  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }

  db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run(status, reviewId);

  // Recalculate trust score for the associated NGO
  const ngo = db.prepare('SELECT * FROM ngos WHERE id = ?').get(review.ngo_id);
  if (ngo) {
    const allReviews = db.prepare("SELECT * FROM reviews WHERE ngo_id = ? AND status = 'approved'").all(review.ngo_id);
    const { trustScore, trustPercentage } = computeTrustScore(ngo, allReviews);
    db.prepare('UPDATE ngos SET trust_score = ?, trust_percentage = ? WHERE id = ?')
      .run(trustScore, trustPercentage, review.ngo_id);
  }

  res.json({ message: `Review marked as ${status}` });
});

/**
 * List whistleblower fraud reports
 */
router.get('/reports', (req, res) => {
  const reports = db.prepare(`
    SELECT fr.*, n.name as ngo_name
    FROM fraud_reports fr
    LEFT JOIN ngos n ON fr.ngo_id = n.id
    ORDER BY fr.created_at DESC
  `).all();
  res.json({ reports });
});

/**
 * Update report status (investigating, resolved, dismissed)
 */
router.put('/reports/:id/status', (req, res) => {
  const reportId = parseInt(req.params.id, 10);
  const { status } = req.body;

  db.prepare('UPDATE fraud_reports SET status = ? WHERE id = ?').run(status, reportId);
  res.json({ message: `Report status updated to ${status}` });
});

/**
 * List suggested NGOs
 */
router.get('/suggestions', (req, res) => {
  const suggestions = db.prepare('SELECT * FROM suggested_ngos ORDER BY created_at DESC').all();
  res.json({ suggestions });
});

/**
 * Approve suggested NGO and convert to live directory record
 */
router.post('/suggestions/:id/approve', (req, res) => {
  const suggestionId = parseInt(req.params.id, 10);
  const suggestion = db.prepare('SELECT * FROM suggested_ngos WHERE id = ?').get(suggestionId);

  if (!suggestion) {
    return res.status(404).json({ error: 'Suggestion not found' });
  }

  const initialNgoData = {
    status_12a: 'Pending',
    status_80g: 'Pending',
    status_fcra: 'Unverified',
    darpan_id: suggestion.darpan_id,
    donation_link: null,
    last_verified_on: new Date().toISOString().split('T')[0]
  };

  const { trustScore, trustPercentage } = computeTrustScore(initialNgoData, []);
  const categoriesJson = JSON.stringify([suggestion.category || 'Community Development']);

  const insert = db.prepare(`
    INSERT INTO ngos (
      name, description, categories, city, state, address,
      phone, email, website, registration_number, darpan_id,
      status_12a, status_80g, status_fcra, verification_status,
      trust_score, trust_percentage, last_verified_on
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      'Pending', 'Pending', 'Unverified', 'Verified',
      ?, ?, ?
    )
  `);

  const result = insert.run(
    suggestion.name,
    suggestion.reason || 'Verified grassroots community initiative.',
    categoriesJson,
    suggestion.city,
    suggestion.state,
    `${suggestion.city}, ${suggestion.state}`,
    suggestion.phone || '',
    suggestion.email || '',
    suggestion.website || '',
    suggestion.registration_number || '',
    suggestion.darpan_id || null,
    trustScore,
    trustPercentage,
    new Date().toISOString().split('T')[0]
  );

  db.prepare("UPDATE suggested_ngos SET status = 'approved' WHERE id = ?").run(suggestionId);

  res.json({
    message: 'Suggested NGO successfully approved and added to verified directory!',
    newNgoId: Number(result.lastInsertRowid)
  });
});

module.exports = router;
