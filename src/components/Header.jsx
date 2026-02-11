import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import UserSidebar from "./UserSidebar";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="
      h-12
      flex items-center justify-between
      px-4
      border-b border-border
      bg-surface
      text-text-primary
    ">
      <div className="font-semibold text-sm text-primary-500">
        Classy
      </div>

      <div className="flex items-center w-1/3">
        <input
          type="text"
          placeholder="Buscar..."
          className="
            h-7
            w-full
            rounded-md
            border border-border
            bg-background
            px-2
            text-xs
            focus:outline-none
            focus:ring-1 focus:ring-primary-400
          "
        />
        <button className="
          ml-2
          text-text-primary
          hover:text-primary-500
          transition-colors
          cursor-pointer
          flex items-center justify-center
          w-6
          h-6
        ">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>

      {user ? (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="
            flex items-center gap-3
            bg-surface-alt
            px-4
            py-0
            h-full
            -mr-4
            -my-0
            text-text-primary
            hover:text-primary-500
            transition-colors
            cursor-pointer
          "
          title="Mi perfil"
        >
          <span className="text-xs">
            Hola, {user.name}
          </span>
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
          className="text-xs text-primary-500 cursor-pointer hover:underline"
        >
          Iniciar sesión
        </button>
      )}

      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </header>
  );
}
