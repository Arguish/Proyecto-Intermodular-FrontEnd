import { useState, useEffect } from "react";
import useReservasStore from "../store/ReservasStore";
import useModalStore from "../store/ModalStore";
import {
    DAYS,
    MONTHS,
    generateCalendarCells,
    hasDayReservations,
    getPreviousMonth,
    getNextMonth,
} from "../utils/calendar";

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Stores
    const { reservas, isLoading, fetchReservas, refresh } = useReservasStore();
    const { openModal } = useModalStore();

    useEffect(() => {
        fetchReservas();
    }, [fetchReservas]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const cells = generateCalendarCells(year, month);

    const goToPrevMonth = () => {
        setCurrentDate(getPreviousMonth(currentDate));
    };

    const goToNextMonth = () => {
        setCurrentDate(getNextMonth(currentDate));
    };

    const handleDayClick = (cell) => {
        if (cell.currentMonth) {
            const clickedDate = new Date(year, month, cell.day);
            openModal("reservationDay", {
                date: clickedDate,
                onReservationCreated: refresh,
            });
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-background">
            {/* Header calendario */}
            <div
                className="
        flex items-center justify-center gap-3
        h-8
        text-xs
        text-text-primary
      "
            >
                <button
                    onClick={goToPrevMonth}
                    className="px-2 text-primary-500 hover:text-primary-700"
                >
                    {"<"}
                </button>

                <span className="font-medium">
                    {MONTHS.long[month]} {year}
                </span>

                <button
                    onClick={goToNextMonth}
                    className="px-2 text-primary-500 hover:text-primary-700"
                >
                    {">"}
                </button>
            </div>

            {/* Días de la semana */}
            <div
                className="
        grid grid-cols-7
        text-center text-[11px]
        font-medium
        text-text-secondary
        border-b border-border
      "
            >
                {DAYS.short.map((day) => (
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
              relative
              ${
                  cell.currentMonth
                      ? "bg-surface hover:bg-primary-50"
                      : "bg-surface-alt text-text-tertiary"
              }
            `}
                    >
                        {cell.day}
                        {cell.currentMonth &&
                            hasDayReservations(
                                cell.day,
                                month,
                                year,
                                reservas,
                            ) && (
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
                            )}
                    </div>
                ))}
            </div>
        </div>
    );
}
