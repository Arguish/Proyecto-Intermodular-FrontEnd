/**
 * Botón reutilizable para sidebar
 * Soporta icono opcional, variantes de color y onClick
 */
export default function SidebarButton({
    text,
    onClick,
    variant = "default",
    className = "",
}) {
    const variants = {
        default: "text-text-primary hover:text-primary-500",
        danger: "text-red-500 hover:text-red-600",
        primary: "text-primary-500 hover:text-primary-600",
    };

    return (
        <button
            onClick={onClick}
            className={`
                w-full
                text-left
                px-0
                py-2
                text-sm
                transition-colors
                flex items-center gap-2
                ${variants[variant]}
                ${className}
            `}
        >
            <span>{text}</span>
        </button>
    );
}
