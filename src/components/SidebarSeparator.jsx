/**
 * Separador horizontal para sidebar
 * Variantes: línea simple o con margen vertical
 */
export default function SidebarSeparator({ spacing = "normal" }) {
    const spacingClasses = {
        none: "",
        normal: "my-4",
        large: "my-6",
    };

    return (
        <div className={`border-t border-border ${spacingClasses[spacing]}`} />
    );
}
