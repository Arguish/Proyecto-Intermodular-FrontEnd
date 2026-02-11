# Sistema de Reservas - IES El Rincón

Aplicación web para la gestión de reservas de aulas, material educativo y recursos del centro. Permite a profesores, alumnos y personal administrativo gestionar reservas de forma eficiente con un calendario interactivo y sistema de administración completo.

## 🛠️ Stack Tecnológico

- **React 18.3.1** - Framework frontend
- **Vite 5.1.0** - Build tool y dev server
- **React Router DOM 6.22.0** - Navegación y rutas protegidas por rol
- **Zustand 4.5.7** - Gestión de estado global
- **Axios 1.6.8** - Cliente HTTP con interceptores de autenticación
- **TailwindCSS 3.4.1** - Estilos utility-first
- **JSON Server 0.17.4** - Mock API REST para desarrollo

## ✨ Funcionalidades Implementadas

### 🔐 Autenticación y Autorización

- Sistema de login con tokens JWT
- Persistencia de sesión en localStorage
- Rutas protegidas por rol (admin, profesor, alumno)
- Verificación automática de sesión al cargar la app

### 📅 Gestión de Reservas

- **Calendario interactivo** semanal con vista de franjas horarias
- **Creación de reservas** con selección de aula, material, fechas y observaciones
- **Validación de solapamientos** con mensajes específicos
- **Vista "Mis Reservas"** agrupada por día con tarjetas uniformes
- **Editar reservas** (abre modal pre-cargado)
- **Cancelar reservas** con confirmación
- Estados: activa, cancelada, completada, pendiente

### 👨‍💼 Panel de Administración (conserjes/admins)

- **Tab "Reservas"**: Listado de últimas 20 reservas con toda la información
- **Tab "Material"**: CRUD completo (crear, editar, eliminar material)
- **Tab "Aulas"**: CRUD completo (crear, editar, eliminar aulas)
- **Tab "Usuarios"**: CRUD completo (crear, editar, eliminar usuarios)
- **Reservas para otros usuarios**: Asignar usuario o marcar como invitado
- **Gestión de estados**: Cambiar estado de reservas existentes

### 🗂️ Gestión de Recursos

- **Material**: nombre, código, barcode, categoría, estado, disponibilidad
- **Aulas**: nombre, tipo, capacidad, ubicación, disponibilidad
- **Usuarios**: name, email, password, role (admin/profesor/alumno)
- Validación de campos obligatorios y tipos de datos
- Actualización en tiempo real tras crear/editar/eliminar

### 🎯 Sistema de Modales

- **Gestión global** con Zustand (ModalStore)
- Soporte para **múltiples modales apilados**
- Navegación modal-to-modal (replaceModal)
- 7 tipos configurados: reservationDay, reservationForm, adminReservationForm, materialForm, aulaForm, userForm

### 💾 Caché Inteligente

- **ReservasStore**: caché de 30 segundos
- **Material/Aulas/Users**: caché de 5 minutos
- Parámetro `forceRefresh` para actualización manual
- Evita peticiones redundantes al servidor

## 📂 Estructura del Proyecto

