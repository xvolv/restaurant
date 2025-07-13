import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme, themes } from '../../contexts/ThemeContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, mode } = useTheme();
  const currentTheme = themes[theme];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' }
  ];

  return (
    <div className="relative group">
      <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
        mode === 'dark' 
          ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
      }`}>
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {languages.find(l => l.code === language)?.flag}
        </span>
      </button>

      <div className={`absolute right-0 mt-2 w-48 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}>
        <div className="p-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as 'en' | 'am')}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                language === lang.code
                  ? `bg-gradient-to-r ${currentTheme.primary} text-white`
                  : mode === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-xs opacity-75">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;