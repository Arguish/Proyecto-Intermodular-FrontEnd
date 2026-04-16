import { useMemo, useEffect } from "react";
import TimeSlotItem from "../components/TimeSlotItem";
import useMaterialStore from "../store/MaterialStore";
import useAulasStore from "../store/AulasStore";
import useReservasStore from "../store/ReservasStore";
import useModalStore from "../store/ModalStore";
import useReservationData from "../hooks/useReservationData";
import {
    getDayReservations,
    generateTimeSlots,
    getReservationsAtTime,
} from "../utils/calendar";

/**
 * Vista del calendario de un día específico
 * Muestra las franjas horarias con las reservas
 */
export default function ReservationDay({
    date,
    modalId,
    onReservationCreated,
}) {
    // Stores
    const { reservas, refresh } = useReservasStore();
    const { fetchMaterial } = useMaterialStore();
    const { fetchAulas } = useAulasStore();
    const { replaceModal } = useModalStore();

    // Hook personalizado para manejar datos de reservas
    const { getReservationInfo } = useReservationData();

    // Cargar datos desde stores
    useEffect(() => {
        fetchMaterial();
        fetchAulas();
    }, [fetchMaterial, fetchAulas]);

    // Filtrar reservas del día seleccionado
    const dayReservations = useMemo(
        () => getDayReservations(date, reservas),
        [date, reservas],
    );

    // Generar franjas horarias (memoizado)
    const timeSlots = useMemo(() => generateTimeSlots(8, 24), []);

    // Navegar al formulario de reserva
    const handleReserve = () => {
        replaceModal(modalId, "reservationForm", {
            date,
            onBack: () => {
                replaceModal(modalId, "reservationDay", {
                    date,
                    onReservationCreated,
                });
            },
            onSuccess: () => {
                refresh();
                if (onReservationCreated) onReservationCreated();
                replaceModal(modalId, "reservationDay", {
                    date,
                    onReservationCreated,
                });
            },
        });
    };

    return (
        <>
            {/* Botón Reservar - STICKY */}
            <div className="sticky top-0 border-b border-border p-4 bg-surface z-10">
                <button
                    onClick={handleReserve}
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
                    Reservar
                </button>
            </div>

            {/* Franjas horarias - SCROLLABLE */}
            <div className="p-4">
                {timeSlots.map((time, index) => {
                    const reservations = getReservationsAtTime(
                        time,
                        dayReservations,
                    );
                    return (
                        <TimeSlotItem
                            key={index}
                            time={time}
                            reservations={reservations}
                            getReservationInfo={getReservationInfo}
                        />
                    );
                })}
            </div>
        </>
    );
}
