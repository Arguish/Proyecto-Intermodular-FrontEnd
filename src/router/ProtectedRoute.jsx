import { Navigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <div className="text-text-primary">
                    Verificando autenticación...
                </div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
}
