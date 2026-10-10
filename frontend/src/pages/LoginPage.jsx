import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, Lock, Mail, KeyRound, User, ArrowRight, 
  CheckCircle2, AlertCircle, Sparkles, Landmark,
  Eye, EyeOff, ShieldAlert, Zap
} from 'lucide-react';

export default function LoginPage() {
  const { loginWithCredentials, registerWithCredentials, demoLogin } = useAuth();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1-Click Instant Demo Login
  const handleDemoLogin = async (role) => {
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await demoLogin(role);
      // AuthProvider automatically updates user state and unblocks AppGatekeeper
    } catch (err) {
      setError(err.message || 'Demo authentication failed.');
      setLoading(false);
    }
  };

  // Handle Email & Password Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        if (!email.trim() || !password) {
          throw new Error('Please enter both email and password.');
        }
        await loginWithCredentials(email.trim(), password);
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (!email.trim() || !password) {
          throw new Error('Please provide both email address and password.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }

        await registerWithCredentials(name.trim(), email.trim(), password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 flex flex-col justify-between text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* 1. National Tricolor Strip */}
      <div className="h-1.5 bg-linear-to-r from-[#ff9933] via-white to-[#138808] w-full shadow-sm" aria-hidden="true"></div>

      {/* 2. Top Civic Banner Header */}
      <header className="px-4 py-4 sm:px-8 border-b border-slate-700/60 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
              <ShieldCheck className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl text-white tracking-tight">
                  True<span className="text-emerald-400">NGO</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-500/40 uppercase tracking-wider">
                  Citizen Gateway
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                National Non-Profit Verification &amp; Due Diligence Registry
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>भारत सरकार | Government of India</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Main Center Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden shadow-black/50">
          
          {/* Card Title Banner */}
          <div className="p-6 sm:p-7 border-b border-slate-800 bg-linear-to-b from-slate-800/50 to-slate-900/80 text-center relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Portal Access Authentication
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Verify your identity to search, inspect compliance audits, and access non-profit records.
            </p>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-7 space-y-6">

            {/* Error & Success Alerts */}
            {error && (
              <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{error}</div>
              </div>
            )}
            {successMsg && (
              <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{successMsg}</div>
              </div>
            )}

            {/* A. INSTANT 1-CLICK DEMO LOGIN (Zero typing required) */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant 1-Click Demo Login</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">No typing required</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* 1-Click Citizen */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('citizen')}
                  disabled={loading}
                  className="flex flex-col items-start p-3 rounded-xl bg-gradient-to-br from-emerald-950/80 to-slate-800 hover:from-emerald-900/90 hover:to-slate-700/90 border border-emerald-500/40 hover:border-emerald-400 text-left transition shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 group"
                >
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-300 mb-0.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Demo Citizen</span>
                  </div>
                  <div className="text-[10px] text-slate-300 truncate w-full">aarav.sharma@gmail.com</div>
                  <div className="text-[9px] text-emerald-400/80 mt-1 font-medium group-hover:text-emerald-300">
                    ⚡ Instant Portal Entry →
                  </div>
                </button>

                {/* 1-Click Officer / Admin */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={loading}
                  className="flex flex-col items-start p-3 rounded-xl bg-gradient-to-br from-blue-950/80 to-slate-800 hover:from-blue-900/90 hover:to-slate-700/90 border border-blue-500/40 hover:border-blue-400 text-left transition shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 group"
                >
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-300 mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Demo Officer</span>
                  </div>
                  <div className="text-[10px] text-slate-300 truncate w-full">admin@ngoverify.org</div>
                  <div className="text-[9px] text-blue-400/80 mt-1 font-medium group-hover:text-blue-300">
                    🛡️ Admin Clearance →
                  </div>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full"></div>
              <div className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold absolute">
                or sign in with email
              </div>
            </div>

            {/* B. Email / Password Form with Sign In & Register Tabs */}
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); }}
                  className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Citizen Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setError(''); setSuccessMsg(''); }}
                  className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {activeTab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Legal Name <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Rajesh Kumar Sharma"
                        required
                        className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="citizen@domain.com"
                      required
                      className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Password <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition flex items-center justify-center space-x-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  <span>
                    {loading 
                      ? 'Authenticating...' 
                      : activeTab === 'login' 
                        ? 'Sign In to Portal' 
                        : 'Create Account & Sign In'
                    }
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

          {/* Card Footer Statutory Warning */}
          <div className="p-4 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 text-center leading-relaxed">
            Protected under DPDP Act 2023 &amp; IT Act 2000. All non-profit inquiries and forensic checks are logged for public accountability.
          </div>

        </div>
      </main>

      {/* 4. Bottom Government Accreditation Bar */}
      <footer className="px-4 py-3 border-t border-slate-800/80 bg-slate-950/80 text-[11px] text-slate-400 text-center flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto w-full">
        <div>
          © 2026 TrueNGO National Due Diligence Registry. All rights reserved.
        </div>
        <div className="flex items-center space-x-3 mt-1 sm:mt-0">
          <span>Digital India Initiative</span>
          <span>•</span>
          <span>NITI Aayog Darpan Cross-Index</span>
          <span>•</span>
          <span>Section 12A / 80G Certified</span>
        </div>
      </footer>
    </div>
  );
}
