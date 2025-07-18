import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, ShoppingCart, Menu as MenuIcon, 
  Package, TrendingUp, Settings, LogOut, ChevronDown,
  UtensilsCrossed, Clock, MapPin, Star, CreditCard,
  BarChart3, Users2, Calendar, Bell, Moon, Sun, ChevronLeft, ChevronRight,
  Calculator, BookOpen, Heart, Truck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme, themes } from '../../contexts/ThemeContext';
import ProfileModal from '../modals/ProfileModal';
import SettingsModal from '../modals/SettingsModal';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  
  const { user, logout } = useAuth();
  const { theme, mode, toggleMode } = useTheme();
  const { t } = useTranslation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const currentTheme = themes[theme];

  const getRoleMenuItems = () => {
    const allMenuItems = {
      // Core modules available to all roles
      dashboard: { icon: LayoutDashboard, label: t('navigation.dashboard'), roles: ['admin', 'manager', 'waiter', 'cashier', 'kitchen', 'delivery', 'customer'] },
      
      // Role-specific items
      pos: { icon: Calculator, label: t('navigation.order'), roles: ['admin', 'manager', 'waiter', 'cashier'] },
      orders: { icon: ShoppingCart, label: t('navigation.orders'), roles: ['admin', 'manager', 'waiter', 'cashier', 'kitchen'] },
      reservations: { icon: BookOpen, label: t('navigation.reservations'), roles: ['admin', 'manager', 'waiter'] },
      menu: { icon: UtensilsCrossed, label: t('navigation.menu'), roles: ['admin', 'manager', 'kitchen'] },
      tables: { icon: Users2, label: t('navigation.tables'), roles: ['admin', 'manager', 'waiter'] },
      customers: { icon: Users, label: t('navigation.customers'), roles: ['admin', 'manager', 'waiter', 'cashier'] },
      delivery: { icon: MapPin, label: t('navigation.delivery'), roles: ['admin', 'manager', 'delivery'] },
      payments: { icon: CreditCard, label: t('navigation.payments'), roles: ['admin', 'manager', 'cashier'] },
      
      // Kitchen specific
      kitchen: { icon: Clock, label: t('navigation.kitchen'), roles: ['admin', 'manager', 'kitchen'] },
      
      // Customer specific
      favorites: { icon: Star, label: 'Favorites', roles: ['customer'] },
      myorders: { icon: Package, label: 'My Orders', roles: ['customer'] },
      
      // Management & Analytics (Admin only)
      staff: { icon: Users, label: t('navigation.staff'), roles: ['admin', 'manager'] },
      users: { icon: Users, label: t('navigation.users'), roles: ['admin'] },
      analytics: { icon: BarChart3, label: t('navigation.analytics'), roles: ['admin', 'manager'] },
      reports: { icon: TrendingUp, label: t('navigation.reports'), roles: ['admin', 'manager'] },
      inventory: { icon: Package, label: t('navigation.inventory'), roles: ['admin', 'manager', 'kitchen'] },
      loyalty: { icon: Heart, label: t('navigation.loyalty'), roles: ['admin', 'manager'] },
      suppliers: { icon: Truck, label: t('navigation.suppliers'), roles: ['admin', 'manager'] },
      accounting: { icon: Calculator, label: t('navigation.accounting'), roles: ['admin', 'manager'] },
      notifications: { icon: Bell, label: t('navigation.notifications'), roles: ['admin', 'manager'] }
    };

    return Object.entries(allMenuItems).filter(([_, item]) => 
      item.roles.includes(user?.role || 'customer')
    );
  };

  const menuItems = getRoleMenuItems();

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleDisplayName = () => {
    const roleNames = {
      admin: t('roles.admin'),
      manager: t('roles.manager'),
      waiter: t('roles.waiter'),
      cashier: t('roles.cashier'),
      kitchen: t('roles.kitchen'),
      delivery: t('roles.delivery'),
      customer: t('roles.customer')
    };
    return roleNames[user?.role as keyof typeof roleNames] || t('roles.customer');
  };

  const getActiveItemStyle = (itemKey: string) => {
    const isActive = activePage === itemKey;
    return isActive 
      ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg transform scale-105` 
      : `${mode === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`;
  };

  return (
    <>
      <div className={`${isCollapsed ? 'w-16' : 'w-72'} h-screen ${mode === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col transition-all duration-300 shadow-xl relative`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.primary} rounded-xl flex items-center justify-center shadow-lg`}>
                  <UtensilsCrossed className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    RestaurantPOS
                  </h1>
                  <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Management System
                  </p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="flex justify-center w-full">
                <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.primary} rounded-xl flex items-center justify-center shadow-lg`}>
                  <UtensilsCrossed className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 rounded-lg ${mode === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-all duration-200 hover:scale-110`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className={`flex items-center space-x-3 p-3 rounded-xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} transition-all duration-200`}>
              <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}>
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>
                  {user?.name}
                </p>
                <p className={`text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                  {getRoleDisplayName()}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => setShowProfileModal(true)}
                className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${
                  mode === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                } border ${mode === 'dark' ? 'border-gray-600' : 'border-gray-200'} shadow-sm hover:shadow-md`}
              >
                Profile Settings
              </button>
              <button
                onClick={toggleMode}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  mode === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                } border ${mode === 'dark' ? 'border-gray-600' : 'border-gray-200'} shadow-sm hover:shadow-md`}
              >
                {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Collapsed Profile Section */}
        {isCollapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center space-y-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center text-white font-semibold shadow-lg group relative`}>
                {getUserInitials()}
                <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {user?.name} ({getRoleDisplayName()})
                </div>
              </div>
              <button
                onClick={toggleMode}
                className={`p-2 rounded-lg transition-all duration-200 group relative ${
                  mode === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                } border ${mode === 'dark' ? 'border-gray-600' : 'border-gray-200'} shadow-sm hover:shadow-md`}
              >
                {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <div className="absolute left-12 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {!isCollapsed && (
              <div className={`text-xs font-semibold ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-4`}>
                {['admin', 'manager'].includes(user?.role || '') ? 'Management Console' : 'Quick Access'}
              </div>
            )}
            
            {menuItems.map(([key, item]) => {
              const Icon = item.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActivePage(key)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${getActiveItemStyle(key)}`}
                >
                  <Icon className={`w-5 h-5 ${activePage === key ? 'text-white' : ''} transition-colors`} />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-16 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap shadow-lg">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {!isCollapsed ? (
            <>
              <button
                onClick={() => setShowSettingsModal(true)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  mode === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>{t('navigation.settings')}</span>
              </button>
              
              <button
                onClick={handleLogout}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  mode === 'dark' 
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                    : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span>{t('auth.signOut')}</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => setShowSettingsModal(true)}
                className={`p-3 rounded-xl font-medium transition-all duration-200 group relative ${
                  mode === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {t('navigation.settings')}
                </div>
              </button>
              
              <button
                onClick={handleLogout}
                className={`p-3 rounded-xl font-medium transition-all duration-200 group relative ${
                  mode === 'dark' 
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                    : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {t('auth.signOut')}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
};

export default Sidebar;