import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Clock, 
  AlertTriangle, Users, MessageSquare, PlusCircle, RefreshCw, 
  ExternalLink, Save, Edit3, Trash2, Check, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';
import { INDIA_LOCATIONS, ALL_INDIAN_STATES, ALL_INDIAN_CITIES } from '../data/indiaLocations';

export default function AdminDashboardPage({ onSelectNgo }) {
  const [activeTab, setActiveTab] = useState('documents'); // 'documents', 'reviews', 'reports', 'suggestions'

  // Data states
  const [stats, setStats] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reports, setReports] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  // Inline editing state for document desk
  const [editingNgoId, setEditingNgoId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Add new NGO form modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNgo, setNewNgo] = useState({
    name: '',
    city: '',
    state: '',
    categories: 'Education',
    registrationNumber: '',
    panNumber: '',
    darpanId: '',
    status12A: 'Verified',
    status80G: 'Verified',
    statusFCRA: 'Unverified',
    donationLink: '',
    phone: '',
    email: '',
    website: '',
    description: ''
  });

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, ngosData, reviewsData, reportsData, suggestionsData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminNgos(),
        api.getAdminReviews(),
        api.getAdminReports(),
        api.getAdminSuggestions()
      ]);
      setStats(statsData);
      setNgos(ngosData.ngos || []);
      setReviews(reviewsData.reviews || []);
      setReports(reportsData.reports || []);
      setSuggestions(suggestionsData.suggestions || []);
    } catch (err) {
      console.error('Failed to load admin desk data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  const showToast = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleStartEditDocs = (ngo) => {
    setEditingNgoId(ngo.id);
    setEditForm({
      status12A: ngo.status12A || 'Pending',
      status80G: ngo.status80G || 'Pending',
      statusFCRA: ngo.statusFCRA || 'Unverified',
      darpanId: ngo.darpanId || '',
      verificationStatus: ngo.verificationStatus || 'Pending'
    });
  };

  const handleSaveDocs = async (ngoId) => {
    try {
      const res = await api.updateGovDocuments(ngoId, editForm);
      showToast(`Updated documents for NGO #${ngoId}. Recomputed Trust Score: ${res.trustScore}/5.0`);
      setEditingNgoId(null);
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleModerateReview = async (reviewId, status) => {
    try {
      await api.moderateReview(reviewId, status);
      showToast(`Review #${reviewId} marked as ${status}`);
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateReport = async (reportId, status) => {
    try {
      await api.updateReportStatus(reportId, status);
      showToast(`Report #${reportId} status set to ${status}`);
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleApproveSuggestion = async (suggestionId) => {
    try {
      await api.approveSuggestion(suggestionId);
      showToast('Suggestion approved and added to active NGO directory!');
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateNgo = async (e) => {
    e.preventDefault();
    try {
      await api.createNgo({
        ...newNgo,
        categories: [newNgo.categories]
      });
      showToast('New NGO record successfully indexed!');
      setShowAddModal(false);
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gov Compliance Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Compliance & Verification Control Center
            </h1>
            <p className="text-xs text-slate-300">
              Manage statutory registrations, moderate community feedback, and investigate whistleblower fraud flags.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add NGO Record</span>
            </button>
            <button
              onClick={loadAllAdminData}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
              title="Refresh desk data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-[11px] text-slate-400 font-medium">Total NGOs</div>
              <div className="text-xl font-bold text-white mt-0.5">{stats.totalNgos}</div>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <div className="text-[11px] text-emerald-300 font-medium">Verified NGOs</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{stats.verifiedNgos}</div>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="text-[11px] text-amber-300 font-medium">Pending Review</div>
              <div className="text-xl font-bold text-amber-400 mt-0.5">{stats.pendingNgos}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-[11px] text-slate-400 font-medium">Citizen Reviews</div>
              <div className="text-xl font-bold text-white mt-0.5">{stats.totalReviews}</div>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
              <div className="text-[11px] text-rose-300 font-medium">Fraud Reports</div>
              <div className="text-xl font-bold text-rose-400 mt-0.5">{stats.pendingReports}</div>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
              <div className="text-[11px] text-teal-300 font-medium">Suggestions</div>
              <div className="text-xl font-bold text-teal-300 mt-0.5">{stats.pendingSuggestions}</div>
            </div>
          </div>
        )}
      </div>

      {/* Desk Tab Navigation */}
      <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 px-4 transition border-b-2 ${
            activeTab === 'documents'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Document Verification Desk ({ngos.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-4 transition border-b-2 ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Review Moderation Queue ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-4 transition border-b-2 ${
            activeTab === 'reports'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Whistleblower & Fraud Reports ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`pb-3 px-4 transition border-b-2 ${
            activeTab === 'suggestions'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Crowdsourced Suggestions ({suggestions.length})
        </button>
      </div>

      {/* Tab 1: NGO Document Verification Desk */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Registered NGOs Statutory Compliance Roster</h3>
            <span className="text-xs text-slate-500">Click "Edit" to modify document statuses and recompute score</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60">
                <tr>
                  <th className="px-4 py-3">NGO Name & City</th>
                  <th className="px-4 py-3">Darpan ID</th>
                  <th className="px-4 py-3">12A Exemption</th>
                  <th className="px-4 py-3">80G Benefit</th>
                  <th className="px-4 py-3">FCRA Status</th>
                  <th className="px-4 py-3">Trust Score</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ngos.map((ngo) => {
                  const isEditing = editingNgoId === ngo.id;
                  return (
                    <tr key={ngo.id} className="hover:bg-slate-50/70 transition">
                      {/* Name */}
                      <td className="px-4 py-3.5">
                        <div 
                          onClick={() => onSelectNgo(ngo.id)}
                          className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer"
                        >
                          {ngo.name}
                        </div>
                        <div className="text-[11px] text-slate-500">{ngo.city}, {ngo.state}</div>
                      </td>

                      {/* Darpan ID */}
                      <td className="px-4 py-3.5 font-mono text-slate-700">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.darpanId}
                            onChange={(e) => setEditForm({ ...editForm, darpanId: e.target.value })}
                            className="p-1 border rounded text-xs w-28"
                          />
                        ) : (
                          ngo.darpanId || <span className="text-slate-400">None</span>
                        )}
                      </td>

                      {/* 12A Status */}
                      <td className="px-4 py-3.5">
                        {isEditing ? (
                          <select
                            value={editForm.status12A}
                            onChange={(e) => setEditForm({ ...editForm, status12A: e.target.value })}
                            className="p-1 border rounded text-xs"
                          >
                            <option value="Verified">Verified</option>
                            <option value="Pending">Pending</option>
                            <option value="Expired">Expired</option>
                            <option value="Unverified">Unverified</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            ngo.status12A === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ngo.status12A}
                          </span>
                        )}
                      </td>

                      {/* 80G Status */}
                      <td className="px-4 py-3.5">
                        {isEditing ? (
                          <select
                            value={editForm.status80G}
                            onChange={(e) => setEditForm({ ...editForm, status80G: e.target.value })}
                            className="p-1 border rounded text-xs"
                          >
                            <option value="Verified">Verified</option>
                            <option value="Pending">Pending</option>
                            <option value="Expired">Expired</option>
                            <option value="Unverified">Unverified</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            ngo.status80G === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ngo.status80G}
                          </span>
                        )}
                      </td>

                      {/* FCRA Status */}
                      <td className="px-4 py-3.5">
                        {isEditing ? (
                          <select
                            value={editForm.statusFCRA}
                            onChange={(e) => setEditForm({ ...editForm, statusFCRA: e.target.value })}
                            className="p-1 border rounded text-xs"
                          >
                            <option value="Verified">Verified</option>
                            <option value="Pending">Pending</option>
                            <option value="Expired">Expired</option>
                            <option value="Unverified">Unverified</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            ngo.statusFCRA === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ngo.statusFCRA}
                          </span>
                        )}
                      </td>

                      {/* Trust Score */}
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        ★ {ngo.trustScore?.toFixed(1) || '0.0'}
                        <span className="text-[10px] text-slate-400 block">{ngo.trustPercentage}%</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        {isEditing ? (
                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => handleSaveDocs(ngo.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingNgoId(null)}
                              className="px-2 py-1 bg-slate-200 text-slate-700 rounded-md text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEditDocs(ngo)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-medium transition"
                          >
                            Update Docs
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Feedback & Review Moderation */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Citizen Reviews Moderation Desk</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {reviews.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">No reviews submitted yet.</div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">{rev.ngo_name || `NGO #${rev.ngo_id}`}</span>
                      <span className="text-amber-500 font-bold text-xs">★ {rev.rating}/5</span>
                      <span className="text-slate-400 text-xs">• by {rev.user_name}</span>
                      <span className={`px-2 py-0.2 text-[10px] rounded-full font-semibold ${
                        rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {rev.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">"{rev.comment}"</p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleModerateReview(rev.id, 'approved')}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                    )}
                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleModerateReview(rev.id, 'rejected')}
                        className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Fraud & Whistleblower Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Whistleblower Scam Complaints</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {reports.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">No active fraud reports filed.</div>
            ) : (
              reports.map((rep) => (
                <div key={rep.id} className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-rose-600">REP-2026-{String(rep.id).padStart(4, '0')}</span>
                      <span className="font-bold text-xs text-slate-900">Target: {rep.ngo_name || `NGO #${rep.ngo_id}`}</span>
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-semibold rounded-md">
                        {rep.reason}
                      </span>
                    </div>
                    <select
                      value={rep.status}
                      onChange={(e) => handleUpdateReport(rep.id, e.target.value)}
                      className="p-1 border rounded text-xs font-semibold"
                    >
                      <option value="pending">Pending</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Resolved</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    "{rep.details}"
                  </p>
                  <div className="text-[11px] text-slate-400">
                    Reported by {rep.reporter_name || 'Anonymous'} ({rep.reporter_email || 'No email'}) on {rep.created_at}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Crowdsourced NGO Suggestions */}
      {activeTab === 'suggestions' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Public "Suggest an NGO" Intake Desk</h3>
            <span className="text-xs text-slate-500">Audit submitted records and approve them directly into live directory</span>
          </div>
          <div className="divide-y divide-slate-100">
            {suggestions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">No pending NGO suggestions.</div>
            ) : (
              suggestions.map((sug) => (
                <div key={sug.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{sug.name}</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded-md">
                        {sug.category}
                      </span>
                      <span className="text-xs text-slate-500">{sug.city}, {sug.state}</span>
                    </div>
                    {sug.darpan_id && (
                      <p className="text-xs font-mono text-slate-600">Darpan: {sug.darpan_id}</p>
                    )}
                    {sug.reason && (
                      <p className="text-xs text-slate-600 italic">"{sug.reason}"</p>
                    )}
                    <p className="text-[11px] text-slate-400">
                      Submitted by {sug.submitter_name} ({sug.submitter_email || 'No email'})
                    </p>
                  </div>
                  <div>
                    {sug.status === 'pending' ? (
                      <button
                        onClick={() => handleApproveSuggestion(sug.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                      >
                        ✓ Approve & Index NGO
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                        Already Approved
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add New NGO Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 max-h-[85vh] overflow-y-auto space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add New Verified NGO Record</h3>
            <form onSubmit={handleCreateNgo} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">NGO Name *</label>
                <input
                  type="text"
                  required
                  value={newNgo.name}
                  onChange={(e) => setNewNgo({ ...newNgo, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">State / UT *</label>
                  <select
                    required
                    value={newNgo.state}
                    onChange={(e) => setNewNgo({ ...newNgo, state: e.target.value, city: '' })}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="">Select State / UT</option>
                    {ALL_INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    list="admin-cities-list"
                    placeholder="Type or select city..."
                    value={newNgo.city}
                    onChange={(e) => setNewNgo({ ...newNgo, city: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                  <datalist id="admin-cities-list">
                    {(newNgo.state ? (INDIA_LOCATIONS.find(s => s.name === newNgo.state)?.cities || []) : ALL_INDIAN_CITIES).map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Primary Category</label>
                  <input
                    type="text"
                    value={newNgo.categories}
                    onChange={(e) => setNewNgo({ ...newNgo, categories: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Darpan ID</label>
                  <input
                    type="text"
                    value={newNgo.darpanId}
                    onChange={(e) => setNewNgo({ ...newNgo, darpanId: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">12A Status</label>
                  <select
                    value={newNgo.status12A}
                    onChange={(e) => setNewNgo({ ...newNgo, status12A: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">80G Status</label>
                  <select
                    value={newNgo.status80G}
                    onChange={(e) => setNewNgo({ ...newNgo, status80G: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">FCRA</label>
                  <select
                    value={newNgo.statusFCRA}
                    onChange={(e) => setNewNgo({ ...newNgo, statusFCRA: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Official Donation Gateway Link</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newNgo.donationLink}
                  onChange={(e) => setNewNgo({ ...newNgo, donationLink: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-200 rounded-lg text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Save NGO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
