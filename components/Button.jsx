export default function Button({
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...props
}) {
    const baseClasses =
        "font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "btn-primary",
        accent: "btn-accent",
        secondary: "btn-secondary",
        success:
            "bg-success-500 hover:bg-success-600 text-white dark:bg-dark-success-500 dark:hover:bg-dark-success-600",
        warning:
            "bg-warning-500 hover:bg-warning-600 text-white dark:bg-dark-warning-500 dark:hover:bg-dark-warning-600",
        error: "bg-error-500 hover:bg-error-600 text-white dark:bg-dark-error-500 dark:hover:bg-dark-error-600",
    };

    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
