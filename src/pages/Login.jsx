import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email.trim() && password.trim()) {
            const result = await login(email, password);
            if (result.success) {
                navigate("/");
            }
        }
    };

    return (
        <div
            className="
      h-screen
      flex items-center justify-center
      bg-background
    "
        >
            <div
                className="
        bg-surface
        rounded-lg
        shadow-lg
        p-8
        w-full
        max-w-md
        border border-border
      "
            >
                <h1
                    className="
          text-2xl
          font-semibold
          text-text-primary
          mb-6
          text-center
        "
                >
                    Iniciar Sesión
                </h1>

                {error && (
                    <div
                        className="
            bg-red-500/10
            border border-red-500
            text-red-500
            px-4
            py-3
            rounded-md
            mb-4
            text-sm
          "
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label
                            className="
              block
              text-sm
              font-medium
              text-text-primary
              mb-1
            "
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="
                w-full
                px-3
                py-2
                border border-border
                rounded-md
                bg-background
                text-text-primary
                text-sm
                focus:outline-none
                focus:ring-1 focus:ring-primary-400
              "
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label
                            className="
              block
              text-sm
              font-medium
              text-text-primary
              mb-1
            "
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Tu contraseña"
                            className="
                w-full
                px-3
                py-2
                border border-border
                rounded-md
                bg-background
                text-text-primary
                text-sm
                focus:outline-none
                focus:ring-1 focus:ring-primary-400
              "
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="
              w-full
              bg-primary-500
              hover:bg-primary-600
              text-white
              font-medium
              py-2
              px-4
              rounded-md
              transition-colors
              mt-2
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
                    >
                        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </button>
                </form>

                <p
                    className="
          text-xs
          text-text-secondary
          text-center
          mt-4
        "
                >
                    Ingresa tus credenciales para acceder al sistema.
                </p>
            </div>
        </div>
    );
}
