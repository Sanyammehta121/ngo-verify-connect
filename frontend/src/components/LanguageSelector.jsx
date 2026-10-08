import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function LanguageSelector({ compact = false, className = '' }) {
  const { language, setLanguage, languages, currentLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {compact ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1.5 p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200 bg-white shadow-2xs"
          title="Change language / भाषा बदलें"
          aria-label="Change language"
        >
          <Globe className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold">{currentLanguage.nativeName}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 py-1.5 px-3 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition group"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold text-slate-900">{currentLanguage.nativeName}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-200 py-1.5 z-50 animate-fadeIn">
          <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Select Language / भाषा
            </span>
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {languages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-[13px]">{item.nativeName}</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {item.code !== 'en' ? `(${item.name})` : ''}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
