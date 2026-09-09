import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check } from 'lucide-react';

export default function MapLocation({ ngo }) {
  const [copied, setCopied] = useState(false);
  const lat = ngo.latitude || 28.6139;
  const lng = ngo.longitude || 77.2090;

  // OpenStreetMap embed URL
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02}%2C${lat - 0.015}%2C${lng + 0.02}%2C${lat + 0.015}&layer=mapnik&marker=${lat}%2C${lng}`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ngo.name}, ${ngo.address || ngo.city}`)}`;

  const handleCopyAddress = () => {
    if (ngo.address) {
      navigator.clipboard.writeText(ngo.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Registered Operating Location</h4>
            <p className="text-xs text-slate-500">{ngo.city}, {ngo.state}</p>
          </div>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Embedded Map */}
      <div className="relative w-full h-64 bg-slate-100">
        <iframe
          title={`Map of ${ngo.name}`}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={osmEmbedUrl}
          className="w-full h-full border-0"
        ></iframe>

        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-slate-600 shadow-xs border border-slate-200">
          © OpenStreetMap contributors
        </div>
      </div>

      {/* Address Details */}
      <div className="p-5 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-400 font-medium block text-[11px]">Official Registered Address:</span>
          <p className="font-semibold text-slate-800 mt-0.5">{ngo.address || `${ngo.city}, ${ngo.state}`}</p>
        </div>

        {ngo.address && (
          <button
            onClick={handleCopyAddress}
            className="inline-flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 font-medium p-1 self-start sm:self-auto"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Address' : 'Copy Address'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
