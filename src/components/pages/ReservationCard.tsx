import React from "react";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  MapPin,
  Edit,
} from "lucide-react";
import { useTheme, themes } from "../../contexts/ThemeContext";
import { Reservation, statusColors } from "./types/Reservation";

interface ReservationCardProps {
  reservation: Reservation;
  mode: string;
  onEdit: (reservation: Reservation) => void;
  onStatusUpdate: (id: string, status: Reservation["status"]) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  mode,
  onEdit,
  onStatusUpdate,
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <div
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
            {reservation.status === "confirmed" && (
              <span title="Confirmed">✅</span>
            )}
            {reservation.status === "pending" && (
              <span title="Pending">⏳</span>
            )}
            {reservation.status === "cancelled" && (
              <span title="Cancelled">❌</span>
            )}
            {reservation.status === "seated" && (
              <span title="Seated">🪑</span>
            )}
            {reservation.status === "completed" && (
              <span title="Completed">✔️</span>
            )}
            {reservation.status.charAt(0).toUpperCase() +
              reservation.status.slice(1)}
          </span>
          <button
            onClick={() => onEdit(reservation)}
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
            onClick={() => onStatusUpdate(reservation.id, "confirmed")}
            className={`flex-1 py-2 px-3 bg-gradient-to-r ${currentTheme.secondary} text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200`}
          >
            Confirm
          </button>
        )}
        {reservation.status === "confirmed" && (
          <button
            onClick={() => onStatusUpdate(reservation.id, "seated")}
            className={`flex-1 py-2 px-3 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200`}
          >
            Seat
          </button>
        )}
        {reservation.status === "seated" && (
          <button
            onClick={() => onStatusUpdate(reservation.id, "completed")}
            className="flex-1 py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200"
          >
            Complete
          </button>
        )}
        <button
          onClick={() => onStatusUpdate(reservation.id, "cancelled")}
          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReservationCard;