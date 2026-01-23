export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="card max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-primary-500 rounded-xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                        IES
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        IES El Rincón
                    </h1>
                    <p className="text-text-secondary mt-2">
                        Portal de Reservas
                    </p>
                </div>

                <form className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-text-primary mb-2"
                        >
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="usuario@ieselrincon.es"
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-text-primary mb-2"
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="input-field"
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full">
                        Iniciar Sesión
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-border dark:border-dark-border">
                    <p className="text-sm text-text-secondary text-center">
                        ¿Problemas para acceder? Contacta con el administrador
                    </p>
                </div>
            </div>
        </div>
    );
}
