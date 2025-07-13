import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Eye, EyeOff } from 'lucide-react';
import { useAuth, User } from '../../contexts/AuthContext';
import { useTheme, themes } from '../../contexts/ThemeContext';

const UserManagement: React.FC = () => {
  const { users, createUser, updateUser, deleteUser } = useAuth();
  const { theme, mode } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showPassword, setShowPassword] = useState(false);
  
  const currentTheme = themes[theme];

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    role: 'waiter' as User['role'],
    isActive: true,
    department: '',
    address: '',
    dateOfBirth: ''
  });

  const roles = [
    { value: 'admin', label: 'Administrator', icon: '👑' },
    { value: 'waiter', label: 'Waiter', icon: '🍽️' },
    { value: 'cashier', label: 'Cashier', icon: '💰' },
    { value: 'kitchen', label: 'Kitchen Staff', icon: '👨‍🍳' },
    { value: 'delivery', label: 'Delivery Driver', icon: '🚚' },
    { value: 'customer', label: 'Customer', icon: '👤' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      role: 'waiter',
      isActive: true,
      department: '',
      address: '',
      dateOfBirth: ''
    });
  };

  const handleCreate = () => {
    createUser(formData);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      department: user.department || '',
      address: user.address || '',
      dateOfBirth: user.dateOfBirth || ''
    });
  };

  const handleUpdate = () => {
    if (editingUser) {
      updateUser(editingUser.id, formData);
      setEditingUser(null);
      resetForm();
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleInfo = (role: string) => {
    return roles.find(r => r.value === role) || roles[1];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            User Management
          </h1>
          <p className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Manage system users and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105`}
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters */}
      <div className={`p-6 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                  mode === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className={`w-5 h-5 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                mode === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const roleInfo = getRoleInfo(user.role);
          return (
            <div
              key={user.id}
              className={`p-6 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}>
                    {getUserInitials(user.name)}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg">{roleInfo.icon}</span>
                      <span className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {roleInfo.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-medium">Phone:</span> {user.phone}
                </p>
                <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-medium">Username:</span> {user.username}
                </p>
                {user.department && (
                  <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="font-medium">Department:</span> {user.department}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r ${currentTheme.secondary} text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200`}
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-2xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}>
            <div className={`px-6 py-4 bg-gradient-to-r ${currentTheme.primary} text-white`}>
              <h2 className="text-xl font-bold">Create New User</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                      mode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${mode === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.icon} {role.label}
                    </option>
                  ))}
                </select>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className={`px-6 py-2 border rounded-lg font-medium transition-colors ${
                    mode === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className={`px-6 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-2xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}>
            <div className={`px-6 py-4 bg-gradient-to-r ${currentTheme.primary} text-white`}>
              <h2 className="text-xl font-bold">Edit User</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                      mode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${mode === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.icon} {role.label}
                    </option>
                  ))}
                </select>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className={`w-4 h-4 text-${currentTheme.accent} border-gray-300 rounded focus:ring-${currentTheme.accent}`}
                />
                <label htmlFor="isActive" className={`text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Active User
                </label>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setEditingUser(null);
                    resetForm();
                  }}
                  className={`px-6 py-2 border rounded-lg font-medium transition-colors ${
                    mode === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className={`px-6 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
                >
                  Update User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;