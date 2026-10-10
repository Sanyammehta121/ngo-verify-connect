import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { 
  Shield, Search, CheckCircle, PlusCircle, 
  ShieldCheck, ExternalLink, Menu, X, Landmark,
  BellRing, Award, CheckCircle2
} from 'lucide-react';

export default function Navbar({ onNavigate, currentPage, onOpenSuggest }) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState('normal');

  const handleMobileNav = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const adjustFontSize = (size) => {
    setFontSize(size);
    if (size === 'small') {
      document.documentElement.style.fontSize = '90%';
    } else if (size === 'large') {
      document.documentElement.style.fontSize = '110%';
    } else {
      document.documentElement.style.fontSize = '100%';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      {/* 1. National Tricolor Strip */}
      <div className="h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808] w-full" aria-hidden="true"></div>

      {/* 2. Top National Government Portal Utility Strip */}
      <div className="bg-[#0f172a] text-slate-300 border-b border-slate-800 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Government of India / National Portal Identification */}
          <div className="flex items-center space-x-2.5">
            {/* National Emblem Emblem Motif */}
            <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
              <Landmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">भारत सरकार | Government of India</span>
              <span className="sm:hidden">Govt. of India</span>
            </div>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline truncate max-w-md">
              National Non-Profit Verification &amp; Due Diligence Registry
            </span>
          </div>

          {/* Right Utility: Accessibility & Verified Portal Tag */}
          <div className="flex items-center space-x-3 text-[11px]">
            {/* Accessibility Font Resizer */}
            <div className="hidden sm:flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-slate-400 text-[10px] mr-1">Text:</span>
              <button 
                onClick={() => adjustFontSize('small')}
                className={`px-1 rounded hover:text-white ${fontSize === 'small' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                title="Decrease font size"
              >
                A-
              </button>
              <button 
                onClick={() => adjustFontSize('normal')}
                className={`px-1 rounded hover:text-white ${fontSize === 'normal' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                title="Standard font size"
              >
                A
              </button>
              <button 
                onClick={() => adjustFontSize('large')}
                className={`px-1 rounded hover:text-white ${fontSize === 'large' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Official Gov Badge */}
            <div className="inline-flex items-center space-x-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="hidden xs:inline">Official Public Registry</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <div className="bg-white/98 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* TrueNGO Official Brand Logo */}
          <div 
            onClick={() => handleMobileNav('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
          >
            {/* Official Government Seal Crest */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-emerald-900 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/20 group-hover:scale-105 transition border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  True<span className="text-emerald-700">NGO</span>
                </span>
                <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 bg-slate-900 text-amber-300 rounded-md tracking-wider uppercase border border-slate-800">
                  National Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none flex items-center space-x-1 mt-0.5">
                <span>NITI Aayog Darpan &amp; 12A/80G Registry</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('finder')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                currentPage === 'finder'
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {t('nav.findNgos')}
            </button>

            <button
              onClick={() => onNavigate('how-it-works')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                currentPage === 'how-it-works'
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {t('nav.howItWorks')}
            </button>

            <button
              onClick={onOpenSuggest}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              <span>{t('nav.suggestNgo')}</span>
            </button>

            {/* Compliance Desk link - accessible to view verified records */}
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                currentPage === 'admin'
                  ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                  : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-700" />
              <span>{t('nav.adminDesk')}</span>
            </button>
          </nav>

          {/* Right Header Area: Language Selector + Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Desktop Language Selector */}
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Official Government Advisory Ticker */}
      <div className="bg-amber-50/80 border-b border-amber-200/70 text-amber-950 text-[11px] py-1 px-4 sm:px-6 lg:px-8 flex items-center space-x-2">
        <span className="font-bold text-[10px] px-1.5 py-0.2 bg-amber-600 text-white rounded shrink-0 uppercase tracking-wide">
          Notice
        </span>
        <div className="truncate text-slate-700 font-medium">
          Official statutory compliance records (Section 12A, 80G, FCRA &amp; NITI Aayog Darpan) are cross-examined against public archives.
        </div>
      </div>

      {/* 5. Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 shadow-xl animate-fadeIn">
          {/* Mobile Language Selector Row */}
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Language / भाषा:</span>
            <LanguageSelector compact />
          </div>

          <button
            onClick={() => handleMobileNav('home')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
              currentPage === 'home'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{t('nav.homePortal')}</span>
            {currentPage === 'home' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
          </button>

          <button
            onClick={() => handleMobileNav('finder')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
              currentPage === 'finder'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{t('nav.findAndVerify')}</span>
            {currentPage === 'finder' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
          </button>

          <button
            onClick={() => handleMobileNav('how-it-works')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
              currentPage === 'how-it-works'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{t('nav.howItWorks')}</span>
            {currentPage === 'how-it-works' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSuggest();
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-800 hover:bg-emerald-50 flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>{t('nav.suggestNgo')}</span>
          </button>

          <button
            onClick={() => handleMobileNav('admin')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
              currentPage === 'admin'
                ? 'bg-blue-50 text-blue-800 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>{t('nav.officerAdminDesk')}</span>
            </div>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">Registry</span>
          </button>
        </div>
      )}
    </header>
  );
}
