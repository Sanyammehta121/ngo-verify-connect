import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, HelpCircle, FileCheck, Layers, Award } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function HowVerificationWorks({ onNavigate, onOpenSuggest }) {
  const { t } = useTranslation();

  const formulaPillars = [
    {
      percentage: '20%',
      title: 'Section 12A Charitable Exemption',
      issuer: 'Income Tax Department (Form 10AC)',
      description: 'Verifies that the organization is officially recognized as an established charitable institution under the Indian Income Tax Act, 1961.'
    },
    {
      percentage: '20%',
      title: 'Section 80G Donor Tax Benefit',
      issuer: 'Director General of Income Tax',
      description: 'Confirms that donations made to the NGO are eligible for a 50% income tax deduction for Indian citizens and corporations.'
    },
    {
      percentage: '20%',
      title: 'NITI Aayog NGO Darpan ID',
      issuer: 'National Planning Commission / Central Registry',
      description: 'Mandatory central registration that tracks non-profit operations, trustee PAN details, and annual compliance submissions across India.'
    },
    {
      percentage: '10%',
      title: 'FCRA Statutory Clearance',
      issuer: 'Ministry of Home Affairs (MHA)',
      description: 'Statutory compliance validation for receiving offshore/foreign philanthropic contributions without regulatory penalties.'
    },
    {
      percentage: '10%',
      title: 'Verified Direct Payment Gateway',
      issuer: 'PCI-DSS Bank Gateway / Corporate UPI',
      description: 'Ensures donor funds route exclusively through institutionally held bank accounts, blocking diversion into unverified personal accounts.'
    },
    {
      percentage: '10%',
      title: 'Audit Freshness (<12 Months)',
      issuer: 'Platform Compliance Desk Timestamp',
      description: 'Active compliance records reviewed within the past 12 months. Outdated records experience decay in score until re-verified.'
    },
    {
      percentage: '10%',
      title: 'Community Feedback & Transparency',
      issuer: 'Verified Donors & Volunteer Reviews',
      description: 'Dynamic modifier based on genuine star ratings, receipts turnaround time, and whistleblower fraud investigation status.'
    }
  ];

  const redFlags = [
    'Demanding donations directly into personal UPI handles or savings accounts rather than institutional bank VPAs.',
    'Inability to issue an immediate, signed 80G tax exemption receipt containing valid PAN and 10BE numbers.',
    'No valid registration on NITI Aayog NGO Darpan or refusal to provide an official registration certificate.',
    'Unsolicited aggressive WhatsApp or phone fundraising with generic stock photos and emotional extortion.',
    'Registration certificate dated over 5 years ago without renewal filings under the new mandatory Income Tax re-registration scheme.'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fadeIn">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
          <span>सत्यमेव जयते</span>
          <span className="text-slate-400">|</span>
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>TrueNGO Statutory Due Diligence Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('howItWorks.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t('howItWorks.subtitle')}
        </p>
      </div>

      {/* Trust Formula Pillars */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('howItWorks.scoreTitle')}</h2>
            <p className="text-xs text-slate-500">{t('howItWorks.scoreDesc')}</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg self-start sm:self-auto">
            100 Point Scale
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formulaPillars.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-emerald-300 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-2.5 py-0.5 bg-emerald-600 text-white rounded-md">
                  {p.percentage} Weight
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{p.issuer}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{p.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Cross-Verification Guide */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Citizen Due Diligence</span>
          <h2 className="text-2xl font-bold tracking-tight">How to Cross-Verify an NGO on Official Government Portals</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            We believe in radical transparency. You do not have to take our word for it — you can verify any registered Indian NGO yourself using these official government resources:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="font-bold text-emerald-400 text-sm">1. NITI Aayog NGO Darpan</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Visit the official Darpan portal and search by the NGO's unique ID (e.g., <code>DL/2009/0002131</code>). Verify active blacklisting status and trustee names.
            </p>
            <a
              href="https://ngodarpan.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-emerald-300 hover:text-white font-semibold pt-1"
            >
              <span>ngodarpan.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="font-bold text-emerald-400 text-sm">2. Income Tax 80G Verification</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Search the NGO's PAN on the Income Tax Department's exempt institution directory to confirm valid Section 80G tax benefit orders.
            </p>
            <a
              href="https://www.incometax.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-emerald-300 hover:text-white font-semibold pt-1"
            >
              <span>incometax.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="font-bold text-emerald-400 text-sm">3. MHA FCRA Online Services</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              If donating in foreign currency, check the Ministry of Home Affairs FCRA renewal notices to ensure foreign contribution licenses remain active.
            </p>
            <a
              href="https://fcraonline.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-emerald-300 hover:text-white font-semibold pt-1"
            >
              <span>fcraonline.nic.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Scam Red Flags Checklist */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-3 text-rose-800">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h2 className="text-lg font-bold">5 Philanthropic Red Flags Every Donor Must Know</h2>
        </div>
        <div className="space-y-2.5">
          {redFlags.map((flag, index) => (
            <div key={index} className="flex items-start space-x-2.5 text-xs text-rose-900 leading-relaxed">
              <span className="font-bold text-rose-600 shrink-0">#{index + 1}</span>
              <span>{flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4 pb-8 space-y-3">
        <h3 className="font-bold text-slate-900 text-lg">Ready to find a trusted charity?</h3>
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => onNavigate('finder')}
            className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            {t('nav.findNgos')}
          </button>
          <button
            onClick={onOpenSuggest}
            className="py-2.5 px-5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            {t('nav.suggestNgo')}
          </button>
        </div>
      </div>
    </div>
  );
}
