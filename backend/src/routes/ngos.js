const express = require('express');
const { db, computeTrustScore } = require('../db');

const router = express.Router();

/**
 * Autocomplete endpoint for fast instant search
 * Matches NGO name, city, and cause categories
 */
router.get('/search/autocomplete', (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query || query.length < 1) {
    return res.json({ suggestions: [] });
  }

  const pattern = `%${query}%`;
  const ngos = db.prepare(`
    SELECT id, name, city, state, categories, verification_status, trust_score
    FROM ngos
    WHERE name LIKE ? OR city LIKE ? OR state LIKE ? OR categories LIKE ?
    LIMIT 8
  `).all(pattern, pattern, pattern, pattern);

  const formatted = ngos.map(n => {
    let cats = [];
    try { cats = JSON.parse(n.categories); } catch (e) {}
    return {
      id: n.id,
      name: n.name,
      city: n.city,
      state: n.state,
      categories: cats,
      verificationStatus: n.verification_status,
      trustScore: n.trust_score
    };
  });

  res.json({ suggestions: formatted });
});

/**
 * Get distinct filter metadata: list of all categories and cities available
 */
router.get('/filters/metadata', (req, res) => {
  const allNgos = db.prepare('SELECT city, state, categories FROM ngos').all();
  
  const activeCities = new Set();
  const activeStates = new Set();
  const categories = new Set();

  for (const row of allNgos) {
    if (row.city) activeCities.add(row.city);
    if (row.state) activeStates.add(row.state);
    try {
      const parsedCats = JSON.parse(row.categories);
      if (Array.isArray(parsedCats)) {
        parsedCats.forEach(c => categories.add(c));
      }
    } catch (e) {}
  }

  let allIndiaLocations = [];
  try {
    const locsPath = require('node:path').join(__dirname, '..', '..', 'data', 'india_locations.json');
    allIndiaLocations = require(locsPath).states || [];
  } catch (err) {
    console.error('Failed to read india_locations.json:', err);
  }

  const allStates = allIndiaLocations.map(s => s.name).sort();
  const allCities = Array.from(new Set(allIndiaLocations.flatMap(s => s.cities))).sort();

  res.json({
    states: allStates,
    cities: allCities,
    locations: allIndiaLocations,
    activeStates: Array.from(activeStates).sort(),
    activeCities: Array.from(activeCities).sort(),
    categories: Array.from(categories).sort()
  });
});

/**
 * List NGOs with multi-criteria filtering, search, and sorting
 */
router.get('/', (req, res) => {
  const {
    q,
    category,       // Can be comma-separated or repeated
    city,
    state,
    verificationStatus,
    minTrust,       // Minimum trust score (e.g. 4.0)
    sortBy          // 'trust_desc', 'reviews_desc', 'verified_desc', 'name_asc'
  } = req.query;

  let query = 'SELECT n.* FROM ngos n WHERE 1=1';
  const params = [];

  // Search keyword (name, description, or registration number)
  if (q && q.trim() !== '') {
    query += ' AND (n.name LIKE ? OR n.description LIKE ? OR n.city LIKE ? OR n.state LIKE ? OR n.categories LIKE ? OR n.registration_number LIKE ? OR n.darpan_id LIKE ?)';
    const term = `%${q.trim()}%`;
    params.push(term, term, term, term, term, term, term);
  }

  // Location filters
  if (city && city.trim() !== '') {
    query += ' AND LOWER(n.city) = LOWER(?)';
    params.push(city.trim());
  }

  if (state && state.trim() !== '') {
    query += ' AND LOWER(n.state) = LOWER(?)';
    params.push(state.trim());
  }

  // Verification status filter (Verified, Pending, Unverified, etc.)
  if (verificationStatus && verificationStatus.trim() !== '') {
    query += ' AND LOWER(n.verification_status) = LOWER(?)';
    params.push(verificationStatus.trim());
  }

  // Min trust score
  if (minTrust && !isNaN(parseFloat(minTrust))) {
    query += ' AND n.trust_score >= ?';
    params.push(parseFloat(minTrust));
  }

  // Sorting
  switch (sortBy) {
    case 'trust_desc':
      query += ' ORDER BY n.trust_score DESC, n.trust_percentage DESC';
      break;
    case 'verified_desc':
      query += ' ORDER BY n.last_verified_on DESC';
      break;
    case 'name_asc':
      query += ' ORDER BY n.name ASC';
      break;
    case 'reviews_desc':
      // We will order after attaching review counts or subquery
      query += " ORDER BY (SELECT COUNT(*) FROM reviews WHERE ngo_id = n.id AND status = 'approved') DESC";
      break;
    default:
      query += ' ORDER BY n.trust_score DESC, n.id ASC';
  }

  const rows = db.prepare(query).all(...params);

  // Parse categories and attach review summary
  let results = rows.map(ngo => {
    let cats = [];
    try { cats = JSON.parse(ngo.categories); } catch (e) {}

    const reviewsCount = db.prepare("SELECT COUNT(*) as count, AVG(rating) as avgRating FROM reviews WHERE ngo_id = ? AND status = 'approved'").get(ngo.id);

    return {
      id: ngo.id,
      name: ngo.name,
      logo: ngo.logo,
      description: ngo.description,
      categories: cats,
      city: ngo.city,
      state: ngo.state,
      address: ngo.address,
      latitude: ngo.latitude,
      longitude: ngo.longitude,
      phone: ngo.phone,
      email: ngo.email,
      website: ngo.website,
      registrationNumber: ngo.registration_number,
      panNumber: ngo.pan_number,
      status12A: ngo.status_12a,
      status80G: ngo.status_80g,
      statusFCRA: ngo.status_fcra,
      fcraNumber: ngo.fcra_number,
      darpanId: ngo.darpan_id,
      verificationStatus: ngo.verification_status,
      trustScore: ngo.trust_score,
      trustPercentage: ngo.trust_percentage,
      donationLink: ngo.donation_link,
      donationUpi: ngo.donation_upi,
      lastVerifiedOn: ngo.last_verified_on,
      reviewCount: reviewsCount.count || 0,
      averageRating: reviewsCount.avgRating ? parseFloat(reviewsCount.avgRating.toFixed(1)) : null
    };
  });

  // Category filter (handles single or multi-select array in query)
  if (category) {
    const selectedCategories = (Array.isArray(category) ? category : category.split(','))
      .map(c => c.trim().toLowerCase())
      .filter(Boolean);

    if (selectedCategories.length > 0) {
      results = results.filter(ngo => {
        return ngo.categories.some(cat => selectedCategories.includes(cat.toLowerCase()));
      });
    }
  }

  res.json({
    total: results.length,
    ngos: results
  });
});

