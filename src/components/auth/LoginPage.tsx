import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, ChefHat } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme, themes } from '../../contexts/ThemeContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { theme, mode } = useTheme();
  const currentTheme = themes[theme];

  const demoCredentials = [
    { role: 'Admin', username: 'Admin123', password: 'Admin@123', icon: '👑' },
    { role: 'Waiter', username: 'Waiter123', password: 'Waiter@123', icon: '🍽️' },
    { role: 'Cashier', username: 'Cashier123', password: 'Cashier@123', icon: '💰' },
    { role: 'Kitchen', username: 'Kitchen123', password: 'Kitchen@123', icon: '👨‍🍳' },
    { role: 'Delivery', username: 'Delivery123', password: 'Delivery@123', icon: '🚚' },
    { role: 'Customer', username: 'Customer123', password: 'Customer@123', icon: '👤' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = login(username, password);
    
    if (!success) {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  const fillDemoCredentials = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${
      mode === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-20 w-72 h-72 bg-gradient-to-r ${currentTheme.primary} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse`}></div>
        <div className={`absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r ${currentTheme.secondary} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r ${currentTheme.primary} rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500`}></div>
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Demo Credentials */}
          <div className={`${mode === 'dark' ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-lg rounded-2xl p-8 border ${mode === 'dark' ? 'border-gray-700/50' : 'border-white/50'} shadow-2xl`}>
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-2xl shadow-lg mb-4`}>
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                Demo Credentials
              </h2>
              <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Click any role to auto-fill login credentials
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoCredentials.map((demo) => (
                <button
                  key={demo.role}
                  onClick={() => fillDemoCredentials(demo.username, demo.password)}
                  className={`group p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    mode === 'dark'
                      ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 hover:border-gray-500'
                      : 'bg-white/50 border-gray-200 hover:bg-white/70 hover:border-gray-300'
                  } hover:shadow-lg`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{demo.icon}</span>
                    <div className="text-left">
                      <div className={`font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {demo.role}
                      </div>
                      <div className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {demo.username}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className={`${mode === 'dark' ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-lg rounded-2xl p-8 border ${mode === 'dark' ? 'border-gray-700/50' : 'border-white/50'} shadow-2xl`}>
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-2xl shadow-lg mb-4`}>
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h1 className={`text-3xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                Restaurant POS
              </h1>
              <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Username
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                        mode === 'dark'
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                        mode === 'dark'
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${mode === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-gradient-to-r ${currentTheme.primary} text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className={`mt-6 text-center text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Use demo credentials above or contact your administrator for access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;