import React, { useState } from 'react';
import { X, Bell, Check, Trash2, Filter, Search } from 'lucide-react';
import { useTheme, themes } from '../../contexts/ThemeContext';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'payment' | 'kitchen' | 'schedule' | 'inventory';
  unread: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, notifications }) => {
  const { theme, mode } = useTheme();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationList, setNotificationList] = useState(notifications);

  const currentTheme = themes[theme];

  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    const icons = {
      order: '🛒',
      payment: '💳',
      kitchen: '👨‍🍳',
      schedule: '📅',
      inventory: '📦'
    };
    return icons[type as keyof typeof icons] || '🔔';
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      order: 'bg-blue-100 text-blue-800',
      payment: 'bg-green-100 text-green-800',
      kitchen: 'bg-orange-100 text-orange-800',
      schedule: 'bg-purple-100 text-purple-800',
      inventory: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredNotifications = notificationList.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markAsRead = (id: number) => {
    setNotificationList(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotificationList(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notificationList.filter(n => n.unread).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-2xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className={`px-6 py-4 bg-gradient-to-r ${currentTheme.primary} text-white flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Notifications</h2>
              <p className="text-white/80 text-sm">
                {unreadCount} unread notifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className={`w-4 h-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                  mode === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Types</option>
                <option value="order">Orders</option>
                <option value="payment">Payments</option>
                <option value="kitchen">Kitchen</option>
                <option value="schedule">Schedule</option>
                <option value="inventory">Inventory</option>
              </select>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${currentTheme.secondary} text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200`}
              >
                <Check className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className={`w-12 h-12 mx-auto mb-4 ${mode === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-lg font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                No notifications found
              </p>
              <p className={`text-sm ${mode === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                {searchTerm ? 'Try adjusting your search or filter' : 'You\'re all caught up!'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {notification.title}
                            </h4>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-3">
                            <span className={`text-xs ${mode === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              {notification.time}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                              {notification.type}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {notification.unread && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                mode === 'dark' 
                                  ? 'hover:bg-gray-600 text-gray-400 hover:text-white' 
                                  : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                              }`}
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className={`p-1 rounded-lg transition-colors ${
                              mode === 'dark' 
                                ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300' 
                                : 'hover:bg-red-50 text-red-500 hover:text-red-700'
                            }`}
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 ${mode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t`}>
          <div className="flex justify-between items-center">
            <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredNotifications.length} of {notificationList.length} notifications
            </p>
            <button
              onClick={onClose}
              className={`px-4 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;