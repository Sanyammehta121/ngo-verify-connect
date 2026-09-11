import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Shield, User, Lock, Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialRole = 'citizen' }) {
  const { login, register, demoLogin, loginWithGoogle } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [useCustomGoogle, setUseCustomGoogle] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password, role);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole) => {
    setError('');
    setLoading(true);
    try {
      await demoLogin(demoRole);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSelect = async (account) => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(account);
      setShowGoogleChooser(false);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleEmail.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }
    const accName = customGoogleName.trim() || customGoogleEmail.split('@')[0];
    await handleGoogleSelect({
      email: customGoogleEmail.trim().toLowerCase(),
      name: accName,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(accName)}`
    });
  };

  const googlePresets = [
    {
      name: 'Aarav Mehta',
      email: 'aarav.mehta@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Google Account Chooser View */}
        {showGoogleChooser ? (
          <div className="p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowGoogleChooser(false);
                  setUseCustomGoogle(false);
                  setError('');
                }}
                className="p-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition flex items-center space-x-1 text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              
              <div className="flex items-center space-x-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span className="text-xs font-semibold text-slate-700">Google Sign-In</span>
              </div>

              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-1">
              <h3 className="text-base font-bold text-slate-900">Choose an account</h3>
              <p className="text-xs text-slate-500">to continue to NGO Verify & Connect</p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!useCustomGoogle ? (
              <div className="space-y-2">
                {googlePresets.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleGoogleSelect(acc)}
                    disabled={loading}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition text-left group"
                  >
                    <img 
                      src={acc.avatar} 
                      alt={acc.name} 
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{acc.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{acc.email}</p>
                    </div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setUseCustomGoogle(true)}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Use another Google account</p>
                    <p className="text-[11px] text-slate-400">Sign in with any Gmail address</p>
                  </div>
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Google Email</label>
                  <input
                    type="email"
                    required
                    placeholder="your.name@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sanyam Mehta"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setUseCustomGoogle(false)}
                    className="flex-1 py-2 px-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    {loading ? 'Signing in...' : 'Sign In with Google'}
                  </button>
                </div>
              </form>
            )}

            <p className="text-[10px] text-slate-400 text-center pt-1">
              By signing in with Google, you agree to secure citizen access and community guidelines.
            </p>
          </div>
        ) : (
          /* Standard Auth & Google Button View */
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-base">
                    {isRegister ? 'Create Citizen Account' : 'Welcome to NGO Verify'}
                  </h3>
                  <p className="text-xs text-slate-500">Secure access to ratings and moderation</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prominent Google Sign-In Button */}
            <div className="px-6 pt-5 pb-1">
              <button
                type="button"
                onClick={() => setShowGoogleChooser(true)}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-xs hover:shadow-sm transition active:scale-[0.99] disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-3 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider absolute">or</span>
              </div>
            </div>

            {/* 1-Click Quick Demo Sign In Box */}
            <div className="px-6 pb-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('citizen')}
                  disabled={loading}
                  className="flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-emerald-50/70 border border-emerald-200 text-emerald-800 hover:bg-emerald-100/70 rounded-xl text-xs font-medium transition"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Demo Citizen</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  disabled={loading}
                  className="flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-blue-50/70 border border-blue-200 text-blue-800 hover:bg-blue-100/70 rounded-xl text-xs font-medium transition"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Demo Admin</span>
                </button>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3.5">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {isRegister && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Aarav Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-xs hover:shadow-md transition disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : isRegister ? 'Create Citizen Account' : 'Sign In with Email'}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                  }}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-medium hover:underline"
                >
                  {isRegister
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Create one"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
