import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Search, CheckCircle, PlusCircle, User, LogOut, 
  ShieldCheck, ChevronDown, ExternalLink, Menu, X 
} from 'lucide-react';

export default function Navbar({ onNavigate, currentPage, onOpenSuggest, onOpenAuth }) {
  const { user, isAdmin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => handleMobileNav('home')}
          className="flex items-center space-x-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">NGO Verify</span>
              <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                & Connect
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none">Public Trust & Compliance</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => onNavigate('finder')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentPage === 'finder'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Find NGOs
          </button>

          <button
            onClick={() => onNavigate('how-it-works')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentPage === 'how-it-works'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            How Verification Works
          </button>

          <button
            onClick={onOpenSuggest}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Suggest an NGO</span>
          </button>

          {/* Admin link - only visible to authenticated admin */}
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                currentPage === 'admin'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin Desk</span>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            </button>
          )}
        </nav>

        {/* Right Area: Auth & Mobile Hamburger */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Auth / Profile Area */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 py-1.5 px-2.5 sm:px-3 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 transition"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-emerald-300" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium capitalize">
                    {user.role === 'admin' ? '🛡️ Admin Officer' : user.provider === 'google' ? '🟢 Google Verified' : '✓ Verified Donor'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1 z-50 animate-fadeIn"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => onNavigate('admin')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 flex items-center space-x-2"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin Control Center</span>
                    </button>
                  )}

                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="py-1.5 px-3 sm:px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition flex items-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 shadow-xl animate-fadeIn">
          <button
            onClick={() => handleMobileNav('home')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
              currentPage === 'home'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Home Portal</span>
            {currentPage === 'home' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
          </button>

          <button
            onClick={() => handleMobileNav('finder')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
              currentPage === 'finder'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Find & Verify NGOs</span>
            {currentPage === 'finder' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
          </button>

          <button
            onClick={() => handleMobileNav('how-it-works')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
              currentPage === 'how-it-works'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>How Verification Works</span>
            {currentPage === 'how-it-works' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSuggest();
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Suggest an NGO</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => handleMobileNav('admin')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                currentPage === 'admin'
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Officer Admin Desk</span>
              </div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">Officer</span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-100">
            {!user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold text-center transition shadow-xs"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold text-center transition flex items-center justify-center space-x-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out ({user.name})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
