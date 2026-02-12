import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { usersAPI } from "../lib/api";

const useUsersStore = create(
    devtools(
        (set, get) => ({
            // Estado
            users: [],
            isLoading: false,
            error: null,
            lastFetch: null,

            // Fetch con caché inteligente
            fetchUsers: async (forceRefresh = false) => {
                const { users, lastFetch } = get();

                // Si ya hay datos y no es refresh forzado, usar caché
                if (!forceRefresh && users.length > 0 && lastFetch) {
                    const timeSinceLastFetch = Date.now() - lastFetch;
                    // Caché válido por 5 minutos
                    if (timeSinceLastFetch < 300000) {
                        return;
                    }
                }

                set({ isLoading: true, error: null });
                try {
                    const response = await usersAPI.getAll();
                    // Backend retorna { data: [ users ] }
                    const usersData = response.data.data || response.data;
                    set({
                        users: usersData,
                        isLoading: false,
                        lastFetch: Date.now(),
                    });
                } catch (error) {
                    console.error("Error al cargar usuarios:", error);
                    set({
                        error: error.message,
                        isLoading: false,
                    });
                }
            },

            // Obtener usuario por ID
            getUserById: (userId) => {
                const { users } = get();
                return users.find((u) => u.id === userId);
            },

            // Añadir usuario al estado local
            addUser: (user) => {
                set((state) => ({
                    users: [...state.users, user],
                }));
            },

            // Crear usuario (API + estado local)
            createUser: async (data) => {
                try {
                    const response = await usersAPI.create(data);
                    get().addUser(response.data);
                    return { success: true, data: response.data };
                } catch (error) {
                    console.error("Error al crear usuario:", error);
                    return {
                        success: false,
                        error:
                            error.response?.data?.message ||
                            "Error al crear usuario",
                    };
                }
            },

            // Actualizar usuario
            updateUser: async (id, data) => {
                try {
                    const response = await usersAPI.update(id, data);
                    set((state) => ({
                        users: state.users.map((u) =>
                            u.id === id ? response.data : u,
                        ),
                    }));
                    return { success: true, data: response.data };
                } catch (error) {
                    console.error("Error al actualizar usuario:", error);
                    return {
                        success: false,
                        error:
                            error.response?.data?.message ||
                            "Error al actualizar usuario",
                    };
                }
            },

            // Eliminar usuario
            deleteUser: async (id) => {
                try {
                    await usersAPI.delete(id);
                    set((state) => ({
                        users: state.users.filter((u) => u.id !== id),
                    }));
                    return { success: true };
                } catch (error) {
                    console.error("Error al eliminar usuario:", error);
                    return {
                        success: false,
                        error:
                            error.response?.data?.message ||
                            "Error al eliminar usuario",
                    };
                }
            },

            // Limpiar caché
            clearCache: () => {
                set({ lastFetch: null });
            },
        }),
        { name: "UsersStore" },
    ),
);

export default useUsersStore;
