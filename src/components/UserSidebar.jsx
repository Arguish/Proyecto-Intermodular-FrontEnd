import useAuthStore from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import SidebarButton from "./SidebarButton";
import SidebarSeparator from "./SidebarSeparator";

export default function UserSidebar({ isOpen, onClose }) {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        onClose();
        navigate("/login");
    };

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
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
                        {/* Información de cuenta */}
                        <div>
                            <p className="text-xs font-medium text-text-secondary mb-3">
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

                        <SidebarSeparator />

                        {/* Opciones del menú */}
                        <div>
                            <p className="text-xs font-medium text-text-secondary mb-3">
                                OPCIONES
                            </p>
                            <div className="space-y-1">
                                <SidebarButton
                                    text="Mis Reservas"
                                    onClick={() => handleNavigation("/my-reservations")}
                                />

                                {user?.role === "admin" && (
                                    <SidebarButton
                                        text="Dashboard"
                                        onClick={() => handleNavigation("/admin/dashboard")}
                                    />
                                )}
                            </div>
                        </div>

                        <SidebarSeparator />

                        <div>
                            <SidebarButton
                                text="Cerrar Sesión"
                                variant="danger"
                                onClick={handleLogout}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
