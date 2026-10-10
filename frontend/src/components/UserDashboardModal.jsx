import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, User, Mail, ShieldCheck, CheckCircle2, 
  LogOut, Shield, Award, Clock
} from 'lucide-react';

export default function UserDashboardModal({ isOpen, onClose }) {
  const { user, logout, demoLogin } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-black shadow-md border-2 border-emerald-400">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg text-white leading-tight">{user.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  ID: #{String(user.id).padStart(4, '0')}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center space-x-1 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email}</span>
              </p>
              <div className="flex items-center space-x-2 mt-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>
                    {user.role === 'admin' ? 'Officer Clearance' : 'Active Citizen'}
                  </span>
                </span>
                {user.provider && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {user.provider}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Activity Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-2xl font-black text-slate-800">
                {user.activity ? user.activity.reviewsSubmitted : 0}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Reviews Authored</div>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-2xl font-black text-slate-800">
                {user.activity ? user.activity.reportsFiled : 0}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Whistleblower Reports</div>
            </div>
          </div>

          {/* Security & Clearance Information */}
          <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Identity &amp; Account Details</span>
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Account ID:</span>
                <span className="font-mono font-semibold text-slate-800">usr_in_{user.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Access Role:</span>
                <span className="font-semibold text-slate-800 capitalize">{user.role || 'citizen'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Session Type:</span>
                <span className="font-semibold text-slate-800">JWT Token Auth</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Account Status:</span>
                <span className="text-emerald-700 font-bold">Verified &amp; Active</span>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher / Officer Desk Shortcut */}
          <div className="pt-1">
            {user.role === 'admin' ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  window.location.hash = 'admin';
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                <Shield className="w-4 h-4 text-blue-700" />
                <span>Open Gov Compliance Admin Desk →</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  await demoLogin('admin');
                  onClose();
                  window.location.hash = 'admin';
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>⚡ Switch to Demo Officer (Access Admin Desk)</span>
              </button>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center space-x-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Portal</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
