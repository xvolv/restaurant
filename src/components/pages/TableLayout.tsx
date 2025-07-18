import React from "react";
import { useTheme, themes } from "../../contexts/ThemeContext";
import { tables, Reservation } from "./types/Reservation";

interface TableLayoutProps {
  reservations: Reservation[];
  mode: string;
}

const TableLayout: React.FC<TableLayoutProps> = ({ reservations, mode }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  // Find which tables are occupied and by whom
  const occupiedMap: Record<number, Reservation | undefined> = {};
  reservations.forEach((res) => {
    if (res.status === "seated" && res.tableNumber) {
      occupiedMap[res.tableNumber] = res;
    }
  });

  return (
    <div className="grid grid-cols-4 gap-6 my-8">
      {tables.map((table) => {
        const occupied = !!occupiedMap[table.id];
        const guestName = occupiedMap[table.id]?.customerName;
        return (
          <div
            key={table.id}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-md border-2 transition-all duration-200
              ${
                occupied
                  ? "bg-red-100 border-red-500"
                  : mode === "dark"
                  ? "bg-gray-800 border-green-600"
                  : "bg-green-100 border-green-500"
              }
            `}
          >
            <div className="text-lg font-bold mb-1">Table {table.id}</div>
            <div className="text-xs mb-1">Capacity: {table.capacity}</div>
            <div
              className={`text-sm font-semibold ${
                occupied ? "text-red-700" : "text-green-700"
              }`}
            >
              {occupied ? "Occupied" : "Available"}
            </div>
            {occupied && guestName && (
              <div className="mt-2 text-xs text-red-700 font-medium truncate max-w-[100px]">
                {guestName}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TableLayout;
