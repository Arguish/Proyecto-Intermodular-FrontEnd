# Guía de Integración Backend - API REST

Esta guía documenta todos los endpoints necesarios para que el frontend funcione correctamente. Sirve como especificación para implementar el backend en Laravel, Node.js u otra tecnología.

## 📋 Tabla de Contenidos

- [Autenticación](#autenticación)
- [Usuarios](#usuarios)
- [Material](#material)
- [Aulas](#aulas)
- [Reservas](#reservas)
- [Códigos de Estado HTTP](#códigos-de-estado-http)
- [Headers Requeridos](#headers-requeridos)

---

## 🔐 Autenticación

El sistema usa **autenticación basada en tokens**. El token debe incluirse en todas las peticiones protegidas.

### POST `/api/login`

**Descripción:** Iniciar sesión de usuario

**Acceso:** Público

**Request Body:**

```json
{
    "email": "admin@classy.com",
    "password": "admin123"
}
```

**Response Success (200):**

```json
{
    "token": "abc123xyz456...",
    "user": {
        "id": 1,
        "name": "Admin Usuario",
        "email": "admin@classy.com",
        "role": "admin"
    }
}
```

**Response Error (401):**

```json
{
    "message": "Credenciales incorrectas",
    "errors": {
        "email": ["Las credenciales no coinciden con nuestros registros"]
    }
}
```

---

### POST `/api/logout`

**Descripción:** Cerrar sesión del usuario actual

**Acceso:** Protegido (requiere token)

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200):**

```json
{
    "message": "Sesión cerrada correctamente"
}
```

---

### GET `/api/user`

**Descripción:** Obtener datos del usuario autenticado

**Acceso:** Protegido (requiere token)

**Headers:**

```
Authorization: Bearer {token}
```

**Response Success (200):**

```json
{
    "id": 1,
    "name": "Admin Usuario",
    "email": "admin@classy.com",
    "role": "admin"
}
```

**Response Error (401):**

```json
{
    "message": "No autenticado"
}
```

---

## 👥 Usuarios

### GET `/api/users`

**Descripción:** Listar todos los usuarios

**Acceso:** Protegido (solo admin)

**Response (200):**

```json
[
    {
        "id": 1,
        "name": "Admin Usuario",
        "email": "admin@classy.com",
        "password": "admin123",
        "role": "admin",
        "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
        "id": 2,
        "name": "Profesor García",
        "email": "profesor@classy.com",
        "password": "profesor123",
        "role": "profesor",
        "created_at": "2024-01-01T00:00:00.000Z"
    }
]
```

---

### GET `/api/users/:id`

**Descripción:** Obtener un usuario específico

**Acceso:** Protegido (solo admin)

**Response (200):**

```json
{
    "id": 1,
    "name": "Admin Usuario",
    "email": "admin@classy.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Response Error (404):**

```json
{
    "message": "Usuario no encontrado"
}
```

---

### POST `/api/users`

**Descripción:** Crear un nuevo usuario

**Acceso:** Protegido (solo admin)

**Request Body:**

```json
{
    "name": "Nuevo Usuario",
    "email": "nuevo@classy.com",
    "password": "password123",
    "role": "alumno"
}
```

**Validaciones:**

- `name`: requerido, string, min 3 caracteres
- `email`: requerido, email válido, único
- `password`: requerido, min 6 caracteres
- `role`: requerido, valores: `admin`, `profesor`, `alumno`

**Response (201):**

```json
{
    "id": 4,
    "name": "Nuevo Usuario",
    "email": "nuevo@classy.com",
    "role": "alumno",
    "created_at": "2026-02-11T12:00:00.000Z"
}
```

---

### PUT `/api/users/:id`

**Descripción:** Actualizar un usuario existente

**Acceso:** Protegido (solo admin)

**Request Body:**

```json
{
    "name": "Usuario Actualizado",
    "email": "actualizado@classy.com",
    "password": "newpassword123",
    "role": "profesor"
}
```

**Notas:**

- Todos los campos son opcionales
- Si no se envía `password`, no se modifica

**Response (200):**

```json
{
    "id": 4,
    "name": "Usuario Actualizado",
    "email": "actualizado@classy.com",
    "role": "profesor",
    "created_at": "2026-02-11T12:00:00.000Z"
}
```

---

### DELETE `/api/users/:id`

**Descripción:** Eliminar un usuario

**Acceso:** Protegido (solo admin)

**Response (200 o 204):**

```json
{
    "message": "Usuario eliminado correctamente"
}
```

---

## 📦 Material

### GET `/api/material`

**Descripción:** Listar todo el material

**Acceso:** Público (GET) / Protegido (otros métodos)

**Response (200):**

```json
[
    {
        "id": 1,
        "nombre": "Portátil HP EliteBook",
        "codigo": "PORT-001",
        "barcode": "7891234567890",
        "categoria": "Informática",
        "disponible": true,
        "estado": "Bueno",
        "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
        "id": 2,
        "nombre": "Proyector Epson EB-X41",
        "codigo": "PROY-001",
        "barcode": "7891234567891",
        "categoria": "Audiovisual",
        "disponible": true,
        "estado": "Bueno",
        "created_at": "2024-01-01T00:00:00.000Z"
    }
]
```

---

### GET `/api/material/:id`

**Descripción:** Obtener material específico

**Acceso:** Protegido

**Response (200):**

```json
{
    "id": 1,
    "nombre": "Portátil HP EliteBook",
    "codigo": "PORT-001",
    "barcode": "7891234567890",
    "categoria": "Informática",
    "disponible": true,
    "estado": "Bueno",
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

### GET `/api/material/search?q={query}`

**Descripción:** Buscar material por texto

**Acceso:** Protegido

**Parámetros:**

- `q`: Texto de búsqueda (busca en `nombre`, `codigo`, `categoria`)

**Ejemplo:** `/api/material/search?q=proyector`

**Response (200):**

```json
[
    {
        "id": 2,
        "nombre": "Proyector Epson EB-X41",
        "codigo": "PROY-001",
        "barcode": "7891234567891",
        "categoria": "Audiovisual",
        "disponible": true,
        "estado": "Bueno"
    }
]
```

---

### GET `/api/material/barcode/:barcode`

**Descripción:** Buscar material por código de barras

**Acceso:** Protegido

**Ejemplo:** `/api/material/barcode/7891234567890`

**Response (200):**

```json
{
    "id": 1,
    "nombre": "Portátil HP EliteBook",
    "codigo": "PORT-001",
    "barcode": "7891234567890",
    "categoria": "Informática",
    "disponible": true,
    "estado": "Bueno"
}
```

**Response Error (404):**

```json
{
    "message": "Material no encontrado"
}
```

---

### POST `/api/material`

**Descripción:** Crear nuevo material

**Acceso:** Protegido (admin/conserje)

**Request Body:**

```json
{
    "nombre": "MacBook Pro M3",
    "codigo": "MAC-001",
    "barcode": "1234567890123",
    "categoria": "Informática",
    "estado": "Excelente",
    "disponible": true
}
```

**Validaciones:**

- `nombre`: requerido, string
- `codigo`: requerido, string, único
- `barcode`: opcional, string
- `categoria`: requerido, valores: `Informática`, `Audiovisual`, `Mobiliario`, `Deportivo`, `Laboratorio`, `Otros`
- `estado`: requerido, valores: `Excelente`, `Bueno`, `Regular`, `Malo`
- `disponible`: boolean, default: `true`

**Response (201):**

```json
{
    "id": 6,
    "nombre": "MacBook Pro M3",
    "codigo": "MAC-001",
    "barcode": "1234567890123",
    "categoria": "Informática",
    "estado": "Excelente",
    "disponible": true,
    "created_at": "2026-02-11T12:00:00.000Z"
}
```

---

### PUT `/api/material/:id`

**Descripción:** Actualizar material existente

**Acceso:** Protegido (admin/conserje)

**Request Body:** (todos los campos opcionales)

```json
{
    "nombre": "MacBook Pro M3 16GB",
    "disponible": false,
    "estado": "Bueno"
}
```

**Response (200):**

```json
{
    "id": 6,
    "nombre": "MacBook Pro M3 16GB",
    "codigo": "MAC-001",
    "barcode": "1234567890123",
    "categoria": "Informática",
    "estado": "Bueno",
    "disponible": false,
    "created_at": "2026-02-11T12:00:00.000Z"
}
```

---

### DELETE `/api/material/:id`

**Descripción:** Eliminar material

**Acceso:** Protegido (admin/conserje)

**Response (200 o 204):**

```json
{
    "message": "Material eliminado correctamente"
}
```

---

## 🏫 Aulas

### GET `/api/aulas`

**Descripción:** Listar todas las aulas

**Acceso:** Protegido

**Response (200):**

```json
[
    {
        "id": 1,
        "nombre": "Aula 201",
        "codigo": "AULA-201",
        "capacidad": 30,
        "tipo": "Teórica",
        "ubicacion": "Planta 2",
        "disponible": true,
        "equipamiento": ["Proyector", "Pizarra digital"],
        "created_at": "2024-01-01T00:00:00.000Z"
    }
]
```

---

### GET `/api/aulas/:id`

**Descripción:** Obtener aula específica

**Acceso:** Protegido

**Response (200):**

```json
{
    "id": 1,
    "nombre": "Aula 201",
    "codigo": "AULA-201",
    "capacidad": 30,
    "tipo": "Teórica",
    "ubicacion": "Planta 2",
    "disponible": true,
    "equipamiento": ["Proyector", "Pizarra digital"],
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

### POST `/api/aulas`

**Descripción:** Crear nueva aula

**Acceso:** Protegido (admin/conserje)

**Request Body:**

```json
{
    "nombre": "Aula 301",
    "tipo": "Laboratorio",
    "capacidad": 25,
    "ubicacion": "Planta 3",
    "disponible": true
}
```

**Validaciones:**

- `nombre`: requerido, string
- `tipo`: requerido, valores: `Teórica`, `Laboratorio`, `Informática`, `Taller`, `Auditorio`, `Estudio`
- `capacidad`: requerido, número entero positivo
- `ubicacion`: requerido, string
- `disponible`: boolean, default: `true`

**Response (201):**

```json
{
    "id": 7,
    "nombre": "Aula 301",
    "tipo": "Laboratorio",
    "capacidad": 25,
    "ubicacion": "Planta 3",
    "disponible": true,
    "created_at": "2026-02-11T12:00:00.000Z"
}
```

---

### PUT `/api/aulas/:id`

**Descripción:** Actualizar aula existente

**Acceso:** Protegido (admin/conserje)

**Request Body:** (todos los campos opcionales)

```json
{
    "capacidad": 30,
    "disponible": false
}
```

**Response (200):**

```json
{
    "id": 7,
    "nombre": "Aula 301",
    "tipo": "Laboratorio",
    "capacidad": 30,
    "ubicacion": "Planta 3",
    "disponible": false,
    "created_at": "2026-02-11T12:00:00.000Z"
}
```

---

### DELETE `/api/aulas/:id`

**Descripción:** Eliminar aula

**Acceso:** Protegido (admin/conserje)

**Response (200 o 204):**

```json
{
    "message": "Aula eliminada correctamente"
}
```

---

## 📅 Reservas

### GET `/api/reservas`

**Descripción:** Listar todas las reservas

**Acceso:** Protegido

**Response (200):**

```json
[
    {
        "id": 1,
        "user_id": 2,
        "material_id": 3,
        "aula_id": null,
        "fecha_inicio": "2024-02-10T09:00:00.000Z",
        "fecha_fin": "2024-02-12T17:00:00.000Z",
        "estado": "activa",
        "observaciones": "Para prácticas de programación",
        "es_invitado": false,
        "created_at": "2024-02-09T10:00:00.000Z"
    },
    {
        "id": 2,
        "user_id": 1,
        "material_id": 2,
        "aula_id": 3,
        "fecha_inicio": "2026-02-12T14:00:00.000Z",
        "fecha_fin": "2026-02-12T16:00:00.000Z",
        "estado": "activa",
        "observaciones": "Clase práctica de programación",
        "es_invitado": false,
        "created_at": "2026-02-11T12:35:00.000Z"
    }
]
```

**Notas:**

- Una reserva puede tener `material_id`, `aula_id` o ambos
- Al menos uno de los dos debe estar presente

---

### GET `/api/reservas/:id`

**Descripción:** Obtener reserva específica

**Acceso:** Protegido

**Response (200):**

```json
{
    "id": 1,
    "user_id": 2,
    "material_id": 3,
    "aula_id": null,
    "fecha_inicio": "2024-02-10T09:00:00.000Z",
    "fecha_fin": "2024-02-12T17:00:00.000Z",
    "estado": "activa",
    "observaciones": "Para prácticas de programación",
    "es_invitado": false,
    "created_at": "2024-02-09T10:00:00.000Z"
}
```

---

### POST `/api/reservas`

**Descripción:** Crear nueva reserva

**Acceso:** Protegido

**Request Body:**

```json
{
    "user_id": 2,
    "material_id": 1,
    "aula_id": null,
    "fecha_inicio": "2026-02-15T09:00:00.000Z",
    "fecha_fin": "2026-02-15T12:00:00.000Z",
    "observaciones": "Reunión de equipo",
    "es_invitado": false
}
```

**Validaciones:**

- `user_id`: requerido, debe existir en la BD
- `material_id`: opcional, debe existir y estar disponible
- `aula_id`: opcional, debe existir y estar disponible
- **Al menos uno** de `material_id` o `aula_id` debe estar presente
- `fecha_inicio`: requerido, formato ISO 8601
- `fecha_fin`: requerido, debe ser mayor que `fecha_inicio`
- `observaciones`: opcional, string
- `es_invitado`: opcional, boolean, default: `false`
- `estado`: se asigna automáticamente como `activa`

**Validación de Solapamientos:**
El backend debe verificar que no existan solapamientos de:

- Mismo `material_id` en las mismas fechas
- Misma `aula_id` en las mismas fechas

**Response Success (201):**

```json
{
    "id": 10,
    "user_id": 2,
    "material_id": 1,
    "aula_id": null,
    "fecha_inicio": "2026-02-15T09:00:00.000Z",
    "fecha_fin": "2026-02-15T12:00:00.000Z",
    "estado": "activa",
    "observaciones": "Reunión de equipo",
    "es_invitado": false,
    "created_at": "2026-02-11T12:00:00.000Z"
}
```

**Response Error (409 Conflict):**

```json
{
    "message": "Ya existe una reserva en ese horario",
    "conflicts": {
        "material": "Portátil HP ya está reservado de 09:00 a 11:00",
        "aula": null
    }
}
```

---

### PUT `/api/reservas/:id`

**Descripción:** Actualizar reserva existente

**Acceso:** Protegido (el propietario o admin)

**Request Body:** (todos los campos opcionales)

```json
{
    "fecha_inicio": "2026-02-15T10:00:00.000Z",
    "fecha_fin": "2026-02-15T13:00:00.000Z",
    "observaciones": "Reunión extendida",
    "estado": "completada"
}
```

**Validaciones:**

- Si se modifica `material_id` o `aula_id`, verificar disponibilidad
- Si se modifican fechas, verificar solapamientos
- `estado` acepta: `activa`, `cancelada`, `completada`, `pendiente`

**Response (200):**

```json
{
    "id": 10,
    "user_id": 2,
    "material_id": 1,
    "aula_id": null,
    "fecha_inicio": "2026-02-15T10:00:00.000Z",
    "fecha_fin": "2026-02-15T13:00:00.000Z",
    "estado": "completada",
    "observaciones": "Reunión extendida",
    "es_invitado": false,
    "created_at": "2026-02-11T12:00:00.000Z"
}
```

---

### DELETE `/api/reservas/:id`

**Descripción:** Eliminar/cancelar reserva

**Acceso:** Protegido (el propietario o admin)

**Response (200 o 204):**

```json
{
    "message": "Reserva eliminada correctamente"
}
```

**Nota:** Alternativamente, se puede implementar como cambio de estado a `cancelada` en lugar de eliminación física.

---

### POST `/api/reservas/:id/devolver`

**Descripción:** Marcar material como devuelto (cambiar estado y disponibilidad)

**Acceso:** Protegido (conserje/admin)

**Comportamiento:**

1. Cambiar `estado` de la reserva a `devuelta` o `completada`
2. Si tiene `material_id`, marcar el material como `disponible: true`

**Response (200):**

```json
{
    "message": "Material devuelto correctamente"
}
```

---

## 📊 Códigos de Estado HTTP

El frontend espera los siguientes códigos de estado:

| Código  | Significado           | Uso                                      |
| ------- | --------------------- | ---------------------------------------- |
| **200** | OK                    | Petición exitosa (GET, PUT, DELETE)      |
| **201** | Created               | Recurso creado exitosamente (POST)       |
| **204** | No Content            | Eliminación exitosa sin contenido        |
| **400** | Bad Request           | Datos de entrada inválidos               |
| **401** | Unauthorized          | No autenticado o token inválido          |
| **403** | Forbidden             | Autenticado pero sin permisos            |
| **404** | Not Found             | Recurso no encontrado                    |
| **409** | Conflict              | Conflicto (ej: solapamiento de reservas) |
| **422** | Unprocessable Entity  | Validación fallida                       |
| **500** | Internal Server Error | Error del servidor                       |

---

## 🔑 Headers Requeridos

### Request Headers

**Todas las peticiones:**

```
Content-Type: application/json
```

**Peticiones protegidas:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

### Response Headers

```
Content-Type: application/json
```

---

## 🔒 Consideraciones de Seguridad

1. **Tokens:** Usar JWT o similar con expiración
2. **Contraseñas:** Nunca devolver contraseñas en las respuestas (excepto en JSON Server mock)
3. **Hash:** Las contraseñas deben hashearse con bcrypt u otro algoritmo seguro
4. **Roles:** Verificar permisos en el backend, no confiar en el frontend
5. **CORS:** Configurar correctamente para permitir peticiones desde el frontend
6. **Rate Limiting:** Implementar límites de peticiones por IP/usuario
7. **Validación:** Validar todos los inputs en el backend

---

## 📝 Estructura de Entidades

### User

```typescript
{
  id: number,
  name: string,
  email: string,
  password: string,          // Solo en BD, nunca en response
  role: "admin" | "profesor" | "alumno",
  created_at: string         // ISO 8601
}
```

### Material

```typescript
{
  id: number,
  nombre: string,
  codigo: string,            // Único
  barcode?: string,
  categoria: "Informática" | "Audiovisual" | "Mobiliario" | "Deportivo" | "Laboratorio" | "Otros",
  estado: "Excelente" | "Bueno" | "Regular" | "Malo",
  disponible: boolean,
  created_at: string
}
```

### Aula

```typescript
{
  id: number,
  nombre: string,
  tipo: "Teórica" | "Laboratorio" | "Informática" | "Taller" | "Auditorio" | "Estudio",
  capacidad: number,         // Entero positivo
  ubicacion: string,
  disponible: boolean,
  equipamiento?: string[],   // Opcional
  created_at: string
}
```

### Reserva

```typescript
{
  id: number,
  user_id: number,
  material_id?: number | null,    // Opcional
  aula_id?: number | null,        // Opcional
  fecha_inicio: string,           // ISO 8601
  fecha_fin: string,              // ISO 8601
  estado: "activa" | "cancelada" | "completada" | "pendiente",
  observaciones?: string,
  es_invitado: boolean,
  created_at: string
}
```

---

## 🧪 Testing con JSON Server

El proyecto incluye un servidor mock (`JsonServer/server.cjs`) que implementa todos estos endpoints. Úsalo como referencia para:

1. Estructura de respuestas
2. Códigos de estado
3. Lógica de validación
4. Manejo de errores

**Iniciar servidor mock:**

```bash
npm run api
```

El servidor estará disponible en `http://localhost:8000/api`

---

## 📚 Recursos Adicionales

- **Configuración del cliente:** `src/lib/api.js`
- **Stores del frontend:** `src/store/`
- **Mock API:** `JsonServer/server.cjs`
- **Datos de ejemplo:** `JsonServer/db.json`
