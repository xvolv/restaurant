import React, { useState } from "react";

import TableLayout from "./TableLayout";
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
import ReservationModals from "./ReservationModals";
import ReservationList from "./ReservationList";

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
interface NewReservation {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
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
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInReservation, setCheckInReservation] =
    useState<Reservation | null>(null);

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
  const [newReservation, setNewReservation] = useState<NewReservation>({
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
          className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
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
        <TableLayout
          tables={tables}
          reservations={reservations}
          selectedDate={selectedDate}
          mode={mode}
          
        />
      </div>

      <ReservationList
        reservations={reservations}
        filteredReservations={filteredReservations}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        mode={mode}
        currentTheme={currentTheme}
        openEditModal={openEditModal}
        updateReservationStatus={updateReservationStatus}
        setCheckInReservation={setCheckInReservation}
        setShowCheckInModal={setShowCheckInModal}
      />

      <ReservationModals
        mode={mode}
        currentTheme={currentTheme}
        showNewReservation={showNewReservation}
        setShowNewReservation={setShowNewReservation}
        handleCreateReservation={handleCreateReservation}
        newReservation={newReservation}
        setNewReservation={setNewReservation}
        availableTimeSlotsForNewReservation={
          availableTimeSlotsForNewReservation
        }
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editingReservation={editingReservation}
        setEditingReservation={setEditingReservation}
        handleEditReservation={handleEditReservation}
        availableTimeSlotsForEdit={availableTimeSlotsForEdit}
        showCheckInModal={showCheckInModal}
        setShowCheckInModal={setShowCheckInModal}
        checkInReservation={checkInReservation}
        lastCreatedReservation={lastCreatedReservation}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
      />
    </div>
  );
};

export default ReservationSystem;
