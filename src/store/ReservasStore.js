import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { reservasAPI } from "../lib/api";

const useReservasStore = create(
    devtools(
        (set, get) => ({
            // Estado
            reservas: [],
            isLoading: false,
            error: null,
            lastFetch: null,

            // Fetch con caché inteligente
            fetchReservas: async (forceRefresh = false) => {
                const { reservas, lastFetch } = get();

                // Si ya hay datos y no es refresh forzado, usar caché
                if (!forceRefresh && reservas.length > 0 && lastFetch) {
                    const timeSinceLastFetch = Date.now() - lastFetch;
                    // Caché válido por 30 segundos
                    if (timeSinceLastFetch < 30000) {
                        return;
                    }
                }

                set({ isLoading: true, error: null });
                try {
                    const response = await reservasAPI.getAll();
                    // Backend retorna { data: [ reservations ] }
                    const reservasData = response.data.data || response.data;
                    set({
                        reservas: reservasData,
                        isLoading: false,
                        lastFetch: Date.now(),
                    });
                } catch (error) {
                    console.error("Error al cargar reservas:", error);
                    set({
                        error: error.message,
                        isLoading: false,
                    });
                }
            },

            // Añadir reserva al estado local
            addReserva: (reserva) => {
                set((state) => ({
                    reservas: [...state.reservas, reserva],
                }));
            },

            // Crear reserva (API + estado local)
            createReserva: async (data) => {
                try {
                    const response = await reservasAPI.create(data);
                    get().addReserva(response.data);
                    return { success: true, data: response.data };
                } catch (error) {
                    console.error("Error al crear reserva:", error);
                    return {
                        success: false,
                        error:
                            error.response?.data?.message ||
                            "Error al crear reserva",
                    };
                }
            },

            // Actualizar reserva
            updateReserva: async (id, data) => {
                try {
                    const response = await reservasAPI.update(id, data);
                    set((state) => ({
                        reservas: state.reservas.map((r) =>
                            r.id === id ? response.data : r,
                        ),
                    }));
                    return { success: true, data: response.data };
                } catch (error) {
                    console.error("Error al actualizar reserva:", error);
                    return {
                        success: false,
                        error:
                            error.response?.data?.message ||
                            "Error al actualizar reserva",
                    };
                }
            },

            // Eliminar reserva
            deleteReserva: async (id) => {
                try {
                    await reservasAPI.delete(id);
                    set((state) => ({
                        reservas: state.reservas.filter((r) => r.id !== id),
                    }));
                    return { success: true };
                } catch (error) {
                    console.error("Error al eliminar reserva:", error);
                    return {
                        success: false,
                        error:
                            error.response?.data?.message ||
                            "Error al eliminar reserva",
                    };
                }
            },

            // Limpiar error
            clearError: () => set({ error: null }),

            // Forzar recarga (útil para refrescar después de operaciones)
            refresh: () => get().fetchReservas(true),
        }),
        { name: "ReservasStore" },
    ),
);

export default useReservasStore;
