const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
let dbPath;

if (isServerless) {
  const tmpDbPath = path.join(os.tmpdir(), 'ngo_database.sqlite');
  const bundledDb = path.join(__dirname, '..', 'data', 'ngo_database.sqlite');
  if (!fs.existsSync(tmpDbPath)) {
    if (fs.existsSync(bundledDb)) {
      try {
        fs.copyFileSync(bundledDb, tmpDbPath);
      } catch (err) {
        console.warn('Could not copy bundled DB to /tmp, will initialize fresh:', err.message);
      }
    }
  }
  dbPath = tmpDbPath;
} else {
  const dbDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  dbPath = path.join(dbDir, 'ngo_database.sqlite');
}

const db = new DatabaseSync(dbPath);

// Enable foreign keys and initialize tables
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'citizen',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ngos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    logo TEXT,
    description TEXT,
    categories TEXT, -- JSON array of strings
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT,
    latitude REAL,
    longitude REAL,
    phone TEXT,
    email TEXT,
    website TEXT,
    registration_number TEXT,
    pan_number TEXT,
    status_12a TEXT DEFAULT 'Pending',
    status_80g TEXT DEFAULT 'Pending',
    status_fcra TEXT DEFAULT 'Unverified',
    fcra_number TEXT,
    darpan_id TEXT,
    verification_status TEXT DEFAULT 'Pending',
    trust_score REAL DEFAULT 0,
    trust_percentage INTEGER DEFAULT 0,
    donation_link TEXT,
    donation_upi TEXT,
    last_verified_on TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ngo_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    issuer TEXT,
    issue_date TEXT,
    expiry_date TEXT,
    status TEXT DEFAULT 'Verified',
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ngo_id INTEGER NOT NULL,
    user_id INTEGER,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    status TEXT DEFAULT 'approved',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS fraud_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ngo_id INTEGER NOT NULL,
    reporter_name TEXT,
    reporter_email TEXT,
    reason TEXT NOT NULL,
    details TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS suggested_ngos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    category TEXT NOT NULL,
    darpan_id TEXT,
    registration_number TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    reason TEXT,
    submitter_name TEXT,
    submitter_email TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

/**
 * Computes composite trust score based on document validity, donation verification,
 * audit freshness, and community reviews.
 * Returns { trustScore: number (1.0 to 5.0), trustPercentage: number (0 to 100) }
 */
function computeTrustScore(ngoData, reviews = []) {
  let points = 0;

  // 1. 12A Tax Exemption (20 pts)
  if (ngoData.status_12a === 'Verified' || ngoData.status12A === 'Verified') {
    points += 20;
  }

  // 2. 80G Tax Exemption (20 pts)
  if (ngoData.status_80g === 'Verified' || ngoData.status80G === 'Verified') {
    points += 20;
  }

  // 3. NITI Aayog Darpan ID (20 pts)
  const darpan = ngoData.darpan_id || ngoData.darpanId;
  if (darpan && darpan.trim() !== '') {
    points += 20;
  }

  // 4. FCRA Clearance (10 pts)
  if (ngoData.status_fcra === 'Verified' || ngoData.statusFCRA === 'Verified') {
    points += 10;
  }

  // 5. Verified Donation Channel (10 pts)
  const donationLink = ngoData.donation_link || ngoData.donationLink;
  if (donationLink && donationLink.trim().startsWith('http')) {
    points += 10;
  }

  // 6. Verification Freshness within last 12 months (10 pts)
  const lastVerified = ngoData.last_verified_on || ngoData.lastVerifiedOn;
  if (lastVerified) {
    const verifiedDate = new Date(lastVerified);
    const now = new Date();
    const diffMonths = (now - verifiedDate) / (1000 * 60 * 60 * 24 * 30);
    if (diffMonths <= 12) {
      points += 10;
    } else if (diffMonths <= 24) {
      points += 5;
    }
  }

  // 7. Community Reviews (10 pts)
  const approvedReviews = reviews.filter(r => r.status === 'approved' || !r.status);
  if (approvedReviews.length > 0) {
    const sumRatings = approvedReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = sumRatings / approvedReviews.length;
    points += Math.round((avgRating / 5) * 10);
  } else {
    // If no reviews yet, neutral grant 7 pts if documents are verified
    if (points >= 50) points += 7;
  }

  // Cap points between 10 and 100
  points = Math.min(100, Math.max(15, points));
  
  // Calculate 1.0 to 5.0 score
  const score = (points / 20).toFixed(1);

  return {
    trustScore: parseFloat(score),
    trustPercentage: points
  };
}

module.exports = {
  db,
  computeTrustScore
};

// Auto-seed database if empty (ensures serverless deployments have all records)
try {
  const checkUsers = db.prepare('SELECT count(*) as count FROM users').get();
  if (!checkUsers || checkUsers.count === 0) {
    const { importSeedData } = require('./import-seed');
    importSeedData();
  }
} catch (e) {
  // Ignored if table not ready
}

