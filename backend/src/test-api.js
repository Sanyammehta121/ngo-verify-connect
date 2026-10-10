const assert = require('node:assert');
const http = require('node:http');
const app = require('./server');

const PORT = 5055;
let server;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch (e) { parsed = data; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting TrueNGO Simple Authentication & Demo Login Test Suite...');
  server = app.listen(PORT);

  try {
    // 1. Health check
    console.log('\n--- 1. Core Health & Public Registry ---');
    const health = await request('/api/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.body.status, 'ok');
    console.log('✅ Health check passed');

    // 2. Public NGO Registry Search & Browsing
    const ngosRes = await request('/api/ngos');
    assert.strictEqual(ngosRes.status, 200);
    assert(ngosRes.body.total >= 8, 'Must have at least 8 seeded NGOs');
    console.log(`✅ Loaded ${ngosRes.body.total} NGOs in public registry`);

    // 3. Autocomplete search
    const autoRes = await request('/api/ngos/search/autocomplete?q=Goonj');
    assert.strictEqual(autoRes.status, 200);
    assert(autoRes.body.suggestions.length > 0);
    console.log('✅ Autocomplete search passed');

    // -------------------------------------------------------------------------
    // 4. One-Click Demo Login (Citizen & Admin)
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Instant 1-Click Demo Login Endpoints ---');
    
    // Demo Citizen Login
    const demoCitizenRes = await request('/api/auth/demo', {
      method: 'POST',
      body: { role: 'citizen' }
    });
    assert.strictEqual(demoCitizenRes.status, 200);
    assert.strictEqual(demoCitizenRes.body.user.role, 'citizen');
    assert(demoCitizenRes.body.token, 'Must return JWT session token');
    const demoCitizenToken = demoCitizenRes.body.token;
    console.log(`✅ Demo citizen login succeeded: ${demoCitizenRes.body.user.name} (${demoCitizenRes.body.user.email})`);

    // Demo Admin Login
    const demoAdminRes = await request('/api/auth/demo', {
      method: 'POST',
      body: { role: 'admin' }
    });
    assert.strictEqual(demoAdminRes.status, 200);
    assert.strictEqual(demoAdminRes.body.user.role, 'admin');
    assert(demoAdminRes.body.token, 'Must return JWT session token');
    const demoAdminToken = demoAdminRes.body.token;
    console.log(`✅ Demo officer login succeeded: ${demoAdminRes.body.user.name} (${demoAdminRes.body.user.email})`);

    // -------------------------------------------------------------------------
    // 5. Simple Email & Password Login
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Simple Email & Password Authentication ---');
    
    // Valid Citizen Login
    const citizenLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'aarav.sharma@gmail.com', password: 'Password@123' }
    });
    assert.strictEqual(citizenLoginRes.status, 200);
    assert.strictEqual(citizenLoginRes.body.user.email, 'aarav.sharma@gmail.com');
    assert(citizenLoginRes.body.token, 'Must return JWT token');
    console.log('✅ Citizen email & password authentication succeeded');

    // Valid Admin Login
    const adminLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@ngoverify.org', password: 'Admin@123' }
    });
    assert.strictEqual(adminLoginRes.status, 200);
    assert.strictEqual(adminLoginRes.body.user.role, 'admin');
    console.log('✅ Officer email & password authentication succeeded');

    // Invalid Password Rejection
    const badPassRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@ngoverify.org', password: 'WrongPassword' }
    });
    assert.strictEqual(badPassRes.status, 401);
    console.log('✅ Rejected invalid password with 401 Unauthorized');

    // -------------------------------------------------------------------------
    // 6. Citizen Registration (Immediately active without OTP friction)
    // -------------------------------------------------------------------------
    console.log('\n--- 4. User Registration Flow ---');
    const testEmail = `new_citizen_${Date.now()}@domain.org`;
    const regRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Pooja Verma',
        email: testEmail,
        password: 'PassWord@123'
      }
    });
    assert.strictEqual(regRes.status, 201);
    assert.strictEqual(regRes.body.user.name, 'Pooja Verma');
    assert(regRes.body.token, 'Must immediately return active session token');
    const newCitizenToken = regRes.body.token;
    console.log(`✅ New citizen registered and immediately active: ${testEmail}`);

    // Duplicate Email Rejection
    const dupRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Duplicate Citizen',
        email: testEmail,
        password: 'PassWord@123'
      }
    });
    assert.strictEqual(dupRes.status, 400);
    console.log('✅ Rejected duplicate registration with 400 Bad Request');

    // -------------------------------------------------------------------------
    // 7. Protected Actions (Reviews & Reports)
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Protected Features Authorization ---');

    // Unauthenticated review attempt -> 401
    const anonReviewRes = await request('/api/reviews', {
      method: 'POST',
      body: { ngoId: 1, rating: 5, comment: 'Anonymous review' }
    });
    assert.strictEqual(anonReviewRes.status, 401);
    console.log('✅ Unauthenticated review blocked with 401');

    // Authenticated review with new citizen token -> 201
    const authReviewRes = await request('/api/reviews', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${newCitizenToken}` },
      body: { ngoId: 1, rating: 5, comment: 'Verified inspection completed successfully.' }
    });
    assert.strictEqual(authReviewRes.status, 201);
    assert.strictEqual(authReviewRes.body.review.userName, 'Pooja Verma');
    console.log('✅ Authenticated citizen review submitted successfully');

    // Authenticated Whistleblower Fraud Report -> 201
    const authReportRes = await request('/api/reports', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${demoCitizenToken}` },
      body: {
        ngoId: 9,
        reason: 'Misuse of Donated Funds',
        details: 'Audit report inspection with transaction ID verification.'
      }
    });
    assert.strictEqual(authReportRes.status, 201);
    assert(authReportRes.body.ticket.startsWith('REP-2026-'));
    console.log(`✅ Fraud report filed with ticket: ${authReportRes.body.ticket}`);

    // -------------------------------------------------------------------------
    // 8. Role-Based Access Control (Admin Desk)
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Role-Based Access Control ---');
    // Citizen accessing admin stats -> 403 Forbidden
    const citizenAdminRes = await request('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${demoCitizenToken}` }
    });
    assert.strictEqual(citizenAdminRes.status, 403);
    console.log('✅ Citizen blocked from Admin Desk with 403 Forbidden');

    // Officer accessing admin stats -> 200 OK
    const adminStatsRes = await request('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${demoAdminToken}` }
    });
    assert.strictEqual(adminStatsRes.status, 200);
    assert(adminStatsRes.body.totalNgos >= 8);
    console.log(`✅ Officer accessed Admin Desk (Total NGOs: ${adminStatsRes.body.totalNgos})`);

    // -------------------------------------------------------------------------
    // 9. Session Verification (/api/auth/me)
    // -------------------------------------------------------------------------
    console.log('\n--- 7. Session Profile Verification (/api/auth/me) ---');
    const meRes = await request('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${newCitizenToken}` }
    });
    assert.strictEqual(meRes.status, 200);
    assert.strictEqual(meRes.body.user.email, testEmail);
    assert.strictEqual(meRes.body.user.activity.reviewsSubmitted, 1);
    console.log('✅ /api/auth/me returned user profile with accurate activity stats');

    console.log('\n🎉 ALL SIMPLE AUTHENTICATION & DEMO LOGIN TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

runTests();
