import useReservationData from "../hooks/useReservationData";

/**
 * Card individual para mostrar una reserva
 * Muestra información completa con botones de acción
 */
export default function ReservationCard({ reserva, onEdit, onCancel }) {
    const { getReservationInfo } = useReservationData();
    const info = getReservationInfo(reserva);
    const startDate = new Date(reserva.fecha_inicio);
    const endDate = new Date(reserva.fecha_fin);

    return (
        <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow h-full flex flex-col">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-text-primary mb-1">
                        {info.line1}
                    </h3>
                    {info.line2 && (
                        <p className="text-sm text-text-secondary">
                            📦 {info.line2}
                        </p>
                    )}
                </div>
                <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                    {reserva.estado === "activa" ? "Activa" : reserva.estado}
                </span>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                    <span>📅</span>
                    <span>
                        {startDate.toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                    <span>⏰</span>
                    <span>
                        {startDate.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {endDate.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
                <div className="pt-2 border-t border-border">
                    <p className="text-text-tertiary italic">{info.line3}</p>
                </div>
            </div>

            <div className="flex gap-2 mt-auto pt-4">
                <button
                    onClick={() => onEdit?.(reserva)}
                    className="text-xs px-3 py-1.5 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                >
                    Editar
                </button>
                <button
                    onClick={() => onCancel?.(reserva)}
                    className="text-xs px-3 py-1.5 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}
