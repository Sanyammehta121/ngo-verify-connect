import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, ExternalLink, Copy, Check, QrCode } from 'lucide-react';

export default function DonationSafetyBanner({ ngo }) {
  const [copied, setCopied] = useState(false);

  const handleCopyUpi = () => {
    if (ngo.donationUpi) {
      navigator.clipboard.writeText(ngo.donationUpi);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (ngo.donationLink) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-300/80 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-slate-900 text-base">
                  Verified Official Donation Channel
                </h4>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                  SSL Verified
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                This NGO maintains an audited, official payment gateway verified by platform checks. Your contributions directly fund their registered charitable causes.
              </p>

              {/* UPI Pill if present */}
              {ngo.donationUpi && (
                <div className="mt-2.5 flex items-center space-x-2 text-xs">
                  <span className="text-slate-500 font-medium">Verified UPI VPA:</span>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs font-mono font-semibold text-slate-800">
                    <span>{ngo.donationUpi}</span>
                    <button
                      onClick={handleCopyUpi}
                      className="text-emerald-700 hover:text-emerald-800 p-0.5"
                      title="Copy UPI ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {copied && <span className="text-[11px] text-emerald-600 font-semibold">Copied!</span>}
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 flex items-center space-x-2">
            <a
              href={ngo.donationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition group"
            >
              <span>Donate on Official Gateway</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Warning Banner if NO verified transaction link
  return (
    <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-5 shadow-xs">
      <div className="flex items-start space-x-3.5">
        <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="font-bold text-amber-900 text-base">
              Donate with Caution: No Verified Transaction Link
            </h4>
            <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[11px] font-bold rounded-full">
              High Due-Diligence Required
            </span>
          </div>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed max-w-2xl">
            This NGO has not yet submitted an authenticated payment gateway or verified institutional bank account on this registry. <strong>Do not transfer funds to personal UPI IDs or unverified mobile numbers.</strong> Verify their audited statements and official receipts before disbursing contributions.
          </p>
        </div>
      </div>
    </div>
  );
}
