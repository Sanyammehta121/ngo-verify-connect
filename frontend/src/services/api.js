const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('ngo_auth_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // NGO Finder & Details
  async getNgos(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.city) query.append('city', params.city);
    if (params.state) query.append('state', params.state);
    if (params.verificationStatus) query.append('verificationStatus', params.verificationStatus);
    if (params.minTrust) query.append('minTrust', params.minTrust);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.category) {
      if (Array.isArray(params.category)) {
        query.append('category', params.category.join(','));
      } else {
        query.append('category', params.category);
      }
    }

    const res = await fetch(`${API_BASE}/ngos?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch NGOs');
    return res.json();
  },

  async getNgo(id) {
    const res = await fetch(`${API_BASE}/ngos/${id}`);
    if (!res.ok) throw new Error('Failed to fetch NGO details');
    return res.json();
  },

  async getAutocomplete(q) {
    const res = await fetch(`${API_BASE}/ngos/search/autocomplete?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('Autocomplete failed');
    return res.json();
  },

  async getFilterMetadata() {
    const res = await fetch(`${API_BASE}/ngos/filters/metadata`);
    if (!res.ok) throw new Error('Failed to fetch filter metadata');
    return res.json();
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async register(name, email, password, role = 'citizen') {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async demoLogin(role = 'citizen') {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Demo login failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  // Feedback & Reviews
  async submitReview(ngoId, rating, comment) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ngoId, rating, comment })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit review');
    return data;
  },

  // Whistleblower / Fraud Reports
  async submitFraudReport(data) {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit report');
    return result;
  },

  // Public Suggestions
  async submitSuggestion(data) {
    const res = await fetch(`${API_BASE}/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit suggestion');
    return result;
  },

  // Admin APIs
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load admin stats');
    return res.json();
  },

  async getAdminNgos() {
    const res = await fetch(`${API_BASE}/admin/ngos`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load NGOs for admin');
    return res.json();
  },

  async updateGovDocuments(ngoId, data) {
    const res = await fetch(`${API_BASE}/admin/ngos/${ngoId}/documents`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update documents');
    return result;
  },

  async createNgo(data) {
    const res = await fetch(`${API_BASE}/admin/ngos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to create NGO');
    return result;
  },

  async deleteNgo(id) {
    const res = await fetch(`${API_BASE}/admin/ngos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete NGO');
    return res.json();
  },

  async getAdminReviews() {
    const res = await fetch(`${API_BASE}/admin/reviews`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async moderateReview(id, status) {
    const res = await fetch(`${API_BASE}/admin/reviews/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update review status');
    return result;
  },

  async getAdminReports() {
    const res = await fetch(`${API_BASE}/admin/reports`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async updateReportStatus(id, status) {
    const res = await fetch(`${API_BASE}/admin/reports/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update report');
    return result;
  },

  async getAdminSuggestions() {
    const res = await fetch(`${API_BASE}/admin/suggestions`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch suggestions');
    return res.json();
  },

  async approveSuggestion(id) {
    const res = await fetch(`${API_BASE}/admin/suggestions/${id}/approve`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to approve suggestion');
    return result;
  }
};
