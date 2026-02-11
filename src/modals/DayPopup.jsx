import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import ReservationForm from "./ReservationForm";
import { materialAPI, aulasAPI } from "../lib/api";

const dayNames = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
];
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

export default function DayPopup({
    date,
    reservas = [],
    onClose,
    onReservationCreated,
}) {
    const [showForm, setShowForm] = useState(false);
    const [material, setMaterial] = useState([]);
    const [aulas, setAulas] = useState([]);

    const dayOfWeek = dayNames[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = monthNames[date.getMonth()];

    // Cargar material y aulas
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [materialRes, aulasRes] = await Promise.all([
                    materialAPI.getAll(),
                    aulasAPI.getAll(),
                ]);
                setMaterial(materialRes.data);
                setAulas(aulasRes.data);
            } catch (err) {
                console.error("Error al cargar datos:", err);
            }
        };
        fetchData();
    }, []);

    // Filtrar reservas del día seleccionado
    const dayReservations = useMemo(() => {
        return reservas.filter((reserva) => {
            const reservaDate = new Date(reserva.fecha_inicio);
            return (
                reservaDate.getDate() === date.getDate() &&
                reservaDate.getMonth() === date.getMonth() &&
                reservaDate.getFullYear() === date.getFullYear()
            );
        });
    }, [reservas, date]);

    // Generar franjas horarias de 8:00 a 23:00
    const timeSlots = [];
    for (let i = 8; i < 24; i++) {
        timeSlots.push(`${i}:00`);
    }

    // Verificar si hay una reserva en una franja horaria
    const getReservationAtTime = (time) => {
        const [hour] = time.split(":");
        return dayReservations.find((reserva) => {
            const inicio = new Date(reserva.fecha_inicio);
            const fin = new Date(reserva.fecha_fin);
            const timeHour = parseInt(hour);
            return inicio.getHours() <= timeHour && fin.getHours() > timeHour;
        });
    };

    // Obtener nombre del material
    const getMaterialName = (materialId) => {
        const item = material.find((m) => m.id === materialId);
        return item ? item.nombre : "Material no encontrado";
    };

    // Obtener nombre del aula
    const getAulaName = (aulaId) => {
        const aula = aulas.find((a) => a.id === aulaId);
        return aula ? aula.nombre : "Aula no encontrada";
    };

    // Obtener descripción de la reserva
    const getReservationLabel = (reservation) => {
        const parts = [];
        if (reservation.material_id) {
            parts.push(getMaterialName(reservation.material_id));
        }
        if (reservation.aula_id) {
            parts.push(getAulaName(reservation.aula_id));
        }
        return parts.length > 0 ? parts.join(" + ") : "Reserva";
    };

    const handleSuccess = () => {
        setShowForm(false);
        if (onReservationCreated) onReservationCreated();
    };

    return createPortal(
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            {/* Pop-up */}
            <div
                className="
        bg-surface
        shadow-lg
        w-[500px]
        h-[420px]
        flex flex-col
        pointer-events-auto
      "
            >
                {/* Header - STICKY */}
                <div
                    className="
          sticky top-0
          border-b border-border
          p-4
          bg-primary-50
          z-10
          flex items-center justify-between
        "
                >
                    <h2 className="text-lg font-semibold text-text-primary">
                        {dayOfWeek} {dayOfMonth} de {month}
                    </h2>
                    <button
                        onClick={onClose}
                        className="
              text-text-primary
              hover:text-text-secondary
              text-2xl
              leading-none
              transition-colors
              cursor-pointer
            "
                    >
                        ×
                    </button>
                </div>

                {/* Botón Reservar - STICKY */}
                <div
                    className="
          sticky top-16
          border-b border-border
          p-4
          bg-surface
          z-10
        "
                >
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="
              w-32
              bg-primary-500
              hover:bg-primary-600
              text-white
              font-medium
              py-2
              px-4
              rounded
              transition-colors
            "
                    >
                        {showForm ? "Ocultar" : "Reservar"}
                    </button>
                </div>

                {/* Franjas horarias - SCROLLABLE */}
                <div className="flex-1 overflow-y-auto p-4">
                    {timeSlots.map((time, index) => {
                        const reservation = getReservationAtTime(time);
                        return (
                            <div
                                key={index}
                                className={`
                  flex items-center justify-between
                  py-2
                  text-sm
                  border-b border-border last:border-b-0
                  ${
                      reservation
                          ? "bg-primary-50 text-primary-700"
                          : "text-text-primary"
                  }
                `}
                            >
                                <span className="font-medium">{time}</span>
                                {reservation ? (
                                    <div className="text-xs flex flex-col items-end">
                                        <span className="font-semibold">
                                            {getReservationLabel(reservation)}
                                        </span>
                                        <span className="text-primary-600 italic">
                                            {reservation.observaciones?.substring(
                                                0,
                                                30,
                                            )}
                                            ...
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-border">
                                        -------------------
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Formulario de reserva */}
                {showForm && (
                    <ReservationForm
                        selectedDate={date}
                        onClose={() => setShowForm(false)}
                        onSuccess={handleSuccess}
                    />
                )}
            </div>
        </div>,
        document.body,
    );
}
