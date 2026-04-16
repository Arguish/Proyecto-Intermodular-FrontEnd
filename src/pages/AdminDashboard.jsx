import { useEffect, useState } from "react";
import useReservasStore from "../store/ReservasStore";
import useMaterialStore from "../store/MaterialStore";
import useAulasStore from "../store/AulasStore";
import useUsersStore from "../store/UsersStore";
import useModalStore from "../store/ModalStore";
import useReservationData from "../hooks/useReservationData";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("reservas");

    const {
        reservas,
        fetchReservas,
        isLoading: loadingReservas,
    } = useReservasStore();
    const {
        material,
        fetchMaterial,
        isLoading: loadingMaterial,
    } = useMaterialStore();
    const { aulas, fetchAulas, isLoading: loadingAulas } = useAulasStore();
    const { users, fetchUsers, isLoading: loadingUsers } = useUsersStore();
    const { openModal, closeAllModals } = useModalStore();
    const { getUserName } = useReservationData();

    useEffect(() => {
        fetchReservas(true);
        fetchMaterial();
        fetchAulas();
        fetchUsers();
    }, [fetchReservas, fetchMaterial, fetchAulas, fetchUsers]);

    const handleEditReservation = (reserva) => {
        openModal("adminReservationForm", {
            reserva,
            onSuccess: () => {
                closeAllModals();
                fetchReservas(true);
            },
        });
    };

    const handleCreateReservation = () => {
        const today = new Date();
        openModal("adminReservationForm", {
            date: today,
            onSuccess: () => {
                closeAllModals();
                fetchReservas(true);
            },
        });
    };

    const handleCreateMaterial = () => {
        openModal("materialForm", {
            onSuccess: () => {
                closeAllModals();
                fetchMaterial(true);
            },
        });
    };

    const handleCreateAula = () => {
        openModal("aulaForm", {
            onSuccess: () => {
                closeAllModals();
                fetchAulas(true);
            },
        });
    };

    const handleCreateUser = () => {
        openModal("userForm", {
            onSuccess: () => {
                closeAllModals();
                fetchUsers(true);
            },
        });
    };

    const tabs = [
        { id: "reservas", label: "Reservas Recientes", icon: "📋" },
        { id: "material", label: "Gestionar Material", icon: "📦" },
        { id: "aulas", label: "Gestionar Aulas", icon: "🏫" },
        { id: "usuarios", label: "Gestionar Usuarios", icon: "👥" },
    ];

    const isLoading =
        loadingReservas || loadingMaterial || loadingAulas || loadingUsers;

    return (
        <div className="flex-1 p-6 bg-background overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Dashboard Administrador
                    </h1>
                    <p className="text-text-secondary">
                        Panel de control y gestión del sistema
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-12 text-text-secondary">
                        Cargando datos...
                    </div>
                ) : (
                    <div className="bg-surface border border-border rounded-lg overflow-hidden">
                        {/* Tabs Header */}
                        <div className="flex border-b border-border bg-background">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 px-4 py-4 text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? "text-primary-600 border-b-2 border-primary-600 bg-surface"
                                            : "text-text-secondary hover:text-text-primary hover:bg-surface"
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === "reservas" && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-text-primary">
                                            Reservas Recientes
                                        </h2>
                                        <button
                                            onClick={handleCreateReservation}
                                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                                        >
                                            ➕ Añadir Reserva
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {reservas
                                            .slice(0, 20)
                                            .map((reserva) => {
                                                const date = new Date(
                                                    reserva.fecha_inicio,
                                                );
                                                // Backend retorna objeto user anidado
                                                const userName = reserva.user
                                                    ? reserva.user.name
                                                    : "Invitado";
                                                return (
                                                    <button
                                                        key={reserva.id}
                                                        onClick={() =>
                                                            handleEditReservation(
                                                                reserva,
                                                            )
                                                        }
                                                        className="w-full flex items-center justify-between py-3 px-4 border border-border rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-all text-left"
                                                    >
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-text-primary">
                                                                {userName}
                                                            </p>
                                                            <p className="text-xs text-text-secondary">
                                                                {date.toLocaleDateString(
                                                                    "es-ES",
                                                                    {
                                                                        weekday:
                                                                            "short",
                                                                        day: "numeric",
                                                                        month: "short",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    },
                                                                )}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                                                                reserva.estado ===
                                                                "activa"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : reserva.estado ===
                                                                        "cancelada"
                                                                      ? "bg-red-100 text-red-700"
                                                                      : "bg-gray-100 text-gray-700"
                                                            }`}
                                                        >
                                                            {reserva.estado}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}

                            {activeTab === "material" && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-text-primary">
                                            Material
                                        </h2>
                                        <button
                                            onClick={handleCreateMaterial}
                                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                                        >
                                            ➕ Añadir Material
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-background border-b border-border">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Nombre
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Código
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Categoría
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Estado
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Disponible
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {material.map((item) => (
                                                    <tr
                                                        key={item.id}
                                                        className="hover:bg-background transition-colors"
                                                    >
                                                        <td className="px-4 py-3 text-sm text-text-primary font-medium">
                                                            {item.nombre}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-text-secondary">
                                                            {item.codigo}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-text-secondary">
                                                            {item.categoria}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-text-secondary">
                                                            {item.estado}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                                    item.disponible
                                                                        ? "bg-green-100 text-green-700"
                                                                        : "bg-red-100 text-red-700"
                                                                }`}
                                                            >
                                                                {item.disponible
                                                                    ? "Sí"
                                                                    : "No"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === "aulas" && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-text-primary">
                                            Aulas
                                        </h2>
                                        <button
                                            onClick={handleCreateAula}
                                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                                        >
                                            ➕ Añadir Aula
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-background border-b border-border">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Nombre
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Tipo
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Capacidad
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Ubicación
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Disponible
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {aulas.map((aula) => (
                                                    <tr
                                                        key={aula.id}
                                                        className="hover:bg-background transition-colors"
                                                    >
                                                        <td className="px-4 py-3 text-sm text-text-primary font-medium">
                                                            {aula.nombre}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-text-secondary">
                                                            {aula.tipo}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-text-secondary">
                                                            {aula.capacidad}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-text-secondary">
                                                            {aula.ubicacion}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                                    aula.disponible
                                                                        ? "bg-green-100 text-green-700"
                                                                        : "bg-red-100 text-red-700"
                                                                }`}
                                                            >
                                                                {aula.disponible
                                                                    ? "Sí"
                                                                    : "No"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === "usuarios" && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-text-primary">
                                            Usuarios
                                        </h2>
                                        <button
                                            onClick={handleCreateUser}
                                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                                        >
                                            ➕ Añadir Usuario
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-background border-b border-border">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Nombre
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Email
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Rol
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                                                        Fecha Creación
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {users.map((user) => (
                                                    <tr
                                                        key={user.id}
                                                        className="hover:bg-background transition-colors"
                                                    >
                                                        <td className="px-4 py-3 text-sm text-text-primary font-medium">
                                                            {user.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-text-secondary">
                                                            {user.email}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                                    user.role ===
                                                                    "admin"
                                                                        ? "bg-purple-100 text-purple-700"
                                                                        : user.role ===
                                                                            "profesor"
                                                                          ? "bg-blue-100 text-blue-700"
                                                                          : "bg-gray-100 text-gray-700"
                                                                }`}
                                                            >
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-text-secondary">
                                                            {new Date(
                                                                user.created_at,
                                                            ).toLocaleDateString(
                                                                "es-ES",
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
