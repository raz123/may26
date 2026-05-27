import { createContext, useContext, useState, useCallback } from 'react';
import en from './en.json';
import fr from './fr.json';

const messages = { en, fr };

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const browserLang = navigator.language?.startsWith('fr') ? 'fr' : 'en';
    return browserLang;
  });

  const t = useCallback((key) => {
    return messages[lang][key] || key;
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang(prev => (prev === 'en' ? 'fr' : 'en'));
  }, []);

  // Helper: given a bilingual object { en: "...", fr: "..." }, return current language value
  const localized = useCallback((obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || '';
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang, localized }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}
