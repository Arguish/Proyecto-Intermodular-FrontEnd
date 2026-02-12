# 🔌 Guía de Integración Frontend - Backend Laravel

> **Backend:** Laravel 12.48.1 + Sanctum  
> **Base URL:** `http://127.0.0.1:8000/api`  
> **Estado:** ✅ Producción Ready  
> **Compatibilidad:** 98% con especificación original

---

## 📋 Tabla de Contenidos

- [Configuración Inicial](#configuración-inicial)
- [Autenticación](#autenticación)
- [Endpoints Disponibles](#endpoints-disponibles)
- [Diferencias Importantes](#diferencias-importantes)
- [Ejemplos de Integración](#ejemplos-de-integración)
- [Manejo de Errores](#manejo-de-errores)
- [Credenciales de Prueba](#credenciales-de-prueba)

---

## 🚀 Configuración Inicial

### 1. Variables de Entorno

```javascript
// Configurar en tu .env o config del frontend
const API_BASE_URL = "http://127.0.0.1:8000/api";
```

### 2. Cliente HTTP (Axios ejemplo)

```javascript
import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
```

---

## 🔐 Autenticación

### Flujo de Autenticación

#### 1. Login

```javascript
// POST /api/login
const login = async (email, password) => {
  const response = await apiClient.post('/login', {
    email,
    password
  });

  // Guardar token
  localStorage.setItem('auth_token', response.data.token);

  return response.data;
};

// Respuesta:
{
  "token": "8|abc123...",
  "user": {
    "id": 1,
    "name": "Admin Usuario",
    "email": "admin@example.com",
    "role": "admin",
    "department": null,          // ⚠️ Campo adicional
    "created_at": "2026-02-12T12:36:54.000000Z"
  }
}
```

#### 2. Obtener Usuario Actual

```javascript
// GET /api/user
const getCurrentUser = async () => {
  const response = await apiClient.get('/user');
  return response.data;
};

// Respuesta:
{
  "data": {
    "id": 1,
    "name": "Admin Usuario",
    "email": "admin@example.com",
    "role": "admin",
    "department": null,
    "created_at": "2026-02-12T12:36:54.000000Z"
  }
}
```

#### 3. Logout

```javascript
// POST /api/logout
const logout = async () => {
    await apiClient.post("/logout");
    localStorage.removeItem("auth_token");
};
```

---

## 📡 Endpoints Disponibles

### **AUTENTICACIÓN**

| Método | Endpoint      | Acceso    | Descripción    |
| ------ | ------------- | --------- | -------------- |
| POST   | `/api/login`  | Público   | Iniciar sesión |
| POST   | `/api/logout` | Protegido | Cerrar sesión  |
| GET    | `/api/user`   | Protegido | Usuario actual |

---

### **USUARIOS** (Solo Admin)

| Método | Endpoint          | Acceso | Descripción        |
| ------ | ----------------- | ------ | ------------------ |
| GET    | `/api/users`      | Admin  | Listar usuarios    |
| GET    | `/api/users/{id}` | Admin  | Ver usuario        |
| POST   | `/api/users`      | Admin  | Crear usuario      |
| PUT    | `/api/users/{id}` | Admin  | Actualizar usuario |
| DELETE | `/api/users/{id}` | Admin  | Eliminar usuario   |

**Ejemplo Request - Crear Usuario:**

```json
POST /api/users
{
  "name": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "password": "password123",
  "role": "profesor",
  "department": "Matemáticas"  // Opcional
}
```

---

### **MATERIAL**

| Método | Endpoint                       | Acceso         | Descripción         |
| ------ | ------------------------------ | -------------- | ------------------- |
| GET    | `/api/material`                | **✅ PÚBLICO** | Listar material     |
| GET    | `/api/material/{id}`           | **✅ PÚBLICO** | Ver material        |
| GET    | `/api/material/search?q=texto` | **✅ PÚBLICO** | Buscar material     |
| GET    | `/api/material/barcode/{code}` | **✅ PÚBLICO** | Buscar por barcode  |
| POST   | `/api/material`                | Admin/Conserje | Crear material      |
| PUT    | `/api/material/{id}`           | Admin/Conserje | Actualizar material |
| DELETE | `/api/material/{id}`           | Admin/Conserje | Eliminar material   |

**Ejemplo Request - Crear Material:**

```json
POST /api/material
{
  "nombre": "Portátil HP",
  "codigo": "PORT-001",
  "barcode": "7891234567890",
  "categoria": "Informática",
  "estado": "Bueno",
  "disponible": true
}
```

**Categorías válidas:**

- `Informática`
- `Audiovisual`
- `Mobiliario`
- `Deportivo`
- `Laboratorio`
- `Otros`

**Estados válidos:**

- `Excelente`
- `Bueno`
- `Regular`
- `Malo`

---

### **AULAS**

| Método | Endpoint          | Acceso         | Descripción     |
| ------ | ----------------- | -------------- | --------------- |
| GET    | `/api/aulas`      | Protegido      | Listar aulas    |
| GET    | `/api/aulas/{id}` | Protegido      | Ver aula        |
| POST   | `/api/aulas`      | Admin/Conserje | Crear aula      |
| PUT    | `/api/aulas/{id}` | Admin/Conserje | Actualizar aula |
| DELETE | `/api/aulas/{id}` | Admin/Conserje | Eliminar aula   |

**Ejemplo Request - Crear Aula:**

```json
POST /api/aulas
{
  "nombre": "Aula 301",
  "codigo": "AULA-301",
  "tipo": "Laboratorio",
  "capacidad": 30,
  "ubicacion": "Planta 3",
  "disponible": true,
  "equipamiento": ["Proyector", "Pizarra digital"]
}
```

**Tipos válidos:**

- `Teórica`
- `Laboratorio`
- `Informática`
- `Taller`
- `Auditorio`
- `Estudio`

---

### **RESERVAS**

| Método | Endpoint                      | Acceso            | Descripción        |
| ------ | ----------------------------- | ----------------- | ------------------ |
| GET    | `/api/reservas`               | Protegido         | Listar reservas    |
| GET    | `/api/reservas/{id}`          | Protegido         | Ver reserva        |
| POST   | `/api/reservas`               | Protegido         | Crear reserva      |
| PUT    | `/api/reservas/{id}`          | Propietario/Admin | Actualizar reserva |
| POST   | `/api/reservas/{id}/cancel`   | Propietario/Admin | Cancelar reserva   |
| DELETE | `/api/reservas/{id}`          | Propietario/Admin | Eliminar reserva   |
| POST   | `/api/reservas/{id}/devolver` | Admin/Conserje    | Marcar devuelto    |

---

## ⚠️ DIFERENCIAS IMPORTANTES

### 🔴 **1. Estructura de Reservas (CRÍTICO)**

#### ❌ Especificación Original (GuiaBackend.md)

```json
{
    "id": 1,
    "user_id": 2,
    "material_id": 3, // ❌ Campo singular
    "aula_id": null, // ❌ Nombre antiguo
    "fecha_inicio": "...",
    "estado": "activa"
}
```

#### ✅ Backend Real (Implementado)

**AL LISTAR (GET /api/reservas):**

```json
{
    "data": [
        {
            "id": 1,
            "user": {
                // ✅ Objeto completo
                "id": 2,
                "name": "Profesor García",
                "email": "profesor@example.com",
                "role": "profesor"
            },
            "room": {
                // ✅ Objeto completo (no 'aula')
                "id": 3,
                "nombre": "Aula 201",
                "tipo": "Informática",
                "capacidad": 30
            },
            "materials": [
                // ✅ Array de objetos
                {
                    "id": 5,
                    "nombre": "Portátil HP",
                    "disponible": true
                }
            ],
            "fecha_inicio": "2026-02-15T09:00:00.000000Z",
            "fecha_fin": "2026-02-15T11:00:00.000000Z",
            "estado": "activa",
            "observaciones": "Clase práctica",
            "es_invitado": false,
            "created_at": "2026-02-12T10:00:00.000000Z"
        }
    ]
}
```

**AL CREAR/ACTUALIZAR (POST/PUT /api/reservas):**

```json
// ⚠️ IMPORTANTE: Usar estos nombres de campos
{
    "user_id": 2,
    "room_id": 3, // ⚠️ NO 'aula_id'
    "material_ids": [5, 7], // ⚠️ Array, NO 'material_id' singular
    "fecha_inicio": "2026-02-15 09:00:00",
    "fecha_fin": "2026-02-15 11:00:00",
    "observaciones": "Clase práctica",
    "es_invitado": false
}
```

### 📝 **Adaptaciones Requeridas en el Frontend**

```javascript
// ❌ NO HACER ESTO:
const userId = reservation.user_id;
const aulaId = reservation.aula_id;
const materialId = reservation.material_id;

// ✅ HACER ESTO:
const userName = reservation.user.name;
const roomName = reservation.room?.nombre; // room puede ser null
const firstMaterial = reservation.materials[0]?.nombre;

// Al crear reserva:
const createReservation = {
    user_id: userId,
    room_id: roomId, // NO aula_id
    material_ids: [1, 2, 3], // Array de IDs
    fecha_inicio: "2026-02-15 09:00:00",
    fecha_fin: "2026-02-15 11:00:00",
};
```

---

### 🟡 **2. Formato de Fechas**

**Backend acepta:**

- ✅ `2026-02-15 09:00:00` (formato Laravel)
- ✅ `2026-02-15T09:00:00.000Z` (ISO 8601)

**Backend retorna:**

- ✅ Siempre ISO 8601: `2026-02-15T09:00:00.000000Z`

```javascript
// Convertir fecha para enviar:
const formatDateForBackend = (date) => {
    return date.toISOString().slice(0, 19).replace("T", " ");
    // Resultado: "2026-02-15 09:00:00"
};

// Parsear fecha del backend:
const fecha = new Date(reservation.fecha_inicio);
```

---

### 🟢 **3. Respuestas con `data` wrapper**

Muchas respuestas están envueltas en `{ data: ... }`:

```javascript
// ❌ NO:
const users = response.data;

// ✅ SÍ:
const users = response.data.data; // Doble .data

// O mejor, destructurar:
const { data: users } = response.data;
```

**Endpoints con wrapper:**

- ✅ GET `/api/user` → `{ data: { user } }`
- ✅ GET `/api/material` → `{ data: [ materials ] }`
- ✅ GET `/api/reservas` → `{ data: [ reservations ] }`

---

## 💡 Ejemplos de Integración

### Ejemplo Completo: Listar y Mostrar Reservas

```javascript
import { ref, onMounted } from "vue";
import apiClient from "@/services/api";

const reservations = ref([]);

const fetchReservations = async () => {
    try {
        const response = await apiClient.get("/reservas");

        // ⚠️ Nota el doble .data
        reservations.value = response.data.data.map((reservation) => ({
            id: reservation.id,

            // Acceder a objetos anidados
            userName: reservation.user.name,
            userEmail: reservation.user.email,

            // room puede ser null
            roomName: reservation.room?.nombre || "Solo préstamo",
            roomType: reservation.room?.tipo,

            // materials es un array
            materialNames: reservation.materials
                .map((m) => m.nombre)
                .join(", "),
            materialCount: reservation.materials.length,

            // Fechas
            startDate: new Date(reservation.fecha_inicio),
            endDate: new Date(reservation.fecha_fin),

            // Estado
            status: reservation.estado,
            isGuest: reservation.es_invitado,
            observations: reservation.observaciones,
        }));
    } catch (error) {
        console.error("Error fetching reservations:", error);
    }
};

onMounted(fetchReservations);
```

### Ejemplo: Crear Reserva

```javascript
const createReservation = async (formData) => {
    try {
        // Preparar datos según formato del backend
        const payload = {
            user_id: formData.userId,
            room_id: formData.roomId || null, // Puede ser null
            material_ids: formData.materials, // Array de IDs
            fecha_inicio: formatDate(formData.startDate),
            fecha_fin: formatDate(formData.endDate),
            observaciones: formData.notes || null,
            es_invitado: formData.isGuest || false,
        };

        const response = await apiClient.post("/reservas", payload);

        // Backend retorna 201 Created
        console.log("Reserva creada:", response.data);

        return response.data;
    } catch (error) {
        if (error.response?.status === 409) {
            // Conflicto de solapamiento
            console.error("Conflicto:", error.response.data.conflicts);
        }
        throw error;
    }
};

const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
```

### Ejemplo: Búsqueda de Material

```javascript
// ✅ Búsqueda pública (no requiere token)
const searchMaterial = async (query) => {
    try {
        // No necesita autenticación
        const response = await axios.get(
            `http://127.0.0.1:8000/api/material/search`,
            { params: { q: query } },
        );

        return response.data.data;
    } catch (error) {
        console.error("Error searching:", error);
        return [];
    }
};

// Buscar por código de barras
const findByBarcode = async (barcode) => {
    try {
        const response = await axios.get(
            `http://127.0.0.1:8000/api/material/barcode/${barcode}`,
        );

        return response.data.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.log("Material no encontrado");
            return null;
        }
        throw error;
    }
};
```

---

## 🚨 Manejo de Errores

### Códigos de Estado HTTP

| Código | Significado      | Acción Recomendada            |
| ------ | ---------------- | ----------------------------- |
| 200    | OK               | Operación exitosa             |
| 201    | Created          | Recurso creado                |
| 401    | Unauthorized     | Redirigir a login             |
| 403    | Forbidden        | Mostrar "Sin permisos"        |
| 404    | Not Found        | Mostrar "No encontrado"       |
| 409    | Conflict         | Solapamiento de reserva       |
| 422    | Validation Error | Mostrar errores de validación |
| 500    | Server Error     | Mostrar error genérico        |

### Estructura de Errores

```javascript
// Error 422 - Validación
{
  "message": "The given data was invalid.",
  "errors": {
    "nombre": ["El campo nombre es obligatorio."],
    "codigo": ["El código ya está en uso."]
  }
}

// Error 409 - Conflicto de reserva
{
  "message": "Ya existe una reserva en ese horario",
  "conflicts": {
    "aula": "El aula ya está reservada de 09:00 a 11:00",
    "material": "Portátil HP ya está reservado en ese horario"
  }
}

// Error 401 - No autenticado
{
  "message": "No autenticado"
}
```

### Interceptor de Errores

```javascript
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem("auth_token");
            router.push("/login");
        }

        if (error.response?.status === 403) {
            // Sin permisos
            console.error("Acceso denegado");
        }

        if (error.response?.status === 422) {
            // Errores de validación
            const errors = error.response.data.errors;
            console.error("Validation errors:", errors);
        }

        return Promise.reject(error);
    },
);
```

---

## 🔑 Credenciales de Prueba

### Usuario Administrador

```
Email:    admin@example.com
Password: password
Role:     admin
```

### Usuarios Profesor (ejemplos)

```
Email:    zratke@example.net
Password: password
Role:     profesor
```

### Datos de Prueba Disponibles

- **Usuarios:** 11
- **Materiales:** 20
- **Aulas:** 5
- **Reservas:** 18

---

## 🎯 Checklist de Integración

### Antes de Empezar

- [ ] Verificar que el servidor Laravel está corriendo en `http://127.0.0.1:8000`
- [ ] Probar login en Postman
- [ ] Guardar colección Postman para referencia

