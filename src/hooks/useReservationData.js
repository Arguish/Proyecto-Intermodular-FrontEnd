import { useCallback } from "react";
import useMaterialStore from "../store/MaterialStore";
import useAulasStore from "../store/AulasStore";

/**
 * Hook personalizado para obtener información de reservas
 * Proporciona funciones para obtener nombres de materiales, aulas y etiquetas de reservas
 */
export default function useReservationData() {
    const { getMaterialById } = useMaterialStore();
    const { getAulaById } = useAulasStore();

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

    return {
        getMaterialName,
        getAulaName,
        getReservationLabel,
    };
}
