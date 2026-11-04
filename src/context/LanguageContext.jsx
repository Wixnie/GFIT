import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../utils/gfitt_lang';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'gfitt_lang';
const supportedLanguages = ['tr', 'en'];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return supportedLanguages.includes(saved) ? saved : 'tr';
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (nextLanguage) => {
    const next = supportedLanguages.includes(nextLanguage) ? nextLanguage : 'tr';
    localStorage.setItem(STORAGE_KEY, next);
    setLanguageState(next);
  };

  const t = (path, variables = {}) => {
    const value = path.split('.').reduce((current, key) => current?.[key], translations[language]) || path;
    return Object.entries(variables).reduce((text, [key, replacement]) => text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(replacement)), value);
  };

  const value = useMemo(() => ({ language, setLanguage, t, supportedLanguages }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}

export default LanguageContext;
