import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
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
                Paleta corporativa con modo claro y oscuro configurada
              </p>
            </div>

            <div className="p-4 bg-accent-50 dark:bg-dark-accent-50 rounded-lg border border-accent-200 dark:border-dark-accent-200">
              <h2 className="text-lg font-semibold text-accent-700 dark:text-dark-accent-700 mb-2">
                ⚡ React + Vite + Tailwind
              </h2>
              <p className="text-sm text-text-secondary">
                Stack moderno con React Router y Zustand
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
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                Botones
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Botón Principal</Button>
                <Button variant="accent">Botón Acento</Button>
                <Button variant="outline">Botón Outline</Button>
                <Button variant="ghost">Botón Ghost</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                Tarjetas
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Card
                  title="Material Disponible"
                  description="Ver todo el material disponible para reserva"
                />
                <Card
                  title="Mis Reservas"
                  description="Gestiona tus reservas activas"
                />
                <Card
                  title="Configuración"
                  description="Ajustes de la aplicación"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                Inputs
              </h3>
              <div className="max-w-md space-y-3">
                <Input label="Nombre" placeholder="Introduce tu nombre" />
                <Input label="Email" type="email" placeholder="tu@email.com" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
