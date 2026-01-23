export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background">
            <header className="bg-surface border-b border-border dark:bg-dark-surface dark:border-dark-border">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
                            IES
                        </div>
                        <h1 className="text-xl font-bold text-text-primary">
                            Dashboard
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-text-secondary">
                            Profesor: Juan Pérez
                        </span>
                        <button className="btn-secondary text-sm">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-text-secondary">
                                Reservas Activas
                            </h3>
                            <span className="text-2xl">📚</span>
                        </div>
                        <p className="text-3xl font-bold text-text-primary">
                            5
                        </p>
                        <p className="text-sm text-success-600 dark:text-dark-success-600 mt-1">
                            +2 esta semana
                        </p>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-text-secondary">
                                Pendientes Devolución
                            </h3>
                            <span className="text-2xl">⏰</span>
                        </div>
                        <p className="text-3xl font-bold text-text-primary">
                            2
                        </p>
                        <p className="text-sm text-warning-600 dark:text-dark-warning-600 mt-1">
                            Vencen en 3 días
                        </p>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-text-secondary">
                                Material Disponible
                            </h3>
                            <span className="text-2xl">📦</span>
                        </div>
                        <p className="text-3xl font-bold text-text-primary">
                            48
                        </p>
                        <p className="text-sm text-info-600 dark:text-dark-info-600 mt-1">
                            Ver inventario
                        </p>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-text-primary">
                            Mis Reservas
                        </h2>
                        <button className="btn-primary">Nueva Reserva</button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="p-4 bg-surface-alt dark:bg-dark-surface-alt rounded-lg border border-border dark:border-dark-border"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-text-primary">
                                            Portátil HP EliteBook {item}
                                        </h3>
                                        <p className="text-sm text-text-secondary mt-1">
                                            Código: LAP-00{item} • Desde:
                                            20/01/2026 • Hasta: 25/01/2026
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="btn-accent text-sm">
                                            Devolver
                                        </button>
                                        <button className="btn-secondary text-sm">
                                            Renovar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
