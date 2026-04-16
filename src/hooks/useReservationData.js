import { useCallback } from "react";

/**
 * Hook personalizado para obtener información de reservas
 * Adaptado para trabajar con objetos anidados del backend Laravel
 * El backend retorna: { user: {...}, room: {...}, materials: [...] }
 */
export default function useReservationData() {
    /**
     * Obtiene el nombre del material desde el objeto anidado
     */
    const getMaterialName = useCallback((reservation) => {
        if (!reservation.materials || reservation.materials.length === 0)
            return null;
        // Si hay múltiples materiales, unirlos con comas
        return reservation.materials.map((m) => m.nombre).join(", ");
    }, []);

    /**
     * Obtiene el nombre del aula/room desde el objeto anidado
     */
    const getRoomName = useCallback((reservation) => {
        if (!reservation.room) return null;
        return reservation.room.nombre;
    }, []);

    /**
     * Obtiene el nombre del usuario desde el objeto anidado
     */
    const getUserName = useCallback((reservation) => {
        if (!reservation.user) return "Usuario desconocido";
        return reservation.user.name;
    }, []);

    /**
     * Obtiene la etiqueta descriptiva de una reserva
     * Combina material y aula si ambos existen
     */
    const getReservationLabel = useCallback(
        (reservation) => {
            const parts = [];
            const materialName = getMaterialName(reservation);
            if (materialName) parts.push(materialName);
            const roomName = getRoomName(reservation);
            if (roomName) parts.push(roomName);
            return parts.length > 0 ? parts.join(" + ") : "Reserva";
        },
        [getMaterialName, getRoomName],
    );

    /**
     * Obtiene información completa formateada de la reserva
     * Retorna objeto con líneas separadas para mostrar en el calendario
     */
    const getReservationInfo = useCallback(
        (reservation) => {
            const userName = getUserName(reservation);
            const roomName = getRoomName(reservation);
            const materialName = getMaterialName(reservation);

            return {
                // Línea 1: Usuario + Aula
                line1: [userName, roomName].filter(Boolean).join(" - "),
                // Línea 2: Material (si existe)
                line2: materialName || null,
                // Línea 3: Observaciones (motivo)
                line3: reservation.observaciones || "Sin motivo especificado",
            };
        },
        [getUserName, getRoomName, getMaterialName],
    );

    return {
        getMaterialName,
        getRoomName,
        getUserName,
        getReservationLabel,
        getReservationInfo,
    };
}
