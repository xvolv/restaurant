import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Archive,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme, themes } from "../../contexts/ThemeContext";
import {
  Reservation,
  CustomerFeedback,
  tables,
  timeSlots,
  getEstimatedDuration,
  getAvailableTimeSlots,
  assignTable,
} from "./types/Reservation";
import ReservationCard from "./ReservationCard";
import ReservationModals from "./ReservationModals";
import TableLayout from "./TableLayout";

const ReservationSystem: React.FC = () => {
  const { t } = useTranslation();
  const { theme, mode } = useTheme();
  const currentTheme = themes[theme];

  // Modal states
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
  const [lastCreatedReservation, setLastCreatedReservation] =
    useState<Reservation | null>(null);

  // Check-In modal state
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInReservation, setCheckInReservation] =
    useState<Reservation | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // New state for view toggle
  const [viewMode, setViewMode] = useState<"active" | "archived">("active");
  const [autoCompleteEnabled, setAutoCompleteEnabled] = useState(false); // Default to OFF

  // Reservation data
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      customerName: "አበበ ከበደ",
      customerPhone: "+251911123456",
      customerEmail: "abebe@email.com",
      date: "2024-01-15",
      time: "19:00",
      guests: 4,
      tableNumber: 5,
      status: "confirmed",
      specialRequests: "Window seat preferred",
      estimatedDuration: 90,
    },
    {
      id: "2",
      customerName: "Sarah Johnson",
      customerPhone: "+251922234567",
      customerEmail: "sarah@email.com",
      date: "2024-01-15",
      time: "20:30",
      guests: 2,
      status: "pending",
      estimatedDuration: 60,
    },
  ]);

  // New reservation form state
  const [newReservation, setNewReservation] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    date: "",
    time: "",
    guests: 2,
    specialRequests: "",
  });

  // Enhanced filtered reservations with view mode
  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.customerPhone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || reservation.status === statusFilter;
    const matchesDate = !selectedDate || reservation.date === selectedDate;

    // Filter by view mode
    const isCompleted =
      reservation.status === "completed" || reservation.status === "cancelled";
    const matchesViewMode =
      viewMode === "archived" ? isCompleted : !isCompleted;

    return matchesSearch && matchesStatus && matchesDate && matchesViewMode;
  });

  // Dashboard counts - should show ALL reservations for the selected date (not filtered by view mode)
  const dashboardReservations = reservations.filter((reservation) => {
    const matchesDate = !selectedDate || reservation.date === selectedDate;
    return matchesDate;
  });

  // Available time slots
  const availableTimeSlotsForNewReservation = newReservation.date
    ? getAvailableTimeSlots(
        reservations,
        tables,
        newReservation.date,
        newReservation.guests
      )
    : timeSlots;

  const availableTimeSlotsForEdit = editingReservation?.date
    ? getAvailableTimeSlots(
        reservations,
        tables,
        editingReservation.date,
        editingReservation.guests,
        editingReservation.id
      )
    : timeSlots;

  // Auto-completion effect
  useEffect(() => {
    if (!autoCompleteEnabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
      const currentDate = now.toISOString().split("T")[0];

      setReservations((prev) =>
        prev.map((reservation) => {
          if (
            reservation.status !== "seated" ||
            reservation.date !== currentDate
          ) {
            return reservation;
          }

          // Calculate if reservation should be auto-completed
          const [hours, minutes] = reservation.time.split(":").map(Number);
          const reservationTime = hours * 60 + minutes;
          const estimatedDuration =
            reservation.estimatedDuration ||
            getEstimatedDuration(reservation.guests);
          const expectedEndTime = reservationTime + estimatedDuration;

          // Auto-complete if 15 minutes past estimated end time
          if (currentTime > expectedEndTime + 15) {
            return { ...reservation, status: "completed" as const };
          }

          return reservation;
        })
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [autoCompleteEnabled]);

  // Event handlers
  const handleCreateReservation = () => {
    const assignedTable = assignTable(
      reservations,
      tables,
      newReservation.date,
      newReservation.time,
      newReservation.guests
    );

    if (!assignedTable) {
      alert(
        "No tables available for this time slot. Please choose a different time."
      );
      return;
    }

    const reservation: Reservation = {
      id: Date.now().toString(),
      ...newReservation,
      tableNumber: assignedTable,
      status: "pending",
      estimatedDuration: getEstimatedDuration(newReservation.guests),
    };

    setReservations((prev) => [...prev, reservation]);
    setLastCreatedReservation(reservation);
    setNewReservation({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      date: "",
      time: "",
      guests: 2,
      specialRequests: "",
    });
    setShowNewReservation(false);
    setShowConfirmation(true);
  };

  const handleEditReservation = () => {
    if (!editingReservation) return;

    const assignedTable = assignTable(
      reservations,
      tables,
      editingReservation.date,
      editingReservation.time,
      editingReservation.guests
    );

    if (!assignedTable) {
      alert(
        "No tables available for this time slot. Please choose a different time."
      );
      return;
    }

    setReservations((prev) =>
      prev.map((res) =>
        res.id === editingReservation.id
          ? {
              ...editingReservation,
              tableNumber: assignedTable,
              estimatedDuration: getEstimatedDuration(
                editingReservation.guests
              ),
            }
          : res
      )
    );
    setShowEditModal(false);
    setEditingReservation(null);
  };

  const updateReservationStatus = (
    id: string,
    status: Reservation["status"]
  ) => {
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? { ...res, status } : res))
    );
  };

  const openEditModal = (reservation: Reservation) => {
    setEditingReservation({ ...reservation });
    setShowEditModal(true);
  };

  // Handler for opening check-in modal
  const handleCheckInClick = (reservation: Reservation) => {
    setCheckInReservation(reservation);
    setShowCheckInModal(true);
  };

  // Handler to confirm check-in
  const handleConfirmCheckIn = () => {
    if (checkInReservation) {
      setReservations((prev) =>
        prev.map((res) =>
          res.id === checkInReservation.id ? { ...res, status: "seated" } : res
        )
      );
    }
    setShowCheckInModal(false);
    setCheckInReservation(null);
  };

  // Handler to manually mark as completed and trigger feedback
  const handleMarkCompleted = (id: string) => {
    const reservation = reservations.find((r) => r.id === id);
    if (!reservation) return;

    // Mark reservation as completed
    updateReservationStatus(id, "completed");

    // Trigger feedback request (simulate email sending)
    triggerFeedbackRequest(reservation);
  };

  // Simulate email feedback request
  const triggerFeedbackRequest = (reservation: Reservation) => {
    // Generate unique feedback link
    const feedbackLink = `${window.location.origin}/feedback/${reservation.id}`;

    // In a real implementation, this would send actual email
    console.log(`📧 Feedback email sent to: ${reservation.customerEmail}`);
    console.log(
      `📧 Email Subject: Thank you for dining with us! Share your feedback`
    );
    console.log(`📧 Email Content:`);
    console.log(`   Dear ${reservation.customerName},`);
    console.log(
      `   Thank you for dining with us on ${new Date(
        reservation.date
      ).toLocaleDateString()}.`
    );
    console.log(`   We'd love to hear about your experience!`);
    console.log(`   Please click the link below to share your feedback:`);
    console.log(`   ${feedbackLink}`);
    console.log(
      `   This will only take 2 minutes and helps us improve our service.`
    );
    console.log(`   Thank you!`);

    // Show success notification to staff
    alert(`✅ Feedback request sent to ${reservation.customerName} via email!`);

    // Note: In production, you would integrate with email service like:
    // - SendGrid, Mailgun, AWS SES, etc.
    //
    // Example integration:
    // await emailService.send({
    //   to: reservation.customerEmail,
    //   subject: "Thank you for dining with us! Share your feedback",
    //   html: feedbackEmailTemplate(reservation, feedbackLink)
    // });
  };

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl font-bold ${
              mode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t("navigation.reservations")}
          </h1>
          <p
            className={`${
              mode === "dark" ? "text-gray-400" : "text-gray-600"
            } mt-1`}
          >
            {viewMode === "active"
              ? "Manage active table reservations and bookings"
              : "View completed and cancelled reservations"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div
            className={`flex rounded-lg p-1 ${
              mode === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <button
              onClick={() => setViewMode("active")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === "active"
                  ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-md`
                  : mode === "dark"
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Active
            </button>
            <button
              onClick={() => setViewMode("archived")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === "archived"
                  ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-md`
                  : mode === "dark"
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Archive className="w-4 h-4 inline mr-2" />
              Archive
            </button>
          </div>

          {viewMode === "active" && (
            <button
              onClick={() => setShowNewReservation(true)}
              className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105`}
            >
              <Plus className="w-5 h-5" />
              <span>New Reservation</span>
            </button>
          )}
        </div>
      </div>

      {/* Auto-completion Settings (only show for active view) */}
      {viewMode === "active" && (
        <div
          className={`p-4 ${
            mode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border rounded-xl shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock
                className={`w-5 h-5 ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <div>
                <h3
                  className={`font-medium ${
                    mode === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Auto-Completion (Optional)
                </h3>
                <p
                  className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Backup feature: Auto-mark as completed 30 minutes after
                  estimated end time. Feedback emails sent automatically.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoCompleteEnabled}
                onChange={(e) => setAutoCompleteEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      )}

      {/* Table Layout (only for active reservations) */}
      {viewMode === "active" && (
        <TableLayout
          reservations={reservations.filter(
            (r) => r.status !== "completed" && r.status !== "cancelled"
          )}
          mode={mode}
        />
      )}

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
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                mode === "dark" ? "text-gray-400" : "text-gray-400"
              }`}
            />
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
            />
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

          <div className="flex items-center space-x-2">
            <Filter
              className={`w-5 h-5 ${
                mode === "dark" ? "text-gray-400" : "text-gray-400"
              }`}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${
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

          <div className="text-center">
            <div className={`text-lg font-bold text-yellow-600`}>
              {filteredReservations.filter((r) => r.specialRequests).length}
            </div>
            <div
              className={`text-xs ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Special Requests
            </div>
          </div>
        </div>
      </div>

      {/* Staff Dashboard Summary */}
      <div
        className={`p-6 ${
          mode === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } border rounded-xl shadow-lg`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            mode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Staff Dashboard -{" "}
          {selectedDate
            ? new Date(selectedDate).toLocaleDateString()
            : "Today's"}{" "}
          Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl mb-1">⏳</div>
            <div className="text-lg font-bold text-yellow-600">
              {
                dashboardReservations.filter((r) => r.status === "pending")
                  .length
              }
            </div>
            <div className="text-xs text-yellow-700">Pending</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-lg font-bold text-green-600">
              {
                dashboardReservations.filter((r) => r.status === "confirmed")
                  .length
              }
            </div>
            <div className="text-xs text-green-700">Confirmed</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-1">🪑</div>
            <div className="text-lg font-bold text-blue-600">
              {
                dashboardReservations.filter((r) => r.status === "seated")
                  .length
              }
            </div>
            <div className="text-xs text-blue-700">Seated</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-600">
              {
                dashboardReservations.filter((r) => r.status === "completed")
                  .length
              }
            </div>
            <div className="text-xs text-gray-700">Completed</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-bold text-red-600">
              {
                dashboardReservations.filter((r) => r.status === "cancelled")
                  .length
              }
            </div>
            <div className="text-xs text-red-700">Cancelled</div>
          </div>
        </div>

        {/* Special Requests Alert */}
        {dashboardReservations.filter(
          (r) =>
            r.specialRequests &&
            (r.status === "confirmed" || r.status === "pending")
        ).length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="font-semibold text-yellow-800">
                {
                  dashboardReservations.filter(
                    (r) =>
                      r.specialRequests &&
                      (r.status === "confirmed" || r.status === "pending")
                  ).length
                }{" "}
                reservations have special requests requiring attention
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Reservations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            mode={mode}
            onEdit={openEditModal}
            onStatusUpdate={updateReservationStatus}
            onCheckIn={handleCheckInClick}
            onMarkCompleted={handleMarkCompleted}
          />
        ))}
      </div>

      {/* Modals */}
      <ReservationModals
        mode={mode}
        showNewReservation={showNewReservation}
        setShowNewReservation={setShowNewReservation}
        newReservation={newReservation}
        setNewReservation={setNewReservation}
        availableTimeSlotsForNewReservation={
          availableTimeSlotsForNewReservation
        }
        handleCreateReservation={handleCreateReservation}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editingReservation={editingReservation}
        setEditingReservation={setEditingReservation}
        availableTimeSlotsForEdit={availableTimeSlotsForEdit}
        handleEditReservation={handleEditReservation}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        lastCreatedReservation={lastCreatedReservation}
        setLastCreatedReservation={setLastCreatedReservation}
      />

      {showCheckInModal && checkInReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-md ${
              mode === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div
              className={`px-6 py-4 bg-gradient-to-r ${currentTheme.primary} text-white`}
            >
              <h2 className="text-xl font-bold">Confirm Check-In</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Guest:</span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    {checkInReservation.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Party Size:</span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    {checkInReservation.guests}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Table:</span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    {checkInReservation.tableNumber || "Not assigned"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Reservation Time:</span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    {checkInReservation.time}
                  </span>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowCheckInModal(false);
                    setCheckInReservation(null);
                  }}
                  className={`px-6 py-2 border rounded-lg font-medium transition-colors ${
                    mode === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCheckIn}
                  className={`px-6 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
                >
                  Confirm Check-In
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
