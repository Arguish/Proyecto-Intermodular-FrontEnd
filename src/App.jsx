import { useEffect } from "react";
import AppRouter from "./router/AppRouter";
import useAuthStore from "./store";

export default function App() {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        // Verificar autenticación al cargar la aplicación
        checkAuth();
    }, [checkAuth]);

    return <AppRouter />;
}
