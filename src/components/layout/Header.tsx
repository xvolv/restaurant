import React, { useState } from 'react';
import { Bell, Search, User, Settings, LogOut, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme, themes } from '../../contexts/ThemeContext';
import LanguageSelector from '../common/LanguageSelector';
import ProfileModal from '../modals/ProfileModal';
import NotificationModal from '../modals/NotificationModal';

interface HeaderProps {
  activePage: string;
}

const Header: React.FC<HeaderProps> = ({ activePage }) => {
  const { user, logout } = useAuth();
  const { theme, mode } = useTheme();
  const { t } = useTranslation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentTheme = themes[theme];

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPageTitle = () => {
    const titles: { [key: string]: string } = {
      dashboard: t('navigation.dashboard'),
      orders: t('navigation.orders'),
      menu: t('navigation.menu'),
      tables: t('navigation.tables'),
      customers: t('navigation.customers'),
      delivery: t('navigation.delivery'),
      payments: t('navigation.payments'),
      kitchen: t('navigation.kitchen'),
      inventory: t('navigation.inventory'),
      users: t('navigation.users'),
      analytics: t('navigation.analytics'),
      reports: t('navigation.reports'),
      pos: t('navigation.order'),
      reservations: t('navigation.reservations'),
      staff: t('navigation.staff'),
      loyalty: t('navigation.loyalty'),
      suppliers: t('navigation.suppliers'),
      accounting: t('navigation.accounting'),
      notifications: t('navigation.notifications')
    };
    return titles[activePage] || t('navigation.dashboard');
  };

  const notifications = [
    { id: 1, title: 'New Order #1234', message: 'Table 5 placed a new order', time: '2 min ago', type: 'order', unread: true },
    { id: 2, title: 'Payment Received', message: 'Order #1233 payment confirmed', time: '5 min ago', type: 'payment', unread: true },
    { id: 3, title: 'Kitchen Alert', message: 'Order #1232 ready for pickup', time: '8 min ago', type: 'kitchen', unread: false },
    { id: 4, title: 'Staff Schedule', message: 'Tomorrow\'s schedule updated', time: '1 hour ago', type: 'schedule', unread: false },
    { id: 5, title: 'Inventory Alert', message: 'Low stock: Chicken Breast', time: '2 hours ago', type: 'inventory', unread: true }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className={`h-16 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center justify-between px-6 shadow-sm`}>
        {/* Left Section - Page Title */}
        <div className="flex items-center space-x-4">
          <h1 className={`text-xl font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {getPageTitle()}
          </h1>
          <div className={`px-3 py-1 bg-gradient-to-r ${currentTheme.primary} text-white rounded-full text-xs font-medium`}>
            {user?.role?.toUpperCase()}
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder={t('common.search') + "..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                mode === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationModal(true)}
              className={`relative p-2 rounded-lg transition-colors ${
                mode === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium`}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                mode === 'dark' 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className={`w-8 h-8 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                {getUserInitials()}
              </div>
              <div className="text-left hidden md:block">
                <p className={`text-sm font-medium ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name}
                </p>
                <p className={`text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user?.role}
                </p>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div className={`absolute right-0 mt-2 w-64 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg z-50`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center text-white font-semibold`}>
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className={`font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {user?.name}
                      </p>
                      <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <div className="space-y-1 mb-3">
                    <div className={`flex items-center space-x-2 px-3 py-2 text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Phone className="w-4 h-4" />
                      <span>{user?.phone}</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-2 text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <MapPin className="w-4 h-4" />
                      <span>{user?.department}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowProfileDropdown(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      mode === 'dark' 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileDropdown(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      mode === 'dark' 
                        ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                        : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
      />

      {/* Overlay for dropdown */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </>
  );
};

export default Header;