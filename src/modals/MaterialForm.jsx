import { useState, useEffect } from "react";
import useMaterialStore from "../store/MaterialStore";

export default function MaterialForm({ material, onSuccess }) {
    const { createMaterial, updateMaterial } = useMaterialStore();

    const [formData, setFormData] = useState({
        nombre: "",
        codigo: "",
        barcode: "",
        categoria: "",
        disponible: true,
        estado: "Bueno",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Pre-rellenar formulario si estamos editando
    useEffect(() => {
        if (material) {
            setFormData({
                nombre: material.nombre || "",
                codigo: material.codigo || "",
                barcode: material.barcode || "",
                categoria: material.categoria || "",
                disponible: material.disponible !== false,
                estado: material.estado || "Bueno",
            });
        }
    }, [material]);

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

        if (!formData.codigo.trim()) {
            setError("El código es obligatorio.");
            return;
        }

        if (!formData.categoria.trim()) {
            setError("La categoría es obligatoria.");
            return;
        }

        setLoading(true);
        try {
            const materialData = {
                ...formData,
                created_at: material?.created_at || new Date().toISOString(),
            };

            const result = material
                ? await updateMaterial(material.id, materialData)
                : await createMaterial(materialData);

            if (result.success) {
                if (onSuccess) onSuccess();
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error(
                `Error al ${material ? "actualizar" : "crear"} material:`,
                err,
            );
            setError(
                `Error al ${material ? "actualizar" : "crear"} el material`,
            );
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
                        placeholder="Ej: Portátil HP EliteBook"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    />
                </div>

                {/* Código */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Código *
                    </label>
                    <input
                        type="text"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ej: PORT-001"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    />
                </div>

                {/* Código de barras */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Código de barras (opcional)
                    </label>
                    <input
                        type="text"
                        name="barcode"
                        value={formData.barcode}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ej: 7891234567890"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    />
                </div>

                {/* Categoría */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Categoría *
                    </label>
                    <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    >
                        <option value="">-- Seleccionar categoría --</option>
                        <option value="Informática">Informática</option>
                        <option value="Audiovisual">Audiovisual</option>
                        <option value="Mobiliario">Mobiliario</option>
                        <option value="Deportes">Deportes</option>
                        <option value="Laboratorio">Laboratorio</option>
                        <option value="Otros">Otros</option>
                    </select>
                </div>

                {/* Estado */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Estado
                    </label>
                    <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    >
                        <option value="Bueno">Bueno</option>
                        <option value="Regular">Regular</option>
                        <option value="Malo">Malo</option>
                        <option value="En reparación">En reparación</option>
                    </select>
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
                        Material disponible para reserva
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
                        ? material
                            ? "Guardando cambios..."
                            : "Creando material..."
                        : material
                          ? "Guardar cambios"
                          : "Crear material"}
                </button>
            </form>
        </div>
    );
}
