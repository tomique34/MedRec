import React, { useState, useEffect } from 'react';
import { getCurrentLanguage, setCurrentLanguage, Language } from '../lib/i18n';

export const LanguageSelector: React.FC = () => {
  const [language, setLanguage] = useState<Language>(getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(getCurrentLanguage());
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    setLanguage(lang);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        className={`px-2 py-1 text-xs rounded ${
          language === 'en' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
        }`}
        onClick={() => handleLanguageChange('en')}
      >
        EN
      </button>
      <button
        className={`px-2 py-1 text-xs rounded ${
          language === 'sk' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
        }`}
        onClick={() => handleLanguageChange('sk')}
      >
        SK
      </button>
    </div>
  );
};