### Configuración Frontend

- [ ] Configurar `API_BASE_URL`
- [ ] Implementar cliente HTTP (Axios/Fetch)
- [ ] Agregar interceptor para token
- [ ] Agregar interceptor para errores

### Adaptaciones Críticas

- [ ] **Reservas:** Usar `room_id` en lugar de `aula_id`
- [ ] **Reservas:** Usar `material_ids: []` (array) en lugar de `material_id`
- [ ] **Reservas:** Acceder a objetos anidados (`user.name`, `room.nombre`, `materials[]`)
- [ ] **Respuestas:** Manejar wrapper `{ data: ... }`
- [ ] **Fechas:** Formato `YYYY-MM-DD HH:mm:ss` al enviar

### Testing

- [ ] Login/Logout funciona
- [ ] Listar materiales (público)
- [ ] Buscar materiales
- [ ] Crear/editar reservas
- [ ] Listar reservas con relaciones
- [ ] Manejo de errores 401/403/422

---

## 📚 Recursos Adicionales

### Documentación

- **Colección Postman:** `Intermodular.postman_collection.json`
- **Plan de Trabajo:** `PlanDeTrabajo.md`
- **Guía Original:** `GuiaBackend.md`

### Endpoints de Ejemplo

```bash
# Listar materiales (público)
curl http://127.0.0.1:8000/api/material

# Login
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Buscar material
curl "http://127.0.0.1:8000/api/material/search?q=laptop"

# Listar reservas (con token)
curl http://127.0.0.1:8000/api/reservas \
  -H "Authorization: Bearer {tu-token}"
```

