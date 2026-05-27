import { createContext, useContext, useState, useCallback } from 'react';
import en from './en.json';
import fr from './fr.json';

const messages = { en, fr };

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    // Default to browser language or English
    const browserLang = navigator.language?.startsWith('fr') ? 'fr' : 'en';
    return browserLang;
  });

  const t = useCallback((key) => {
    return messages[lang][key] || key;
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'en' ? 'fr' : 'en');
  }, []);

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}
