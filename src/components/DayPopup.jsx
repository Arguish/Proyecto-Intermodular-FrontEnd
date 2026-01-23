import { useState } from "react";
import { createPortal } from "react-dom";
import ReservationForm from "./ReservationForm";

const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function DayPopup({ date, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const dayOfWeek = dayNames[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = monthNames[date.getMonth()];
  
  // Generar franjas horarias de 8:00 a 23:00
  const timeSlots = [];
  for (let i = 8; i < 24; i++) {
    timeSlots.push(`${i}:00`);
  }

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Pop-up */}
      <div className="
        bg-surface
        shadow-lg
        w-[500px]
        h-[420px]
        flex flex-col
        pointer-events-auto
      ">
        {/* Header - STICKY */}
        <div className="
          sticky top-0
          border-b border-border
          p-4
          bg-primary-50
          z-10
          flex items-center justify-between
        ">
          <h2 className="text-lg font-semibold text-text-primary">
            {dayOfWeek} {dayOfMonth} de {month}
          </h2>
          <button
            onClick={onClose}
            className="
              text-text-primary
              hover:text-text-secondary
              text-2xl
              leading-none
              transition-colors
              cursor-pointer
            "
          >
            ×
          </button>
        </div>

        {/* Botón Reservar - STICKY */}
        <div className="
          sticky top-16
          border-b border-border
          p-4
          bg-surface
          z-10
        ">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="
              w-32
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
            {showForm ? "Ocultar" : "Reservar"}
          </button>
        </div>

        {/* Franjas horarias - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-4">
          {timeSlots.map((time, index) => (
            <div 
              key={index}
              className="
                flex items-center justify-between
                py-2
                text-sm
                text-text-primary
                border-b border-border last:border-b-0
              "
            >
              <span className="font-medium">{time}</span>
              <span className="text-border">-------------------</span>
            </div>
          ))}
        </div>

        {/* Formulario de reserva */}
        {showForm && (
          <ReservationForm onClose={() => setShowForm(false)} />
        )}
      </div>
    </div>,
    document.body
  );
}
