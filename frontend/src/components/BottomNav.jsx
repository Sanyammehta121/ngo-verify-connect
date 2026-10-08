import React from 'react';
import { Home, Search, PlusCircle, ShieldCheck, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function BottomNav({ currentPage, onNavigate, onOpenSuggest, onOpenAuth }) {
  const { user, isAdmin, logout } = useAuth();
  const { t } = useTranslation();
  const [showAccountMenu, setShowAccountMenu] = React.useState(false);

  return (
    <>
      {/* User Account Popover Sheet */}
      {showAccountMenu && user && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end justify-center pb-20 px-4 animate-fadeIn"
          onClick={() => setShowAccountMenu(false)}
        >
          <div 
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 space-y-3 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-emerald-300 shadow-xs" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm uppercase shadow-sm">
                  {user.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isAdmin ? 'bg-blue-100 text-blue-800' : user.provider === 'google' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isAdmin ? `🛡️ ${t('nav.adminOfficer')}` : user.provider === 'google' ? `🟢 ${t('nav.googleVerified')}` : `✓ ${t('nav.verifiedDonor')}`}
                </span>
              </div>
            </div>

            {/* Language Selector Row inside Mobile Account Sheet */}
            <div className="py-1 flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-semibold text-slate-600">{t('bottomNav.selectLanguage')}:</span>
              <LanguageSelector compact />
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  onNavigate('admin');
                }}
                className="w-full py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition"
              >
                <Shield className="w-4 h-4 text-blue-600" />
                <span>{t('bottomNav.openAdminDesk')}</span>
              </button>
            )}

            <button
              onClick={() => {
                setShowAccountMenu(false);
                logout();
              }}
              className="w-full py-2 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-semibold text-center transition"
            >
              {t('bottomNav.signOut')}
            </button>
          </div>
        </div>
      )}

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

        {/* 4. Verification Guide / Admin Desk (Only for admin) */}
        <button
          onClick={() => onNavigate(isAdmin ? 'admin' : 'how-it-works')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            currentPage === 'how-it-works' || currentPage === 'admin'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isAdmin ? (
            <Shield className={`w-5 h-5 ${currentPage === 'admin' ? 'stroke-[2.5] text-blue-600' : 'stroke-2'}`} />
          ) : (
            <ShieldCheck className={`w-5 h-5 ${currentPage === 'how-it-works' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          )}
          <span className="text-[10px] mt-1 font-medium">
            {isAdmin ? t('bottomNav.admin') : t('bottomNav.guide')}
          </span>
        </button>

        {/* 5. Account / Auth */}
        <button
          onClick={user ? () => setShowAccountMenu(prev => !prev) : onOpenAuth}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            user ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {user ? (
            user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover border border-emerald-400" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center uppercase">
                {user.name?.charAt(0) || 'U'}
              </div>
            )
          ) : (
            <User className="w-5 h-5 stroke-2" />
          )}
          <span className="text-[10px] mt-1 font-medium truncate max-w-[54px]">
            {user ? user.name.split(' ')[0] : t('nav.signIn')}
          </span>
        </button>
      </nav>
    </>
  );
}
