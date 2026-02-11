import useModalStore from "../store/ModalStore";
import Modal from "./Modal";
import ReservationDay from "../modals/ReservationDay";
import ReservationForm from "../modals/ReservationForm";
import { formatDateHeader } from "../utils/calendar";

/**
 * Configuración de modales
 * Define componente, título y altura para cada tipo
 */
const MODAL_CONFIG = {
    reservationDay: {
        component: ReservationDay,
        getTitle: (props) => {
            const { dayOfWeek, dayOfMonth, month } = formatDateHeader(
                props.date,
            );
            return `${dayOfWeek} ${dayOfMonth} de ${month}`;
        },
        height: "420px",
        size: "md",
    },
    reservationForm: {
        component: ReservationForm,
        getTitle: () => "Nueva Reserva",
        height: "auto",
        size: "md",
    },
    // Futuros modales:
    // confirmDelete: {
    //     component: ConfirmDeleteModal,
    //     getTitle: () => "Confirmar eliminación",
    //     height: "auto",
    //     size: "sm",
    // },
};

/**
 * Gestor global de modales
 * Renderiza todos los modales activos del store con su configuración
 * Debe colocarse una vez en el árbol de componentes (usualmente en App.jsx)
 */
export default function ModalManager() {
    const { modals, closeModal } = useModalStore();

    if (modals.length === 0) return null;

    return (
        <>
            {modals.map((modal) => {
                const config = MODAL_CONFIG[modal.type];

                if (!config) {
                    console.warn(`Modal type "${modal.type}" not found`);
                    return null;
                }

                const {
                    component: ModalComponent,
                    getTitle,
                    height,
                    size,
                } = config;
                const title = getTitle(modal.props);

                return (
                    <Modal
                        key={modal.id}
                        onClose={() => closeModal(modal.id)}
                        size={size}
                        title={title}
                        height={height}
                    >
                        <ModalComponent
                            {...modal.props}
                            modalId={modal.id}
                            onClose={() => closeModal(modal.id)}
                        />
                    </Modal>
                );
            })}
        </>
    );
}
