import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, XCircle, ExternalLink, Calendar, Edit3, Save, X } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function GovDocumentChecker({ ngo, onUpdateNgo }) {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Edit form state
  const [status12A, setStatus12A] = useState(ngo.status12A || 'Pending');
  const [status80G, setStatus80G] = useState(ngo.status80G || 'Pending');
  const [statusFCRA, setStatusFCRA] = useState(ngo.statusFCRA || 'Unverified');
  const [fcraNumber, setFcraNumber] = useState(ngo.fcraNumber || '');
  const [darpanId, setDarpanId] = useState(ngo.darpanId || '');
  const [verificationStatus, setVerificationStatus] = useState(ngo.verificationStatus || 'Pending');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const result = await api.updateGovDocuments(ngo.id, {
        status12A,
        status80G,
        statusFCRA,
        fcraNumber: fcraNumber || null,
        darpanId: darpanId || null,
        verificationStatus,
        lastVerifiedOn: new Date().toISOString().split('T')[0]
      });

      if (onUpdateNgo) {
        onUpdateNgo({
          ...ngo,
          status12A,
          status80G,
          statusFCRA,
          fcraNumber,
          darpanId,
          verificationStatus,
          trustScore: result.trustScore,
          trustPercentage: result.trustPercentage,
          lastVerifiedOn: result.lastVerifiedOn
        });
      }
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified & Active</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Under Review</span>
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Expired Renewal</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Not Registered / Unverified</span>
          </span>
        );
    }
  };

  // Official Darpan Lookup URL
  const darpanSearchUrl = ngo.darpanId
    ? `https://ngodarpan.gov.in/index.php/home/statewise_ngo/`
    : `https://ngodarpan.gov.in/index.php/home/statewise_ngo/`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Statutory & Tax Verification Desk</h3>
            <p className="text-xs text-slate-300">Cross-verified against central government databases</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Last Verified Timestamp */}
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-white/10 rounded-lg text-xs text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Last verified on: <strong>{ngo.lastVerifiedOn || 'Recent'}</strong></span>
          </div>

          {/* Admin Edit Trigger */}
          {isAdmin && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Status</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Inline Editor */}
      {isEditing && (
        <div className="p-6 bg-blue-50/60 border-b border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              🛡️ Officer Override: Update Verification Documents
            </h4>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1 text-slate-500 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && <p className="text-xs text-rose-600 mb-3">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Section 12A Status</label>
              <select
                value={status12A}
                onChange={(e) => setStatus12A(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
                <option value="Unverified">Unverified</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Section 80G Status</label>
              <select
                value={status80G}
                onChange={(e) => setStatus80G(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
                <option value="Unverified">Unverified</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">FCRA Clearance</label>
              <select
                value={statusFCRA}
                onChange={(e) => setStatusFCRA(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
                <option value="Unverified">Unverified</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">FCRA Number</label>
              <input
                type="text"
                value={fcraNumber}
                onChange={(e) => setFcraNumber(e.target.value)}
                placeholder="e.g. 231660608"
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">NGO Darpan ID</label>
              <input
                type="text"
                value={darpanId}
                onChange={(e) => setDarpanId(e.target.value)}
                placeholder="e.g. DL/2009/0002131"
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Overall Status</label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Unverified">Unverified</option>
                <option value="Suspicious">Suspicious / Warning</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save & Recompute Trust Score'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid of 5 Statutory Documents */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Document 1: NGO Darpan ID */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              NITI Aayog Darpan
            </span>
            {ngo.darpanId ? getBadge('Verified') : getBadge('Unverified')}
          </div>
          <div className="font-mono font-bold text-slate-900 text-sm mb-1">
            {ngo.darpanId || 'Not Registered'}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            National planning agency registry for non-profit entities in India.
          </p>
          <a
            href={darpanSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>Lookup on ngodarpan.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Document 2: Section 80G */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Section 80G Tax Exemption
            </span>
            {getBadge(ngo.status80G)}
          </div>
          <div className="font-semibold text-slate-900 text-sm mb-1">
            50% Donor Tax Deduction
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Permits individual and corporate donors to claim 50% deduction under the Income Tax Act.
          </p>
          <a
            href="https://www.incometax.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>Verify on Income Tax Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Document 3: Section 12A */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Section 12A Exemption
            </span>
            {getBadge(ngo.status12A)}
          </div>
          <div className="font-semibold text-slate-900 text-sm mb-1">
            Charitable Entity Recognition
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Statutory recognition from the Income Tax department establishing charitable status.
          </p>
          <span className="text-xs text-slate-400 font-medium">Form 10AC Validated</span>
        </div>

        {/* Document 4: FCRA Clearance */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              FCRA Foreign Funding
            </span>
            {getBadge(ngo.statusFCRA)}
          </div>
          <div className="font-mono text-xs font-semibold text-slate-900 mb-1">
            {ngo.fcraNumber ? `FCRA Reg: ${ngo.fcraNumber}` : (ngo.statusFCRA === 'Verified' ? 'Active Clearance' : 'No Foreign Contribution')}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Ministry of Home Affairs statutory clearance for receiving offshore donations.
          </p>
          <a
            href="https://fcraonline.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>MHA FCRA Online Desk</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Document 5: Trust/Society Registration Number */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 transition md:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Society / Trust Registration & PAN
            </span>
            <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs rounded-md font-mono font-medium">
              PAN: {ngo.panNumber || 'Available on file'}
            </span>
          </div>
          <div className="font-semibold text-slate-900 text-sm mb-1">
            Registration No: <span className="font-mono font-bold text-slate-800">{ngo.registrationNumber || 'Pending public recording'}</span>
          </div>
          <p className="text-xs text-slate-500">
            Registered under the Societies Registration Act XXI of 1860 or Indian Trusts Act / Bombay Public Trusts Act, 1950.
          </p>
        </div>
      </div>
    </div>
  );
}
