/**
 * Componente que representa una franja horaria en el popup de día
 * Muestra la hora y las reservas en formato de chips compactos
 */
export default function TimeSlotItem({
    time,
    reservations = [],
    getReservationInfo,
}) {
    if (!reservations || reservations.length === 0) {
        return (
            <div className="flex items-center justify-between py-2 text-sm border-b border-border last:border-b-0 text-text-primary">
                <span className="font-medium">{time}</span>
                <span className="text-border">-------------------</span>
            </div>
        );
    }

    return (
        <div className="flex items-start gap-3 py-2 text-sm border-b border-border last:border-b-0">
            <span className="font-medium text-text-primary flex-shrink-0 pt-1 min-w-[45px]">
                {time}
            </span>

            <div className="flex flex-wrap gap-2 flex-1">
                {reservations.map((reservation, idx) => {
                    const info = getReservationInfo(reservation);

                    return (
                        <div
                            key={idx}
                            title={info.line3}
                            className="
                                flex flex-col gap-0.5
                                bg-primary-50 
                                border border-primary-200
                                rounded-lg 
                                px-3 py-2
                                text-xs
                                hover:bg-primary-100
                                transition-colors
                                select-none
                                min-w-[120px]
                                flex-1
                            "
                        >
                            {/* Línea 1: Usuario + Aula */}
                            <div className="font-semibold text-primary-900 truncate">
                                {info.line1 || "Sin información"}
                            </div>

                            {/* Línea 2: Material (si existe) */}
                            {info.line2 && (
                                <div className="text-primary-700 truncate">
                                    📦 {info.line2}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