---

## 🆘 Soporte

### Problemas Comunes

**Error: CORS**

- Verificar que el backend tiene configurado `FRONTEND_URL` en `.env`
- Verificar `SANCTUM_STATEFUL_DOMAINS`

**Error: Token inválido**

- Verificar formato: `Bearer {token}` (con espacio)
- Token puede haber expirado, hacer login nuevamente

**Error 422 en reservas**

- Verificar que estás usando `room_id` (no `aula_id`)
- Verificar que `material_ids` es array
- Verificar formato de fechas

**Reservas no muestran relaciones**

- Verificar que estás accediendo a `response.data.data`
- Verificar que accedes a `reservation.user.name` (no `user_id`)

---

## ✅ Checklist Final

Antes de dar por terminada la integración:

- [ ] Todos los CRUD funcionan
- [ ] Login/Logout operativos
- [ ] Búsquedas funcionan
- [ ] Validaciones muestran mensajes
- [ ] Errores se manejan correctamente
- [ ] Reservas se crean/editan/cancelan
- [ ] Permisos por rol funcionan
- [ ] Formato de fechas correcto
- [ ] No hay warnings en console

---

**Última actualización:** 12 de Febrero 2026  
**Versión Backend:** Laravel 12.48.1 + Sanctum  
**Estado:** ✅ Producción Ready
