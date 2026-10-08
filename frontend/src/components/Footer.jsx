import React from 'react';
import { ShieldCheck, ExternalLink, FileText, CheckCircle2, Heart } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function Footer({ onNavigate }) {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2 text-white">
              <div className="p-1.5 bg-emerald-500 rounded-lg text-slate-950 font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight">{t('footer.aboutTitle')}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('footer.aboutDesc')}
            </p>
          </div>

          {/* Col 2: Official Government Registries */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Official Govt Registries
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://ngodarpan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center space-x-1 transition"
                >
                  <span>NITI Aayog NGO Darpan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.incometax.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center space-x-1 transition"
                >
                  <span>Income Tax 12A/80G Registry</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://fcraonline.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center space-x-1 transition"
                >
                  <span>MHA FCRA Online Services</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://data.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center space-x-1 transition"
                >
                  <span>Open Government Data (Data.gov.in)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigate('finder')}
                  className="hover:text-emerald-400 transition"
                >
                  {t('nav.findNgos')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-emerald-400 transition"
                >
                  {t('nav.howItWorks')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-emerald-400 transition"
                >
                  {t('nav.adminDesk')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Transparency & Freshness Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              {t('footer.legalDisclaimer')}
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              {t('footer.disclaimerText')}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>© 2026 NGO Verify & Connect. {t('footer.allRightsReserved')}</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pan-India Verified NGO Registry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
