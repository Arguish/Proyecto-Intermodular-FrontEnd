# JSON Server - Mock API Backend

## 📖 Descripción General

Este proyecto utiliza **JSON Server** como API REST mock para desarrollo local. Simula un backend completo con autenticación, CRUD de recursos y lógica de negocio personalizada.

**Ubicación:** `JsonServer/`

## 📁 Estructura de Archivos

```
JsonServer/
├── server.cjs      # Servidor Node.js con lógica personalizada
└── db.json         # Base de datos JSON (se actualiza automáticamente)
```

### server.cjs

Servidor Express personalizado que incluye:

- Sistema de autenticación con tokens en memoria
- Middleware de protección de rutas
- Endpoints personalizados (login, búsqueda, etc.)
- Manejo inteligente de puertos ocupados
- Reescritura de rutas para prefijo `/api`

### db.json

Base de datos JSON con 4 colecciones:

- **users** - Cuentas de usuario (admin, profesor, alumno)
- **material** - Inventario de equipamiento (portátiles, proyectores, etc.)
- **aulas** - Espacios físicos (aulas teóricas, laboratorios, etc.)
- **reservas** - Reservas de material y aulas con fechas/horas

## 🚀 Cómo Iniciar el Servidor

### Opción 1: Solo API

```bash
npm run api
```

### Opción 2: API + Frontend simultáneos (recomendado)

```bash
npm run dev:all
```

### Salida esperada

```
🚀 JSON Server corriendo en http://localhost:8000
📚 API disponible en http://localhost:8000/api

👤 Usuarios de prueba:
   Admin: admin@classy.com / admin123
   Profesor: profesor@classy.com / profesor123
   Alumno: alumno@classy.com / alumno123
```

## 🌐 Configuración del Servidor

- **Puerto por defecto:** 8000
- **Base URL:** `http://localhost:8000/api`
- **Fallback automático:** Si el puerto 8000 está ocupado, prueba 8001, 8002... hasta 8009

> ⚠️ **Importante:** Si el servidor usa un puerto diferente, actualiza tu `.env`:
>
> ```
> VITE_API_URL=http://localhost:8001/api
> ```

## 🔐 Sistema de Autenticación

### Flujo de Autenticación

1. **Login:** `POST /api/login`

    ```json
    // Request
    { "email": "admin@classy.com", "password": "admin123" }

    // Response
    {
      "token": "abc123xyz...",
      "user": {
        "id": 1,
        "name": "Admin Usuario",
        "email": "admin@classy.com",
        "role": "admin"
      }
    }
    ```

2. **Requests autenticados:** Incluye el header

    ```
    Authorization: Bearer abc123xyz...
    ```

3. **Logout:** `POST /api/logout` (elimina el token del servidor)

4. **Usuario actual:** `GET /api/user` (obtiene datos del usuario autenticado)

### Usuarios de Prueba

| Email               | Contraseña  | Rol      | Permisos                            |
| ------------------- | ----------- | -------- | ----------------------------------- |
| admin@classy.com    | admin123    | admin    | CRUD completo en todos los recursos |
| profesor@classy.com | profesor123 | profesor | Gestión de reservas y consultas     |
| alumno@classy.com   | alumno123   | alumno   | Crear y gestionar propias reservas  |

## 🛣️ Endpoints Disponibles

### Autenticación (públicos)

- `POST /api/login` - Iniciar sesión
- `POST /api/logout` - Cerrar sesión
- `GET /api/user` - Obtener usuario actual

### Usuarios (requiere autenticación)

- `GET /api/users` - Listar todos los usuarios
- `GET /api/users/:id` - Obtener usuario específico
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `PATCH /api/users/:id` - Actualización parcial
- `DELETE /api/users/:id` - Eliminar usuario

### Material (GET público, resto requiere auth)

- `GET /api/material` - Listar todo el material
- `GET /api/material/:id` - Obtener material específico
- `GET /api/material/search?q=portátil` - Búsqueda por texto
- `GET /api/material/barcode/:barcode` - Buscar por código de barras
- `POST /api/material` - Crear material
- `PUT /api/material/:id` - Actualizar material
- `DELETE /api/material/:id` - Eliminar material

### Aulas (requiere autenticación)

- `GET /api/aulas` - Listar todas las aulas
- `GET /api/aulas/:id` - Obtener aula específica
- `POST /api/aulas` - Crear aula
- `PUT /api/aulas/:id` - Actualizar aula
- `DELETE /api/aulas/:id` - Eliminar aula

### Reservas (requiere autenticación)

- `GET /api/reservas` - Listar todas las reservas
- `GET /api/reservas/:id` - Obtener reserva específica
- `POST /api/reservas` - Crear reserva
- `PUT /api/reservas/:id` - Actualizar reserva
- `POST /api/reservas/:id/devolver` - Devolver material (cambia estado + disponibilidad)
- `DELETE /api/reservas/:id` - Eliminar reserva

## 🔒 Protección de Rutas

**Rutas públicas:**

- `POST /api/login`
- `GET /api/material` (solo lectura de catálogo)

**Rutas protegidas:**

- Todas las demás requieren header `Authorization: Bearer {token}`
- Si el token no existe o es inválido: `401 Unauthorized`

## 💾 Persistencia de Datos

- **Los cambios se guardan automáticamente** en `db.json`
- Al crear/actualizar/eliminar un recurso, el archivo se actualiza al instante
- **Los tokens NO persisten** - se almacenan en memoria y se pierden al reiniciar el servidor
- Para resetear la base de datos: restaura `db.json` desde un backup o repositorio

## 🛠️ Funcionalidades Especiales

### 1. Sistema de Búsqueda de Material

```javascript
// Busca en nombre, código y categoría
GET /api/material/search?q=proyector

// Busca por código de barras exacto
GET /api/material/barcode/7891234567890
```

### 2. Devolución de Material

```javascript
POST /api/reservas/:id/devolver

// Automáticamente:
// 1. Cambia estado de reserva a "devuelta"
// 2. Marca el material como disponible=true
```

### 3. Manejo de Puertos Ocupados

Si el puerto 8000 está en uso, el servidor automáticamente:

1. Muestra advertencia en consola
2. Intenta el siguiente puerto (8001, 8002, etc.)
3. Sugiere actualizar el `.env` con el nuevo puerto

## 🐛 Troubleshooting

### El servidor no inicia

```bash
# Verifica que las dependencias estén instaladas
npm install

# Verifica que no haya otro proceso en el puerto
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # Mac/Linux
```

### 401 Unauthorized en todas las peticiones

- Verifica que el token se incluya en el header `Authorization`
- El token debe tener formato: `Bearer abc123xyz...`
- Si reinicias el servidor, debes hacer login nuevamente

### Los cambios en db.json no se guardan

- Verifica permisos de escritura en la carpeta `JsonServer/`
- No edites `db.json` manualmente mientras el servidor está corriendo

### El frontend no conecta con la API

1. Verifica que el servidor esté corriendo (`npm run api`)
2. Verifica el puerto en la consola del servidor
3. Actualiza `.env` con la URL correcta:
    ```
    VITE_API_URL=http://localhost:8000/api
    ```
4. Reinicia el servidor de Vite (`npm run dev`)

## 📚 Recursos Adicionales

- [JSON Server Documentation](https://github.com/typicode/json-server)
- Consulta `src/lib/api.js` para ver los métodos del cliente HTTP
- Consulta los stores de Zustand para ver cómo se consumen los endpoints
