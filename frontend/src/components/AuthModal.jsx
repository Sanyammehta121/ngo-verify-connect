import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Shield, User, Lock, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialRole = 'citizen' }) {
  const { login, register, demoLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
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

        {/* 1-Click Quick Demo Sign In Box */}
        <div className="px-6 pt-5 pb-3 bg-emerald-50/40 border-b border-emerald-100/60">
          <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-2">
            ⚡ Quick 1-Click Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('citizen')}
              disabled={loading}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-medium shadow-xs transition"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Donor</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              disabled={loading}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-white border border-blue-200 text-blue-800 hover:bg-blue-50 rounded-xl text-xs font-medium shadow-xs transition"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin Desk</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
            {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>

          <div className="text-center pt-2">
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
      </div>
    </div>
  );
}
