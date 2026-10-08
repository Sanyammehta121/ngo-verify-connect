import React, { useState, useEffect, useRef } from 'react';
import { Search, ShieldCheck, CheckCircle2, ArrowRight, Star, Heart, MapPin, Building2, AlertTriangle, Users, BookOpen, HeartPulse, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import NgoCard from '../components/NgoCard';
import { useTranslation } from '../context/LanguageContext';

export default function HomePage({ onNavigate, onSelectNgo, onOpenSuggest, onOpenTrustBreakdown }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [featuredNgos, setFeaturedNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getNgos({ sortBy: 'trust_desc' });
        setFeaturedNgos(res.ngos.slice(0, 6));
      } catch (err) {
        console.error('Failed to load featured NGOs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Autocomplete fetch on search typing with debounce
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.getAutocomplete(searchTerm.trim());
        setSuggestions(res.suggestions || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside to close autocomplete
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onNavigate('finder', { q: searchTerm });
  };

  const handleSuggestionClick = (item) => {
    setShowSuggestions(false);
    onSelectNgo(item.id);
  };

  const categoryKeys = {
    'Education': 'education',
    'Health & Nutrition': 'health',
    'Disaster Relief': 'disaster',
    'Elderly Care': 'elderly',
    'Animal Welfare': 'animal',
    'Child Welfare': 'child',
    'Women Empowerment': 'women',
    'Rural Development': 'rural'
  };

  const categories = [
    { name: 'Education', icon: '🎓', count: 'Pratham, Smile' },
    { name: 'Health & Nutrition', icon: '🏥', count: 'Akshaya Patra, Smile' },
    { name: 'Disaster Relief', icon: '🚨', count: 'Goonj, HelpAge' },
    { name: 'Elderly Care', icon: '👵', count: 'HelpAge India' },
    { name: 'Animal Welfare', icon: '🐾', count: 'Wildlife SOS' },
    { name: 'Child Welfare', icon: '👶', count: 'CRY, Pratham' },
    { name: 'Women Empowerment', icon: '👩', count: 'Goonj, Smile' },
    { name: 'Rural Development', icon: '🌾', count: 'Goonj, Jan Kalyan' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl">
        {/* Background Subtle Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-6">
          {/* Trust Badge Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('home.badge')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {t('home.heroTitle1')} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              {t('home.heroTitle2')}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            {t('home.heroDesc')}
          </p>

          {/* Search Autocomplete Bar */}
          <div ref={searchContainerRef} className="relative max-w-2xl mx-auto pt-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex items-center bg-white rounded-2xl shadow-xl p-2 border-2 border-emerald-500/30 focus-within:border-emerald-400 transition">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder={t('home.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                  className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-xs shrink-0"
                >
                  {t('home.searchBtn')}
                </button>
              </div>
            </form>

            {/* Instant Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-left animate-fadeIn">
                <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('home.matchingRecords')} ({suggestions.length})
                </div>
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSuggestionClick(item)}
                    className="px-4 py-2.5 hover:bg-emerald-50/80 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-0 transition"
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900 flex items-center space-x-2">
                        <span>{item.name}</span>
                        {item.verificationStatus === 'Verified' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.city}, {item.state}</span>
                        <span>•</span>
                        <span>{(item.categories || []).slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-md">
                        ★ {item.trustScore?.toFixed(1) || '5.0'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-800/80">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">{t('home.statRegistry')}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">40+</div>
              <div className="text-xs text-slate-400 mt-0.5">{t('home.statDocs')}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-teal-300">4.8★</div>
              <div className="text-xs text-slate-400 mt-0.5">{t('home.statRating')}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">₹0</div>
              <div className="text-xs text-slate-400 mt-0.5">{t('home.statCut')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cause Areas & Quick Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t('home.exploreCauses')}</h2>
            <p className="text-xs text-slate-500 mt-1">{t('home.exploreCausesSub')}</p>
          </div>
          <button
            onClick={() => onNavigate('finder')}
            className="mt-3 sm:mt-0 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{t('home.viewAllCauses')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            const locKey = categoryKeys[cat.name];
            const label = locKey ? t(`categories.${locKey}`) : cat.name;
            return (
              <div
                key={idx}
                onClick={() => onNavigate('finder', { category: cat.name })}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition cursor-pointer group flex flex-col justify-between"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition">{cat.icon}</div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition">
                    {label}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{cat.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured / Top Rated NGOs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('home.topRatedBadge')}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t('home.topRatedTitle')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('home.topRatedSub')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('finder')}
            className="mt-3 sm:mt-0 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl shadow-xs transition"
          >
            {t('home.exploreFullDirectory')}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNgos.map((ngo) => (
              <NgoCard
                key={ngo.id}
                ngo={ngo}
                onSelect={onSelectNgo}
                onOpenTrustBreakdown={onOpenTrustBreakdown}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust Score Methodology Explanation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 bg-emerald-400/20 text-emerald-300 text-xs font-bold rounded-full uppercase tracking-wider">
              {t('home.methodologyBadge')}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t('home.methodologyTitle')}
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              {t('home.methodologyDesc')}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => onNavigate('how-it-works')}
              className="py-3 px-6 bg-white text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-slate-100 transition text-center"
            >
              {t('home.readMethodology')}
            </button>
            <button
              onClick={onOpenSuggest}
              className="py-3 px-6 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm rounded-xl transition text-center"
            >
              {t('home.suggestNgoBtn')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
