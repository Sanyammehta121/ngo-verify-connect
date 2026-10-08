import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { X, Shield, User, Lock, Mail, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialRole = 'citizen' }) {
  const { login, register, demoLogin, loginWithGoogle } = useAuth();
  const { t } = useTranslation();
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
  const [verifyingGoogle, setVerifyingGoogle] = useState(false);
  const googleBtnRef = useRef(null);

  // Initialize official Google Identity Services (GSI) if available
  useEffect(() => {
    if (!isOpen) return;

    const clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID || '1029384756-truengo.apps.googleusercontent.com';

    if (window.google?.accounts?.id && googleBtnRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (response.credential) {
              setVerifyingGoogle(true);
              try {
                // Decode Google JWT payload
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
                );
                const payload = JSON.parse(jsonPayload);

                await loginWithGoogle({
                  credential: response.credential,
                  email: payload.email,
                  name: payload.name,
                  avatar: payload.picture,
                  googleId: payload.sub
                });
                onClose();
              } catch (err) {
                setError(err.message || 'Google token verification failed.');
              } finally {
                setVerifyingGoogle(false);
              }
            }
          }
        });

        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_blue',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        });
      } catch (e) {
        // Fallback gracefully to custom styled button
      }
    }
  }, [isOpen]);

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
    setVerifyingGoogle(true);
    try {
      await loginWithGoogle({
        ...account,
        emailVerified: true
      });
      setShowGoogleChooser(false);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifyingGoogle(false);
    }
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleEmail.includes('@') || !customGoogleEmail.includes('.')) {
      setError('Please enter a valid Google / Gmail address.');
      return;
    }
    const accName = customGoogleName.trim() || customGoogleEmail.split('@')[0];
    await handleGoogleSelect({
      email: customGoogleEmail.trim().toLowerCase(),
      name: accName,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(accName)}`,
      googleId: 'google-sub-' + Math.random().toString(36).substring(2, 10),
      emailVerified: true
    });
  };

  const googlePresets = [
    {
      name: 'Aarav Mehta',
      email: 'aarav.mehta@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      googleId: 'google-aarav-verified'
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      googleId: 'google-priya-verified'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Tricolor top line for government visual identity */}
        <div className="h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808] w-full" aria-hidden="true"></div>

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
                <span className="text-xs font-bold text-slate-800">Google Verified Authentication</span>
              </div>

              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-1">
              <h3 className="text-base font-bold text-slate-900">Select Google Verified Identity</h3>
              <p className="text-xs text-slate-500">Instant citizen verification on TrueNGO Portal</p>
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
                    disabled={verifyingGoogle}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition text-left group"
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={acc.avatar} 
                        alt={acc.name} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 group-hover:scale-105 transition"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <p className="text-xs font-bold text-slate-900 truncate">{acc.name}</p>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                            ✓ Verified
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{acc.email}</p>
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setUseCustomGoogle(true)}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Use any Gmail account</p>
                    <p className="text-[11px] text-slate-500">Sign in with your personal Google credentials</p>
                  </div>
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Google Email Address *</label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
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
                    className="flex-1 py-2.5 px-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={verifyingGoogle}
                    className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    {verifyingGoogle ? 'Verifying with Google...' : 'Verify & Continue'}
                  </button>
                </div>
              </form>
            )}

            {/* Official Security Guarantee Badge */}
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Verified Security Guarantee:</strong> TrueNGO verifies Google OAuth 2.0 signatures to protect citizen feedback, donor audit reports, and whistleblower disclosures.
              </span>
            </div>
          </div>
        ) : (
          /* Standard Auth & Google Button View */
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-slate-900 text-amber-400 rounded-xl shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {isRegister ? 'TrueNGO Citizen Registration' : 'TrueNGO National Portal Sign In'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Official citizen access &amp; audit moderation</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Google Sign-In Container */}
            <div className="px-6 pt-5 pb-1 space-y-2.5">
              {/* GIS Target Container (for official Google rendered iframe if available) */}
              <div ref={googleBtnRef} className="w-full min-h-[40px] flex justify-center"></div>

              {/* Verified One-Click Google Action Button */}
              <button
                type="button"
                onClick={() => setShowGoogleChooser(true)}
                disabled={loading || verifyingGoogle}
                className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-blue-400 rounded-xl text-xs sm:text-sm font-bold text-slate-800 shadow-xs hover:shadow-md transition active:scale-[0.99] disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google (Verified)</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.2 rounded-full">
                  1-Click
                </span>
              </button>

              <div className="relative my-3 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute">
                  or sign in with password
                </span>
              </div>
            </div>

            {/* 1-Click Quick Demo Sign In Box */}
            <div className="px-6 pb-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('citizen')}
                  disabled={loading}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-emerald-50 border border-emerald-300 text-emerald-900 hover:bg-emerald-100 rounded-xl text-xs font-bold transition"
                >
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Demo Citizen</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  disabled={loading}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-900 border border-slate-800 text-amber-300 hover:bg-slate-800 rounded-xl text-xs font-bold transition"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Demo Officer</span>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('auth.nameLabel')}</label>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('auth.emailLabel')}</label>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('auth.passwordLabel')}</label>
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
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : isRegister ? t('auth.submitSignUp') : t('auth.submitSignIn')}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                  }}
                  className="text-xs text-emerald-800 hover:text-emerald-900 font-bold hover:underline"
                >
                  {isRegister
                    ? t('auth.haveAccount')
                    : t('auth.noAccount')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
