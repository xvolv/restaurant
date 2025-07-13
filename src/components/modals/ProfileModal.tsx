import React, { useState } from 'react';
import { X, Edit3, Save, User, Mail, Phone, MapPin, Calendar, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme, themes } from '../../contexts/ThemeContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { theme, mode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
    department: user?.department || ''
  });

  const currentTheme = themes[theme];

  if (!isOpen) return null;

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      dateOfBirth: user?.dateOfBirth || '',
      department: user?.department || ''
    });
    setIsEditing(false);
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleDisplayName = () => {
    const roleNames = {
      admin: 'Administrator',
      waiter: 'Waiter',
      cashier: 'Cashier',
      kitchen: 'Kitchen Staff',
      delivery: 'Delivery Driver',
      customer: 'Customer'
    };
    return roleNames[user?.role || 'customer'];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-2xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className={`px-6 py-4 bg-gradient-to-r ${currentTheme.primary} text-white`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Profile Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6 mb-8">
            <div className={`w-20 h-20 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
              {getUserInitials()}
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user?.name}
              </h3>
              <p className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {getRoleDisplayName()}
              </p>
              <p className={`text-sm ${mode === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Member since {new Date(user?.createdAt || '').toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } ${isEditing ? 'focus:ring-2 focus:ring-blue-500' : 'cursor-not-allowed opacity-75'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } ${isEditing ? 'focus:ring-2 focus:ring-blue-500' : 'cursor-not-allowed opacity-75'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } ${isEditing ? 'focus:ring-2 focus:ring-blue-500' : 'cursor-not-allowed opacity-75'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <Building className="w-4 h-4 inline mr-2" />
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } ${isEditing ? 'focus:ring-2 focus:ring-blue-500' : 'cursor-not-allowed opacity-75'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } ${isEditing ? 'focus:ring-2 focus:ring-blue-500' : 'cursor-not-allowed opacity-75'}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <MapPin className="w-4 h-4 inline mr-2" />
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                  mode === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                } ${isEditing ? 'focus:ring-2 focus:ring-blue-500' : 'cursor-not-allowed opacity-75'}`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className={`px-6 py-2 border rounded-lg font-medium transition-colors ${
                    mode === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`px-6 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2`}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={`px-6 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;