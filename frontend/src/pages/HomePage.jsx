import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShieldCheck, CheckCircle2, ArrowRight, Star, Heart, MapPin, 
  Building2, AlertTriangle, Users, BookOpen, HeartPulse, Sparkles, 
  FileCheck2, ShieldAlert, Award, Landmark, ExternalLink, HelpCircle
} from 'lucide-react';
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
    'Rural Development': 'rural',
    'Environment & Wildlife': 'environment',
    'Skill Development': 'skill'
  };

  const categories = [
    { 
      name: 'Education', 
      icon: '🎓', 
      count: 'Pratham, Smile, Teach For India',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
      description: 'Primary schools, digital literacy & higher learning grants'
    },
    { 
      name: 'Health & Nutrition', 
      icon: '🏥', 
      count: 'Akshaya Patra, Smile, Narayana',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
      description: 'Midday meals, mobile healthcare clinics & dialysis centers'
    },
    { 
      name: 'Disaster Relief', 
      icon: '🚨', 
      count: 'Goonj, HelpAge, Rapid Action',
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&auto=format&fit=crop&q=80',
      description: 'Flood relief kits, emergency medical aid & rehabilitation'
    },
    { 
      name: 'Elderly Care', 
      icon: '👵', 
      count: 'HelpAge India, Dignity Foundation',
      image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&auto=format&fit=crop&q=80',
      description: 'Old age homes, cataract surgeries & elder legal counseling'
    },
    { 
      name: 'Animal Welfare', 
      icon: '🐾', 
      count: 'Wildlife SOS, PFA, Friendicoes',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
      description: 'Animal rescue ambulances, sterilization & wildlife habitats'
    },
    { 
      name: 'Child Welfare', 
      icon: '👶', 
      count: 'CRY, Pratham, Bachpan Bachao',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80',
      description: 'Child protection from labor, malnutrition & trafficking rescue'
    },
    { 
      name: 'Women Empowerment', 
      icon: '👩', 
      count: 'SEWA, Goonj, Smile Foundation',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      description: 'Micro-enterprises, vocational sewing & legal self-defense'
    },
    { 
      name: 'Rural Development', 
      icon: '🌾', 
      count: 'BAIF, PRADAN, Jan Kalyan',
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&auto=format&fit=crop&q=80',
      description: 'Clean drinking water, solar electrification & agrarian aid'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section - Official Government Portal Design with Photographic Impact Collage */}
      <section className="relative overflow-hidden pt-10 pb-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl border border-slate-800">
        {/* Subtle Ashoka / Tricolor Gradient Aura */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Official Heraldic Pill */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-xs">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>सत्यमेव जयते</span>
              <span className="text-slate-500">|</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NITI AAYOG DARPAN & MCA COMPLIANCE REGISTRY</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              <span>National Due Diligence & </span><br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-white">
                NGO Verification Portal
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto font-normal leading-relaxed">
              Empowering Indian citizens, institutional donors, and CSR foundations with authoritative, independent verification of <strong>328+ statutory NGOs</strong> across <strong>314 districts</strong> in all 28 states & 8 Union Territories.
            </p>

            {/* Direct Search Bar */}
            <div ref={searchContainerRef} className="relative max-w-2xl mx-auto pt-2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center bg-white rounded-2xl shadow-2xl p-2 border-2 border-emerald-500/40 focus-within:border-emerald-400 transition">
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by NGO name, Darpan ID, district (e.g. Yamuna Nagar) or cause..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                    className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shrink-0 flex items-center space-x-1.5"
                  >
                    <span>{t('home.searchBtn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Instant Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-left animate-fadeIn">
                  <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>{t('home.matchingRecords')} ({suggestions.length})</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Central Database Sync</span>
                  </div>
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSuggestionClick(item)}
                      className="px-4 py-3 hover:bg-emerald-50/80 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-0 transition"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                          <span>{item.name}</span>
                          {item.verificationStatus === 'Verified' && (
                            <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                              VERIFIED
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.city}, {item.state}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">UID: {item.darpanId || 'Indexed'}</span>
                          <span>•</span>
                          <span>{(item.categories || []).slice(0, 2).join(', ')}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-black text-xs rounded-lg shadow-2xs">
                          ★ {item.trustScore?.toFixed(1) || '5.0'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Statutory Compliance Ticker */}
            <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">NITI Aayog Darpan</div>
                  <div className="text-[10px] text-slate-400">100% UID Verified</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Sec 12A & 80G Tax</div>
                  <div className="text-[10px] text-slate-400">Exemption Status Tracked</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">FCRA Cleared</div>
                  <div className="text-[10px] text-slate-400">MHA Compliant Portals</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">₹0 Intermediary Fee</div>
                  <div className="text-[10px] text-slate-400">Direct Citizen-to-Cause</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Impact Photographic Showcase Gallery */}
          <div className="mt-12 pt-8 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pan-India Ground Impact & Verified Organizations</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">328 Indexed NGOs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Photo Card 1: Child Education */}
              <div 
                onClick={() => onNavigate('finder', { category: 'Education' })}
                className="group relative rounded-2xl overflow-hidden h-48 border border-slate-700/80 cursor-pointer shadow-lg hover:border-emerald-400 transition duration-300"
              >
                <img 
                  src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80" 
                  alt="Child education classroom in rural India"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white font-bold text-[10px] uppercase tracking-wide">
                    Education & Literacy
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1 group-hover:text-emerald-300 transition">
                    Pratham & Teach For India
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                    Digital learning & foundational reading programs across 12,000 villages
                  </p>
                </div>
              </div>

              {/* Photo Card 2: Health & Midday Meals */}
              <div 
                onClick={() => onNavigate('finder', { category: 'Health & Nutrition' })}
                className="group relative rounded-2xl overflow-hidden h-48 border border-slate-700/80 cursor-pointer shadow-lg hover:border-emerald-400 transition duration-300"
              >
                <img 
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80" 
                  alt="Community healthcare clinic and nutritious meals"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="px-2 py-0.5 rounded-md bg-teal-600/90 text-white font-bold text-[10px] uppercase tracking-wide">
                    Nutrition & Health
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1 group-hover:text-teal-300 transition">
                    Akshaya Patra Foundation
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                    2 Million hot wholesome meals distributed daily in government schools
                  </p>
                </div>
              </div>

              {/* Photo Card 3: Disaster Relief & Clothing */}
              <div 
                onClick={() => onNavigate('finder', { category: 'Disaster Relief' })}
                className="group relative rounded-2xl overflow-hidden h-48 border border-slate-700/80 cursor-pointer shadow-lg hover:border-emerald-400 transition duration-300"
              >
                <img 
                  src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&auto=format&fit=crop&q=80" 
                  alt="Disaster relief material and community rebuilding"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="px-2 py-0.5 rounded-md bg-amber-600/90 text-white font-bold text-[10px] uppercase tracking-wide">
                    Disaster Relief
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1 group-hover:text-amber-300 transition">
                    Goonj Relief Ecosystem
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                    Converting urban surplus into rural development and dignity kits
                  </p>
                </div>
              </div>

              {/* Photo Card 4: Elder Care & Dignity */}
              <div 
                onClick={() => onNavigate('finder', { category: 'Elderly Care' })}
                className="group relative rounded-2xl overflow-hidden h-48 border border-slate-700/80 cursor-pointer shadow-lg hover:border-emerald-400 transition duration-300"
              >
                <img 
                  src="https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&auto=format&fit=crop&q=80" 
                  alt="Senior citizen healthcare and elderly support"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="px-2 py-0.5 rounded-md bg-sky-600/90 text-white font-bold text-[10px] uppercase tracking-wide">
                    Elder Care & Dignity
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1 group-hover:text-sky-300 transition">
                    HelpAge India
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                    Mobile medical units, free cataract operations & senior helplines
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official 4-Pillar Due Diligence Framework (Government Standard Verification) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-emerald-800 text-xs font-extrabold uppercase tracking-widest mb-1.5">
                <Landmark className="w-4 h-4 text-emerald-700" />
                <span>Statutory Compliance Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                The TrueNGO 4-Pillar Verification Standard
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Every listed non-profit undergoes rigorous multi-tier statutory cross-referencing against Government of India databases before receiving a verification badge.
              </p>
            </div>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
            >
              <span>Examine Audit Methodology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-base">NITI Aayog NGO-Darpan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mandatory verification of unique Darpan UID numbers against the central registry portal to prevent phantom paper entities.
              </p>
              <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Registry Cross-Checked</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-base">Income Tax Sec 12A & 80G</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Audited valid tax-exemption orders granting donors legal 50% tax deductions under Indian Income Tax Act regulations.
              </p>
              <div className="pt-2 text-[11px] font-bold text-teal-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>50% Tax Relief Verified</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-base">FCRA Cleared (MHA)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ministry of Home Affairs Foreign Contribution Regulation Act clearance tracking for international donor safety.
              </p>
              <div className="pt-2 text-[11px] font-bold text-amber-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>National Security Compliant</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black text-sm shadow-xs">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-base">Audited Balance Sheets</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                CA-certified balance sheets, Form 10B filings, and public expenditure ratios ensuring at least 80%+ funds reach on-ground causes.
              </p>
              <div className="pt-2 text-[11px] font-bold text-slate-800 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Fund Transparency Assured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cause Areas & Quick Photographic Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>National Priority Sectors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('home.exploreCauses')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse thoroughly vetted non-profits by their primary constitutional mandate
            </p>
          </div>
          <button
            onClick={() => onNavigate('finder')}
            className="mt-3 sm:mt-0 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{t('home.viewAllCauses')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => {
            const locKey = categoryKeys[cat.name];
            const label = locKey ? t(`categories.${locKey}`) : cat.name;
            return (
              <div
                key={idx}
                onClick={() => onNavigate('finder', { category: cat.name })}
                className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Photo Header */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs flex items-center justify-center text-lg shadow-xs">
                    {cat.icon}
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h3 className="font-extrabold text-base leading-snug drop-shadow-sm group-hover:text-emerald-300 transition">
                      {label}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium truncate max-w-[180px]">
                      {cat.count}
                    </span>
                    <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition shrink-0">
                      Explore ➔
                    </span>
                  </div>
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
            <div className="inline-flex items-center space-x-1 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('home.topRatedBadge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('home.topRatedTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Statutory audited entities with 4.8★+ integrity score and zero negative vigilance remarks
            </p>
          </div>
          <button
            onClick={() => onNavigate('finder')}
            className="mt-3 sm:mt-0 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            {t('home.exploreFullDirectory')} (328 NGOs)
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 bg-slate-100 rounded-3xl animate-pulse"></div>
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

      {/* Citizen Vigilance & Anti-Fraud Advisory Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>National Citizen Vigilance Notice</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Report Fraudulent or Unregistered Trust Collections
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Never transfer donations to personal UPI phone numbers or unverified QR codes on social media. All legitimate NGOs must issue official Section 80G tax receipts bearing their PAN and Darpan UID. Report suspect solicitations to TrueNGO for immediate audit inspection.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => onNavigate('how-it-works')}
              className="py-3 px-6 bg-white text-slate-900 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-slate-100 transition text-center"
            >
              Donor Safety Guide
            </button>
            <button
              onClick={onOpenSuggest}
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition text-center shadow-xs"
            >
              Submit NGO for Verification
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
