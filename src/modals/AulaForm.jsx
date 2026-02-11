import { useState, useEffect } from "react";
import useAulasStore from "../store/AulasStore";

export default function AulaForm({ aula, onSuccess }) {
    const { createAula, updateAula } = useAulasStore();

    const [formData, setFormData] = useState({
        nombre: "",
        tipo: "",
        capacidad: "",
        ubicacion: "",
        disponible: true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Pre-rellenar formulario si estamos editando
    useEffect(() => {
        if (aula) {
            setFormData({
                nombre: aula.nombre || "",
                tipo: aula.tipo || "",
                capacidad: aula.capacidad?.toString() || "",
                ubicacion: aula.ubicacion || "",
                disponible: aula.disponible !== false,
            });
        }
    }, [aula]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validaciones
        if (!formData.nombre.trim()) {
            setError("El nombre es obligatorio.");
            return;
        }

        if (!formData.tipo.trim()) {
            setError("El tipo de aula es obligatorio.");
            return;
        }

        if (!formData.capacidad || parseInt(formData.capacidad) <= 0) {
            setError("La capacidad debe ser un número mayor a 0.");
            return;
        }

        if (!formData.ubicacion.trim()) {
            setError("La ubicación es obligatoria.");
            return;
        }

        setLoading(true);
        try {
            const aulaData = {
                nombre: formData.nombre,
                tipo: formData.tipo,
                capacidad: parseInt(formData.capacidad),
                ubicacion: formData.ubicacion,
                disponible: formData.disponible,
                created_at: aula?.created_at || new Date().toISOString(),
            };

            const result = aula
                ? await updateAula(aula.id, aulaData)
                : await createAula(aulaData);

            if (result.success) {
                if (onSuccess) onSuccess();
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error(
                `Error al ${aula ? "actualizar" : "crear"} aula:`,
                err,
            );
            setError(`Error al ${aula ? "actualizar" : "crear"} el aula`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Nombre *
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ej: Aula 101"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    />
                </div>

                {/* Tipo */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Tipo *
                    </label>
                    <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    >
                        <option value="">-- Seleccionar tipo --</option>
                        <option value="Aula estándar">Aula estándar</option>
                        <option value="Laboratorio">Laboratorio</option>
                        <option value="Taller">Taller</option>
                        <option value="Sala de reuniones">
                            Sala de reuniones
                        </option>
                        <option value="Auditorio">Auditorio</option>
                        <option value="Gimnasio">Gimnasio</option>
                    </select>
                </div>

                {/* Capacidad */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Capacidad *
                    </label>
                    <input
                        type="number"
                        name="capacidad"
                        value={formData.capacidad}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ej: 30"
                        min="1"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    />
                </div>

                {/* Ubicación */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Ubicación *
                    </label>
                    <input
                        type="text"
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ej: Planta 1, Edificio A"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    />
                </div>

                {/* Disponible */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="disponible"
                        name="disponible"
                        checked={formData.disponible}
                        onChange={handleChange}
                        disabled={loading}
                        className="rounded border-border text-primary-500 focus:ring-primary-500"
                    />
                    <label
                        htmlFor="disponible"
                        className="text-sm text-text-primary"
                    >
                        Aula disponible para reserva
                    </label>
                </div>

                {/* Zona fija para errores */}
                <div className="min-h-[20px]">
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading
                        ? aula
                            ? "Guardando cambios..."
                            : "Creando aula..."
                        : aula
                          ? "Guardar cambios"
                          : "Crear aula"}
                </button>
            </form>
        </div>
    );
}
