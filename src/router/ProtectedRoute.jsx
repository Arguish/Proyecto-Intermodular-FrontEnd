import { Navigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";

export default function ProtectedRoute({
    children,
    redirectTo = "/login",
    allowedRoles = null,
}) {
    const { isAuthenticated, isLoading, user } = useAuthStore();

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <div className="text-text-primary">
                    Verificando autenticación...
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    // Si hay roles permitidos, verificar que el usuario tenga uno de ellos
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
