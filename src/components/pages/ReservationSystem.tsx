import React, { useState } from 'react';
import { Calendar, Clock, Users, Phone, Mail, Plus, Search, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme, themes } from '../../contexts/ThemeContext';

interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  guests: number;
  tableNumber?: number;
  status: 'confirmed' | 'pending' | 'seated' | 'completed' | 'cancelled';
  specialRequests?: string;
}

const ReservationSystem: React.FC = () => {
  const { t } = useTranslation();
  const { theme, mode } = useTheme();
  const currentTheme = themes[theme];
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: '1',
      customerName: 'አበበ ከበደ',
      customerPhone: '+251911123456',
      customerEmail: 'abebe@email.com',
      date: '2024-01-15',
      time: '19:00',
      guests: 4,
      tableNumber: 5,
      status: 'confirmed',
      specialRequests: 'Window seat preferred'
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      customerPhone: '+251922234567',
      customerEmail: 'sarah@email.com',
      date: '2024-01-15',
      time: '20:30',
      guests: 2,
      status: 'pending'
    },
    {
      id: '3',
      customerName: 'ሙሉጌታ ተስፋዬ',
      customerPhone: '+251933345678',
      customerEmail: 'mulugeta@email.com',
      date: '2024-01-16',
      time: '18:30',
      guests: 6,
      tableNumber: 8,
      status: 'seated'
    }
  ]);

  const [newReservation, setNewReservation] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });

  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    seated: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    const matchesDate = !selectedDate || reservation.date === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleCreateReservation = () => {
    const reservation: Reservation = {
      id: Date.now().toString(),
      ...newReservation,
      status: 'pending'
    };
    setReservations(prev => [...prev, reservation]);
    setNewReservation({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      date: '',
      time: '',
      guests: 2,
      specialRequests: ''
    });
    setShowNewReservation(false);
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations(prev => prev.map(res => res.id === id ? { ...res, status } : res));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('navigation.reservations')}
          </h1>
          <p className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Manage table reservations and bookings
          </p>
        </div>
        <button
          onClick={() => setShowNewReservation(true)}
          className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105`}
        >
          <Plus className="w-5 h-5" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Filters */}
      <div className={`p-6 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search reservations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                mode === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                mode === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className={`w-5 h-5 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                mode === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="seated">Seated</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="text-center">
            <div className={`text-2xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {filteredReservations.length}
            </div>
            <div className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Reservations
            </div>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReservations.map((reservation) => (
          <div
            key={reservation.id}
            className={`p-6 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {reservation.customerName}
                </h3>
                <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Reservation #{reservation.id}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[reservation.status]}`}>
                {reservation.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-3">
                <Calendar className={`w-4 h-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {new Date(reservation.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className={`w-4 h-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {reservation.time}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className={`w-4 h-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {reservation.guests} guests
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className={`w-4 h-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {reservation.customerPhone}
                </span>
              </div>
              {reservation.tableNumber && (
                <div className="flex items-center space-x-3">
                  <span className={`w-4 h-4 text-center text-xs font-bold ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    T
                  </span>
                  <span className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Table {reservation.tableNumber}
                  </span>
                </div>
              )}
            </div>

            {reservation.specialRequests && (
              <div className={`p-3 ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg mb-4`}>
                <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Special Requests:</strong> {reservation.specialRequests}
                </p>
              </div>
            )}

            <div className="flex space-x-2">
              {reservation.status === 'pending' && (
                <button
                  onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                  className={`flex-1 py-2 px-3 bg-gradient-to-r ${currentTheme.secondary} text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200`}
                >
                  Confirm
                </button>
              )}
              {reservation.status === 'confirmed' && (
                <button
                  onClick={() => updateReservationStatus(reservation.id, 'seated')}
                  className={`flex-1 py-2 px-3 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200`}
                >
                  Seat
                </button>
              )}
              {reservation.status === 'seated' && (
                <button
                  onClick={() => updateReservationStatus(reservation.id, 'completed')}
                  className="flex-1 py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200"
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Reservation Modal */}
      {showNewReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-2xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}>
            <div className={`px-6 py-4 bg-gradient-to-r ${currentTheme.primary} text-white`}>
              <h2 className="text-xl font-bold">New Reservation</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newReservation.customerName}
                  onChange={(e) => setNewReservation({ ...newReservation, customerName: e.target.value })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newReservation.customerPhone}
                  onChange={(e) => setNewReservation({ ...newReservation, customerPhone: e.target.value })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newReservation.customerEmail}
                  onChange={(e) => setNewReservation({ ...newReservation, customerEmail: e.target.value })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <input
                  type="number"
                  placeholder="Number of Guests"
                  min="1"
                  max="20"
                  value={newReservation.guests}
                  onChange={(e) => setNewReservation({ ...newReservation, guests: parseInt(e.target.value) })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <input
                  type="date"
                  value={newReservation.date}
                  onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="time"
                  value={newReservation.time}
                  onChange={(e) => setNewReservation({ ...newReservation, time: e.target.value })}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <textarea
                placeholder="Special Requests (optional)"
                value={newReservation.specialRequests}
                onChange={(e) => setNewReservation({ ...newReservation, specialRequests: e.target.value })}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                  mode === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowNewReservation(false)}
                  className={`px-6 py-2 border rounded-lg font-medium transition-colors ${
                    mode === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReservation}
                  className={`px-6 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
                >
                  Create Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationSystem;