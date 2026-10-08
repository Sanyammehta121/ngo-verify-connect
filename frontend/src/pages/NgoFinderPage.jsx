import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw, ShieldCheck, MapPin, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import { api } from '../services/api';
import NgoCard from '../components/NgoCard';
import { INDIA_LOCATIONS, ALL_INDIAN_STATES, ALL_INDIAN_CITIES } from '../data/indiaLocations';
import { useTranslation } from '../context/LanguageContext';

export default function NgoFinderPage({ initialFilters = {}, onSelectNgo, onOpenTrustBreakdown }) {
  const { t } = useTranslation();
  const [ngos, setNgos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(initialFilters.q || '');
  const [selectedState, setSelectedState] = useState(initialFilters.state || '');
  const [selectedCity, setSelectedCity] = useState(initialFilters.city || '');
  const [selectedCategories, setSelectedCategories] = useState(
    initialFilters.category ? [initialFilters.category] : []
  );
  const [verificationStatus, setVerificationStatus] = useState(initialFilters.verificationStatus || '');
  const [minTrust, setMinTrust] = useState(initialFilters.minTrust || '');
  const [sortBy, setSortBy] = useState('trust_desc');

  // Mobile drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Available metadata
  const [activeStates, setActiveStates] = useState([]);
  const [allCategories, setAllCategories] = useState([
    'Education',
    'Health & Nutrition',
    'Disaster Relief',
    'Elderly Care',
    'Animal Welfare',
    'Child Welfare',
    'Women Empowerment',
    'Rural Development',
    'Environment & Wildlife',
    'Poverty Alleviation',
    'Skill Development'
  ]);

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

  // Sync state if initialFilters prop updates from parent navigation
  useEffect(() => {
    setSearchQuery(initialFilters.q || '');
    setSelectedState(initialFilters.state || '');
    setSelectedCity(initialFilters.city || '');
    setSelectedCategories(initialFilters.category ? [initialFilters.category] : []);
    setVerificationStatus(initialFilters.verificationStatus || '');
    setMinTrust(initialFilters.minTrust || '');
  }, [initialFilters]);

  // Load filter metadata
  useEffect(() => {
    async function loadMeta() {
      try {
        const meta = await api.getFilterMetadata();
        if (meta.activeStates?.length) setActiveStates(meta.activeStates);
        if (meta.categories?.length) setAllCategories(meta.categories);
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    }
    loadMeta();
  }, []);

  // Compute available cities based on selected state
  const availableCities = selectedState
    ? (INDIA_LOCATIONS.find(s => s.name.toLowerCase() === selectedState.toLowerCase())?.cities || [])
    : ALL_INDIAN_CITIES;

  // Active filter count
  const activeFilterCount = (selectedState ? 1 : 0) +
    (selectedCity ? 1 : 0) +
    selectedCategories.length +
    (verificationStatus ? 1 : 0) +
    (minTrust ? 1 : 0);

  // Fetch filtered NGOs
  const fetchNgos = async () => {
    setLoading(true);
    try {
      const params = {
        q: searchQuery,
        state: selectedState,
        city: selectedCity,
        verificationStatus,
        minTrust,
        sortBy,
        category: selectedCategories
      };
      const res = await api.getNgos(params);
      setNgos(res.ngos || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Failed to fetch NGOs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search query & instant filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNgos();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedState, selectedCity, selectedCategories, verificationStatus, minTrust, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNgos();
  };

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedState('');
    setSelectedCity('');
    setSelectedCategories([]);
    setVerificationStatus('');
    setMinTrust('');
    setSortBy('trust_desc');
  };

  // Render Filter Form Controls
  const renderFilterFields = () => (
    <div className="space-y-5 text-xs">
      {/* State / UT Filter */}
      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
          {t('finder.stateLabel')}
        </label>
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity('');
          }}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
        >
          <option value="">{t('finder.allIndia')}</option>
          {ALL_INDIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s} {activeStates.includes(s) ? '★' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* City / Location Filter */}
      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
          {t('finder.cityLabel')} {selectedState && `(${selectedState})`}
        </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
        >
          <option value="">
            {selectedState ? t('finder.allCitiesIn', { state: selectedState }) : t('finder.allCities')}
          </option>
          {availableCities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Verification Status */}
      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
          {t('finder.verificationStatus')}
        </label>
        <div className="space-y-2">
          {[
            { label: t('finder.allStatuses'), val: '' },
            { label: t('finder.verifiedOnly'), val: 'Verified' },
            { label: t('finder.pendingReview'), val: 'Pending' }
          ].map((item) => (
            <label key={item.val} className="flex items-center space-x-2.5 cursor-pointer text-slate-700">
              <input
                type="radio"
                name="verificationStatus"
                checked={verificationStatus === item.val}
                onChange={() => setVerificationStatus(item.val)}
                className="text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Trust Score */}
      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
          {t('finder.minTrust')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: t('finder.anyTrust'), val: '' },
            { label: '★ 3.5+', val: '3.5' },
            { label: '★ 4.5+', val: '4.5' }
          ].map((tItem) => (
            <button
              key={tItem.val}
              type="button"
              onClick={() => setMinTrust(tItem.val)}
              className={`py-2 rounded-xl border text-center transition font-semibold text-xs ${
                minTrust === tItem.val
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-select Cause Categories */}
      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
          {t('finder.causeCategories')} ({selectedCategories.length} {t('finder.selected')})
        </label>
        <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
          {allCategories.map((cat) => {
            const locKey = categoryKeys[cat];
            const catLabel = locKey ? t(`categories.${locKey}`) : cat;
            return (
              <label key={cat} className="flex items-center space-x-2.5 cursor-pointer text-slate-700 hover:text-emerald-800">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>{catLabel}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Page Title & Search Bar */}
      <div className="relative overflow-hidden bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#ff9933] via-slate-300 to-[#138808]"></div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>सत्यमेव जयते</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-800">TrueNGO National Registry</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('finder.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Authoritative national index of 328+ statutory audited non-profit institutions across 314 districts in India.
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-4 sm:mt-5 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={t('finder.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-4 sm:px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition shrink-0"
            >
              {t('home.searchBtn')}
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Filter Toggle Bar (Visible on mobile/tablet screens < lg) */}
      <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center space-x-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{t('finder.filters')}</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-emerald-800 text-[10px] font-extrabold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 font-semibold px-2 py-1 hover:bg-rose-50 rounded-lg transition"
            >
              {t('finder.resetAll')}
            </button>
          )}

          {/* Mobile Quick Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="trust_desc">{t('finder.sortTrustDesc')}</option>
            <option value="reviews_desc">{t('finder.sortRatingDesc')}</option>
            <option value="name_asc">{t('finder.sortNameAsc')}</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips on Mobile */}
      {activeFilterCount > 0 && (
        <div className="lg:hidden flex flex-wrap gap-1.5 pt-1">
          {selectedState && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-200">
              <span>{selectedState}</span>
              <button onClick={() => setSelectedState('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedCity && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-200">
              <span>{selectedCity}</span>
              <button onClick={() => setSelectedCity('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {verificationStatus && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-200">
              <span>{verificationStatus}</span>
              <button onClick={() => setVerificationStatus('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {minTrust && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-200">
              <span>Min: ★ {minTrust}</span>
              <button onClick={() => setMinTrust('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedCategories.map((c) => {
            const locKey = categoryKeys[c];
            const catLabel = locKey ? t(`categories.${locKey}`) : c;
            return (
              <span key={c} className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-200">
                <span>{catLabel}</span>
                <button onClick={() => toggleCategory(c)}><X className="w-3 h-3" /></button>
              </span>
            );
          })}
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Left Filter Sidebar (Hidden on mobile) */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-6 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>{t('finder.filters')}</span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-semibold text-slate-500 hover:text-emerald-700 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('finder.resetAll')}</span>
              </button>
            </div>

            {renderFilterFields()}
          </div>
        </div>

        {/* Right Results Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs text-slate-600">
              <strong>{total}</strong> {t('finder.ngosFound')}
              {selectedCity && <span> in <strong>{selectedCity}</strong></span>}
              {selectedCategories.length > 0 && <span> ({selectedCategories.length} {t('finder.selected')})</span>}
            </div>

            {/* Desktop Sort Dropdown */}
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-xs text-slate-500 flex items-center space-x-1 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{t('finder.sortBy')}</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white"
              >
                <option value="trust_desc">{t('finder.sortTrustDesc')}</option>
                <option value="reviews_desc">{t('finder.sortRatingDesc')}</option>
                <option value="name_asc">{t('finder.sortNameAsc')}</option>
              </select>
            </div>
          </div>

          {/* NGOs Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : ngos.length === 0 ? (
            <div className="p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
              <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">{t('finder.noResults')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t('finder.noResultsDesc')}
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 py-2 px-4 bg-emerald-600 text-white font-medium text-xs rounded-xl hover:bg-emerald-700 transition"
              >
                {t('finder.clearFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {ngos.map((ngo) => (
                <NgoCard
                  key={ngo.id}
                  ngo={ngo}
                  onSelect={onSelectNgo}
                  onOpenTrustBreakdown={onOpenTrustBreakdown}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-up Filter Sheet Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs animate-fadeIn lg:hidden">
          <div 
            className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">{t('finder.filters')}</h3>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Sheet Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {renderFilterFields()}
            </div>

            {/* Sticky Sheet Footer */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0 flex items-center space-x-3">
              <button
                onClick={handleResetFilters}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
              >
                {t('finder.clearFilters')}
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition text-center"
              >
                {t('home.searchBtn')} ({ngos.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
