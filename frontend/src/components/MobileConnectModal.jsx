import React, { useState, useEffect } from 'react';
import { X, Smartphone, Wifi, Copy, Check, ExternalLink, QrCode, ShieldCheck } from 'lucide-react';

export default function MobileConnectModal({ isOpen, onClose }) {
  const [networkInfo, setNetworkInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    async function fetchInfo() {
      try {
        const res = await fetch('/api/network-info');
        if (res.ok) {
          const data = await res.json();
          setNetworkInfo(data);
        }
      } catch (err) {
        console.error('Failed to fetch network info:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInfo();
  }, [isOpen]);

  if (!isOpen) return null;

  const mobileUrl = networkInfo?.mobileUrl || `${window.location.protocol}//${window.location.hostname}:5000`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(mobileUrl)}&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              Open on Mobile Device
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Scan with your phone camera to test live
            </p>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col items-center justify-center text-center">
          <div className="w-48 h-48 bg-white rounded-xl p-2 border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden">
            {loading ? (
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <img
                src={qrCodeUrl}
                alt="Mobile QR Code"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>

          <div className="mt-3 flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span>Connect to same Wi-Fi / Hotspot</span>
          </div>
        </div>

        {/* URL Box with Copy Button */}
        <div className="mt-4">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Direct Mobile URL
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={mobileUrl}
              className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 select-all"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
          <div className="flex items-start space-x-2">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>Make sure your phone and laptop are on the same Wi-Fi or mobile hotspot.</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>Open your phone's Camera or QR scanner and tap the prompt, or paste the URL into your browser.</span>
          </div>
        </div>

        {/* Footer Close */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
