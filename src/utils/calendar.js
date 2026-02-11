export const DAYS = {
    short: ["L", "M", "X", "J", "V", "S", "D"],
    long: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ],
};

export const MONTHS = {
    long: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ],
};

/**
 * Genera las celdas del calendario para un mes específico
 * @param {number} year - Año del calendario
 * @param {number} month - Mes del calendario (0-11)
 * @returns {Array} Array de objetos con day y currentMonth
 */
export function generateCalendarCells(year, month) {
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = (firstDayOfMonth.getDay() + 6) % 7; // Convertir domingo (0) a domingo (6)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // Días del mes anterior
    for (let i = startDay - 1; i >= 0; i--) {
        cells.push({
            day: daysInPrevMonth - i,
            currentMonth: false,
        });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
        cells.push({
            day: i,
            currentMonth: true,
        });
    }

    // Días del mes siguiente (completar 6 semanas = 42 días)
    while (cells.length < 42) {
        cells.push({
            day: cells.length - (startDay + daysInMonth) + 1,
            currentMonth: false,
        });
    }

    return cells;
}

/**
 * Verifica si un día específico tiene reservas activas
 * @param {number} day - Día del mes
 * @param {number} month - Mes (0-11)
 * @param {number} year - Año
 * @param {Array} reservas - Array de reservas
 * @returns {boolean} True si el día tiene reservas activas
 */
export function hasDayReservations(day, month, year, reservas) {
    const dateToCheck = new Date(year, month, day);
    return reservas.some((reserva) => {
        const reservaDate = new Date(reserva.fecha_inicio);
        return (
            reservaDate.getDate() === dateToCheck.getDate() &&
            reservaDate.getMonth() === dateToCheck.getMonth() &&
            reservaDate.getFullYear() === dateToCheck.getFullYear() &&
            reserva.estado === "activa"
        );
    });
}

/**
 * Navega al mes anterior
 * @param {Date} currentDate - Fecha actual del calendario
 * @returns {Date} Nueva fecha del mes anterior
 */
export function getPreviousMonth(currentDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month - 1, 1);
}

/**
 * Navega al mes siguiente
 * @param {Date} currentDate - Fecha actual del calendario
 * @returns {Date} Nueva fecha del mes siguiente
 */
export function getNextMonth(currentDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 1);
}

/**
 * Filtra las reservas de un día específico
 * @param {Date} date - Fecha del día a filtrar
 * @param {Array} reservas - Array de todas las reservas
 * @returns {Array} Array de reservas del día especificado
 */
export function getDayReservations(date, reservas) {
    return reservas.filter((reserva) => {
        const reservaDate = new Date(reserva.fecha_inicio);
        return (
            reservaDate.getDate() === date.getDate() &&
            reservaDate.getMonth() === date.getMonth() &&
            reservaDate.getFullYear() === date.getFullYear()
        );
    });
}

/**
 * Genera un array de franjas horarias
 * @param {number} startHour - Hora de inicio (0-23)
 * @param {number} endHour - Hora de fin (0-23)
 * @returns {Array<string>} Array con las franjas horarias en formato "HH:00"
 */
export function generateTimeSlots(startHour = 8, endHour = 24) {
    const slots = [];
    for (let i = startHour; i < endHour; i++) {
        slots.push(`${i}:00`);
    }
    return slots;
}

/**
 * Busca si hay una reserva activa en una franja horaria específica
 * @param {string} time - Hora en formato "HH:00"
 * @param {Array} dayReservations - Reservas del día
 * @returns {Object|undefined} La reserva encontrada o undefined
 */
export function getReservationAtTime(time, dayReservations) {
    const [hour] = time.split(":");
    return dayReservations.find((reserva) => {
        const inicio = new Date(reserva.fecha_inicio);
        const fin = new Date(reserva.fecha_fin);
        const timeHour = parseInt(hour);
        return inicio.getHours() <= timeHour && fin.getHours() > timeHour;
    });
}

/**
 * Formatea la fecha para mostrar en el header del popup
 * @param {Date} date - Fecha a formatear
 * @returns {Object} Objeto con dayOfWeek, dayOfMonth y month
 */
export function formatDateHeader(date) {
    return {
        dayOfWeek: DAYS.long[date.getDay()],
        dayOfMonth: date.getDate(),
        month: MONTHS.long[date.getMonth()],
    };
}
