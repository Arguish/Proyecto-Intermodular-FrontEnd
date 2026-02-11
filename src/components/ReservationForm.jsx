import { useState } from "react";

export default function ReservationForm({ onClose }) {
  const [formData, setFormData] = useState({
    aula: "",
    item: "",
    horaInicio: "",
    horaFin: "",
    motivo: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1️⃣ Aula o Ítem (al menos uno)
    if (!formData.aula && !formData.item) {
      setError("Debes seleccionar al menos un aula o un ítem.");
      return;
    }

    // 2️⃣ Horario completo
    if (!formData.horaInicio || !formData.horaFin) {
      setError("Debes seleccionar una hora de inicio y una de fin.");
      return;
    }

    // 3️⃣ Horario válido
    if (formData.horaInicio >= formData.horaFin) {
      setError("La hora de fin debe ser posterior a la de inicio.");
      return;
    }

    // 4️⃣ Motivo obligatorio (no solo espacios)
    if (!formData.motivo.trim()) {
      setError("Debes indicar el motivo de la reserva.");
      return;
    }

    // ✅ Todo correcto
    setError("");
    console.log("Reserva enviada:", formData);
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
        h-[460px]
        flex flex-col
        p-4
      "
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
        {/* Aula */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Aula
          </label>
          <select
            name="aula"
            value={formData.aula}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
          >
            <option value="">-- Seleccionar aula --</option>
            <option value="aula-201">Aula 201</option>
            <option value="aula-202">Aula 202</option>
            <option value="aula-203">Aula 203</option>
            <option value="laboratorio-1">Laboratorio 1</option>
            <option value="laboratorio-2">Laboratorio 2</option>
            <option value="salon-actos">Salón de actos</option>
            <option value="biblioteca">Biblioteca</option>
          </select>
        </div>

        {/* Ítem */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Ítem
          </label>
          <select
            name="item"
            value={formData.item}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
          >
            <option value="">-- Seleccionar ítem --</option>
            <option value="rv-1">Gafas RV 1</option>
            <option value="rv-2">Gafas RV 2</option>
            <option value="rv-3">Gafas RV 3</option>
            <option value="portatil-1">Portátil 1</option>
            <option value="portatil-2">Portátil 2</option>
            <option value="portatil-3">Portátil 3</option>
            <option value="proyector">Proyector</option>
            <option value="camara">Cámara de vídeo</option>
          </select>
        </div>

        {/* Horario */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Horario
          </label>
          <div className="flex gap-2">
            <input
              type="time"
              name="horaInicio"
              value={formData.horaInicio}
              onChange={handleChange}
              min="08:00"
              max="23:00"
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm"
            />
            <input
              type="time"
              name="horaFin"
              value={formData.horaFin}
              onChange={handleChange}
              min="08:00"
              max="23:00"
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm"
            />
          </div>
        </div>

        {/* Motivo */}
        <div className="flex flex-col flex-1">
          <label className="block text-sm font-medium text-text-primary mb-1">
            Motivo
          </label>
          <textarea
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            placeholder="Describe el motivo de la reserva..."
            className="
              w-full
              flex-1
              px-3
              py-2
              border border-border
              rounded-md
              bg-background
              text-sm
              resize-none
            "
          />
        </div>

        {/* Zona fija para errores */}
        <div className="min-h-[20px]">
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}
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
            rounded
          "
        >
          Enviar reserva
        </button>
      </form>
    </div>
  );
}
