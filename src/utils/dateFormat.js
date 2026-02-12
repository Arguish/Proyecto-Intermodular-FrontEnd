/**
 * Utilidades para formatear fechas según el formato esperado por el backend Laravel
 * Backend acepta: "YYYY-MM-DD HH:mm:ss" (formato Laravel)
 * Backend retorna: ISO 8601 con microsegundos (ej: "2026-02-15T09:00:00.000000Z")
 */

/**
 * Convierte una fecha/hora a formato Laravel: "YYYY-MM-DD HH:mm:ss"
 * @param {Date|string} date - Fecha a convertir
 * @returns {string} Fecha formateada para el backend
 */
export const formatDateForBackend = (date) => {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Convierte una fecha del backend (ISO 8601) a Date
 * @param {string} dateString - Fecha en formato ISO del backend
 * @returns {Date} Objeto Date
 */
export const parseDateFromBackend = (dateString) => {
    return new Date(dateString);
};

/**
 * Formatea una fecha para mostrar en la UI (español)
 * @param {Date|string} date - Fecha a formatear
 * @param {object} options - Opciones de formateo (Intl.DateTimeFormat)
 * @returns {string} Fecha formateada
 */
export const formatDateForDisplay = (date, options = {}) => {
    const defaultOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...options,
    };
    return new Date(date).toLocaleDateString("es-ES", defaultOptions);
};

/**
 * Formatea una hora para mostrar en la UI (español)
 * @param {Date|string} date - Fecha/hora a formatear
 * @returns {string} Hora formateada (HH:mm)
 */
export const formatTimeForDisplay = (date) => {
    return new Date(date).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

/**
 * Formatea fecha y hora completa para mostrar en la UI
 * @param {Date|string} date - Fecha/hora a formatear
 * @returns {string} Fecha y hora formateadas
 */
export const formatDateTimeForDisplay = (date) => {
    return new Date(date).toLocaleString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
