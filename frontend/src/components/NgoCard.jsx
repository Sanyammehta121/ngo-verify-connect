import React from 'react';
import { ShieldCheck, MapPin, Star, AlertTriangle, Clock, ExternalLink, CheckCircle } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function NgoCard({ ngo, onSelect, onOpenTrustBreakdown }) {
  const { t } = useTranslation();
  // Trust score color
  const score = ngo.trustScore || 0;
  const percentage = ngo.trustPercentage || Math.round(score * 20);

  const getScoreColor = () => {
    if (score >= 4.5) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 3.5) return 'text-teal-600 bg-teal-50 border-teal-200';
    if (score >= 2.5) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const isVerified = ngo.verificationStatus === 'Verified';

  const categoryKeys = {
    'Education': 'education',
    'Health & Nutrition': 'health',
    'Disaster Relief': 'disaster',
    'Elderly Care': 'elderly',
    'Animal Welfare': 'animal',
    'Child Welfare': 'child',
    'Women Empowerment': 'women',
    'Rural Development': 'rural',
    'Environment & Wildlife': 'environment',
    'Poverty Alleviation': 'poverty',
    'Skill Development': 'skill'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-emerald-300">
      <div>
        {/* Card Header with Logo & Verification Badge */}
        <div className="p-4 sm:p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img
                  src={ngo.logo || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=160&auto=format&fit=crop&q=80'}
                  alt={`${ngo.name} logo`}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=160&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <div>
                <h3 
                  onClick={() => onSelect(ngo.id)}
                  className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition cursor-pointer line-clamp-1"
                >
                  {ngo.name}
                </h3>
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{ngo.city}, {ngo.state}</span>
                </div>
              </div>
            </div>

            {/* Verification Badge */}
            {isVerified ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-100/80 text-emerald-800 text-[11px] font-semibold rounded-full shrink-0 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('card.verified')}</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-100/80 text-amber-800 text-[11px] font-semibold rounded-full shrink-0 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('card.pending')}</span>
              </span>
            )}
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
            {ngo.description || 'Dedicated non-profit working on community development and welfare.'}
          </p>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(ngo.categories || []).slice(0, 3).map((cat, idx) => {
              const locKey = categoryKeys[cat];
              const catLabel = locKey ? t(`categories.${locKey}`) : cat;
              return (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium"
                >
                  {catLabel}
                </span>
              );
            })}
            {(ngo.categories || []).length > 3 && (
              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px]">
                +{(ngo.categories || []).length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Statutory Compliance Indicator Pills */}
        <div className="px-5 py-2.5 bg-slate-50/70 border-t border-b border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-medium uppercase">12A Tax</span>
            <span className={`font-semibold mt-0.5 ${ngo.status12A === 'Verified' ? 'text-emerald-700' : 'text-slate-500'}`}>
              {ngo.status12A === 'Verified' ? `✓ ${t('detail.valid')}` : ngo.status12A || t('detail.pending')}
            </span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-medium uppercase">80G Benefit</span>
            <span className={`font-semibold mt-0.5 ${ngo.status80G === 'Verified' ? 'text-emerald-700' : 'text-slate-500'}`}>
              {ngo.status80G === 'Verified' ? '✓ 50% Tax' : ngo.status80G || t('detail.pending')}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-medium uppercase">Darpan ID</span>
            <span className={`font-semibold mt-0.5 truncate max-w-[80px] ${ngo.darpanId ? 'text-emerald-700' : 'text-slate-500'}`}>
              {ngo.darpanId ? '✓ Listed' : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Trust Meter & Actions */}
      <div className="p-5 pt-3">
        <div className="flex items-center justify-between mb-3">
          {/* Trust Rating Score */}
          <div 
            onClick={() => onOpenTrustBreakdown && onOpenTrustBreakdown(ngo)}
            className="cursor-pointer group/score"
            title="Click to view trust calculation formula"
          >
            <div className="flex items-center space-x-1.5">
              <span className={`px-2 py-0.5 rounded-lg font-bold text-xs border ${getScoreColor()}`}>
                ★ {score.toFixed(1)} / 5
              </span>
              <span className="text-xs font-semibold text-slate-700 group-hover/score:text-emerald-700 transition underline decoration-dotted">
                {percentage}% {t('card.trustScore')}
              </span>
            </div>
            {ngo.reviewCount > 0 && (
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {ngo.reviewCount} {t('card.reviews')}
              </span>
            )}
          </div>

          {/* Donation Channel Status */}
          {ngo.donationLink ? (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Verified Gateway</span>
            </span>
          ) : (
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Direct Bank Channel</span>
            </span>
          )}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => onSelect(ngo.id)}
          className="w-full py-2.5 px-3 bg-slate-900 hover:bg-emerald-600 text-white font-medium text-xs rounded-xl shadow-xs transition duration-200 flex items-center justify-center space-x-1.5 min-h-[44px]"
        >
          <span>{t('card.viewDetails')}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
