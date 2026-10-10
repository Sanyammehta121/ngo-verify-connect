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
  console.log('🧪 Starting TrueNGO Automated API Test Suite...');
  server = app.listen(PORT);

  try {
    // 1. Health check
    console.log('Testing 1: /api/health');
    const health = await request('/api/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.body.status, 'ok');
    console.log('✅ Health check passed');

    // 2. NGO list and search
    console.log('Testing 2: GET /api/ngos');
    const ngosRes = await request('/api/ngos');
    assert.strictEqual(ngosRes.status, 200);
    assert(ngosRes.body.total >= 8, 'Must have at least 8 seeded NGOs');
    console.log(`✅ Loaded ${ngosRes.body.total} NGOs`);

    // 3. Autocomplete search
    console.log('Testing 3: GET /api/ngos/search/autocomplete?q=Goonj');
    const autoRes = await request('/api/ngos/search/autocomplete?q=Goonj');
    assert.strictEqual(autoRes.status, 200);
    assert(autoRes.body.suggestions.length > 0);
    assert.strictEqual(autoRes.body.suggestions[0].name, 'Goonj');
    console.log('✅ Autocomplete search passed');

    // 4. NGO Single Detail
    console.log('Testing 4: GET /api/ngos/1 (Goonj)');
    const detailRes = await request('/api/ngos/1');
    assert.strictEqual(detailRes.status, 200);
    assert.strictEqual(detailRes.body.ngo.name, 'Goonj');
    assert.strictEqual(detailRes.body.ngo.darpanId, 'DL/2009/0002131');
    assert(detailRes.body.ngo.certifications.length > 0, 'Must have certifications');
    console.log('✅ NGO Detail passed');

    // 5. Post Review (Open to all citizens without login)
    console.log('Testing 5: POST /api/reviews (Open Submission)');
    const reviewRes = await request('/api/reviews', {
      method: 'POST',
      body: {
        ngoId: 1,
        rating: 5,
        comment: 'Public citizen review verifying on-ground transparency.',
        userName: 'Aarav Sharma'
      }
    });
    assert.strictEqual(reviewRes.status, 201);
    assert.strictEqual(reviewRes.body.review.userName, 'Aarav Sharma');
    assert(reviewRes.body.updatedTrustScore >= 4.0);
    console.log('✅ Open review submission & score recalculation passed');

    // 6. Whistleblower Scam Report
    console.log('Testing 6: POST /api/reports');
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

    // 7. Suggest an NGO
    console.log('Testing 7: POST /api/suggestions');
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

    // 8. Admin Stats (Accessible without login)
    console.log('Testing 8: GET /api/admin/stats');
    const adminStats = await request('/api/admin/stats');
    assert.strictEqual(adminStats.status, 200);
    assert(adminStats.body.totalNgos >= 8);
    console.log('✅ Admin stats desk passed without login');

    // 9. Admin Document Update & Real-Time Trust Recalculation (Accessible without login)
    console.log('Testing 9: PUT /api/admin/ngos/9/documents');
    const updateDocRes = await request('/api/admin/ngos/9/documents', {
      method: 'PUT',
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

    // 10. Yamuna Nagar (Haryana) District Filter & Search
    console.log('Testing 10: GET /api/ngos?city=Yamuna Nagar and city=Yamunanagar');
    const y1 = await request('/api/ngos?city=Yamuna%20Nagar');
    assert.strictEqual(y1.status, 200);
    assert(y1.body.ngos.length > 0, 'Must find NGO for Yamuna Nagar');
    assert.strictEqual(y1.body.ngos[0].state, 'Haryana');
    const y2 = await request('/api/ngos?city=Yamunanagar');
    assert.strictEqual(y2.status, 200);
    assert(y2.body.ngos.length > 0, 'Must find NGO for Yamunanagar');
    console.log(`✅ Yamuna Nagar district search passed -> ${y1.body.ngos[0].name}`);

    console.log('\n🎉 ALL 10 AUTOMATED VERIFICATION TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

runTests();
