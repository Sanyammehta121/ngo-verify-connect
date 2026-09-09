const fs = require('node:fs');
const path = require('node:path');
const bcrypt = require('bcryptjs');
const { db, computeTrustScore } = require('./db');

async function importSeedData() {
  console.log('🔄 Starting NGO seed data import...');

  // 1. Seed Users (Demo Admin & Demo Citizen)
  console.log('👤 Seeding default authentication accounts...');
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('Admin@123', salt);
  const citizenPasswordHash = bcrypt.hashSync('User@123', salt);

  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertUser.run(1, 'Admin Officer (Gov Desk)', 'admin@ngoverify.org', adminPasswordHash, 'admin');
  insertUser.run(2, 'Aarav Mehta (Verified Donor)', 'citizen@example.com', citizenPasswordHash, 'citizen');
  console.log('✅ Accounts seeded: admin@ngoverify.org, citizen@example.com');

  // 2. Read Seed JSON
  const seedFilePath = path.join(__dirname, '..', 'data', 'real_ngos_seed.json');
  if (!fs.existsSync(seedFilePath)) {
    console.error(`❌ Seed file not found at ${seedFilePath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(seedFilePath, 'utf-8');
  const ngos = JSON.parse(rawData);
  console.log(`📦 Found ${ngos.length} real NGO records to import.`);

  // Prepare SQL statements
  const insertNgo = db.prepare(`
    INSERT OR REPLACE INTO ngos (
      id, name, logo, description, categories, city, state, address,
      latitude, longitude, phone, email, website, registration_number,
      pan_number, status_12a, status_80g, status_fcra, fcra_number,
      darpan_id, verification_status, trust_score, trust_percentage,
      donation_link, donation_upi, last_verified_on
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  const deleteCertifications = db.prepare('DELETE FROM certifications WHERE ngo_id = ?');
  const insertCert = db.prepare(`
    INSERT INTO certifications (ngo_id, name, issuer, issue_date, expiry_date, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const deleteReviews = db.prepare('DELETE FROM reviews WHERE ngo_id = ?');
  const insertReview = db.prepare(`
    INSERT INTO reviews (ngo_id, user_id, user_name, rating, comment, status, created_at)
    VALUES (?, ?, ?, ?, ?, 'approved', ?)
  `);

  let count = 0;
  for (const ngo of ngos) {
    // Compute initial trust score
    const reviews = ngo.sampleReviews || [];
    const { trustScore, trustPercentage } = computeTrustScore({
      status_12a: ngo.status12A,
      status_80g: ngo.status80G,
      status_fcra: ngo.statusFCRA,
      darpan_id: ngo.darpanId,
      donation_link: ngo.donationLink,
      last_verified_on: ngo.lastVerifiedOn
    }, reviews);

    // Categories as JSON string
    const categoriesJson = JSON.stringify(ngo.categories || []);

    insertNgo.run(
      ngo.id,
      ngo.name,
      ngo.logo || null,
      ngo.description || '',
      categoriesJson,
      ngo.city,
      ngo.state,
      ngo.address || '',
      ngo.latitude || null,
      ngo.longitude || null,
      ngo.phone || '',
      ngo.email || '',
      ngo.website || '',
      ngo.registrationNumber || '',
      ngo.panNumber || '',
      ngo.status12A || 'Pending',
      ngo.status80G || 'Pending',
      ngo.statusFCRA || 'Unverified',
      ngo.fcraNumber || null,
      ngo.darpanId || null,
      ngo.verificationStatus || 'Pending',
      trustScore,
      trustPercentage,
      ngo.donationLink || null,
      ngo.donationUpi || null,
      ngo.lastVerifiedOn || new Date().toISOString().split('T')[0]
    );

    // Certifications
    deleteCertifications.run(ngo.id);
    if (ngo.certifications && Array.isArray(ngo.certifications)) {
      for (const cert of ngo.certifications) {
        insertCert.run(
          ngo.id,
          cert.name,
          cert.issuer,
          cert.issueDate,
          cert.expiryDate,
          cert.status || 'Verified'
        );
      }
    }

    // Sample reviews
    deleteReviews.run(ngo.id);
    if (ngo.sampleReviews && Array.isArray(ngo.sampleReviews)) {
      for (const rev of ngo.sampleReviews) {
        insertReview.run(
          ngo.id,
          2, // Aaron Mehta user
          rev.author || 'Verified Donor',
          rev.rating,
          rev.comment,
          rev.date ? `${rev.date} 12:00:00` : new Date().toISOString()
        );
      }
    }

    count++;
  }

  console.log(`🎉 Successfully imported ${count} real NGO records with certifications and reviews!`);
}

if (require.main === module) {
  importSeedData().catch(err => {
    console.error('Import failed:', err);
    process.exit(1);
  });
}

module.exports = { importSeedData };
