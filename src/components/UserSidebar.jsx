import useAuthStore from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

export default function UserSidebar({ isOpen, onClose }) {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        onClose();
        navigate("/login");
    };

    return (
        <>
            {/* Sidebar */}
            <div
                className={`
          fixed top-12 right-0 h-[calc(100vh-12px)] w-64 bg-surface-alt z-50
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          border-l border-border
        `}
                style={{
                    transform: isOpen ? "translateX(0)" : "translateX(100%)",
                }}
            >
                {/* Contenido scrolleable */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                        <div className="pb-4 border-b border-border">
                            <p className="text-xs font-medium text-text-secondary mb-2">
                                CUENTA
                            </p>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-xs text-text-secondary mb-1">
                                        Nombre
                                    </p>
                                    <p className="text-text-primary">
                                        {user?.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-text-secondary mb-1">
                                        Email
                                    </p>
                                    <p className="text-text-primary">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-medium text-text-secondary mb-3">
                                OPCIONES
                            </p>
                            <button
                                className="
                w-full
                text-left
                px-0
                py-2
                text-xs
                text-text-primary
                hover:text-primary-500
                transition-colors
              "
                            >
                                Mis Reservas
                            </button>
                            <button
                                className="
                w-full
                text-left
                px-0
                py-2
                text-xs
                text-text-primary
                hover:text-primary-500
                transition-colors
              "
                            >
                                Configuración
                            </button>
                            <button
                                className="
                w-full
                text-left
                px-0
                py-2
                text-xs
                text-text-primary
                hover:text-primary-500
                transition-colors
              "
                            >
                                Ayuda
                            </button>

                            <div className="pt-4 border-t border-border">
                                <button
                                    onClick={handleLogout}
                                    className="
                    text-xs
                    text-red-500
                    cursor-pointer
                    hover:text-red-600
                    transition-colors
                  "
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
