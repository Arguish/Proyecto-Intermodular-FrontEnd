# Proyecto-Intermodular-FrontEnd

# IES El Rincón - Frontend (Portal de Reservas)

Interfaz de usuario moderna y rápida para que el profesorado y el personal de conserjería gestionen el material del centro de forma eficiente.

## 🛠️ Stack Tecnológico

- **Framework:** React con Next.js.
- **Estilos:** Tailwind CSS (Paleta corporativa IES El Rincón).
- **Consumo de datos:** Fetch/Axios hacia la API de Laravel.

## 🎨 Identidad Visual (IES El Rincón)

### Modo Claro (Light Mode)

**Colores Primarios:**

- **primary-50:** `#e6f1f8` (Azul muy claro - Fondos suaves)
- **primary-100:** `#b3d7ed` (Azul claro - Hover estados)
- **primary-500:** `#005696` (Azul El Rincón - Principal)
- **primary-600:** `#004577` (Azul oscuro - Hover)
- **primary-700:** `#003559` (Azul muy oscuro - Active)

**Colores de Acento:**

- **accent-50:** `#fce8e9` (Rojo muy claro)
- **accent-100:** `#f7b8bc` (Rojo claro - Hover)
- **accent-500:** `#e30613` (Rojo corporativo - Principal)
- **accent-600:** `#b6050f` (Rojo oscuro - Hover)
- **accent-700:** `#8a040b` (Rojo muy oscuro - Active)

**Fondos y Superficies:**

- **background:** `#f9f9f9` (Fondo principal)
- **surface:** `#ffffff` (Tarjetas, modales)
- **surface-alt:** `#f3f4f6` (Fondo alternativo)

**Textos:**

- **text-primary:** `#1f2937` (Texto principal)
- **text-secondary:** `#6b7280` (Texto secundario)
- **text-tertiary:** `#9ca3af` (Texto terciario)
- **text-on-primary:** `#ffffff` (Texto sobre azul)
- **text-on-accent:** `#ffffff` (Texto sobre rojo)

**Bordes y Divisores:**

- **border:** `#e5e7eb` (Bordes sutiles)
- **border-strong:** `#d1d5db` (Bordes destacados)

**Colores Semánticos:**

- **success:** `#10b981` (Verde éxito)
- **warning:** `#f59e0b` (Naranja advertencia)
- **error:** `#ef4444` (Rojo error)
- **info:** `#3b82f6` (Azul información)

### Modo Oscuro (Dark Mode)

**Colores Primarios:**

- **primary-50:** `#1a3a4f` (Azul muy oscuro)
- **primary-100:** `#245270` (Azul oscuro)
- **primary-500:** `#3a8fc9` (Azul brillante)
- **primary-600:** `#5ca7d8` (Azul claro)
- **primary-700:** `#7dbce5` (Azul muy claro)

**Colores de Acento:**

- **accent-50:** `#4a1315` (Rojo muy oscuro)
- **accent-100:** `#6e1b1e` (Rojo oscuro)
- **accent-500:** `#f72c3a` (Rojo brillante)
- **accent-600:** `#fa5560` (Rojo claro)
- **accent-700:** `#fc7d86` (Rojo muy claro)

**Fondos y Superficies:**

- **background:** `#0f172a` (Fondo principal oscuro)
- **surface:** `#1e293b` (Tarjetas, modales)
- **surface-alt:** `#334155` (Fondo alternativo)

**Textos:**

- **text-primary:** `#f1f5f9` (Texto principal)
- **text-secondary:** `#cbd5e1` (Texto secundario)
- **text-tertiary:** `#94a3b8` (Texto terciario)
- **text-on-primary:** `#ffffff` (Texto sobre azul)
- **text-on-accent:** `#ffffff` (Texto sobre rojo)

**Bordes y Divisores:**

- **border:** `#334155` (Bordes sutiles)
- **border-strong:** `#475569` (Bordes destacados)

**Colores Semánticos:**

- **success:** `#34d399` (Verde éxito)
- **warning:** `#fbbf24` (Naranja advertencia)
- **error:** `#f87171` (Rojo error)
- **info:** `#60a5fa` (Azul información)

## 🚀 Funcionalidades Principales

1. **Dashboard de Usuario:** Visualización ordenada de las reservas activas del profesor.
2. **Sistema de Escaneo:** Integración de lógica para identificación de materiales mediante códigos de barras.
3. **Gestión Interactiva:** Filtros de búsqueda de material y botones de interacción para devoluciones.
4. **Auth Guard:** Protección de rutas según el rol (Admin/User) devuelto por el Backend.

## 📂 Estructura

- `/components`: Elementos reutilizables (Botones, inputs, tarjetas).
- `/pages` o `/app`: Rutas principales (Login, Inventario, Reservas).
- `/styles`: Configuración de Tailwind y variables de color.

**Responsables:** Antonio (Front / Legal) y Javier (Tech Lead / Front)
