import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme, themes } from '../../contexts/ThemeContext';

interface DefaultPageProps {
  pageName: string;
}

const DefaultPage: React.FC<DefaultPageProps> = ({ pageName }) => {
  const { user } = useAuth();
  const { theme, mode } = useTheme();
  const currentTheme = themes[theme];

  const getPageDescription = () => {
    const descriptions: { [key: string]: string } = {
      orders: 'Manage and track restaurant orders',
      menu: 'Manage menu items and categories',
      tables: 'Manage table reservations and status',
      customers: 'View and manage customer information',
      delivery: 'Track delivery orders and routes',
      payments: 'Process payments and view transaction history',
      kitchen: 'View kitchen queue and order preparation',
      favorites: 'Your favorite menu items',
      myorders: 'Your order history and tracking',
      analytics: 'Business analytics and insights',
      reports: 'Generate and view business reports',
      inventory: 'Manage inventory and stock levels',
      schedules: 'Manage staff schedules',
      notifications: 'System notifications and alerts'
    };

    return descriptions[pageName] || 'Page content coming soon';
  };

  const getPageIcon = () => {
    const icons: { [key: string]: string } = {
      orders: '🛒',
      menu: '🍽️',
      tables: '🪑',
      customers: '👥',
      delivery: '🚚',
      payments: '💳',
      kitchen: '👨‍🍳',
      favorites: '⭐',
      myorders: '📦',
      analytics: '📊',
      reports: '📈',
      inventory: '📦',
      schedules: '📅',
      notifications: '🔔'
    };

    return icons[pageName] || '📄';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">{getPageIcon()}</div>
        <h1 className={`text-3xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
          {pageName.charAt(0).toUpperCase() + pageName.slice(1)}
        </h1>
        <p className={`text-lg ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {getPageDescription()}
        </p>
      </div>

      {/* Content Card */}
      <div className={`p-8 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg text-center`}>
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-2xl shadow-lg mb-6`}>
          <span className="text-2xl">{getPageIcon()}</span>
        </div>
        
        <h2 className={`text-2xl font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
          {pageName.charAt(0).toUpperCase() + pageName.slice(1)} Module
        </h2>
        
        <p className={`text-lg ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
          This feature is currently under development. Stay tuned for exciting updates!
        </p>

        <div className={`p-6 ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
          <h3 className={`text-lg font-medium ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>
            Coming Soon Features:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            {pageName === 'orders' && [
              '• Real-time order tracking',
              '• Order status management',
              '• Customer notifications',
              '• Payment processing'
            ].map((feature, index) => (
              <div key={index} className={`flex items-center space-x-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>{feature}</span>
              </div>
            ))}
            
            {pageName === 'menu' && [
              '• Menu item management',
              '• Category organization',
              '• Price management',
              '• Availability controls'
            ].map((feature, index) => (
              <div key={index} className={`flex items-center space-x-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>{feature}</span>
              </div>
            ))}

            {pageName === 'analytics' && [
              '• Sales analytics',
              '• Customer insights',
              '• Performance metrics',
              '• Revenue tracking'
            ].map((feature, index) => (
              <div key={index} className={`flex items-center space-x-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>{feature}</span>
              </div>
            ))}

            {!['orders', 'menu', 'analytics'].includes(pageName) && [
              '• Advanced functionality',
              '• Real-time updates',
              '• User-friendly interface',
              '• Mobile optimization'
            ].map((feature, index) => (
              <div key={index} className={`flex items-center space-x-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button className={`px-6 py-3 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105`}>
            Request Feature Update
          </button>
        </div>
      </div>

      {/* Role-specific message */}
      <div className={`p-4 ${mode === 'dark' ? 'bg-gray-700' : 'bg-blue-50'} border border-blue-200 rounded-lg`}>
        <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-blue-800'}`}>
          <strong>Note for {user?.role}s:</strong> This page will be customized specifically for your role with relevant tools and information.
        </p>
      </div>
    </div>
  );
};

export default DefaultPage;