import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Phone, Mail, Globe, MapPin, ArrowLeft, Star, 
  ExternalLink, Calendar, Award, Share2, Check, Clock, AlertTriangle 
} from 'lucide-react';
import { api } from '../services/api';
import GovDocumentChecker from '../components/GovDocumentChecker';
import DonationSafetyBanner from '../components/DonationSafetyBanner';
import MapLocation from '../components/MapLocation';
import ReviewSection from '../components/ReviewSection';
import TrustScoreModal from '../components/TrustScoreModal';
import ReportFraudModal from '../components/ReportFraudModal';

export default function NgoDetailPage({ ngoId, onBack, onOpenTrustBreakdown }) {
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals
  const [trustModalOpen, setTrustModalOpen] = useState(false);
  const [fraudModalOpen, setFraudModalOpen] = useState(false);

  useEffect(() => {
    async function loadNgo() {
      setLoading(true);
      try {
        const data = await api.getNgo(ngoId);
        setNgo(data.ngo);
      } catch (err) {
        setError(err.message || 'Failed to load NGO profile');
      } finally {
        setLoading(false);
      }
    }
    loadNgo();
  }, [ngoId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReviewAdded = (newReview, updatedTrustScore, updatedTrustPercentage) => {
    setNgo(prev => {
      const updatedReviews = [newReview, ...(prev.reviews || [])];
      return {
        ...prev,
        reviews: updatedReviews,
        reviewCount: updatedReviews.length,
        trustScore: updatedTrustScore || prev.trustScore,
        trustPercentage: updatedTrustPercentage || prev.trustPercentage
      };
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Retrieving official NGO compliance dossier...</p>
      </div>
    );
  }

  if (error || !ngo) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">NGO Profile Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">{error || 'Unable to locate the requested organization.'}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  const score = ngo.trustScore || 0;
  const percentage = ngo.trustPercentage || Math.round(score * 20);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Search Results</span>
      </button>

      {/* Hero Profile Dossier Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          {/* Logo & Info */}
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shrink-0 shadow-xs">
              <img
                src={ngo.logo || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=160&auto=format&fit=crop&q=80'}
                alt={`${ngo.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {ngo.name}
                </h1>
                {ngo.verificationStatus === 'Verified' ? (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Gov Verified NGO</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Under Officer Verification</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-700">{ngo.city}, {ngo.state}</span>
                <span>•</span>
                <span className="font-mono text-slate-500">Darpan: {ngo.darpanId || 'Pending'}</span>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(ngo.categories || []).map((c, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-100"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Gauge & Score Button */}
          <div className="shrink-0 flex flex-col items-start sm:items-end w-full sm:w-auto p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Calculated Trust Score
            </div>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-3xl font-black text-slate-900">
                ★ {score.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-slate-500">/ 5.0</span>
            </div>
            <div className="text-xs font-semibold text-emerald-700 mt-0.5">
              {percentage}% Platform Integrity Grade
            </div>
            <button
              onClick={() => setTrustModalOpen(true)}
              className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline decoration-dotted transition"
            >
              Inspect Score Formula ➔
            </button>
          </div>
        </div>

        {/* Action Bar with Click-to-Call */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            {/* Click-to-call mobile button */}
            {ngo.phone && (
              <a
                href={`tel:${ngo.phone}`}
                className="inline-flex items-center justify-center space-x-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition w-full sm:w-auto"
              >
                <Phone className="w-4 h-4" />
                <span>Call {ngo.phone}</span>
              </a>
            )}

            {/* Email link */}
            {ngo.email && (
              <a
                href={`mailto:${ngo.email}`}
                className="inline-flex items-center justify-center space-x-2 py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition w-full sm:w-auto truncate"
              >
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{ngo.email}</span>
              </a>
            )}

            {/* Official Website */}
            {ngo.website && (
              <a
                href={ngo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-1.5 py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition w-full sm:w-auto"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>Official Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center space-x-1.5 py-2.5 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium rounded-xl transition shadow-2xs w-full sm:w-auto"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied' : 'Share NGO'}</span>
          </button>
        </div>
      </div>

      {/* Verified Donation Link or Caution Warning Banner */}
      <DonationSafetyBanner ngo={ngo} />

      {/* Government Document Checker Module */}
      <GovDocumentChecker ngo={ngo} onUpdateNgo={(updated) => setNgo(updated)} />

      {/* Certifications Table */}
      {ngo.certifications && ngo.certifications.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Recognitions & Statutory Certifications ({ngo.certifications.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60">
                <tr>
                  <th className="px-5 py-3">Certificate Name</th>
                  <th className="px-5 py-3">Issuing Authority</th>
                  <th className="px-5 py-3">Issue Date</th>
                  <th className="px-5 py-3">Validity / Expiry</th>
                  <th className="px-5 py-3">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ngo.certifications.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{c.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{c.issuer}</td>
                    <td className="px-5 py-3.5 text-slate-500">{c.issueDate}</td>
                    <td className="px-5 py-3.5 text-slate-500">{c.expiryDate || 'Active'}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        <Check className="w-3 h-3" />
                        <span>{c.status || 'Verified'}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* About & Operational Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-base">About {ngo.name}</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {ngo.description}
        </p>
      </div>

      {/* Map Location Module */}
      <MapLocation ngo={ngo} />

      {/* Community Feedback & Reviews Module */}
      <ReviewSection
        ngo={ngo}
        onOpenReportFraud={() => setFraudModalOpen(true)}
        onReviewAdded={handleReviewAdded}
      />

      {/* Modals */}
      <TrustScoreModal
        ngo={ngo}
        isOpen={trustModalOpen}
        onClose={() => setTrustModalOpen(false)}
      />

      <ReportFraudModal
        ngo={ngo}
        isOpen={fraudModalOpen}
        onClose={() => setFraudModalOpen(false)}
      />
    </div>
  );
}
