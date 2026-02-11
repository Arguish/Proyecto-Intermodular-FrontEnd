# Store de Autenticación con Zustand

## 📦 Estado Global

El store de autenticación maneja:

- Usuario actual
- Token de autenticación
- Estado de carga
- Manejo de errores
- Persistencia en localStorage

## 🚀 Uso Básico

### Importar el store

```javascript
import useAuthStore from "../store";
```

### Acceder al estado y acciones

```javascript
function MiComponente() {
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        checkAuth,
    } = useAuthStore();

    // Usar el estado
    if (isLoading) return <div>Cargando...</div>;
    if (!isAuthenticated) return <div>No autenticado</div>;

    return <div>Bienvenido {user?.name}</div>;
}
```

## 📝 Acciones Disponibles

### login(email, password)

Inicia sesión con email y contraseña.

```javascript
const { login, isLoading, error } = useAuthStore();

const handleLogin = async () => {
    const result = await login("usuario@ejemplo.com", "contraseña");
    if (result.success) {
        console.log("Login exitoso");
    } else {
        console.error("Error:", result.error);
    }
};
```

### logout()

Cierra la sesión del usuario.

```javascript
const { logout } = useAuthStore();

const handleLogout = async () => {
    await logout();
    navigate("/login");
};
```

### checkAuth()

Verifica si el token es válido y obtiene el usuario actual.

```javascript
const { checkAuth } = useAuthStore();

useEffect(() => {
    checkAuth();
}, []);
```

### clearError()

Limpia los errores del estado.

```javascript
const { clearError } = useAuthStore();

clearError();
```

### setUser(user)

Actualiza la información del usuario.

```javascript
const { setUser } = useAuthStore();

setUser({ ...user, name: "Nuevo Nombre" });
```

## 🔐 Estado de Autenticación

### Estado disponible

```javascript
const {
    user, // Objeto del usuario actual
    token, // Token de autenticación
    isAuthenticated, // Boolean: si el usuario está autenticado
    isLoading, // Boolean: si hay una operación en curso
    error, // String: mensaje de error (si existe)
} = useAuthStore();
```

## 📱 Ejemplos de Uso

### Componente de Login

```javascript
import { useState } from "react";
import useAuthStore from "../store";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading, error } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            // Redirigir al usuario
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button disabled={isLoading}>
                {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </button>
        </form>
    );
}
```

### Ruta Protegida

```javascript
import { Navigate } from "react-router-dom";
import useAuthStore from "../store";

function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return <div>Verificando autenticación...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}
```

### Header con información del usuario

```javascript
import useAuthStore from "../store";

function Header() {
    const { user, logout } = useAuthStore();

    return (
        <header>
            <span>Bienvenido {user?.name}</span>
            <button onClick={logout}>Cerrar Sesión</button>
        </header>
    );
}
```

### Verificar autenticación al cargar la app

```javascript
import { useEffect } from "react";
import useAuthStore from "../store";

function App() {
    const { checkAuth, isLoading } = useAuthStore();

    useEffect(() => {
        // Verificar si hay un token válido al cargar la app
        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Cargando aplicación...</div>;
    }

    return <AppRouter />;
}
```

## 🔧 Características Avanzadas

### Persistencia automática

El store usa el middleware `persist` de Zustand para guardar automáticamente el token y usuario en localStorage.

### DevTools

El store incluye soporte para Redux DevTools para debugging (solo en desarrollo).

### Interceptor de API

El token se añade automáticamente a todas las peticiones de Axios mediante un interceptor configurado en `api.js`.

## 🛡️ Seguridad

- El token se almacena en localStorage
- Se elimina automáticamente en caso de error 401
- Se verifica la validez del token al cargar la aplicación
- Las contraseñas nunca se almacenan, solo el token
