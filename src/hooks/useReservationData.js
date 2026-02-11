import { useCallback } from "react";
import useMaterialStore from "../store/MaterialStore";
import useAulasStore from "../store/AulasStore";
import useAuthStore from "../store/AuthStore";

/**
 * Hook personalizado para obtener información de reservas
 * Proporciona funciones para obtener nombres de materiales, aulas, usuarios y etiquetas de reservas
 */
export default function useReservationData() {
    const { getMaterialById } = useMaterialStore();
    const { getAulaById } = useAulasStore();
    const { user: currentUser } = useAuthStore();

    /**
     * Obtiene el nombre del material por su ID
     */
    const getMaterialName = useCallback(
        (materialId) => {
            if (!materialId) return null;
            const item = getMaterialById(materialId);
            return item ? item.nombre : "Material no encontrado";
        },
        [getMaterialById],
    );

    /**
     * Obtiene el nombre del aula por su ID
     */
    const getAulaName = useCallback(
        (aulaId) => {
            if (!aulaId) return null;
            const aula = getAulaById(aulaId);
            return aula ? aula.nombre : "Aula no encontrada";
        },
        [getAulaById],
    );

    /**
     * Obtiene el nombre del usuario por su ID
     */
    const getUserName = useCallback(
        (userId) => {
            // Si no hay userId, es un invitado
            if (!userId || userId === 0) return "Invitado";
            // Si es el usuario actual, retornarlo directamente
            if (currentUser && currentUser.id === userId) {
                return currentUser.name;
            }
            // Para otros usuarios, retornar placeholder (en producción harías fetch)
            return `Usuario #${userId}`;
        },
        [currentUser],
    );

    /**
     * Obtiene la etiqueta descriptiva de una reserva
     * Combina material y aula si ambos existen
     */
    const getReservationLabel = useCallback(
        (reservation) => {
            const parts = [];
            if (reservation.material_id) {
                const materialName = getMaterialName(reservation.material_id);
                if (materialName) parts.push(materialName);
            }
            if (reservation.aula_id) {
                const aulaName = getAulaName(reservation.aula_id);
                if (aulaName) parts.push(aulaName);
            }
            return parts.length > 0 ? parts.join(" + ") : "Reserva";
        },
        [getMaterialName, getAulaName],
    );

    /**
     * Obtiene información completa formateada de la reserva
     * Retorna objeto con líneas separadas para mostrar en el calendario
     */
    const getReservationInfo = useCallback(
        (reservation) => {
            const userName = getUserName(reservation.user_id);
            const aulaName = getAulaName(reservation.aula_id);
            const materialName = getMaterialName(reservation.material_id);

            return {
                // Línea 1: Usuario + Aula
                line1: [userName, aulaName].filter(Boolean).join(" - "),
                // Línea 2: Material (si existe)
                line2: materialName || null,
                // Línea 3: Observaciones (motivo)
                line3: reservation.observaciones || "Sin motivo especificado",
            };
        },
        [getUserName, getAulaName, getMaterialName],
    );

    return {
        getMaterialName,
        getAulaName,
        getUserName,
        getReservationLabel,
        getReservationInfo,
    };
}
