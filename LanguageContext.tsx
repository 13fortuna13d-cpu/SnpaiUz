import React, { createContext, useContext, useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tGenre: (genre: string) => string;
  tStatus: (status: string) => string;
  tCountry: (country: string) => string;
  getAnimeTitle: (titleObj?: Record<string, string>) => string;
  getAnimeSynopsis: (synopsisObj?: Record<string, string>) => string;
  getEpisodeTitle: (episodeTitleObj?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('snpaiuz_lang') as Language;
    return saved && ['uz', 'en', 'ru'].includes(saved) ? saved : 'uz';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('snpaiuz_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['uz']?.[key] || key;
  };

  const tGenre = (genre: string): string => {
    const key = `genre.${genre}`;
    return translations[language]?.[key] || translations['uz']?.[key] || genre;
  };

  const tStatus = (status: string): string => {
    const key = `status.${status.toLowerCase()}`;
    return translations[language]?.[key] || translations['uz']?.[key] || status;
  };

  const tCountry = (country: string): string => {
    const key = `country.${country.toLowerCase()}`;
    return translations[language]?.[key] || translations['uz']?.[key] || country;
  };

  const getAnimeTitle = (titleObj?: Record<string, string>): string => {
    if (!titleObj) return '';
    if (language === 'uz') return titleObj.uz || titleObj.en || titleObj.jp || '';
    if (language === 'en') return titleObj.en || titleObj.uz || titleObj.jp || '';
    if (language === 'ru') return titleObj.ru || titleObj.en || titleObj.uz || titleObj.jp || '';
    return titleObj[language] || titleObj.uz || titleObj.en || titleObj.jp || '';
  };

  const getAnimeSynopsis = (synopsisObj?: Record<string, string>): string => {
    if (!synopsisObj) return '';
    return synopsisObj[language] || synopsisObj['uz'] || synopsisObj['en'] || Object.values(synopsisObj)[0] || '';
  };

  const getEpisodeTitle = (episodeTitleObj?: Record<string, string>): string => {
    if (!episodeTitleObj) return '';
    return episodeTitleObj[language] || episodeTitleObj['uz'] || episodeTitleObj['en'] || Object.values(episodeTitleObj)[0] || '';
  };

  return (
    <LanguageContext.Provider value={{
      language, setLanguage, t, tGenre, tStatus, tCountry,
      getAnimeTitle, getAnimeSynopsis, getEpisodeTitle
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

