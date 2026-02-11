import useModalStore from "../store/ModalStore";
import Modal from "./Modal";
import ReservationDay from "../modals/ReservationDay";
import ReservationForm from "../modals/ReservationForm";
import AdminReservationForm from "../modals/AdminReservationForm";
import MaterialForm from "../modals/MaterialForm";
import AulaForm from "../modals/AulaForm";
import UserForm from "../modals/UserForm";
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
        getTitle: (props) =>
            props.reserva ? "Editar Reserva" : "Nueva Reserva",
        height: "auto",
        size: "md",
    },
    adminReservationForm: {
        component: AdminReservationForm,
        getTitle: (props) =>
            props.reserva ? "Editar Reserva (Admin)" : "Nueva Reserva (Admin)",
        height: "auto",
        size: "lg",
    },
    materialForm: {
        component: MaterialForm,
        getTitle: (props) =>
            props.material ? "Editar Material" : "Nuevo Material",
        height: "auto",
        size: "md",
    },
    aulaForm: {
        component: AulaForm,
        getTitle: (props) => (props.aula ? "Editar Aula" : "Nueva Aula"),
        height: "auto",
        size: "md",
    },
    userForm: {
        component: UserForm,
        getTitle: (props) => (props.user ? "Editar Usuario" : "Nuevo Usuario"),
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
