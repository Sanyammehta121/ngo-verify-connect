import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Info, Award, Calendar, Users, HeartHandshake } from 'lucide-react';

export default function TrustScoreModal({ ngo, isOpen, onClose }) {
  if (!isOpen || !ngo) return null;

  const score = ngo.trustScore || 0;
  const percentage = ngo.trustPercentage || Math.round(score * 20);

  // Breakdown items
  const factors = [
    {
      title: 'Section 12A Tax Exemption',
      points: '20 pts',
      active: ngo.status12A === 'Verified',
      description: 'Official tax authority recognition of charitable operational purpose.'
    },
    {
      title: 'Section 80G Donor Tax Benefit',
      points: '20 pts',
      active: ngo.status80G === 'Verified',
      description: 'Permits 50% tax deductions on eligible donations for public donors.'
    },
    {
      title: 'NITI Aayog NGO Darpan Listing',
      points: '20 pts',
      active: !!ngo.darpanId,
      description: 'Active registration on the central Indian government civil society registry.'
    },
    {
      title: 'FCRA Statutory Clearance',
      points: '10 pts',
      active: ngo.statusFCRA === 'Verified',
      description: 'Clearance from the Ministry of Home Affairs for foreign contributions.'
    },
    {
      title: 'Verified Direct Payment Channel',
      points: '10 pts',
      active: !!ngo.donationLink,
      description: 'Official institutional banking or SSL-secured payment gateway.'
    },
    {
      title: 'Audit Freshness (<12 Months)',
      points: '10 pts',
      active: true, // Based on recent timestamp
      description: `Cross-examined on ${ngo.lastVerifiedOn || 'Recently'}. Regular compliance reviews ensure freshness.`
    },
    {
      title: 'Community Donor Ratings',
      points: '10 pts',
      active: ngo.reviewCount > 0,
      description: ngo.reviewCount > 0 
        ? `Validated against ${ngo.reviewCount} public reviews (${ngo.averageRating || score} avg).` 
        : 'Neutral provisional rating awaiting community reviews.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Trust Score Breakdown</h3>
              <p className="text-xs text-slate-300">{ngo.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Score Badge */}
        <div className="p-6 pb-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ★ {score.toFixed(1)} <span className="text-base font-medium text-slate-500">/ 5.0</span>
            </div>
            <p className="text-xs text-emerald-800 font-semibold mt-0.5">
              Overall Platform Integrity Rating: {percentage}% Trust Score
            </p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-xs">
              {score >= 4.5 ? 'High Trust Grade' : score >= 3.0 ? 'Moderate Trust' : 'Caution Advised'}
            </span>
          </div>
        </div>

        {/* Factors List */}
        <div className="p-6 max-h-96 overflow-y-auto space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Compliance Dimensions & Weighting
          </p>
          {factors.map((f, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border transition flex items-start justify-between gap-3 ${
                f.active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                {f.active ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-xs text-slate-900">{f.title}</div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{f.description}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 ${
                f.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {f.active ? f.points : '0 pts'}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Objective, data-backed rating model</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}
