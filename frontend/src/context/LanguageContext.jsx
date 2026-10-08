import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, LANGUAGES } from '../i18n/translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'ngo_language';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && translations[saved]) {
        return saved;
      }
    } catch {
      // ignore localStorage errors
    }
    return 'en';
  });

  const setLanguage = useCallback((code) => {
    if (translations[code]) {
      setLanguageState(code);
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // ignore localStorage errors
      }
    }
  }, []);

  // Helper function to resolve dot-notated key with fallback to English
  const t = useCallback((key, params = {}) => {
    if (!key) return '';

    const getNested = (obj, path) => {
      return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
    };

    let text = getNested(translations[language], key);

    // Fallback to English if not found
    if (text === undefined && language !== 'en') {
      text = getNested(translations['en'], key);
    }

    if (text === undefined) {
      return key;
    }

    // Parameter interpolation: {paramName} -> value
    if (typeof text === 'string' && Object.keys(params).length > 0) {
      return Object.keys(params).reduce((str, paramKey) => {
        return str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
      }, text);
    }

    return text;
  }, [language]);

  const currentLanguage = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
