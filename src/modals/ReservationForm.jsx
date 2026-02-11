import { useState, useEffect } from "react";
import { materialAPI, aulasAPI, reservasAPI } from "../lib/api";
import useAuthStore from "../store";

export default function ReservationForm({ onClose, selectedDate, onSuccess }) {
    const { user } = useAuthStore();
    const [formData, setFormData] = useState({
        material_id: "",
        aula_id: "",
        fecha_inicio: "",
        fecha_fin: "",
        observaciones: "",
    });

    const [material, setMaterial] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState("");

    // Cargar material y aulas disponibles
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [materialRes, aulasRes] = await Promise.all([
                    materialAPI.getAll(),
                    aulasAPI.getAll(),
                ]);
                setMaterial(materialRes.data.filter((item) => item.disponible));
                setAulas(aulasRes.data.filter((item) => item.disponible));
            } catch (err) {
                console.error("Error al cargar datos:", err);
                setError("Error al cargar el material y aulas disponibles");
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

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

            await reservasAPI.create(reservaData);

            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (err) {
            console.error("Error al crear reserva:", err);
            setError(
                err.response?.data?.message || "Error al crear la reserva",
            );
        } finally {
            setLoading(false);
        }
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
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 h-full"
            >
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
                            {material.map((item) => (
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
                            {aulas.map((aula) => (
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
                <div className="flex flex-col flex-1">
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Observaciones
                    </label>
                    <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        disabled={loading}
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
              disabled:opacity-50
            "
                    />
                </div>

                {/* Zona fija para errores */}
                <div className="min-h-[20px]">
                    {error && <p className="text-sm text-red-500">{error}</p>}
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
    );
}
