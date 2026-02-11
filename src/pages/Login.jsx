import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim() && password.trim()) {
      login(name, email, password);
      navigate("/");
    }
  };

  return (
    <div className="
      h-screen
      flex items-center justify-center
      bg-background
    ">
      <div className="
        bg-surface
        rounded-lg
        shadow-lg
        p-8
        w-full
        max-w-md
        border border-border
      ">
        <h1 className="
          text-2xl
          font-semibold
          text-text-primary
          mb-6
          text-center
        ">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="
              block
              text-sm
              font-medium
              text-text-primary
              mb-1
            ">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
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
            />
          </div>

          <div>
            <label className="
              block
              text-sm
              font-medium
              text-text-primary
              mb-1
            ">
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
            />
          </div>

          <div>
            <label className="
              block
              text-sm
              font-medium
              text-text-primary
              mb-1
            ">
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
            />
          </div>

          <button
            type="submit"
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
            "
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="
          text-xs
          text-text-secondary
          text-center
          mt-4
        ">
          Este es un formulario de prueba. Se guardará en localStorage.
        </p>
      </div>
    </div>
  );
}
