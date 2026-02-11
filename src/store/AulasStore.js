import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { aulasAPI } from "../lib/api";

const useAulasStore = create(
    devtools(
        (set, get) => ({
            // Estado
            aulas: [],
            isLoading: false,
            error: null,
            lastFetch: null,

            // Fetch con caché inteligente
            fetchAulas: async (forceRefresh = false) => {
                const { aulas, lastFetch } = get();

                // Si ya hay datos y no es refresh forzado, usar caché
                if (!forceRefresh && aulas.length > 0 && lastFetch) {
                    const timeSinceLastFetch = Date.now() - lastFetch;
                    // Caché válido por 5 minutos
                    if (timeSinceLastFetch < 300000) {
                        return;
                    }
                }

                set({ isLoading: true, error: null });
                try {
                    const response = await aulasAPI.getAll();
                    set({
                        aulas: response.data,
                        isLoading: false,
                        lastFetch: Date.now(),
                    });
                } catch (error) {
                    console.error("Error al cargar aulas:", error);
                    set({
                        error: error.message,
                        isLoading: false,
                    });
                }
            },

            // Obtener aula por ID (del estado local)
            getAulaById: (id) => {
                const { aulas } = get();
                return aulas.find((a) => a.id === parseInt(id));
            },

            // Añadir aula al estado local
            addAula: (aula) => {
                set((state) => ({
                    aulas: [...state.aulas, aula],
                }));
            },

            // Crear aula (API + estado local)
            createAula: async (data) => {
                try {
                    const response = await aulasAPI.create(data);
                    get().addAula(response.data);
                    return { success: true, data: response.data };
                } catch (error) {
                    console.error("Error al crear aula:", error);
                    return {
                        success: false,
                        error:
                            error.response?.data?.message ||
                            "Error al crear aula",
                    };
                }
            },

            // Actualizar aula
            updateAula: async (id, data) => {
                try {
                    const response = await aulasAPI.update(id, data);
                    set((state) => ({
                        aulas: state.aulas.map((a) =>
                            a.id === id ? response.data : a,
                        ),
                    }));
                    return { success: true, data: response.data };
                } catch (error) {
                    console.error("Error al actualizar aula:", error);
                    return {
                        success: false,
                        error:
                            error.response?.data?.message ||
                            "Error al actualizar aula",
                    };
                }
            },

            // Eliminar aula
            deleteAula: async (id) => {
                try {
                    await aulasAPI.delete(id);
                    set((state) => ({
                        aulas: state.aulas.filter((a) => a.id !== id),
                    }));
                    return { success: true };
                } catch (error) {
                    console.error("Error al eliminar aula:", error);
                    return {
                        success: false,
                        error:
                            error.response?.data?.message ||
                            "Error al eliminar aula",
                    };
                }
            },

            // Limpiar error
            clearError: () => set({ error: null }),

            // Forzar recarga
            refresh: () => get().fetchAulas(true),
        }),
        { name: "AulasStore" },
    ),
);

export default useAulasStore;
