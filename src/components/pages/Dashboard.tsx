import React from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign, Clock, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme, themes } from '../../contexts/ThemeContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme, mode } = useTheme();
  const currentTheme = themes[theme];

  const getDashboardData = () => {
    const roleData = {
      admin: {
        title: 'Admin Dashboard',
        metrics: [
          { icon: DollarSign, label: 'Today\'s Revenue', value: '$2,847', trend: '+12%' },
          { icon: ShoppingCart, label: 'Orders Today', value: '156', trend: '+8%' },
          { icon: Users, label: 'Active Staff', value: '12', trend: '+2%' },
          { icon: Star, label: 'Avg Rating', value: '4.8', trend: '+0.2%' }
        ]
      },
      waiter: {
        title: 'Waiter Dashboard',
        metrics: [
          { icon: ShoppingCart, label: 'My Orders', value: '23', trend: '+5%' },
          { icon: Users, label: 'Tables Served', value: '8', trend: '+3%' },
          { icon: Clock, label: 'Avg Service Time', value: '12m', trend: '-2m' },
          { icon: Star, label: 'Customer Rating', value: '4.9', trend: '+0.1%' }
        ]
      },
      cashier: {
        title: 'Cashier Dashboard',
        metrics: [
          { icon: DollarSign, label: 'Transactions', value: '$1,245', trend: '+15%' },
          { icon: ShoppingCart, label: 'Orders Processed', value: '45', trend: '+8%' },
          { icon: Clock, label: 'Avg Processing', value: '2.5m', trend: '-30s' },
          { icon: Users, label: 'Customers Served', value: '67', trend: '+12%' }
        ]
      },
      kitchen: {
        title: 'Kitchen Dashboard',
        metrics: [
          { icon: ShoppingCart, label: 'Orders Pending', value: '12', trend: '-3' },
          { icon: Clock, label: 'Avg Prep Time', value: '18m', trend: '-2m' },
          { icon: TrendingUp, label: 'Orders Completed', value: '89', trend: '+15%' },
          { icon: Star, label: 'Food Quality', value: '4.7', trend: '+0.3%' }
        ]
      },
      delivery: {
        title: 'Delivery Dashboard',
        metrics: [
          { icon: ShoppingCart, label: 'Deliveries Today', value: '18', trend: '+6%' },
          { icon: Clock, label: 'Avg Delivery Time', value: '28m', trend: '-5m' },
          { icon: DollarSign, label: 'Tips Earned', value: '$125', trend: '+20%' },
          { icon: Star, label: 'Delivery Rating', value: '4.8', trend: '+0.2%' }
        ]
      },
      customer: {
        title: 'My Account',
        metrics: [
          { icon: ShoppingCart, label: 'Orders This Month', value: '12', trend: '+3' },
          { icon: DollarSign, label: 'Total Spent', value: '$342', trend: '+$45' },
          { icon: Star, label: 'Favorite Items', value: '8', trend: '+2' },
          { icon: Clock, label: 'Avg Order Time', value: '25m', trend: '-3m' }
        ]
      }
    };

    return roleData[user?.role || 'customer'];
  };

  const dashboardData = getDashboardData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {dashboardData.title}
          </h1>
          <p className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Welcome back, {user?.name}! Here's what's happening today.
          </p>
        </div>
        <div className={`px-4 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg shadow-lg`}>
          <span className="text-sm font-medium">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className={`p-6 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${currentTheme.primary} rounded-lg shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  metric.trend.startsWith('+') 
                    ? 'bg-green-100 text-green-800' 
                    : metric.trend.startsWith('-') && metric.trend.includes('m')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {metric.trend}
                </span>
              </div>
              <h3 className={`text-2xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>
                {metric.value}
              </h3>
              <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {metric.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Role-specific content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className={`p-6 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg`}>
          <h3 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { action: 'Order #1234 completed', time: '5 minutes ago', status: 'success' },
              { action: 'New customer registered', time: '12 minutes ago', status: 'info' },
              { action: 'Payment processed', time: '18 minutes ago', status: 'success' },
              { action: 'Table 5 reserved', time: '25 minutes ago', status: 'warning' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {activity.action}
                  </p>
                  <p className={`text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`p-6 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg`}>
          <h3 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {user?.role === 'admin' && [
              { label: 'Add User', action: 'user-management' },
              { label: 'View Reports', action: 'reports' },
              { label: 'Manage Menu', action: 'menu' },
              { label: 'Settings', action: 'settings' }
            ].map((action, index) => (
              <button
                key={index}
                className={`p-3 bg-gradient-to-r ${currentTheme.secondary} text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200 hover:scale-105`}
              >
                {action.label}
              </button>
            ))}
            
            {user?.role === 'waiter' && [
              { label: 'New Order', action: 'orders' },
              { label: 'Table Status', action: 'tables' },
              { label: 'Menu Items', action: 'menu' },
              { label: 'Customer Info', action: 'customers' }
            ].map((action, index) => (
              <button
                key={index}
                className={`p-3 bg-gradient-to-r ${currentTheme.secondary} text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200 hover:scale-105`}
              >
                {action.label}
              </button>
            ))}

            {['cashier', 'kitchen', 'delivery', 'customer'].includes(user?.role || '') && [
              { label: 'View Orders', action: 'orders' },
              { label: 'Quick Actions', action: 'quick' },
              { label: 'Help & Support', action: 'help' },
              { label: 'Profile', action: 'profile' }
            ].map((action, index) => (
              <button
                key={index}
                className={`p-3 bg-gradient-to-r ${currentTheme.secondary} text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200 hover:scale-105`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;