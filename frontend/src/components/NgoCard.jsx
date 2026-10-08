import React from 'react';
import { ShieldCheck, MapPin, Star, AlertTriangle, Clock, ExternalLink, CheckCircle, Award, Landmark, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function NgoCard({ ngo, onSelect, onOpenTrustBreakdown }) {
  const { t } = useTranslation();
  // Trust score color
  const score = ngo.trustScore || 0;
  const percentage = ngo.trustPercentage || Math.round(score * 20);

  const getScoreColor = () => {
    if (score >= 4.5) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 3.5) return 'text-teal-700 bg-teal-50 border-teal-300';
    if (score >= 2.5) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
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

  // High quality authentic category photos
  const categoryImages = {
    'Education': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    'Health & Nutrition': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80',
    'Disaster Relief': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80',
    'Elderly Care': 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&auto=format&fit=crop&q=80',
    'Animal Welfare': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    'Child Welfare': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80',
    'Women Empowerment': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    'Rural Development': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    'Environment & Wildlife': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    'Poverty Alleviation': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&auto=format&fit=crop&q=80',
    'Skill Development': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80'
  };

  const primaryCategory = (ngo.categories && ngo.categories[0]) || 'Education';
  const coverPhoto = categoryImages[primaryCategory] || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-emerald-500">
      <div>
        {/* Visual Cover Photo Banner with Official Overlays */}
        <div className="relative h-32 w-full overflow-hidden bg-slate-100">
          <img
            src={coverPhoto}
            alt={`${ngo.name} cause cover`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-black/30"></div>

          {/* Top Left: Verification Status Ribbon */}
          <div className="absolute top-2.5 left-2.5">
            {isVerified ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-700/90 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg shadow-sm border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>GOV VERIFIED</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-700/90 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg shadow-sm border border-amber-400/30">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>PENDING AUDIT</span>
              </span>
            )}
          </div>

          {/* Top Right: Darpan ID Pill */}
          <div className="absolute top-2.5 right-2.5">
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-mono font-bold rounded-md border border-slate-700">
              <Landmark className="w-3 h-3 text-amber-400" />
              <span>{ngo.darpanId ? `DARPAN: ${ngo.darpanId}` : 'REG: PENDING'}</span>
            </span>
          </div>

          {/* Bottom Left: Logo Thumbnail Overlap */}
          <div className="absolute -bottom-3 left-4 flex items-center space-x-2">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border-2 border-white shadow-md shrink-0">
              <img
                src={ngo.logo || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=160&auto=format&fit=crop&q=80'}
                alt={`${ngo.name} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=160&auto=format&fit=crop&q=80';
                }}
              />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 pt-5 pb-3 space-y-2.5">
          <div>
            <h3 
              onClick={() => onSelect(ngo.id)}
              className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition cursor-pointer line-clamp-1"
            >
              {ngo.name}
            </h3>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{ngo.city}, {ngo.state}</span>
              <span>•</span>
              <span className="text-[11px] text-slate-400">Est. Registered Entity</span>
            </div>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {ngo.description || 'Dedicated non-profit working on community development and welfare.'}
          </p>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(ngo.categories || []).slice(0, 3).map((cat, idx) => {
              const locKey = categoryKeys[cat];
              const catLabel = locKey ? t(`categories.${locKey}`) : cat;
              return (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold"
                >
                  {catLabel}
                </span>
              );
            })}
            {(ngo.categories || []).length > 3 && (
              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold">
                +{(ngo.categories || []).length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Official Statutory Compliance Indicator Strip */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-b border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">12A Status</span>
            <span className={`font-bold mt-0.5 ${ngo.status12A === 'Verified' ? 'text-emerald-700' : 'text-slate-500'}`}>
              {ngo.status12A === 'Verified' ? `✓ Valid` : ngo.status12A || 'Pending'}
            </span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">80G Exemption</span>
            <span className={`font-bold mt-0.5 ${ngo.status80G === 'Verified' ? 'text-emerald-700' : 'text-slate-500'}`}>
              {ngo.status80G === 'Verified' ? '✓ 50% Relief' : ngo.status80G || 'Pending'}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Darpan Seal</span>
            <span className={`font-bold mt-0.5 truncate max-w-[80px] ${ngo.darpanId ? 'text-emerald-700' : 'text-slate-500'}`}>
              {ngo.darpanId ? '✓ Listed' : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Government Audit Score & Action Button */}
      <div className="p-4 sm:p-5 pt-3 space-y-3">
        <div className="flex items-center justify-between">
          {/* Government Audit Trust Meter */}
          <div 
            onClick={() => onOpenTrustBreakdown && onOpenTrustBreakdown(ngo)}
            className="cursor-pointer group/score"
            title="Inspect statutory compliance calculation"
          >
            <div className="flex items-center space-x-1.5">
              <span className={`px-2 py-0.5 rounded-lg font-black text-xs border ${getScoreColor()}`}>
                ★ {score.toFixed(1)} / 5.0
              </span>
              <span className="text-xs font-bold text-slate-700 group-hover/score:text-emerald-700 transition">
                {percentage}% Compliance
              </span>
            </div>
            {ngo.reviewCount > 0 && (
              <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                {ngo.reviewCount} Citizen Reviews
              </span>
            )}
          </div>

          {/* Direct Verified Bank Channel Status */}
          {ngo.donationLink ? (
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center space-x-1 border border-emerald-200">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Direct Bank VPA</span>
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center space-x-1">
              <span>Direct Bank Channel</span>
            </span>
          )}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => onSelect(ngo.id)}
          className="w-full py-2.5 px-3 bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition duration-200 flex items-center justify-center space-x-1.5 min-h-[42px]"
        >
          <span>View Compliance Dossier</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
