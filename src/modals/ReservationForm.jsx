import { useState, useEffect } from "react";
import useAuthStore from "../store/AuthStore";
import useReservasStore from "../store/ReservasStore";
import useMaterialStore from "../store/MaterialStore";
import useAulasStore from "../store/AulasStore";
import { formatDateForBackend } from "../utils/dateFormat";

export default function ReservationForm({ onBack, date, onSuccess, reserva }) {
    const { user } = useAuthStore();
    const { createReserva, updateReserva, reservas, fetchReservas } =
        useReservasStore();
    const {
        material,
        fetchMaterial,
        isLoading: loadingMaterial,
    } = useMaterialStore();
    const { aulas, fetchAulas, isLoading: loadingAulas } = useAulasStore();

    // Modo edición si se proporciona una reserva existente
    const isEditMode = !!reserva;
    const selectedDate = date;

    const [formData, setFormData] = useState({
        material_ids: [], // Array de IDs de materiales
        room_id: "", // ID del aula (room)
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

    // Pre-rellenar formulario si estamos editando
    useEffect(() => {
        if (reserva) {
            const startDate = new Date(reserva.fecha_inicio);
            const endDate = new Date(reserva.fecha_fin);

            // El backend retorna objetos anidados
            // materials es un array de objetos, room es un objeto
            const materialIds = reserva.materials
                ? reserva.materials.map((m) => m.id)
                : [];
            const roomId = reserva.room ? reserva.room.id.toString() : "";

            setFormData({
                material_ids: materialIds,
                room_id: roomId,
                fecha_inicio: startDate.toISOString().slice(0, 16),
                fecha_fin: endDate.toISOString().slice(0, 16),
                observaciones: reserva.observaciones || "",
            });
        }
    }, [reserva]);

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

    /**
     * Verifica si hay solapamiento entre dos rangos de fechas
     */
    const checkOverlap = (start1, end1, start2, end2) => {
        return start1 < end2 && start2 < end1;
    };

    /**
     * Valida si la nueva reserva solapa con reservas existentes
     * Retorna objeto con isValid y mensaje de error
     * Adaptado para trabajar con objetos anidados del backend
     */
    const validateOverlap = (newReserva) => {
        const newStart = new Date(newReserva.fecha_inicio);
        const newEnd = new Date(newReserva.fecha_fin);

        // Filtrar reservas activas que podrían solapar
        const conflictingReservas = reservas.filter((r) => {
            if (r.estado !== "activa") return false;

            // Excluir la reserva actual si estamos editando
            if (reserva && r.id === reserva.id) return false;

            const existingStart = new Date(r.fecha_inicio);
            const existingEnd = new Date(r.fecha_fin);

            // Verificar solapamiento de tiempo
            if (!checkOverlap(newStart, newEnd, existingStart, existingEnd)) {
                return false;
            }

            // Backend retorna materials como array de objetos y room como objeto
            // Verificar solapamiento de materiales
            if (newReserva.material_ids && r.materials) {
                const rMaterialIds = r.materials.map((m) => m.id);
                const hasOverlap = newReserva.material_ids.some((id) =>
                    rMaterialIds.includes(id),
                );
                if (hasOverlap) return true;
            }

            // Verificar solapamiento de aula/room
            if (newReserva.room_id && r.room) {
                if (r.room.id === newReserva.room_id) return true;
            }

            return false;
        });

        if (conflictingReservas.length > 0) {
            const conflict = conflictingReservas[0];
            const startTime = new Date(conflict.fecha_inicio).toLocaleString(
                "es-ES",
                {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                },
            );
            const endTime = new Date(conflict.fecha_fin).toLocaleTimeString(
                "es-ES",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                },
            );

            // Detectar qué recurso(s) está(n) en conflicto
            const conflictingResources = [];

            // Verificar materiales en conflicto
            if (conflict.materials && newReserva.material_ids) {
                const conflictMaterialIds = conflict.materials.map((m) => m.id);
                const hasConflict = newReserva.material_ids.some((id) =>
                    conflictMaterialIds.includes(id),
                );
                if (hasConflict) conflictingResources.push("material");
            }

            // Verificar aula en conflicto
            if (
                conflict.room &&
                newReserva.room_id &&
                conflict.room.id === newReserva.room_id
            ) {
                conflictingResources.push("aula");
            }

            // Generar mensaje según los recursos en conflicto
            let resourceText = "";
            if (conflictingResources.length === 2) {
                resourceText = "la misma aula y el mismo material";
            } else if (conflictingResources.includes("aula")) {
                resourceText = "la misma aula";
            } else if (conflictingResources.includes("material")) {
                resourceText = "el mismo material";
            } else {
                resourceText = "el mismo recurso";
            }

            return {
                isValid: false,
                message: `Ya existe una reserva con ${resourceText} en ese horario (${startTime} - ${endTime}). Por favor, elige otro horario o recurso.`,
            };
        }

        return { isValid: true };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validaciones - al menos uno debe estar seleccionado
        if (formData.material_ids.length === 0 && !formData.room_id) {
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
            // CRÍTICO: Recargar reservas desde servidor antes de validar
            // Esto previene condiciones de carrera donde dos usuarios reservan simultáneamente
            await fetchReservas(true);

            // Formato correcto para el backend Laravel
            const reservaData = {
                user_id: user.id,
                ...(formData.room_id && {
                    room_id: parseInt(formData.room_id),
                }),
                ...(formData.material_ids.length > 0 && {
                    material_ids: formData.material_ids.map((id) =>
                        parseInt(id),
                    ),
                }),
                fecha_inicio: formatDateForBackend(formData.fecha_inicio),
                fecha_fin: formatDateForBackend(formData.fecha_fin),
                observaciones: formData.observaciones,
            };

            // Validar solapamiento con datos frescos del servidor
            const validation = validateOverlap(reservaData);
            if (!validation.isValid) {
                setError(validation.message);
                setLoading(false);
                return;
            }

            // Crear o actualizar la reserva en el servidor
            const result = isEditMode
                ? await updateReserva(reserva.id, reservaData)
                : await createReserva(reservaData);

            if (result.success) {
                if (onSuccess) onSuccess();
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
                    {/* Material (múltiple selección) */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Material (opcional - mantén Ctrl/Cmd para
                            seleccionar varios)
                        </label>
                        {loadingData ? (
                            <div className="text-sm text-text-secondary">
                                Cargando...
                            </div>
                        ) : (
                            <select
                                name="material_ids"
                                value={formData.material_ids}
                                onChange={(e) => {
                                    const selectedOptions = Array.from(
                                        e.target.selectedOptions,
                                        (option) => parseInt(option.value),
                                    );
                                    setFormData((prev) => ({
                                        ...prev,
                                        material_ids: selectedOptions,
                                    }));
                                }}
                                disabled={loading}
                                multiple
                                size={5}
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                            >
                                {material
                                    .filter((item) => item.disponible)
                                    .map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nombre} ({item.codigo})
                                        </option>
                                    ))}
                            </select>
                        )}
                        {formData.material_ids.length > 0 && (
                            <p className="text-xs text-text-secondary mt-1">
                                {formData.material_ids.length} material(es)
                                seleccionado(s)
                            </p>
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
                                name="room_id"
                                value={formData.room_id}
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
                        {loading
                            ? isEditMode
                                ? "Guardando cambios..."
                                : "Creando reserva..."
                            : isEditMode
                              ? "Guardar cambios"
                              : "Enviar reserva"}
                    </button>
                </form>
            </div>
        </div>
    );
}
