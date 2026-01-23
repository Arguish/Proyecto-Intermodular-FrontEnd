import { useState } from "react";

export default function ReservationForm({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    observaciones: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora no hace nada funcional
    console.log("Formulario enviado:", formData);
  };

  return (
    <div 
      style={{
        position: "fixed",
        top: "50%",
        left: "calc(50% - 625px)",
        transform: "translateY(-50%)",
        zIndex: 50,
      }}
      className="
      bg-surface
      shadow-lg
      w-[375px]
      h-[420px]
      flex flex-col
      p-4
      overflow-y-auto
    ">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
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
          <label className="block text-sm font-medium text-text-primary mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
          <label className="block text-sm font-medium text-text-primary mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="123 456 789"
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

        <div className="flex-1">
          <label className="block text-sm font-medium text-text-primary mb-1">
            Observaciones
          </label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            placeholder="Deja un comentario..."
            className="
              w-full
              h-full
              px-3
              py-2
              border border-border
              rounded-md
              bg-background
              text-text-primary
              text-sm
              focus:outline-none
              focus:ring-1 focus:ring-primary-400
              resize-none
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
            rounded
            transition-colors
          "
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
