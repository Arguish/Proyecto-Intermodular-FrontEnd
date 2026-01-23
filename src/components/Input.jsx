import { forwardRef } from "react";

const Input = forwardRef(
    ({ label, error, helperText, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`input-field ${error ? "border-error-500 focus:ring-error-500" : ""} ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-error-600 dark:text-dark-error-600">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-text-tertiary">
                        {helperText}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = "Input";

export default Input;
