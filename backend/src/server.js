require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('node:path');

const authRoutes = require('./routes/auth');
const ngosRoutes = require('./routes/ngos');
const reviewsRoutes = require('./routes/reviews');
const reportsRoutes = require('./routes/reports');
const suggestionsRoutes = require('./routes/suggestions');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ngos', ngosRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/admin', adminRoutes);

const os = require('node:os');

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push({ name, address: net.address });
      }
    }
  }
  return addresses;
}

// Health check & Base API
app.get(['/api', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'TrueNGO National Due Diligence API',
    timestamp: new Date().toISOString()
  });
});

// Network & Mobile connection info
app.get('/api/network-info', (req, res) => {
  const ips = getLocalIpAddresses();
  const primaryIp = ips.length > 0 ? ips[0].address : 'localhost';
  res.json({
    port: PORT,
    localUrl: `http://localhost:${PORT}`,
    mobileUrl: `http://${primaryIp}:${PORT}`,
    ip: primaryIp,
    interfaces: ips
  });
});

// Serve frontend dist build if present
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
const fs = require('node:fs');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'An unexpected internal error occurred.' });
});

// Start server if run directly
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    const ips = getLocalIpAddresses();
    const primaryIp = ips.length > 0 ? ips[0].address : 'localhost';
    console.log(`🚀 NGO Verify & Connect Backend running:`);
    console.log(`   💻 Local:   http://localhost:${PORT}`);
    console.log(`   📱 Mobile:  http://${primaryIp}:${PORT}`);
  });
}

module.exports = app;
