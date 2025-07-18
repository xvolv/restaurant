import React, { useState } from "react";
import { FixedSizeGrid as Grid, GridChildComponentProps } from "react-window";
import { Plus, Search, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme, themes } from "../../contexts/ThemeContext";
import {
  Reservation,
  tables,
  timeSlots,
  getEstimatedDuration,
  isTimeSlotAvailable,
  getAvailableTimeSlots,
  assignTable,
} from "./types/Reservation";
import ReservationCard from "./ReservationCard";
import ReservationModals from "./ReservationModals";

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

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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

  // Filtered reservations
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
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            mode={mode}
            onEdit={openEditModal}
            onStatusUpdate={updateReservationStatus}
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
    </div>
  );
};

export default ReservationSystem;
