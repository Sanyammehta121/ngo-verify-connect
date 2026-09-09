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
  console.log('🧪 Starting NGO Verify & Connect Automated API Test Suite...');
  server = app.listen(PORT);

  try {
    // 1. Health check
    console.log('Testing 1: /api/health');
    const health = await request('/api/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.body.status, 'ok');
    console.log('✅ Health check passed');

    // 2. Demo login (Citizen)
    console.log('Testing 2: Demo Citizen Login');
    const citizenLogin = await request('/api/auth/demo-login', {
      method: 'POST',
      body: { role: 'citizen' }
    });
    assert.strictEqual(citizenLogin.status, 200);
    assert(citizenLogin.body.token, 'Token must be present');
    const citizenToken = citizenLogin.body.token;
    console.log('✅ Citizen auth passed');

    // 3. Demo login (Admin)
    console.log('Testing 3: Demo Admin Login');
    const adminLogin = await request('/api/auth/demo-login', {
      method: 'POST',
      body: { role: 'admin' }
    });
    assert.strictEqual(adminLogin.status, 200);
    assert.strictEqual(adminLogin.body.user.role, 'admin');
    const adminToken = adminLogin.body.token;
    console.log('✅ Admin auth passed');

    // 4. NGO list and search
    console.log('Testing 4: GET /api/ngos');
    const ngosRes = await request('/api/ngos');
    assert.strictEqual(ngosRes.status, 200);
    assert(ngosRes.body.total >= 8, 'Must have at least 8 seeded NGOs');
    console.log(`✅ Loaded ${ngosRes.body.total} NGOs`);

    // 5. Autocomplete search
    console.log('Testing 5: GET /api/ngos/search/autocomplete?q=Goonj');
    const autoRes = await request('/api/ngos/search/autocomplete?q=Goonj');
    assert.strictEqual(autoRes.status, 200);
    assert(autoRes.body.suggestions.length > 0);
    assert.strictEqual(autoRes.body.suggestions[0].name, 'Goonj');
    console.log('✅ Autocomplete search passed');

    // 6. NGO Single Detail
    console.log('Testing 6: GET /api/ngos/1 (Goonj)');
    const detailRes = await request('/api/ngos/1');
    assert.strictEqual(detailRes.status, 200);
    assert.strictEqual(detailRes.body.ngo.name, 'Goonj');
    assert.strictEqual(detailRes.body.ngo.darpanId, 'DL/2009/0002131');
    assert(detailRes.body.ngo.certifications.length > 0, 'Must have certifications');
    console.log('✅ NGO Detail passed');

    // 7. Post Review (Authenticated Citizen)
    console.log('Testing 7: POST /api/reviews');
    const reviewRes = await request('/api/reviews', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${citizenToken}` },
      body: {
        ngoId: 1,
        rating: 5,
        comment: 'Automated test review verifying transparency.'
      }
    });
    assert.strictEqual(reviewRes.status, 201);
    assert(reviewRes.body.updatedTrustScore >= 4.0);
    console.log('✅ Review submission & score recalculation passed');

    // 8. Whistleblower Scam Report
    console.log('Testing 8: POST /api/reports');
    const reportRes = await request('/api/reports', {
      method: 'POST',
      body: {
        ngoId: 9,
        reason: 'Misuse of Donated Funds',
        details: 'Testing whistleblower reporting with ticket verification.',
        reporterName: 'Test Auditor'
      }
    });
    assert.strictEqual(reportRes.status, 201);
    assert(reportRes.body.ticket.startsWith('REP-2026-'));
    console.log(`✅ Whistleblower report filed with ticket: ${reportRes.body.ticket}`);

    // 9. Suggest an NGO
    console.log('Testing 9: POST /api/suggestions');
    const suggestRes = await request('/api/suggestions', {
      method: 'POST',
      body: {
        name: 'Goonj Delhi Regional Branch',
        city: 'New Delhi',
        state: 'Delhi',
        category: 'Disaster Relief',
        reason: 'High-impact community clothes bank.'
      }
    });
    assert.strictEqual(suggestRes.status, 201);
    console.log('✅ Public NGO suggestion passed');

    // 10. Admin Stats
    console.log('Testing 10: GET /api/admin/stats');
    const adminStats = await request('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(adminStats.status, 200);
    assert(adminStats.body.totalNgos >= 8);
    console.log('✅ Admin stats desk passed');

    // 11. Admin Document Update & Real-Time Trust Recalculation
    console.log('Testing 11: PUT /api/admin/ngos/9/documents');
    const updateDocRes = await request('/api/admin/ngos/9/documents', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: {
        status12A: 'Verified',
        status80G: 'Verified',
        statusFCRA: 'Unverified',
        darpanId: 'MH/2026/0991212',
        verificationStatus: 'Verified'
      }
    });
    assert.strictEqual(updateDocRes.status, 200);
    assert(updateDocRes.body.trustScore > 3.0, 'Trust score should increase when 12A/80G are verified');
    console.log(`✅ Admin document update recalculated score to: ${updateDocRes.body.trustScore}/5.0`);

    console.log('\n🎉 ALL 11 AUTOMATED VERIFICATION TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

runTests();