/**
 * Get single NGO detail by ID with full documents, certifications, and reviews
 */
router.get('/:id', (req, res) => {
  const ngoId = parseInt(req.params.id, 10);
  if (isNaN(ngoId)) {
    return res.status(400).json({ error: 'Invalid NGO ID' });
  }

  const ngo = db.prepare('SELECT * FROM ngos WHERE id = ?').get(ngoId);
  if (!ngo) {
    return res.status(404).json({ error: 'NGO not found' });
  }

  // Certifications
  const certifications = db.prepare('SELECT * FROM certifications WHERE ngo_id = ? ORDER BY id ASC').all(ngoId);

  // Reviews
  const reviews = db.prepare(`
    SELECT r.id, r.user_id, r.user_name, r.rating, r.comment, r.status, r.created_at
    FROM reviews r
    WHERE r.ngo_id = ? AND r.status = 'approved'
    ORDER BY r.created_at DESC
  `).all(ngoId);

  // Re-verify trust score dynamically
  const { trustScore, trustPercentage } = computeTrustScore(ngo, reviews);

  let categories = [];
  try { categories = JSON.parse(ngo.categories); } catch (e) {}

  const avgRating = reviews.length > 0
    ? parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
    : null;

  res.json({
    ngo: {
      id: ngo.id,
      name: ngo.name,
      logo: ngo.logo,
      description: ngo.description,
      categories,
      city: ngo.city,
      state: ngo.state,
      address: ngo.address,
      latitude: ngo.latitude,
      longitude: ngo.longitude,
      phone: ngo.phone,
      email: ngo.email,
      website: ngo.website,
      registrationNumber: ngo.registration_number,
      panNumber: ngo.pan_number,
      status12A: ngo.status_12a,
      status80G: ngo.status_80g,
      statusFCRA: ngo.status_fcra,
      fcraNumber: ngo.fcra_number,
      darpanId: ngo.darpan_id,
      verificationStatus: ngo.verification_status,
      trustScore,
      trustPercentage,
      donationLink: ngo.donation_link,
      donationUpi: ngo.donation_upi,
      lastVerifiedOn: ngo.last_verified_on,
      certifications: certifications.map(c => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        issueDate: c.issue_date,
        expiryDate: c.expiry_date,
        status: c.status
      })),
      reviews: reviews.map(r => ({
        id: r.id,
        userName: r.user_name,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at
      })),
      reviewCount: reviews.length,
      averageRating: avgRating
    }
  });
});

module.exports = router;
