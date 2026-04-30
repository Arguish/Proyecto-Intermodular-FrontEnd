import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { materialAPI } from "../lib/api";

const useMaterialStore = create(
    devtools(
        (set, get) => ({
            // Estado
            material: [],
            isLoading: false,
            error: null,
            lastFetch: null,

            // Fetch con caché inteligente
            fetchMaterial: async (forceRefresh = false) => {
                const { material, lastFetch } = get();
                const currentMaterial = Array.isArray(material) ? material : [];

                // Si ya hay datos y no es refresh forzado, usar caché
                if (!forceRefresh && currentMaterial.length > 0 && lastFetch) {
                    const timeSinceLastFetch = Date.now() - lastFetch;
                    // Caché válido por 5 minutos
                    if (timeSinceLastFetch < 300000) {
                        return;
                    }
                }

                set({ isLoading: true, error: null });
                try {
                    const response = await materialAPI.getAll();
                    // Backend retorna { data: [ materials ] }
                    let materialData = response.data.data || response.data;
                    // Garantizar que siempre sea un array válido
                    materialData = Array.isArray(materialData) ? materialData : [];
                    set({
                        material: materialData,
                        isLoading: false,
                        lastFetch: Date.now(),
                    });
                } catch (error) {
                    console.error("Error al cargar material:", error);
                    set({
                        error: error.message,
                        isLoading: false,
                        material: [], // Asegurar array vacío en error
                    });
                }
            },

            // Obtener material por ID (del estado local)
            getMaterialById: (id) => {
                const { material } = get();
                const currentMaterial = Array.isArray(material) ? material : [];
                return currentMaterial.find((m) => m.id === parseInt(id));
            },

            // Añadir material al estado local
            addMaterial: (item) => {
                set((state) => ({
                    material: [...(Array.isArray(state.material) ? state.material : []), item],
                }));
            },

            // Crear material (API + estado local)
            createMaterial: async (data) => {
                try {
                    const response = await materialAPI.create(data);
                    get().addMaterial(response.data);
                    return { success: true, data: response.data };
                } catch (error) {
                    console.error("Error al crear material:", error);
                    return {
                        success: false,
                        error:
                            error.response?.data?.message ||
                            "Error al crear material",
                    };
                }
            },

            // Actualizar material
            updateMaterial: async (id, data) => {
                try {
                    const response = await materialAPI.update(id, data);
                    set((state) => ({
                        material: (Array.isArray(state.material) ? state.material : []).map((m) =>
                            m.id === id ? response.data : m,
                        ),
                    }));
                    return { success: true, data: response.data };
                } catch (error) {
                    console.error("Error al actualizar material:", error);
                    return {
                        success: false,
                        error:
                            error.response?.data?.message ||
                            "Error al actualizar material",
                    };
                }
            },

            // Eliminar material
            deleteMaterial: async (id) => {
                try {
                    await materialAPI.delete(id);
                    set((state) => ({
                        material: (Array.isArray(state.material) ? state.material : []).filter((m) => m.id !== id),
                    }));
                    return { success: true };
                } catch (error) {
                    console.error("Error al eliminar material:", error);
                    return {
                        success: false,
                        error:
                            error.response?.data?.message ||
                            "Error al eliminar material",
                    };
                }
            },

            // Limpiar error
            clearError: () => set({ error: null }),

            // Forzar recarga
            refresh: () => get().fetchMaterial(true),
        }),
        { name: "MaterialStore" },
    ),
);

export default useMaterialStore;
