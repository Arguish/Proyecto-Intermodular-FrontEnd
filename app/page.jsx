import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
    return (
        <main className="min-h-screen bg-background p-8">
            <ThemeToggle />
            <div className="max-w-7xl mx-auto">
                <div className="card mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                            IES
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary">
                                IES El Rincón
                            </h1>
                            <p className="text-text-secondary">
                                Portal de Reservas de Material
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-primary-50 dark:bg-dark-primary-50 rounded-lg border border-primary-200 dark:border-dark-primary-200">
                            <h2 className="text-lg font-semibold text-primary-700 dark:text-dark-primary-700 mb-2">
                                🎨 Sistema de Colores
                            </h2>
                            <p className="text-sm text-text-secondary">
                                Paleta corporativa con modo claro y oscuro
                                configurada
                            </p>
                        </div>

                        <div className="p-4 bg-accent-50 dark:bg-dark-accent-50 rounded-lg border border-accent-200 dark:border-dark-accent-200">
                            <h2 className="text-lg font-semibold text-accent-700 dark:text-dark-accent-700 mb-2">
                                ⚡ Next.js + Tailwind
                            </h2>
                            <p className="text-sm text-text-secondary">
                                Stack moderno con JavaScript configurado
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">
                        Componentes de Ejemplo
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                                Botones
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <button className="btn-primary">
                                    Botón Primario
                                </button>
                                <button className="btn-accent">
                                    Botón Acento
                                </button>
                                <button className="btn-secondary">
                                    Botón Secundario
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                                Colores Semánticos
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="p-4 bg-success-50 dark:bg-dark-success-50 border border-success-500 rounded-lg">
                                    <p className="text-success-700 dark:text-dark-success-700 font-medium">
                                        ✓ Éxito
                                    </p>
                                </div>
                                <div className="p-4 bg-warning-50 dark:bg-dark-warning-50 border border-warning-500 rounded-lg">
                                    <p className="text-warning-700 dark:text-dark-warning-700 font-medium">
                                        ⚠ Advertencia
                                    </p>
                                </div>
                                <div className="p-4 bg-error-50 dark:bg-dark-error-50 border border-error-500 rounded-lg">
                                    <p className="text-error-700 dark:text-dark-error-700 font-medium">
                                        ✕ Error
                                    </p>
                                </div>
                                <div className="p-4 bg-info-50 dark:bg-dark-info-50 border border-info-500 rounded-lg">
                                    <p className="text-info-700 dark:text-dark-info-700 font-medium">
                                        ℹ Información
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                                Input de Ejemplo
                            </h3>
                            <input
                                type="text"
                                placeholder="Buscar material..."
                                className="input-field max-w-md"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-text-tertiary text-sm">
                        Proyecto desarrollado por Antonio (Front/Legal) y Javier
                        (Tech Lead/Front)
                    </p>
                </div>
            </div>
        </main>
    );
}
