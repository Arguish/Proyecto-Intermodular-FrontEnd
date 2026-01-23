import { useState } from "react";
import DayPopup from "./DayPopup";

const weekDays = ["L", "M", "X", "J", "V", "S", "D"];
const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Día 1 del mes
  const firstDayOfMonth = new Date(year, month, 1);

  // Convertimos domingo (0) a domingo (6)
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;

  // Días del mes actual
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Días del mes anterior
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  // Días del mes anterior (gris)
  for (let i = startDay - 1; i >= 0; i--) {
    cells.push({
      day: daysInPrevMonth - i,
      currentMonth: false,
    });
  }

  // Días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      day: i,
      currentMonth: true,
    });
  }

  // Días del mes siguiente (gris)
  while (cells.length < 42) {
    cells.push({
      day: cells.length - (startDay + daysInMonth) + 1,
      currentMonth: false,
    });
  }

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (cell) => {
    if (cell.currentMonth) {
      const clickedDate = new Date(year, month, cell.day);
      setSelectedDate(clickedDate);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
  {/* Header calendario */}
  <div className="
    flex items-center justify-center gap-3
    h-8
    text-xs
    text-text-primary
  ">
    <button
      onClick={goToPrevMonth}
      className="px-2 text-primary-500 hover:text-primary-700"
    >
      {"<"}
    </button>

    <span className="font-medium">
      {monthNames[month]} {year}
    </span>

    <button
      onClick={goToNextMonth}
      className="px-2 text-primary-500 hover:text-primary-700"
    >
      {">"}
    </button>
  </div>

  {/* Días de la semana */}
  <div className="
    grid grid-cols-7
    text-center text-[11px]
    font-medium
    text-text-secondary
    border-b border-border
  ">
    {weekDays.map((day) => (
      <div key={day} className="py-1">
        {day}
      </div>
    ))}
  </div>

  {/* Grid */}
  <div className="flex-1 grid grid-cols-7 grid-rows-6">
    {cells.map((cell, index) => (
      <div
        key={index}
        onClick={() => handleDayClick(cell)}
        className={`
          border border-border
          p-1 text-xs
          cursor-pointer
          ${
            cell.currentMonth
              ? "bg-surface hover:bg-primary-50"
              : "bg-surface-alt text-text-tertiary"
          }
        `}
      >
        {cell.day}
      </div>
    ))}
  </div>

  {/* Pop-up de día seleccionado */}
  {selectedDate && (
    <DayPopup 
      date={selectedDate}
      onClose={() => setSelectedDate(null)}
    />
  )}
</div>

  );
}
