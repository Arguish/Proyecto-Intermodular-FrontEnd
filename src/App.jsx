import { useEffect } from "react";
import AppRouter from "./router/AppRouter";
import ModalManager from "./components/ModalManager";
import useAuthStore from "./store/AuthStore";

export default function App() {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        // Verificar autenticación al cargar la aplicación
        checkAuth();
    }, [checkAuth]);

    return (
        <>
            <AppRouter />
            <ModalManager />
        </>
    );
}
