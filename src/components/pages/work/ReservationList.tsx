import React from "react";
import { Calendar, Clock, Users, Phone, MapPin, Edit } from "lucide-react";

interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  guests: number;
  tableNumber?: number;
  status: "confirmed" | "pending" | "seated" | "completed" | "cancelled";
  specialRequests?: string;
  estimatedDuration?: number;
}

interface ReservationListProps {
  reservations: Reservation[];
  filteredReservations: Reservation[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  selectedDate: string;
  setSelectedDate: (val: string) => void;
  mode: string;
  currentTheme: any;
  openEditModal: (reservation: Reservation) => void;
  updateReservationStatus: (id: string, status: Reservation["status"]) => void;
  setCheckInReservation: (reservation: Reservation) => void;
  setShowCheckInModal: (show: boolean) => void;
}

const statusColors = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  seated: "bg-blue-100 text-blue-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const ReservationList: React.FC<ReservationListProps> = ({
  filteredReservations,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  selectedDate,
  setSelectedDate,
  mode,
  currentTheme,
  openEditModal,
  updateReservationStatus,
  setCheckInReservation,
  setShowCheckInModal,
}) => (
  <>
    {/* Filters */}
    <div
      className={`p-6 ${
        mode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      } border rounded-xl shadow-lg`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search reservations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
              currentTheme.accent
            } focus:border-transparent transition-all duration-200 ${
              mode === "dark"
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            style={{ paddingLeft: 40 }}
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>
        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
              currentTheme.accent
            } focus:border-transparent transition-all duration-200 ${
              mode === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-50 border-gray-300 text-gray-900"
            }`}
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
              currentTheme.accent
            } focus:border-transparent transition-all duration-200 ${
              mode === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-50 border-gray-300 text-gray-900"
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
          <div
            className={`text-2xl font-bold ${
              mode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {filteredReservations.length}
          </div>
          <div
            className={`text-sm ${
              mode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Reservations
          </div>
        </div>
      </div>
    </div>

    {/* Reservations List */}
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
      {filteredReservations.map((reservation) => (
        <div
          key={reservation.id}
          className={`p-6 ${
            mode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3
                className={`font-semibold ${
                  mode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {reservation.customerName}
              </h3>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Reservation #{reservation.id}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  statusColors[reservation.status]
                }`}
              >
                {reservation.status.charAt(0).toUpperCase() +
                  reservation.status.slice(1)}
              </span>
              <button
                onClick={() => openEditModal(reservation)}
                className={`p-1 rounded-full hover:bg-gray-100 ${
                  mode === "dark" ? "hover:bg-gray-700" : ""
                } transition-colors`}
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-3">
              <Calendar
                className={`w-4 h-4 ${
                  mode === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {new Date(reservation.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock
                className={`w-4 h-4 ${
                  mode === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {reservation.time} ({reservation.estimatedDuration}min)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Users
                className={`w-4 h-4 ${
                  mode === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {reservation.guests} guests
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone
                className={`w-4 h-4 ${
                  mode === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {reservation.customerPhone}
              </span>
            </div>
            {reservation.tableNumber && (
              <div className="flex items-center space-x-3">
                <MapPin
                  className={`w-4 h-4 ${
                    mode === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    mode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Table {reservation.tableNumber}
                </span>
              </div>
            )}
          </div>
          {reservation.specialRequests && (
            <div
              className={`p-3 mb-4 flex items-center gap-2 border-l-4 ${
                mode === "dark"
                  ? "bg-yellow-900 border-yellow-500"
                  : "bg-yellow-100 border-yellow-500"
              } rounded`}
            >
              <span
                role="img"
                aria-label="Special Request"
                className="text-yellow-500 text-lg"
              >
                ⭐
              </span>
              <span
                className={`text-sm font-semibold ${
                  mode === "dark" ? "text-yellow-200" : "text-yellow-800"
                }`}
              >
                Special Request:
              </span>
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-yellow-100" : "text-yellow-700"
                }`}
              >
                {reservation.specialRequests}
              </span>
            </div>
          )}
          <div className="flex space-x-2">
            {reservation.status === "pending" && (
              <button
                onClick={() =>
                  updateReservationStatus(reservation.id, "confirmed")
                }
                className={`flex-1 py-2 px-3 bg-gradient-to-r ${currentTheme.secondary} text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200`}
              >
                Confirm
              </button>
            )}
            {reservation.status === "confirmed" && (
              <button
                onClick={() => {
                  setCheckInReservation(reservation);
                  setShowCheckInModal(true);
                }}
                className={`flex-1 py-2 px-3 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200`}
              >
                Check-In
              </button>
            )}
            {reservation.status === "seated" && (
              <button
                onClick={() =>
                  updateReservationStatus(reservation.id, "completed")
                }
                className="flex-1 py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200"
              >
                Complete
              </button>
            )}
            <button
              onClick={() =>
                updateReservationStatus(reservation.id, "cancelled")
              }
              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default ReservationList;
