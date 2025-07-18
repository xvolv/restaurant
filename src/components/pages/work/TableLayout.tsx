import React from "react";
import { FixedSizeGrid as Grid, GridChildComponentProps } from "react-window";

interface Table {
  id: number;
  capacity: number;
  isAvailable: boolean;
}
interface Reservation {
  id: string;
  customerName: string;
  date: string;
  time: string;
  guests: number;
  tableNumber?: number;
  status: string;
  // ...other fields as needed
}
interface TableLayoutProps {
  tables: Table[];
  reservations: Reservation[];
  selectedDate: string;
  mode: string;
}

const TableLayout: React.FC<TableLayoutProps> = ({
  tables,
  reservations,
  selectedDate,
  mode,
}) => (
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
        const tableIndex = rowIndex * 5 + columnIndex;
        if (tableIndex >= tables.length) return null;
        const table = tables[tableIndex];
        const isOccupied = reservations.some(
          (res) =>
            res.date === selectedDate &&
            res.tableNumber === table.id &&
            (res.status === "confirmed" || res.status === "seated")
        );
        const seatedReservation = reservations.find(
          (res) =>
            res.date === selectedDate &&
            res.tableNumber === table.id &&
            res.status === "seated"
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
            {seatedReservation && (
              <div className="text-xs font-semibold mt-1 text-blue-700">
                {seatedReservation.customerName}
              </div>
            )}
          </div>
        );
      }}
    </Grid>
  </div>
);

export default TableLayout;
