import React from 'react';
import { X, Palette, Monitor, Sun, Moon, Bell, Shield, Globe, Database, Wifi, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme, themes, ColorTheme, ThemeMode } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, mode, setTheme, setMode } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [notifications, setNotifications] = React.useState({
    orders: true,
    payments: true,
    kitchen: false,
    delivery: true,
    system: false
  });
  const [privacy, setPrivacy] = React.useState({
    profileVisible: true,
    activityTracking: false,
    dataSharing: false
  });
  const [system, setSystem] = React.useState({
    autoSave: true,
    soundEffects: true,
    animations: true,
    compactMode: false
  });

  if (!isOpen) return null;

  const currentTheme = themes[theme];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-4xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className={`px-6 py-4 bg-gradient-to-r ${currentTheme.primary} text-white`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center">
              <Palette className="w-6 h-6 mr-2" />
              {t('settings.generalSettings')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Display Mode */}
          <div>
            <h3 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
              {t('settings.displayMode')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {(['light', 'dark'] as ThemeMode[]).map((modeOption) => (
                <button
                  key={modeOption}
                  onClick={() => setMode(modeOption)}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                    mode === modeOption
                      ? `border-${currentTheme.accent} bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg`
                      : mode === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    {modeOption === 'light' ? (
                      <Sun className="w-6 h-6" />
                    ) : (
                      <Moon className="w-6 h-6" />
                    )}
                    <span className="font-medium capitalize">
                      {modeOption === 'light' ? t('settings.lightMode') : t('settings.darkMode')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Language Settings */}
          <div>
            <h3 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
              <Globe className="w-5 h-5 mr-2" />
              {t('settings.language')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { code: 'en', name: 'English', flag: '🇺🇸' },
                { code: 'am', name: 'አማርኛ', flag: '🇪🇹' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as 'en' | 'am')}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                    language === lang.code
                      ? `border-${currentTheme.accent} bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg`
                      : mode === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Themes */}
          <div>
            <h3 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
              {t('settings.colorTheme')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.entries(themes) as [ColorTheme, typeof themes[ColorTheme]][]).map(([themeKey, themeConfig]) => (
                <button
                  key={themeKey}
                  onClick={() => setTheme(themeKey)}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                    theme === themeKey
                      ? `border-${themeConfig.accent} bg-gradient-to-r ${themeConfig.primary} text-white shadow-lg transform scale-105`
                      : mode === 'dark'
                      ? 'border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${themeConfig.primary} rounded-lg shadow-md flex items-center justify-center`}>
                      <div className="w-6 h-6 bg-white rounded-full opacity-80"></div>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${theme === themeKey ? 'text-white' : mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {t(`themes.${themeKey.replace(/([A-Z])/g, (match) => match.toLowerCase())}`)}
                      </h4>
                      <div className="flex space-x-1 mt-2">
                        <div className={`w-3 h-3 bg-${themeConfig.accent} rounded-full`}></div>
                        <div className={`w-3 h-3 bg-gradient-to-r ${themeConfig.primary} rounded-full`}></div>
                        <div className={`w-3 h-3 bg-gradient-to-r ${themeConfig.secondary} rounded-full`}></div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
              <Bell className="w-5 h-5 mr-2" />
              {t('settings.notifications')}
            </h3>
            <div className={`p-4 ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg space-y-4`}>
              {Object.entries({
                orders: t('settings.orderNotifications'),
                payments: t('settings.paymentConfirmations'),
                kitchen: t('settings.kitchenUpdates'),
                delivery: t('settings.deliveryStatus'),
                system: t('settings.systemAlerts')
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {label}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[key as keyof typeof notifications]}
                      onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${currentTheme.accent}/25 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:${currentTheme.primary}`}></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h3 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
              <Shield className="w-5 h-5 mr-2" />
              {t('settings.privacy')}
            </h3>
            <div className={`p-4 ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg space-y-4`}>
              {Object.entries({
                profileVisible: t('settings.profileVisible'),
                activityTracking: t('settings.activityTracking'),
                dataSharing: t('settings.dataSharing')
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {label}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy[key as keyof typeof privacy]}
                      onChange={(e) => setPrivacy(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${currentTheme.accent}/25 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:${currentTheme.primary}`}></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* System Settings */}
          <div>
            <h3 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
              <Monitor className="w-5 h-5 mr-2" />
              {t('settings.system')}
            </h3>
            <div className={`p-4 ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg space-y-4`}>
              {Object.entries({
                autoSave: t('settings.autoSave'),
                soundEffects: t('settings.soundEffects'),
                animations: t('settings.animations'),
                compactMode: t('settings.compactMode')
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {label}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={system[key as keyof typeof system]}
                      onChange={(e) => setSystem(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${currentTheme.accent}/25 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:${currentTheme.primary}`}></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h3 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
              <Database className="w-5 h-5 mr-2" />
              {t('settings.dataManagement')}
            </h3>
            <div className={`p-4 ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className={`p-3 border-2 border-dashed rounded-lg transition-all duration-200 ${mode === 'dark' ? 'border-gray-600 hover:border-gray-500 text-gray-300' : 'border-gray-300 hover:border-gray-400 text-gray-600'}`}>
                  <Database className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{t('settings.exportData')}</span>
                </button>
                <button className={`p-3 border-2 border-dashed rounded-lg transition-all duration-200 ${mode === 'dark' ? 'border-gray-600 hover:border-gray-500 text-gray-300' : 'border-gray-300 hover:border-gray-400 text-gray-600'}`}>
                  <Wifi className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{t('settings.syncSettings')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
              {t('settings.themePreview')}
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-xl ${mode === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
              <div className="space-y-4">
                <div className={`p-4 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg shadow-md`}>
                  <h4 className="font-semibold">Sample Header</h4>
                  <p className="text-white/80">This is how your theme colors will look</p>
                </div>
                <div className={`p-4 ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg border ${mode === 'dark' ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
                  <h5 className="font-medium mb-2">Sample Content Card</h5>
                  <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    Your content will appear in this style with the selected theme and mode.
                  </p>
                  <button className={`mt-3 px-4 py-2 bg-gradient-to-r ${currentTheme.secondary} text-white rounded-lg text-sm hover:shadow-md transition-all duration-200`}>
                    Sample Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 ${mode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t`}>
          <div className="flex justify-between items-center">
            <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('settings.automaticallySaved')}
            </p>
            <button
              onClick={onClose}
              className={`px-6 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;