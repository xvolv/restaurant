import React, { useState } from "react";

import { FixedSizeGrid as Grid, GridChildComponentProps } from "react-window";

import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  Edit,
  CheckCircle,
  AlertCircle,
  MapPin,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme, themes } from "../../contexts/ThemeContext";

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
];

interface Table {
  id: number;
  capacity: number;
  isAvailable: boolean;
}

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
  estimatedDuration?: number; // in minutes
}

// Table configuration - different sizes for different party sizes
const tables: Table[] = [
  { id: 1, capacity: 2, isAvailable: true },
  { id: 2, capacity: 2, isAvailable: true },
  { id: 3, capacity: 4, isAvailable: true },
  { id: 4, capacity: 4, isAvailable: true },
  { id: 5, capacity: 4, isAvailable: true },
  { id: 6, capacity: 6, isAvailable: true },
  { id: 7, capacity: 6, isAvailable: true },
  { id: 8, capacity: 8, isAvailable: true },
  { id: 9, capacity: 8, isAvailable: true },
  { id: 10, capacity: 10, isAvailable: true },
];

const ReservationSystem: React.FC = () => {
  const { t } = useTranslation();
  const { theme, mode } = useTheme();
  const currentTheme = themes[theme];
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
  const [lastCreatedReservation, setLastCreatedReservation] =
    useState<Reservation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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
    {
      id: "3",
      customerName: "ሙሉጌታ ተስፋዬ",
      customerPhone: "+251933345678",
      customerEmail: "mulugeta@email.com",
      date: "2024-01-16",
      time: "18:30",
      guests: 6,
      tableNumber: 8,
      status: "seated",
      estimatedDuration: 120,
    },
  ]);

  const [newReservation, setNewReservation] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    date: "",
    time: "",
    guests: 2,
    specialRequests: "",
  });

  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    seated: "bg-blue-100 text-blue-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };

  // Check if a time slot is available for a given date and party size
  const isTimeSlotAvailable = (
    date: string,
    time: string,
    guests: number,
    excludeId?: string
  ) => {
    const conflictingReservations = reservations.filter(
      (res) =>
        res.date === date &&
        res.time === time &&
        res.status !== "cancelled" &&
        res.status !== "completed" &&
        res.id !== excludeId
    );

    // Get available tables for the party size
    const suitableTables = tables.filter((table) => table.capacity >= guests);
    const occupiedTables = conflictingReservations.map(
      (res) => res.tableNumber
    );
    const availableTables = suitableTables.filter(
      (table) => !occupiedTables.includes(table.id)
    );

    return availableTables.length > 0;
  };

  // Get available time slots for a specific date and party size
  const getAvailableTimeSlots = (
    date: string,
    guests: number,
    excludeId?: string
  ) => {
    return timeSlots.filter((time) =>
      isTimeSlotAvailable(date, time, guests, excludeId)
    );
  };

  // Assign a table automatically based on party size and availability
  const assignTable = (
    date: string,
    time: string,
    guests: number
  ): number | null => {
    const conflictingReservations = reservations.filter(
      (res) =>
        res.date === date &&
        res.time === time &&
        res.status !== "cancelled" &&
        res.status !== "completed"
    );

    const occupiedTables = conflictingReservations.map(
      (res) => res.tableNumber
    );
    const suitableTables = tables
      .filter(
        (table) =>
          table.capacity >= guests && !occupiedTables.includes(table.id)
      )
      .sort((a, b) => a.capacity - b.capacity); // Prefer smaller suitable tables

    return suitableTables.length > 0 ? suitableTables[0].id : null;
  };

  // Get estimated seating time (assuming 60-120 minutes based on party size)
  const getEstimatedDuration = (guests: number): number => {
    if (guests <= 2) return 60;
    if (guests <= 4) return 90;
    if (guests <= 6) return 105;
    return 120;
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.customerPhone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || reservation.status === statusFilter;
    const matchesDate = !selectedDate || reservation.date === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleCreateReservation = () => {
    const assignedTable = assignTable(
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

    // Check availability for the new time slot (excluding current reservation)
    const assignedTable = assignTable(
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

  const availableTimeSlotsForNewReservation = newReservation.date
    ? getAvailableTimeSlots(newReservation.date, newReservation.guests)
    : timeSlots;

  const availableTimeSlotsForEdit = editingReservation?.date
    ? getAvailableTimeSlots(
        editingReservation.date,
        editingReservation.guests,
        editingReservation.id
      )
    : timeSlots;

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Table Layout Visualization */}
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
          Table Layout -{" "}
          {selectedDate ? new Date(selectedDate).toLocaleDateString() : "Today"}
        </h3>

        <div style={{ width: "100%", height: 400 }}>
          <Grid
            columnCount={5}
            columnWidth={180}
            height={400}
            rowCount={Math.ceil(tables.length / 5)}
            rowHeight={120}
            width={920}
          >
            {({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
              const tableIndex =
                (rowIndex as number) * 5 + (columnIndex as number);
              if (tableIndex >= tables.length) return null;
              const table = tables[tableIndex];
              const isOccupied = reservations.some(
                (res) =>
                  res.date === selectedDate &&
                  res.tableNumber === table.id &&
                  (res.status === "confirmed" || res.status === "seated")
              );
              return (
                <div
                  key={table.id}
                  style={style}
                  className={`p-4 m-2 rounded-lg border-2 text-center transition-all duration-200 ${
                    isOccupied
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-green-300 bg-green-50 text-green-700"
                  }`}
                >
                  <div className="font-semibold">Table {table.id}</div>
                  <div className="text-sm">Seats {table.capacity}</div>
                  <div className="text-xs mt-1">
                    {isOccupied ? "Occupied" : "Available"}
                  </div>
                </div>
              );
            }}
          </Grid>
        </div>
      </div>

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
        </div>
      </div>

      {/* Reservations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  onClick={() =>
                    updateReservationStatus(reservation.id, "seated")
                  }
                  className={`flex-1 py-2 px-3 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200`}
                >
                  Seat
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
                    Date & Time:
                  </span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    {lastCreatedReservation.date} {lastCreatedReservation.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`font-medium ${
                      mode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Table Number:
                  </span>
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    {lastCreatedReservation.tableNumber || "-"}
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
              </div>{" "}
              <div>
                {" "}
                <div>
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
    </div>
  );
};

export default ReservationSystem;
