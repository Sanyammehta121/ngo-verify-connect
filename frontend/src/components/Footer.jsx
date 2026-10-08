import React from 'react';
import { ShieldCheck, ExternalLink, FileText, CheckCircle2, Landmark, Shield, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function Footer({ onNavigate }) {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0b1322] text-slate-400 text-xs border-t-4 border-slate-800 mt-20">
      {/* Tricolor accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808] w-full" aria-hidden="true"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: TrueNGO Government Portal Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2 text-white">
              <div className="p-1.5 bg-gradient-to-tr from-slate-900 to-emerald-700 rounded-lg text-emerald-400 border border-emerald-500/40 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  True<span className="text-emerald-400">NGO</span>
                </span>
                <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">
                  National Due Diligence Portal
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              India's independent civic-tech platform for public verification of non-governmental organizations, NITI Aayog Darpan compliance, and Section 80G tax exemptions.
            </p>
            <div className="pt-1 flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>328 Verified Entities in Public Index</span>
            </div>
          </div>

          {/* Col 2: Official Government Registries */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Govt Portals</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://ngodarpan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 flex items-center space-x-1 transition text-slate-300"
                >
                  <span>NITI Aayog NGO Darpan</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.incometax.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 flex items-center space-x-1 transition text-slate-300"
                >
                  <span>Income Tax 12A/80G Registry</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://fcraonline.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 flex items-center space-x-1 transition text-slate-300"
                >
                  <span>MHA FCRA Online Services</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://data.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 flex items-center space-x-1 transition text-slate-300"
                >
                  <span>Open Government Data (Data.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen Services Navigation */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Citizen Services</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('finder')}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  Search Verified Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  Verification Methodology (1.0 to 5.0)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  Officer Verification Desk
                </button>
              </li>
              <li>
                <span className="text-slate-500 text-[11px] block">
                  314 Districts Covered across India
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Public Security Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Donor Safety Notice</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              TrueNGO is an open public-interest verification platform. We do not collect commissions or process intermediary donations. Always verify official bank account IFSC and Section 80G tax certificates before transferring funds.
            </p>
          </div>
        </div>

        {/* Bottom copyright and national portal compliance */}
        <div className="border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© 2026 TrueNGO. National NGO Due Diligence &amp; Verification Portal. Dedicated to civic transparency across India.</p>
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Live Central Database Synchronized</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
