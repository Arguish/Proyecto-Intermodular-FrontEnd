# JSON Server - Mock API

Esta carpeta contiene el servidor mock de la API para desarrollo.

## 📁 Archivos

- **server.cjs** - Servidor con lógica personalizada y autenticación
- **db.json** - Base de datos mock con usuarios, material y reservas
- **API_MOCK.md** - Documentación completa de la API

## 🚀 Uso

Desde la raíz del proyecto:

```bash
# Iniciar solo el servidor API
npm run api

# Iniciar API + Frontend en paralelo
npm run dev:all
```

## 🔑 Usuarios de Prueba

| Email               | Contraseña  | Rol      |
| ------------------- | ----------- | -------- |
| admin@classy.com    | admin123    | admin    |
| profesor@classy.com | profesor123 | profesor |
| alumno@classy.com   | alumno123   | alumno   |

## 🌐 Servidor

- Puerto: **8000**
- Base URL: `http://localhost:8000/api`

## 📝 Notas

- Los cambios en `db.json` se guardan automáticamente
- El servidor usa `__dirname` para encontrar `db.json` correctamente
- Las rutas protegidas requieren autenticación (header `Authorization: Bearer {token}`)
