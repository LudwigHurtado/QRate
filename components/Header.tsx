
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { USAFlagIcon, MexicoFlagIcon } from './icons/Icons';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white shadow-md print:hidden">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <LogoIcon className="h-10 w-10 text-blue-600" />
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              QRate
            </h1>
            <p className="text-sm font-medium text-slate-500">{t('slogan')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button
                onClick={() => setLanguage('en')}
                className={`p-1 rounded-full transition-all duration-200 ${language === 'en' ? 'ring-2 ring-blue-500 ring-offset-2' : 'opacity-50 hover:opacity-100'}`}
                title="Switch to English"
            >
                <USAFlagIcon className="h-5 w-auto rounded-sm" />
            </button>
            <button
                onClick={() => setLanguage('es')}
                className={`p-1 rounded-full transition-all duration-200 ${language === 'es' ? 'ring-2 ring-blue-500 ring-offset-2' : 'opacity-50 hover:opacity-100'}`}
                title="Cambiar a Español"
            >
                <MexicoFlagIcon className="h-5 w-auto rounded-sm" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
