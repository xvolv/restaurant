// Types and constants for the reservation system
export interface Table {
    id: number;
    capacity: number;
    isAvailable: boolean;
  }
  
  export interface Reservation {
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
  
  export const timeSlots = [
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
  
  // Table configuration - different sizes for different party sizes
  export const tables: Table[] = [
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
  
  export const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    seated: "bg-blue-100 text-blue-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };
  
  // Utility functions
  export const getEstimatedDuration = (guests: number): number => {
    if (guests <= 2) return 60;
    if (guests <= 4) return 90;
    if (guests <= 6) return 105;
    return 120;
  };
  
  export const isTimeSlotAvailable = (
    reservations: Reservation[],
    tables: Table[],
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
    const occupiedTables = conflictingReservations.map((res) => res.tableNumber);
    const availableTables = suitableTables.filter(
      (table) => !occupiedTables.includes(table.id)
    );
  
    return availableTables.length > 0;
  };
  
  export const getAvailableTimeSlots = (
    reservations: Reservation[],
    tables: Table[],
    date: string,
    guests: number,
    excludeId?: string
  ) => {
    return timeSlots.filter((time) =>
      isTimeSlotAvailable(reservations, tables, date, time, guests, excludeId)
    );
  };
  
  export const assignTable = (
    reservations: Reservation[],
    tables: Table[],
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
  
    const occupiedTables = conflictingReservations.map((res) => res.tableNumber);
    const suitableTables = tables
      .filter(
        (table) => table.capacity >= guests && !occupiedTables.includes(table.id)
      )
      .sort((a, b) => a.capacity - b.capacity); // Prefer smaller suitable tables
  
    return suitableTables.length > 0 ? suitableTables[0].id : null;
  };