import { useState, useEffect } from "react";
import useAuthStore from "../store/AuthStore";
import useReservasStore from "../store/ReservasStore";
import useMaterialStore from "../store/MaterialStore";
import useAulasStore from "../store/AulasStore";
import useUsersStore from "../store/UsersStore";

export default function AdminReservationForm({ reserva, date, onSuccess }) {
    const { user: currentUser } = useAuthStore();
    const { createReserva, updateReserva, reservas, fetchReservas } =
        useReservasStore();
    const {
        material,
        fetchMaterial,
        isLoading: loadingMaterial,
    } = useMaterialStore();
    const { aulas, fetchAulas, isLoading: loadingAulas } = useAulasStore();
    const { users, fetchUsers, isLoading: loadingUsers } = useUsersStore();

    const [formData, setFormData] = useState({
        user_id: "",
        material_id: "",
        aula_id: "",
        fecha_inicio: "",
        fecha_fin: "",
        observaciones: "",
        estado: "activa",
        es_invitado: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadingData = loadingMaterial || loadingAulas || loadingUsers;

    // Cargar datos necesarios
    useEffect(() => {
        fetchMaterial();
        fetchAulas();
        fetchUsers();
    }, [fetchMaterial, fetchAulas, fetchUsers]);

    // Pre-rellenar formulario con la reserva existente
    useEffect(() => {
        if (reserva) {
            const startDate = new Date(reserva.fecha_inicio);
            const endDate = new Date(reserva.fecha_fin);

            setFormData({
                user_id: reserva.user_id?.toString() || "",
                material_id: reserva.material_id?.toString() || "",
                aula_id: reserva.aula_id?.toString() || "",
                fecha_inicio: startDate.toISOString().slice(0, 16),
                fecha_fin: endDate.toISOString().slice(0, 16),
                observaciones: reserva.observaciones || "",
                estado: reserva.estado || "activa",
                es_invitado: reserva.user_id === null || reserva.user_id === 0,
            });
        }
    }, [reserva]);

    // Establecer fechas iniciales en modo creación
    useEffect(() => {
        if (!reserva && date) {
            const selectedDate = new Date(date);
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
    }, [date, reserva]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    /**
     * Verifica si hay solapamiento entre dos rangos de fechas
     */
    const checkOverlap = (start1, end1, start2, end2) => {
        return start1 < end2 && start2 < end1;
    };

    /**
     * Valida si la reserva modificada solapa con otras reservas
     */
    const validateOverlap = (newReserva) => {
        const newStart = new Date(newReserva.fecha_inicio);
        const newEnd = new Date(newReserva.fecha_fin);

        const conflictingReservas = reservas.filter((r) => {
            if (r.estado !== "activa") return false;
            if (r.id === reserva.id) return false;

            const existingStart = new Date(r.fecha_inicio);
            const existingEnd = new Date(r.fecha_fin);

            if (!checkOverlap(newStart, newEnd, existingStart, existingEnd)) {
                return false;
            }

            if (
                newReserva.material_id &&
                r.material_id === newReserva.material_id
            ) {
                return true;
            }

            if (newReserva.aula_id && r.aula_id === newReserva.aula_id) {
                return true;
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

            const conflictingResources = [];

            if (
                newReserva.material_id &&
                conflict.material_id &&
                conflict.material_id === newReserva.material_id
            ) {
                conflictingResources.push("material");
            }

            if (
                newReserva.aula_id &&
                conflict.aula_id &&
                conflict.aula_id === newReserva.aula_id
            ) {
                conflictingResources.push("aula");
            }

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

        // Validaciones
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

        if (!formData.es_invitado && !formData.user_id) {
            setError("Debes seleccionar un usuario o marcar como invitado.");
            return;
        }

        setLoading(true);
        try {
            await fetchReservas(true);

            const reservaData = {
                user_id: formData.es_invitado
                    ? null
                    : parseInt(formData.user_id),
                ...(formData.material_id && {
                    material_id: parseInt(formData.material_id),
                }),
                ...(formData.aula_id && {
                    aula_id: parseInt(formData.aula_id),
                }),
                fecha_inicio: new Date(formData.fecha_inicio).toISOString(),
                fecha_fin: new Date(formData.fecha_fin).toISOString(),
                estado: formData.estado,
                observaciones: formData.observaciones,
            };

            // Solo validar solapamiento si el estado es activo
            if (formData.estado === "activa") {
                const validation = validateOverlap(reservaData);
                if (!validation.isValid) {
                    setError(validation.message);
                    setLoading(false);
                    return;
                }
            }

            // Crear o actualizar según el modo
            let result;
            if (reserva) {
                // Modo edición
                result = await updateReserva(reserva.id, reservaData);
            } else {
                // Modo creación
                reservaData.created_at = new Date().toISOString();
                result = await createReserva(reservaData);
            }

            if (result.success) {
                if (onSuccess) onSuccess();
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error(
                `Error al ${reserva ? "actualizar" : "crear"} reserva:`,
                err,
            );
            setError(`Error al ${reserva ? "actualizar" : "crear"} la reserva`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Usuario o Invitado */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Usuario asignado
                    </label>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="es_invitado"
                                name="es_invitado"
                                checked={formData.es_invitado}
                                onChange={handleChange}
                                disabled={loading}
                                className="rounded border-border text-primary-500 focus:ring-primary-500"
                            />
                            <label
                                htmlFor="es_invitado"
                                className="text-sm text-text-secondary"
                            >
                                Reserva de invitado (sin usuario asignado)
                            </label>
                        </div>
                        {!formData.es_invitado && (
                            <select
                                name="user_id"
                                value={formData.user_id}
                                onChange={handleChange}
                                disabled={loading || loadingData}
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                            >
                                <option value="">
                                    -- Seleccionar usuario --
                                </option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email}) - {user.role}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* Estado */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Estado de la reserva
                    </label>
                    <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    >
                        <option value="activa">Activa</option>
                        <option value="cancelada">Cancelada</option>
                        <option value="completada">Completada</option>
                        <option value="pendiente">Pendiente</option>
                    </select>
                </div>

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
                            <option value="">-- Seleccionar material --</option>
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
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm resize-none disabled:opacity-50"
                    />
                </div>

                {/* Zona fija para errores */}
                <div className="min-h-[20px]">
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading || loadingData}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading
                        ? reserva
                            ? "Guardando cambios..."
                            : "Creando reserva..."
                        : reserva
                          ? "Guardar cambios"
                          : "Crear reserva"}
                </button>
            </form>
        </div>
    );
}
