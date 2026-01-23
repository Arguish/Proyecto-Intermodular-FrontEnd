import axios from "axios";

// Configuración base de Axios para la API de Laravel
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem("auth_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

// Funciones de API
export const authAPI = {
    login: (email, password) => api.post("/login", { email, password }),

    logout: () => api.post("/logout"),

    me: () => api.get("/user"),
};

export const reservasAPI = {
    getAll: () => api.get("/reservas"),

    getById: (id) => api.get(`/reservas/${id}`),

    create: (data) => api.post("/reservas", data),

    update: (id, data) => api.put(`/reservas/${id}`, data),

    delete: (id) => api.delete(`/reservas/${id}`),

    devolver: (id) => api.post(`/reservas/${id}/devolver`),
};

export const materialAPI = {
    getAll: () => api.get("/material"),

    getById: (id) => api.get(`/material/${id}`),

    search: (query) => api.get(`/material/search?q=${query}`),

    getByBarcode: (barcode) => api.get(`/material/barcode/${barcode}`),
};

export default api;
