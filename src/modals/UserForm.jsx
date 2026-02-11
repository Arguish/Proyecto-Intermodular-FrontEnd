import { useState, useEffect } from "react";
import useUsersStore from "../store/UsersStore";

export default function UserForm({ user, onSuccess }) {
    const { createUser, updateUser } = useUsersStore();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "alumno",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Pre-rellenar formulario si estamos editando
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                password: "", // No pre-rellenamos la contraseña por seguridad
                role: user.role || "alumno",
            });
        }
    }, [user]);

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

        // Validaciones
        if (!formData.name.trim()) {
            setError("El nombre es obligatorio.");
            return;
        }

        if (!formData.email.trim()) {
            setError("El email es obligatorio.");
            return;
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("El email no es válido.");
            return;
        }

        // Solo validar contraseña en modo creación
        if (!user && !formData.password.trim()) {
            setError("La contraseña es obligatoria.");
            return;
        }

        if (!user && formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setLoading(true);
        try {
            const userData = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                created_at: user?.created_at || new Date().toISOString(),
            };

            // Solo incluir password si se proporcionó (crear o actualizar)
            if (formData.password.trim()) {
                userData.password = formData.password;
            }

            const result = user
                ? await updateUser(user.id, userData)
                : await createUser(userData);

            if (result.success) {
                if (onSuccess) onSuccess();
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error(
                `Error al ${user ? "actualizar" : "crear"} usuario:`,
                err,
            );
            setError(`Error al ${user ? "actualizar" : "crear"} el usuario`);
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
                        Nombre completo *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ej: Juan Pérez"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Email *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ej: juan@ejemplo.com"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    />
                </div>

                {/* Contraseña */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Contraseña{" "}
                        {user ? "(dejar vacío para no cambiar)" : "*"}
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder={
                            user
                                ? "Dejar vacío para no cambiar"
                                : "Mínimo 6 caracteres"
                        }
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    />
                </div>

                {/* Rol */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Rol *
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-50"
                    >
                        <option value="alumno">Alumno</option>
                        <option value="profesor">Profesor</option>
                        <option value="admin">Administrador</option>
                    </select>
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
                        ? user
                            ? "Guardando cambios..."
                            : "Creando usuario..."
                        : user
                          ? "Guardar cambios"
                          : "Crear usuario"}
                </button>
            </form>
        </div>
    );
}
