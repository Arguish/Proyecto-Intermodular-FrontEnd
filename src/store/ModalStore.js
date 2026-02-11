import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Store global para gestión de modales
 * Permite abrir/cerrar modales desde cualquier parte de la aplicación
 */
const useModalStore = create(
    devtools(
        (set, get) => ({
            // Array de modales activos (permite apilar múltiples modales)
            modals: [],

            /**
             * Abre un nuevo modal
             * @param {string} type - Tipo de modal ('reservationDay', 'confirmDelete', etc.)
             * @param {object} props - Props que recibe el modal
             */
            openModal: (type, props = {}) => {
                const id = Date.now() + Math.random(); // ID único
                set((state) => ({
                    modals: [...state.modals, { id, type, props }],
                }));
                return id;
            },

            /**
             * Cierra un modal específico por ID
             * @param {number} id - ID del modal a cerrar
             */
            closeModal: (id) => {
                set((state) => ({
                    modals: state.modals.filter((modal) => modal.id !== id),
                }));
            },

            /**
             * Reemplaza el tipo y props de un modal existente
             * Útil para navegación interna sin cerrar/abrir
             * @param {number} id - ID del modal a reemplazar
             * @param {string} newType - Nuevo tipo de modal
             * @param {object} newProps - Nuevos props
             */
            replaceModal: (id, newType, newProps = {}) => {
                set((state) => ({
                    modals: state.modals.map((modal) =>
                        modal.id === id
                            ? { ...modal, type: newType, props: newProps }
                            : modal
                    ),
                }));
            },

            /**
             * Cierra el último modal abierto (el que está en el top)
             */
            closeTopModal: () => {
                set((state) => ({
                    modals: state.modals.slice(0, -1),
                }));
            },

            /**
             * Cierra todos los modales
             */
            closeAllModals: () => {
                set({ modals: [] });
            },

            /**
             * Obtiene el modal activo en el top
             */
            getTopModal: () => {
                const { modals } = get();
                return modals[modals.length - 1] || null;
            },
        }),
        { name: "ModalStore" },
    ),
);

export default useModalStore;
