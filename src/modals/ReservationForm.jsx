import { useState, useEffect } from "react";
import useAuthStore from "../store/AuthStore";
import useReservasStore from "../store/ReservasStore";
import useMaterialStore from "../store/MaterialStore";
import useAulasStore from "../store/AulasStore";

export default function ReservationForm({ onBack, date, onSuccess }) {
    const { user } = useAuthStore();
    const { createReserva } = useReservasStore();
    const {
        material,
        fetchMaterial,
        isLoading: loadingMaterial,
    } = useMaterialStore();
    const { aulas, fetchAulas, isLoading: loadingAulas } = useAulasStore();

    // Compatibilidad: date o selectedDate
    const selectedDate = date;

    const [formData, setFormData] = useState({
        material_id: "",
        aula_id: "",
        fecha_inicio: "",
        fecha_fin: "",
        observaciones: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadingData = loadingMaterial || loadingAulas;

    // Cargar material y aulas disponibles desde stores
    useEffect(() => {
        fetchMaterial();
        fetchAulas();
    }, [fetchMaterial, fetchAulas]);

    // Formatear fecha seleccionada para los inputs
    useEffect(() => {
        if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
            const day = String(selectedDate.getDate()).padStart(2, "0");
            const dateStr = `${year}-${month}-${day}`;

            setFormData((prev) => ({
                ...prev,
                fecha_inicio: `${dateStr}T08:00`,
                fecha_fin: `${dateStr}T09:00`,
            }));
        }
    }, [selectedDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validaciones - al menos uno debe estar seleccionado
        if (!formData.material_id && !formData.aula_id) {
            setError("Debes seleccionar al menos un material o un aula.");
            return;
        }

        if (!formData.fecha_inicio || !formData.fecha_fin) {
            setError("Debes seleccionar un horario completo.");
            return;
        }

        if (new Date(formData.fecha_inicio) >= new Date(formData.fecha_fin)) {
            setError("La hora de fin debe ser posterior a la de inicio.");
            return;
        }

        if (!formData.observaciones.trim()) {
            setError("Debes indicar el motivo de la reserva.");
            return;
        }

        setLoading(true);
        try {
            const reservaData = {
                user_id: user.id,
                ...(formData.material_id && {
                    material_id: parseInt(formData.material_id),
                }),
                ...(formData.aula_id && {
                    aula_id: parseInt(formData.aula_id),
                }),
                fecha_inicio: new Date(formData.fecha_inicio).toISOString(),
                fecha_fin: new Date(formData.fecha_fin).toISOString(),
                estado: "activa",
                observaciones: formData.observaciones,
                created_at: new Date().toISOString(),
            };

            const result = await createReserva(reservaData);

            if (result.success) {
                if (onSuccess) onSuccess();
                if (onClose) onClose();
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error("Error al crear reserva:", err);
            setError("Error al crear la reserva");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface">
            {/* Botón volver */}
            {onBack && (
                <div className="border-b border-border p-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="
                            text-primary-500
                            hover:text-primary-700
                            font-medium
                            text-sm
                            flex items-center gap-1
                        "
                    >
                        ← Volver al calendario
                    </button>
                </div>
            )}

            <div className="p-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Material */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Material (opcional)
                        </label>
                        {loadingData ? (
                            <div className="text-sm text-text-secondary">
                                Cargando...
                            </div>
                        ) : (
                            <select
                                name="material_id"
                                value={formData.material_id}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                            >
                                <option value="">
                                    -- Seleccionar material --
                                </option>
                                {material
                                    .filter((item) => item.disponible)
                                    .map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nombre} ({item.codigo})
                                        </option>
                                    ))}
                            </select>
                        )}
                    </div>

                    {/* Aulas */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Aula (opcional)
                        </label>
                        {loadingData ? (
                            <div className="text-sm text-text-secondary">
                                Cargando...
                            </div>
                        ) : (
                            <select
                                name="aula_id"
                                value={formData.aula_id}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                            >
                                <option value="">-- Seleccionar aula --</option>
                                {aulas
                                    .filter((aula) => aula.disponible)
                                    .map((aula) => (
                                        <option key={aula.id} value={aula.id}>
                                            {aula.nombre} - {aula.tipo} (
                                            {aula.capacidad} pers.)
                                        </option>
                                    ))}
                            </select>
                        )}
                    </div>

                    {/* Horario */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Horario
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="datetime-local"
                                name="fecha_inicio"
                                value={formData.fecha_inicio}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        fecha_inicio: e.target.value,
                                    }))
                                }
                                disabled={loading}
                                className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                            />
                            <input
                                type="datetime-local"
                                name="fecha_fin"
                                value={formData.fecha_fin}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        fecha_fin: e.target.value,
                                    }))
                                }
                                disabled={loading}
                                className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Observaciones
                        </label>
                        <textarea
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="Describe el motivo de la reserva..."
                            rows={4}
                            className="
              w-full
              px-3
              py-2
              border border-border
              rounded-md
              bg-background
              text-sm
              resize-none
              disabled:opacity-50
            "
                        />
                    </div>

                    {/* Zona fija para errores */}
                    <div className="min-h-[20px]">
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || loadingData}
                        className="
            w-full
            bg-primary-500
            hover:bg-primary-600
            text-white
            font-medium
            py-2
            rounded
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
                    >
                        {loading ? "Creando reserva..." : "Enviar reserva"}
                    </button>
                </form>
            </div>
        </div>
    );
}
