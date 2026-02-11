import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store";
import UserSidebar from "../components/UserSidebar";

export default function Header() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <header
            className="
      h-12
      flex items-center justify-center
      px-4
      border-b border-border
      bg-surface
      text-text-primary
      relative
    "
        >
            <div className="font-semibold text-sm text-primary-500">Classy</div>

            {user ? (
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="
            absolute right-0
            flex items-center gap-3
            bg-surface-alt
            px-4
            py-0
            h-full
            text-text-primary
            hover:text-primary-500
            transition-colors
            cursor-pointer
          "
                    title="Mi perfil"
                >
                    <span className="text-xs">Hola, {user.name}</span>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </button>
            ) : (
                <button
                    onClick={() => navigate("/login")}
                    className="absolute right-4 text-xs text-primary-500 cursor-pointer hover:underline"
                >
                    Iniciar sesión
                </button>
            )}

            <UserSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
        </header>
    );
}