```
src/
├── App.jsx              # Componente raíz de la aplicación
├── main.jsx             # Entry point (ReactDOM.render)
├── index.css            # Estilos globales y Tailwind
├── components/          # Componentes reutilizables
│   ├── Calendar.jsx           # Calendario semanal con franjas horarias
│   ├── Modal.jsx              # Wrapper base para modales
│   ├── ModalManager.jsx       # Orchestrador de modales (conecta con ModalStore)
│   ├── ReservationCard.jsx    # Tarjeta de reserva individual
│   ├── SidebarButton.jsx      # Botón estilizado del sidebar
│   ├── SidebarSeparator.jsx   # Línea separadora visual
│   ├── TimeSlotItem.jsx       # Chip de reserva en calendario
│   └── UserSidebar.jsx        # Sidebar con info de usuario
├── modals/              # Formularios modales
│   ├── AdminReservationForm.jsx   # Formulario admin (con asignación usuario)
│   ├── AulaForm.jsx               # Crear/editar aulas
│   ├── MaterialForm.jsx           # Crear/editar material
│   ├── ReservationDay.jsx         # Modal de día completo con todas las reservas
│   ├── ReservationForm.jsx        # Formulario de reserva (usuario estándar)
│   └── UserForm.jsx               # Crear/editar usuarios
├── layouts/             # Layouts de página
│   ├── Footer.jsx             # Pie de página
│   ├── Header.jsx             # Cabecera con navegación
│   └── MainLayout.jsx         # Layout principal (Header + children + Footer)
├── pages/               # Páginas principales
│   ├── AdminDashboard.jsx     # Panel de administración con tabs
│   ├── Home.jsx               # Calendario principal (página inicio)
│   ├── Login.jsx              # Página de autenticación
│   └── MyReservations.jsx     # Reservas del usuario
├── router/              # Configuración de rutas
│   ├── AppRouter.jsx          # Definición de rutas
│   └── ProtectedRoute.jsx     # HOC para protección por rol
├── store/               # Stores de Zustand
│   ├── AuthStore.js           # Autenticación (persist + devtools)
│   ├── ReservasStore.js       # Reservas (caché 30s)
│   ├── MaterialStore.js       # Material (caché 5min)
│   ├── AulasStore.js          # Aulas (caché 5min)
│   ├── UsersStore.js          # Usuarios (caché 5min)
│   └── ModalStore.js          # Sistema de modales global
├── hooks/               # Custom hooks
│   └── useReservationData.js  # Hook para obtener info completa de reserva
├── lib/                 # Configuración API
│   └── api.js                 # Endpoints y configuración Axios
└── utils/               # Utilidades
    └── calendar.js            # Helpers para calendario

JsonServer/              # Mock API Backend
├── server.cjs           # Servidor Express con autenticación y lógica custom
└── db.json              # Base de datos JSON (auto-actualizable)

.Docs/                   # Documentación
├── JSON-Server-Setup.md       # Guía completa del servidor mock
├── Zustand-Store-Guide.md     # Arquitectura de gestión de estado
└── GuiaBackend.md             # Especificación de API para backend real
```

## 🚀 Instalación y Uso

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno (opcional)

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# El proyecto usa http://localhost:8000/api por defecto
# Solo necesitas modificar si el servidor usa otro puerto
VITE_API_URL=http://localhost:8000/api
```

### 3. Iniciar el proyecto

**Opción A: Todo junto (recomendado)**

```bash
npm run dev:all
```

**Opción B: Por separado**

```bash
# Terminal 1 - API
npm run api

# Terminal 2 - Frontend
npm run dev
```

### 4. Acceder a la aplicación

- **Frontend:** http://localhost:5173
- **API:** http://localhost:8000/api

## 👤 Usuarios de Prueba

| Email               | Contraseña  | Rol      | Permisos                            |
| ------------------- | ----------- | -------- | ----------------------------------- |
| admin@classy.com    | admin123    | admin    | CRUD completo en todos los recursos |
| profesor@classy.com | profesor123 | profesor | Gestión de reservas y consultas     |
| alumno@classy.com   | alumno123   | alumno   | Crear y gestionar propias reservas  |

## 📚 Documentación Adicional

- **[JSON Server Setup](.Docs/JSON-Server-Setup.md)** - Guía completa del mock API backend
- **[Zustand Store Guide](.Docs/Zustand-Store-Guide.md)** - Arquitectura de gestión de estado
- **[Guía Backend API](.Docs/GuiaBackend.md)** - Especificación completa de endpoints para integración backend

## 🔧 Scripts Disponibles

```bash
npm run dev        # Inicia el frontend (Vite)
npm run api        # Inicia el servidor API (JSON Server)
npm run dev:all    # Inicia API + Frontend simultáneamente
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Linter ESLint
```

## 🏗️ Arquitectura

### Patrón de Stores

Todos los stores siguen una estructura consistente:

- **Estado:** items, isLoading, error, lastFetch
- **Acciones:** fetch (con caché), create, update, delete
- **Middleware:** devtools para debugging

### Sistema de Autenticación

1. Login → Token JWT almacenado en localStorage
2. Interceptor Axios añade token a todas las peticiones
3. Error 401 → Logout automático
4. Verificación de sesión al cargar la app

### Sistema de Modales

- **ModalStore** gestiona el estado global
- **ModalManager** renderiza según MODAL_CONFIG
- **Soporte para navegación** entre modales sin cerrar
- **Stack de modales** permite múltiples modales simultáneos

## 🌐 API Endpoints

**Autenticación**

- `POST /api/login` - Iniciar sesión
- `POST /api/logout` - Cerrar sesión
- `GET /api/user` - Usuario actual

**Recursos (CRUD completo)**

- `/api/reservas` - Reservas
- `/api/material` - Material educativo
- `/api/aulas` - Espacios/aulas
- `/api/users` - Usuarios (solo admin)

Ver [JSON-Server-Setup.md](.Docs/JSON-Server-Setup.md) para documentación completa de endpoints.
