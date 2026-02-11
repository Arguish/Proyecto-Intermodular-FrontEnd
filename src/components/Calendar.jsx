import { useState, useEffect } from "react";
import DayPopup from "../modals/DayPopup";
import { reservasAPI } from "../lib/api";

const weekDays = ["L", "M", "X", "J", "V", "S", "D"];
const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar reservas
    const fetchReservas = async () => {
        try {
            const response = await reservasAPI.getAll();
            setReservas(response.data);
        } catch (err) {
            console.error("Error al cargar reservas:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, []);

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

    // Verificar si un día tiene reservas
    const hasReservations = (day) => {
        const dateToCheck = new Date(year, month, day);
        return reservas.some((reserva) => {
            const reservaDate = new Date(reserva.fecha_inicio);
            return (
                reservaDate.getDate() === dateToCheck.getDate() &&
                reservaDate.getMonth() === dateToCheck.getMonth() &&
                reservaDate.getFullYear() === dateToCheck.getFullYear() &&
                reserva.estado === "activa"
            );
        });
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
            <div
                className="
        grid grid-cols-7
        text-center text-[11px]
        font-medium
        text-text-secondary
        border-b border-border
      "
            >
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
              relative
              ${
                  cell.currentMonth
                      ? "bg-surface hover:bg-primary-50"
                      : "bg-surface-alt text-text-tertiary"
              }
            `}
                    >
                        {cell.day}
                        {cell.currentMonth && hasReservations(cell.day) && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pop-up de día seleccionado */}
            {selectedDate && (
                <DayPopup
                    date={selectedDate}
                    reservas={reservas}
                    onClose={() => setSelectedDate(null)}
                    onReservationCreated={fetchReservas}
                />
            )}
        </div>
    );
}
