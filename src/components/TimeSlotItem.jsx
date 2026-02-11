/**
 * Componente que representa una franja horaria en el popup de día
 * Muestra la hora y la información de la reserva si existe
 */
export default function TimeSlotItem({
    time,
    reservation,
    getReservationLabel,
}) {
    return (
        <div
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
                        {reservation.observaciones?.substring(0, 30)}
                        {reservation.observaciones?.length > 30 && "..."}
                    </span>
                </div>
            ) : (
                <span className="text-border">-------------------</span>
            )}
        </div>
    );
}
