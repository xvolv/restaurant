import React from "react";
import { X, AlertCircle, Users, CheckCircle } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
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

interface NewReservation {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}

interface ReservationModalsProps {
  mode: string;
  currentTheme: any;
  showNewReservation: boolean;
  setShowNewReservation: (show: boolean) => void;
  handleCreateReservation: () => void;
  newReservation: NewReservation;
  setNewReservation: Dispatch<SetStateAction<NewReservation>>;
  availableTimeSlotsForNewReservation: string[];
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  editingReservation: Reservation | null;
  setEditingReservation: (res: Reservation | null) => void;
  handleEditReservation: () => void;
  availableTimeSlotsForEdit: string[];
  showCheckInModal: boolean;
  setShowCheckInModal: (show: boolean) => void;
  checkInReservation: Reservation | null;
  lastCreatedReservation: Reservation | null;
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
}

const ReservationModals: React.FC<ReservationModalsProps> = ({
  mode,
  currentTheme,
  showNewReservation,
  setShowNewReservation,
  handleCreateReservation,
  newReservation,
  setNewReservation,
  availableTimeSlotsForNewReservation,
  showEditModal,
  setShowEditModal,
  editingReservation,
  setEditingReservation,
  handleEditReservation,
  availableTimeSlotsForEdit,
  showCheckInModal,
  setShowCheckInModal,
  checkInReservation,
  lastCreatedReservation,
  showConfirmation,
  setShowConfirmation,
}) => (
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
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                className="input"
                value={newReservation.customerName}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    customerName: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Phone"
                className="input"
                value={newReservation.customerPhone}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    customerPhone: e.target.value,
                  })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={newReservation.customerEmail}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    customerEmail: e.target.value,
                  })
                }
              />
              <input
                type="date"
                className="input"
                value={newReservation.date}
                onChange={(e) =>
                  setNewReservation({ ...newReservation, date: e.target.value })
                }
              />
              <select
                className="input"
                value={newReservation.time}
                onChange={(e) =>
                  setNewReservation({ ...newReservation, time: e.target.value })
                }
              >
                <option value="">Select Time</option>
                {availableTimeSlotsForNewReservation.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                placeholder="Guests"
                className="input"
                value={newReservation.guests}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    guests: Number(e.target.value),
                  })
                }
              />
              <input
                type="text"
                placeholder="Special Requests"
                className="input col-span-2"
                value={newReservation.specialRequests || ""}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    specialRequests: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowNewReservation(false)}
                className="px-6 py-2 border rounded-lg font-medium transition-colors border-gray-300 text-gray-700 hover:bg-gray-50"
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
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                className="input"
                value={editingReservation.customerName}
                onChange={(e) =>
                  setEditingReservation({
                    ...editingReservation,
                    customerName: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Phone"
                className="input"
                value={editingReservation.customerPhone}
                onChange={(e) =>
                  setEditingReservation({
                    ...editingReservation,
                    customerPhone: e.target.value,
                  })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={editingReservation.customerEmail}
                onChange={(e) =>
                  setEditingReservation({
                    ...editingReservation,
                    customerEmail: e.target.value,
                  })
                }
              />
              <input
                type="date"
                className="input"
                value={editingReservation.date}
                onChange={(e) =>
                  setEditingReservation({
                    ...editingReservation,
                    date: e.target.value,
                  })
                }
              />
              <select
                className="input"
                value={editingReservation.time}
                onChange={(e) =>
                  setEditingReservation({
                    ...editingReservation,
                    time: e.target.value,
                  })
                }
              >
                <option value="">Select Time</option>
                {availableTimeSlotsForEdit.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                placeholder="Guests"
                className="input"
                value={editingReservation.guests}
                onChange={(e) =>
                  setEditingReservation({
                    ...editingReservation,
                    guests: Number(e.target.value),
                  })
                }
              />
              <input
                type="text"
                placeholder="Special Requests"
                className="input col-span-2"
                value={editingReservation.specialRequests || ""}
                onChange={(e) =>
                  setEditingReservation({
                    ...editingReservation,
                    specialRequests: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 border rounded-lg font-medium transition-colors border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditReservation}
                className={`px-6 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
              >
                Update Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Check-In Confirmation Modal */}
    {showCheckInModal && checkInReservation && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div
          className={`w-full max-w-md ${
            mode === "dark" ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-2xl overflow-hidden`}
        >
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                mode === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Check-In Guest
            </h2>
            <p
              className={`${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              } mb-6`}
            >
              Please confirm guest details before seating.
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
                  {checkInReservation.customerName}
                </span>
              </div>
              {/* ...more details as needed... */}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCheckInModal(false)}
                className={`px-6 py-2 border rounded-lg font-medium transition-colors ${
                  mode === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // call your check-in confirmation handler here
                  // e.g. handleCheckIn(checkInReservation)
                  setShowCheckInModal(false);
                }}
                className={`px-6 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
              >
                Confirm Check-In
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Reservation Confirmation Modal/Toast */}
    {showConfirmation && lastCreatedReservation && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div
          className={`w-full max-w-md ${
            mode === "dark" ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-2xl overflow-hidden`}
        >
          <div className="p-6 text-center">
            <CheckCircle
              className="w-16 h-16 mx-auto mb-4 text-green-500"
              strokeWidth={2.5}
            />
            <h2
              className={`text-2xl font-bold mb-2 ${
                mode === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Reservation Created!
            </h2>
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
                  Reservation ID:
                </span>
                <span
                  className={mode === "dark" ? "text-white" : "text-gray-900"}
                >
                  #{lastCreatedReservation.id}
                </span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <p>
                📧 Confirmation email sent to{" "}
                {lastCreatedReservation.customerEmail}
              </p>
              <p>📱 SMS reminder will be sent 1 hour before your reservation</p>
            </div>
            <button
              onClick={() => setShowConfirmation(false)}
              className={`px-6 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);

export default ReservationModals;
