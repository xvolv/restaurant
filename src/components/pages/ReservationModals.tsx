import React from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { useTheme, themes } from "../../contexts/ThemeContext";
import { Reservation, timeSlots } from "./types/reservation";

interface ReservationModalsProps {
  mode: string;
  // New Reservation Modal Props
  showNewReservation: boolean;
  setShowNewReservation: (show: boolean) => void;
  newReservation: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    time: string;
    guests: number;
    specialRequests: string;
  };
  setNewReservation: (reservation: any) => void;
  availableTimeSlotsForNewReservation: string[];
  handleCreateReservation: () => void;
  
  // Edit Reservation Modal Props
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  editingReservation: Reservation | null;
  setEditingReservation: (reservation: Reservation | null) => void;
  availableTimeSlotsForEdit: string[];
  handleEditReservation: () => void;
  
  // Confirmation Modal Props
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  lastCreatedReservation: Reservation | null;
  setLastCreatedReservation: (reservation: Reservation | null) => void;
}

const ReservationModals: React.FC<ReservationModalsProps> = ({
  mode,
  showNewReservation,
  setShowNewReservation,
  newReservation,
  setNewReservation,
  availableTimeSlotsForNewReservation,
  handleCreateReservation,
  showEditModal,
  setShowEditModal,
  editingReservation,
  setEditingReservation,
  availableTimeSlotsForEdit,
  handleEditReservation,
  showConfirmation,
  setShowConfirmation,
  lastCreatedReservation,
  setLastCreatedReservation,
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <>
      {/* New Reservation Modal */}
      {showNewReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-2xl ${
              mode === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div
              className={`px-6 py-4 bg-gradient-to-r ${currentTheme.primary} text-white`}
            >
              <h2 className="text-xl font-bold">New Reservation</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newReservation.customerName}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      customerName: e.target.value,
                    })
                  }
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                    currentTheme.accent
                  } focus:border-transparent transition-all duration-200 ${
                    mode === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newReservation.customerPhone}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      customerPhone: e.target.value,
                    })
                  }
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                    currentTheme.accent
                  } focus:border-transparent transition-all duration-200 ${
                    mode === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newReservation.customerEmail}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      customerEmail: e.target.value,
                    })
                  }
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                    currentTheme.accent
                  } focus:border-transparent transition-all duration-200 ${
                    mode === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <input
                  type="number"
                  placeholder="Number of Guests"
                  min="1"
                  max="20"
                  value={newReservation.guests}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      guests: parseInt(e.target.value),
                    })
                  }
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                    currentTheme.accent
                  } focus:border-transparent transition-all duration-200 ${
                    mode === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <input
                  type="date"
                  value={newReservation.date}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      date: e.target.value,
                    })
                  }
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                    currentTheme.accent
                  } focus:border-transparent transition-all duration-200 ${
                    mode === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />

                <select
                  value={newReservation.time}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      time: e.target.value,
                    })
                  }
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                    currentTheme.accent
                  } focus:border-transparent transition-all duration-200 ${
                    mode === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="" disabled>
                    Select a time
                  </option>
                  {availableTimeSlotsForNewReservation.length === 0 ? (
                    <option disabled>No available time slots</option>
                  ) : (
                    availableTimeSlotsForNewReservation.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {newReservation.date &&
                availableTimeSlotsForNewReservation.length === 0 && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 text-sm">
                      Fully booked for this date and party size. Please select a
                      different date or reduce party size.
                    </span>
                  </div>
                )}

              <textarea
                placeholder="Special Requests (optional)"
                value={newReservation.specialRequests}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    specialRequests: e.target.value,
                  })
                }
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                  currentTheme.accent
                } focus:border-transparent transition-all duration-200 ${
                  mode === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowNewReservation(false)}
                  className={`px-6 py-2 border rounded-lg font-medium transition-colors ${
                    mode === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReservation}
                  disabled={
                    !newReservation.customerName ||
                    !newReservation.customerPhone ||
                    !newReservation.date ||
                    !newReservation.time ||
                    availableTimeSlotsForNewReservation.length === 0
                  }
                  className={`px-6 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Create Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reservation Modal */}
      {showEditModal && editingReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-2xl ${
              mode === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div
              className={`px-6 py-4 bg-gradient-to-r ${currentTheme.primary} text-white flex items-center justify-between`}
            >
              <h2 className="text-xl font-bold">Edit Reservation</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={editingReservation.customerName}
                  onChange={(e) =>
                    setEditingReservation({
                      ...editingReservation,
                      customerName: e.target.value,
                    })
                  }
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                    currentTheme.accent
                  } focus:border-transparent transition-all duration-200 ${
                    mode === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={editingReservation.customerPhone}
                  onChange={(e) =>
                    setEditingReservation({
                      ...editingReservation,
                      customerPhone: e.target.value,
                    })
                  }
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                    currentTheme.accent
                  } focus:border-transparent transition-all duration-200 ${
                    mode === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={editingReservation.customerEmail}
                  onChange={(e) =>
                    setEditingReservation({
                      ...editingReservation,
                      customerEmail: e.target.value,
                    })
                  }
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                    currentTheme.accent
                  } focus:border-transparent transition-all duration-200 ${
                    mode === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <input
                  type="number"
                  placeholder="Number of Guests"
                  min="1"
                  max="20"
                  value={editingReservation.guests}
                  onChange={(e) =>
                    setEditingReservation({
                      ...editingReservation,
                      guests: parseInt(e.target.value),
                    })
                  }
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                    currentTheme.accent
                  } focus:border-transparent transition-all duration-200 ${
                    mode === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <input
                  type="date"
                  value={editingReservation.date}
                  onChange={(e) =>
                    setEditingReservation({
                      ...editingReservation,
                      date: e.target.value,
                    })
                  }
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                    currentTheme.accent
                  } focus:border-transparent transition-all duration-200 ${
                    mode === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />

                <select
                  value={editingReservation.time}
                  onChange={(e) =>
                    setEditingReservation({
                      ...editingReservation,
                      time: e.target.value,
                    })
                  }
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                    currentTheme.accent
                  } focus:border-transparent transition-all duration-200 ${
                    mode === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="" disabled>
                    Select a time
                  </option>
                  {availableTimeSlotsForEdit.length === 0 ? (
                    <option disabled>No available time slots</option>
                  ) : (
                    availableTimeSlotsForEdit.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {editingReservation.date &&
                availableTimeSlotsForEdit.length === 0 && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 text-sm">
                      No available time slots for this date and party size.
                      Please select a different date or reduce party size.
                    </span>
                  </div>
                )}

              <textarea
                placeholder="Special Requests (optional)"
                value={editingReservation.specialRequests || ""}
                onChange={(e) =>
                  setEditingReservation({
                    ...editingReservation,
                    specialRequests: e.target.value,
                  })
                }
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
                  currentTheme.accent
                } focus:border-transparent transition-all duration-200 ${
                  mode === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`px-6 py-2 border rounded-lg font-medium transition-colors ${
                    mode === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditReservation}
                  disabled={
                    !editingReservation.customerName ||
                    !editingReservation.customerPhone ||
                    !editingReservation.date ||
                    !editingReservation.time ||
                    availableTimeSlotsForEdit.length === 0
                  }
                  className={`px-6 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Update Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && lastCreatedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-md ${
              mode === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2
                className={`text-2xl font-bold mb-2 ${
                  mode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Reservation Confirmed!
              </h2>
              <p
                className={`${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                } mb-6`}
              >
                Your reservation has been successfully created.
              </p>
              <div
                className={`p-4 ${
                  mode === "dark" ? "bg-gray-700" : "bg-gray-50"
                } rounded-lg text-left space-y-2 mb-6`}
              >
                <div className="flex justify-between">
                  <span
                    className={`font-medium ${
                      mode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Customer:
                  </span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    {lastCreatedReservation.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`font-medium ${
                      mode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Phone:
                  </span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    {lastCreatedReservation.customerPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`font-medium ${
                      mode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Date:
                  </span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    {new Date(lastCreatedReservation.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`font-medium ${
                      mode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Time:
                  </span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    {lastCreatedReservation.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`font-medium ${
                      mode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Guests:
                  </span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    {lastCreatedReservation.guests}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`font-medium ${
                      mode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Table:
                  </span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    Table {lastCreatedReservation.tableNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`font-medium ${
                      mode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Estimated Duration:
                  </span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    {lastCreatedReservation.estimatedDuration} minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`font-medium ${
                      mode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Reservation ID:
                  </span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    #{lastCreatedReservation.id}
                  </span>
                </div>
                {lastCreatedReservation.specialRequests && (
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      role="img"
                      aria-label="Special Request"
                      className="text-yellow-500 text-lg"
                    >
                      ⭐
                    </span>
                    <span
                      className={`font-semibold ${
                        mode === "dark" ? "text-yellow-200" : "text-yellow-800"
                      }`}
                    >
                      Special Request:
                    </span>
                    <span
                      className={
                        mode === "dark" ? "text-yellow-100" : "text-yellow-700"
                      }
                    >
                      {lastCreatedReservation.specialRequests}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <p>
                  📧 Confirmation email sent to{" "}
                  {lastCreatedReservation.customerEmail}
                </p>
                <p>
                  📱 SMS reminder will be sent 1 hour before your reservation
                </p>
              </div>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setLastCreatedReservation(null);
                }}
                className={`w-full py-3 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReservationModals;