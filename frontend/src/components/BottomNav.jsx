import React from 'react';
import { Home, Search, PlusCircle, ShieldCheck, Shield } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function BottomNav({ currentPage, onNavigate, onOpenSuggest }) {
  const { t } = useTranslation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl px-2 pt-2 pb-3 flex items-center justify-around select-none">
      {/* 1. Home */}
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
          currentPage === 'home'
            ? 'text-emerald-700 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home className={`w-5 h-5 ${currentPage === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] mt-1 font-medium">{t('bottomNav.home')}</span>
      </button>

      {/* 2. Finder / Directory */}
      <button
        onClick={() => onNavigate('finder')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
          currentPage === 'finder'
            ? 'text-emerald-700 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Search className={`w-5 h-5 ${currentPage === 'finder' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] mt-1 font-medium">{t('bottomNav.findNgos')}</span>
      </button>

      {/* 3. Suggest NGO (Center prominent action button) */}
      <button
        onClick={onOpenSuggest}
        className="flex flex-col items-center justify-center flex-1 py-1 -mt-3 group"
      >
        <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-active:scale-95 transition">
          <PlusCircle className="w-6 h-6 stroke-[2.2]" />
        </div>
        <span className="text-[10px] mt-0.5 text-slate-700 font-semibold">{t('bottomNav.suggest')}</span>
      </button>

      {/* 4. Verification Guide */}
      <button
        onClick={() => onNavigate('how-it-works')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
          currentPage === 'how-it-works'
            ? 'text-emerald-700 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <ShieldCheck className={`w-5 h-5 ${currentPage === 'how-it-works' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] mt-1 font-medium">{t('bottomNav.guide')}</span>
      </button>

      {/* 5. Compliance Desk */}
      <button
        onClick={() => onNavigate('admin')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
          currentPage === 'admin'
            ? 'text-blue-700 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Shield className={`w-5 h-5 ${currentPage === 'admin' ? 'stroke-[2.5] text-blue-600' : 'stroke-2'}`} />
        <span className="text-[10px] mt-1 font-medium">{t('bottomNav.admin')}</span>
      </button>
    </nav>
  );
}
