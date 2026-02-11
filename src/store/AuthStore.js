import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { authAPI } from "../lib/api";

const useAuthStore = create(
    devtools(
        persist(
            (set, get) => ({
                // Estado
                user: null,
                token: localStorage.getItem("auth_token") || null,
                isAuthenticated: false,
                isLoading: false,
                error: null,

                // Acciones
                login: async (email, password) => {
                    set({ isLoading: true, error: null });
                    try {
                        const response = await authAPI.login(email, password);
                        const { token, user } = response.data;

                        // Guardar token en localStorage
                        localStorage.setItem("auth_token", token);

                        set({
                            user,
                            token,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });

                        return { success: true };
                    } catch (error) {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Error al iniciar sesión";
                        set({
                            error: errorMessage,
                            isLoading: false,
                            isAuthenticated: false,
                        });
                        return { success: false, error: errorMessage };
                    }
                },

                logout: async () => {
                    try {
                        await authAPI.logout();
                    } catch (error) {
                        console.error("Error al cerrar sesión:", error);
                    } finally {
                        // Limpiar estado y localStorage
                        localStorage.removeItem("auth_token");
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            error: null,
                        });
                    }
                },

                checkAuth: async () => {
                    const token = localStorage.getItem("auth_token");
                    if (!token) {
                        set({ isAuthenticated: false, user: null });
                        return;
                    }

                    set({ isLoading: true });
                    try {
                        const response = await authAPI.me();
                        set({
                            user: response.data,
                            token,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                    } catch (error) {
                        // Token inválido o expirado
                        localStorage.removeItem("auth_token");
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: null,
                        });
                    }
                },

                clearError: () => set({ error: null }),

                // Actualizar usuario
                setUser: (user) => set({ user }),
            }),
            {
                name: "auth-storage",
                partialize: (state) => ({
                    token: state.token,
                    user: state.user,
                }),
            },
        ),
        { name: "AuthStore" },
    ),
);

export default useAuthStore;
