const app = require('../backend/src/server');

module.exports = (req, res) => {
  // Ensure req.url has /api prefix for Express router if stripped by serverless routing
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
};
