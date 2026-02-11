# JSON Server - API Mock

## 🚀 Inicio Rápido

### Ejecutar solo la API mock
```bash
npm run api
```

### Ejecutar todo (API + Frontend)
```bash
npm run dev:all
```

### Ejecutar solo el frontend (si ya tienes la API corriendo)
```bash
npm run dev
```

## 📝 Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@classy.com | admin123 | admin |
| profesor@classy.com | profesor123 | profesor |
| alumno@classy.com | alumno123 | alumno |

## 🔗 Endpoints Disponibles

### Autenticación
- **POST** `/api/login` - Iniciar sesión
- **POST** `/api/logout` - Cerrar sesión
- **GET** `/api/user` - Obtener usuario actual

### Material
- **GET** `/api/material` - Listar todo el material
- **GET** `/api/material/:id` - Obtener material por ID
- **GET** `/api/material/search?q=query` - Buscar material
- **GET** `/api/material/barcode/:barcode` - Buscar por código de barras
- **POST** `/api/material` - Crear material
- **PUT** `/api/material/:id` - Actualizar material
- **DELETE** `/api/material/:id` - Eliminar material

### Reservas
- **GET** `/api/reservas` - Listar todas las reservas
- **GET** `/api/reservas/:id` - Obtener reserva por ID
- **POST** `/api/reservas` - Crear reserva
- **PUT** `/api/reservas/:id` - Actualizar reserva
- **DELETE** `/api/reservas/:id` - Eliminar reserva
- **POST** `/api/reservas/:id/devolver` - Marcar como devuelta

### Usuarios
- **GET** `/api/users` - Listar usuarios (requiere autenticación)
- **GET** `/api/users/:id` - Obtener usuario por ID

## 📦 Base de Datos

Los datos se almacenan en `db.json`. Puedes editar este archivo directamente para agregar/modificar datos.

## 🔐 Autenticación

1. Los endpoints protegidos requieren el header `Authorization: Bearer {token}`
2. El token se obtiene al hacer login exitoso
3. El token se guarda automáticamente en localStorage por el frontend

## 🛠 Características

- ✅ Autenticación simulada con tokens
- ✅ Validación de credenciales
- ✅ Rutas protegidas
- ✅ Búsqueda de material por nombre, código o categoría
- ✅ Búsqueda por código de barras
- ✅ Sistema de devolución de reservas
- ✅ Actualización automática de disponibilidad de material
- ✅ Respuestas similares a Laravel

## 📡 URL de la API

La API corre por defecto en: `http://localhost:8000`

Puedes cambiar el puerto editando `server.js` y `.env`:

```javascript
// En server.js
const PORT = 8000;

// En .env
VITE_API_URL=http://localhost:8000/api
```

## 🧪 Pruebas con cURL

### Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@classy.com","password":"admin123"}'
```

### Obtener usuario actual
```bash
curl http://localhost:8000/api/user \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Listar material
```bash
curl http://localhost:8000/api/material
```

## 🔄 Resetear Datos

Para restaurar los datos originales, simplemente edita `db.json` o cierra y vuelve a ejecutar el servidor.

## 📚 Recursos

- [JSON Server Documentation](https://github.com/typicode/json-server)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
