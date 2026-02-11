# Gestión de Estado con Zustand

## 📖 ¿Qué es Zustand?

**Zustand** es una librería minimalista de gestión de estado para React. En este proyecto, gestiona toda la lógica de negocio y estado global de la aplicación.

## 🗂️ Stores Disponibles

El proyecto está organizado en **6 stores especializados**:

### 1. **AuthStore** - Autenticación

Maneja login, logout, tokens y usuario actual.

- **Middleware:** `persist` (persiste en localStorage), `devtools`
- **Uso:** Sistema de autenticación completo con verificación automática de tokens

### 2. **ReservasStore** - Reservas

CRUD completo de reservas con caché inteligente (30 segundos).

- **Caché:** Evita peticiones redundantes al servidor
- **Acciones:** fetch, create, update, delete

### 3. **MaterialStore** - Material

Gestión del inventario de equipamiento.

- **Caché:** 5 minutos
- **Acciones:** fetch, create, update, delete

### 4. **AulasStore** - Aulas

Gestión de espacios físicos (aulas, laboratorios).

- **Caché:** 5 minutos
- **Acciones:** fetch, create, update, delete

### 5. **UsersStore** - Usuarios

Gestión de cuentas de usuario (solo admin).

- **Caché:** 5 minutos
- **Acciones:** fetch, create, update, delete

### 6. **ModalStore** - Modales

Sistema global de modales con navegación modal-to-modal.

- **Soporte:** Múltiples modales apilados simultáneamente
- **Acciones:** openModal, closeModal, replaceModal

## 🚀 Patrón de Uso

### Importar y consumir un store

```javascript
import useAuthStore from "../store/AuthStore";

function MiComponente() {
    // Seleccionar solo lo que necesitas
    const { user, login, logout } = useAuthStore();

    return <div>Bienvenido {user?.name}</div>;
}
```

### Ejemplo: Login

```javascript
const { login, isLoading, error } = useAuthStore();

const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
        navigate("/");
    }
};
```

### Ejemplo: Fetch con caché

```javascript
const { reservas, fetchReservas, isLoading } = useReservasStore();

useEffect(() => {
    fetchReservas(); // Solo hace petición si el caché expiró
}, [fetchReservas]);
```

### Ejemplo: Abrir modal

```javascript
const { openModal } = useModalStore();

const handleClick = () => {
    openModal("reservationForm", {
        date: "2024-01-15",
        onSuccess: () => console.log("Guardado!"),
    });
};
```

## 🏗️ Arquitectura de Stores

Todos los stores siguen un patrón consistente:

```javascript
const useStore = create(
    devtools((set, get) => ({
        // 📦 Estado
        items: [],
        isLoading: false,
        error: null,
        lastFetch: null,

        // 🔄 Acciones
        fetchItems: async (forceRefresh = false) => {
            // Lógica de caché
            // Petición a la API
            // Actualizar estado
        },
        createItem: async (data) => {
            /* ... */
        },
        updateItem: async (id, data) => {
            /* ... */
        },
        deleteItem: async (id) => {
            /* ... */
        },
    })),
);
```

## ⚡ Características Clave

### Caché inteligente

Los stores evitan peticiones redundantes:

- **ReservasStore:** 30 segundos
- **Material/Aulas/Users:** 5 minutos
- **forceRefresh** fuerza actualización

### Persistencia (solo AuthStore)

El token y usuario se guardan automáticamente en `localStorage` y se restauran al recargar la página.

### DevTools

Todos los stores son compatibles con **Redux DevTools** para debugging en desarrollo.

### Patrón selector

Selecciona solo lo que necesitas para optimizar re-renders:

```javascript
// ❌ Mal: todo el store (re-render innecesario)
const store = useAuthStore();

// ✅ Bien: solo lo necesario
const { user, isAuthenticated } = useAuthStore();
```

## 📂 Ubicación

```
src/store/
├── AuthStore.js        # Autenticación
├── ReservasStore.js    # Reservas
├── MaterialStore.js    # Material
├── AulasStore.js       # Aulas
├── UsersStore.js       # Usuarios
└── ModalStore.js       # Modales globales
```

## 📚 Recursos

- [Zustand Docs](https://github.com/pmndrs/zustand)
- Ver `src/lib/api.js` para endpoints de API
- Ver `src/components/ModalManager.jsx` para tipos de modales disponibles
