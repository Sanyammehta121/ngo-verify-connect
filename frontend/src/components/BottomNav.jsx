import React from 'react';
import { Home, Search, PlusCircle, ShieldCheck, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav({ currentPage, onNavigate, onOpenSuggest, onOpenAuth }) {
  const { user, isAdmin } = useAuth();

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
        <span className="text-[10px] mt-1 font-medium">Home</span>
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
        <span className="text-[10px] mt-1 font-medium">Find NGOs</span>
      </button>

      {/* 3. Suggest NGO (Center prominent action button) */}
      <button
        onClick={onOpenSuggest}
        className="flex flex-col items-center justify-center flex-1 py-1 -mt-3 group"
      >
        <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-active:scale-95 transition">
          <PlusCircle className="w-6 h-6 stroke-[2.2]" />
        </div>
        <span className="text-[10px] mt-0.5 text-slate-700 font-semibold">Suggest</span>
      </button>

      {/* 4. How Verification Works / Admin Desk */}
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
          {isAdmin ? 'Admin' : 'Verification'}
        </span>
      </button>

      {/* 5. Account / Auth */}
      <button
        onClick={user ? () => onNavigate('admin') : onOpenAuth}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
          user ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {user ? (
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center uppercase">
            {user.name?.charAt(0) || 'U'}
          </div>
        ) : (
          <User className="w-5 h-5 stroke-2" />
        )}
        <span className="text-[10px] mt-1 font-medium truncate max-w-[54px]">
          {user ? user.name.split(' ')[0] : 'Sign In'}
        </span>
      </button>
    </nav>
  );
}
