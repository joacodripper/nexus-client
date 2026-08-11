# Nexus Client

Frontend de **Nexus**, una plataforma de gestión de proyectos y tareas. Construido con **React 19 + Vite**, enrutado con **React Router 7** y estilos con **CSS custom** (modo claro/oscuro incluido).

## Puesta en marcha (desarrollo)

Requisitos: **Node.js** y la **API de Nexus** corriendo en `http://localhost:8000` (ver `nexus-api/README.md`).

```bash
# 1. Instalar dependencias
npm install

# 2. (Opcional) Apuntar a otra URL de API
cp .env.example .env
#   edita VITE_API_URL si tu API no está en http://localhost:8000/api

# 3. Levantar el servidor de desarrollo
npm run dev
```

La app queda en `http://localhost:5173`.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualizar el build |
| `npm run lint` | ESLint (React Hooks + Fast Refresh) |

## Estructura

```
src/
├── api.js                    # Cliente HTTP centralizado (token + manejo 401)
├── context/
│   ├── AuthContext.js        # Objeto de contexto
│   └── AuthProvider.jsx      # Provider con login/registro/logout
├── layouts/DashboardLayout.jsx
└── pages/
    ├── Landing.jsx           # Página pública (marketing)
    ├── Login.jsx / Register.jsx
    ├── Dashboard.jsx         # Proyectos con barra de progreso
    ├── ProjectDetails.jsx    # Tareas de un proyecto
    ├── AllTasks.jsx          # Todas las tareas del usuario
    └── Activity.jsx          # Línea de tiempo de actividad
```

## Autenticación

El token se guarda en `localStorage`. Todo el tráfico a la API pasa por `src/api.js`, que añade el header `Authorization: Token <token>`. Si la API devuelve **401** (token inválido o expirado), la sesión se limpia y redirige a `/login` automáticamente.

## Despliegue (Vercel)

1. Sube el repo a Vercel (framework preset: **Vite**).
2. En Project → Settings → Environment Variables define:
   - `VITE_API_URL` → la URL de tu API desplegada (ej. `https://nexus-api.onrender.com/api`)
3. Asegúrate de que la URL del front desplegado esté en `CORS_ALLOWED_ORIGINS` del backend (ver `nexus-api/core/settings.py`).
