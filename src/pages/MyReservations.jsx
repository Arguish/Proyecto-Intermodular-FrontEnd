import { useEffect } from "react";
import useReservasStore from "../store/ReservasStore";
import useAuthStore from "../store/AuthStore";
import useModalStore from "../store/ModalStore";
import ReservationCard from "../components/ReservationCard";

export default function MyReservations() {
    const { user } = useAuthStore();
    const { reservas, fetchReservas, deleteReserva, isLoading } =
        useReservasStore();
    const { openModal, closeAllModals } = useModalStore();

    useEffect(() => {
        fetchReservas(true);
    }, [fetchReservas]);

    // Filtrar solo las reservas del usuario actual
    const myReservations = reservas.filter(
        (reserva) =>
            reserva.user_id === user?.id && reserva.estado === "activa",
    );

    // Agrupar reservas por día
    const reservationsByDay = myReservations.reduce((groups, reserva) => {
        const date = new Date(reserva.fecha_inicio);
        const dayKey = date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });

        if (!groups[dayKey]) {
            groups[dayKey] = {
                date: date,
                reservations: [],
            };
        }
        groups[dayKey].reservations.push(reserva);
        return groups;
    }, {});

    // Ordenar por fecha
    const sortedDays = Object.values(reservationsByDay).sort(
        (a, b) => a.date - b.date,
    );

    const handleEdit = (reserva) => {
        openModal("reservationForm", {
            reserva,
            onSuccess: () => {
                closeAllModals();
                fetchReservas(true);
            },
        });
    };

    const handleCancel = async (reserva) => {
        if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
            return;
        }

        const result = await deleteReserva(reserva.id);
        if (result.success) {
            fetchReservas(true);
        } else {
            alert("Error al cancelar la reserva");
        }
    };

    return (
        <div className="flex-1 p-6 bg-background overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-text-primary mb-6">
                    Mis Reservas
                </h1>

                {isLoading ? (
                    <div className="text-center py-12 text-text-secondary">
                        Cargando reservas...
                    </div>
                ) : myReservations.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-text-secondary">
                            No tienes reservas activas.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {sortedDays.map((dayGroup) => (
                            <div key={dayGroup.date.toISOString()}>
                                <h2 className="text-lg font-semibold text-text-primary mb-4 pb-2 border-b border-border">
                                    {dayGroup.date.toLocaleDateString("es-ES", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {dayGroup.reservations.map((reserva) => (
                                        <ReservationCard
                                            key={reserva.id}
                                            reserva={reserva}
                                            onEdit={handleEdit}
                                            onCancel={handleCancel}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
