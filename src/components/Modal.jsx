import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const sizeClasses = {
    sm: "w-[400px]",
    md: "w-[500px]",
    lg: "w-[700px]",
    xl: "w-[900px]",
    full: "w-full max-w-[95vw]",
};

/**
 * Componente Modal genérico y reutilizable
 * Maneja portal, backdrop, ESC key, scroll lock, etc.
 */
export default function Modal({
    children,
    onClose,
    size = "md",
    title,
    closeOnBackdropClick = true,
    closeOnEsc = true,
    showCloseButton = true,
    height = "auto",
}) {
    // Manejar tecla ESC
    useEffect(() => {
        if (!closeOnEsc) return;

        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [closeOnEsc, onClose]);

    // Lock scroll del body cuando modal está abierto
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    // Manejar click en backdrop
    const handleBackdropClick = useCallback(
        (e) => {
            if (closeOnBackdropClick && e.target === e.currentTarget) {
                onClose();
            }
        },
        [closeOnBackdropClick, onClose],
    );

    const heightClass =
        height === "auto" ? "h-auto max-h-[90vh]" : `h-[${height}]`;

    return createPortal(
        <div
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div
                className={`
                    bg-surface
                    shadow-2xl
                    rounded-lg
                    ${sizeClasses[size]}
                    ${heightClass}
                    flex flex-col
                    pointer-events-auto
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header opcional */}
                {(title || showCloseButton) && (
                    <div className="sticky top-0 border-b border-border p-4 bg-primary-50 z-10 flex items-center justify-between rounded-t-lg">
                        {title && (
                            <h2 className="text-lg font-semibold text-text-primary">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="
                                    text-text-primary
                                    hover:text-text-secondary
                                    text-2xl
                                    leading-none
                                    transition-colors
                                    cursor-pointer
                                    ml-auto
                                "
                                aria-label="Cerrar modal"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}

                {/* Contenido del modal */}
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>,
        document.body,
    );
}
