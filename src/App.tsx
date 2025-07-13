import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LoginPage from './components/auth/LoginPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/pages/Dashboard';
import UserManagement from './components/pages/UserManagement';
import DefaultPage from './components/pages/DefaultPage';
import OrderSystem from './components/pages/OrderSystem';
import ReservationSystem from './components/pages/ReservationSystem';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { mode } = useTheme();
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState('dashboard');
  const dashboardTitle = t('dashboard.title');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className={`flex h-screen ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activePage={activePage} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {(() => {
              switch (activePage) {
                case 'dashboard':
                  return <Dashboard />;
                case 'users':
                  return user?.role === 'admin' ? <UserManagement /> : <DefaultPage pageName="users" />;
                case 'pos':
                  return <OrderSystem />;
                case 'reservations':
                  return <ReservationSystem />;
                default:
                  return <DefaultPage pageName={activePage} />;
              }
            })()}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;