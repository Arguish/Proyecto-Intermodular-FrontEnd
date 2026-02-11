import { useEffect } from "react";
import useReservasStore from "../store/ReservasStore";
import useMaterialStore from "../store/MaterialStore";
import useAulasStore from "../store/AulasStore";

export default function AdminDashboard() {
    const {
        reservas,
        fetchReservas,
        isLoading: loadingReservas,
    } = useReservasStore();
    const {
        material,
        fetchMaterial,
        isLoading: loadingMaterial,
    } = useMaterialStore();
    const { aulas, fetchAulas, isLoading: loadingAulas } = useAulasStore();

    useEffect(() => {
        fetchReservas(true);
        fetchMaterial();
        fetchAulas();
    }, [fetchReservas, fetchMaterial, fetchAulas]);

    const stats = {
        totalReservas: reservas.length,
        reservasActivas: reservas.filter((r) => r.estado === "activa").length,
        totalMaterial: material.length,
        materialDisponible: material.filter((m) => m.disponible).length,
        totalAulas: aulas.length,
        aulasDisponibles: aulas.filter((a) => a.disponible).length,
    };

    const StatCard = ({ title, value, subtitle, icon, color = "primary" }) => (
        <div
            className={`bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-text-secondary mb-1">{title}</p>
                    <p className={`text-3xl font-bold text-${color}-600 mb-1`}>
                        {value}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-text-tertiary">{subtitle}</p>
                    )}
                </div>
                <span className="text-3xl">{icon}</span>
            </div>
        </div>
    );

    const isLoading = loadingReservas || loadingMaterial || loadingAulas;

    return (
        <div className="flex-1 p-6 bg-background overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Dashboard Administrador
                    </h1>
                    <p className="text-text-secondary">
                        Panel de control y estadísticas del sistema
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-12 text-text-secondary">
                        Cargando datos...
                    </div>
                ) : (
                    <>
                        {/* Estadísticas principales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <StatCard
                                title="Reservas Totales"
                                value={stats.totalReservas}
                                subtitle={`${stats.reservasActivas} activas`}
                                icon="📋"
                                color="primary"
                            />
                            <StatCard
                                title="Material"
                                value={stats.totalMaterial}
                                subtitle={`${stats.materialDisponible} disponibles`}
                                icon="📦"
                                color="blue"
                            />
                            <StatCard
                                title="Aulas"
                                value={stats.totalAulas}
                                subtitle={`${stats.aulasDisponibles} disponibles`}
                                icon="🏫"
                                color="green"
                            />
                        </div>

                        {/* Secciones placeholder */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Reservas recientes */}
                            <div className="bg-surface border border-border rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-text-primary mb-4">
                                    Reservas Recientes
                                </h2>
                                <div className="space-y-3">
                                    {reservas.slice(0, 5).map((reserva) => {
                                        const date = new Date(
                                            reserva.fecha_inicio,
                                        );
                                        return (
                                            <div
                                                key={reserva.id}
                                                className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-text-primary">
                                                        Usuario #
                                                        {reserva.user_id}
                                                    </p>
                                                    <p className="text-xs text-text-secondary">
                                                        {date.toLocaleDateString(
                                                            "es-ES",
                                                        )}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded ${
                                                        reserva.estado ===
                                                        "activa"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {reserva.estado}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Acciones rápidas */}
                            <div className="bg-surface border border-border rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-text-primary mb-4">
                                    Acciones Rápidas
                                </h2>
                                <div className="space-y-2">
                                    <button className="w-full text-left px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
                                        ➕ Añadir Material
                                    </button>
                                    <button className="w-full text-left px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
                                        🏫 Gestionar Aulas
                                    </button>
                                    <button className="w-full text-left px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
                                        👥 Ver Usuarios
                                    </button>
                                    <button className="w-full text-left px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
                                        📊 Generar Reporte
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
