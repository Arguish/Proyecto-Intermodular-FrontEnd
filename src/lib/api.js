import axios from "axios";

const normalizeBaseUrl = (url) => (url ? url.replace(/\/+$/, "") : url);

const API_URL = {
    baseURL: normalizeBaseUrl(import.meta.env.VITE_API_URL || "/api"),
    auth: {
        login: "/login",
        logout: "/logout",
        me: "/user",
    },
    reservas: {
        base: "/reservas",
        byId: (id) => `/reservas/${id}`,
        devolver: (id) => `/reservas/${id}/devolver`,
    },
    material: {
        base: "/material",
        byId: (id) => `/material/${id}`,
        search: (query) => `/material/search?q=${query}`,
        byBarcode: (barcode) => `/material/barcode/${barcode}`,
    },
    aulas: {
        base: "/aulas",
        byId: (id) => `/aulas/${id}`,
    },
    users: {
        base: "/users",
        byId: (id) => `/users/${id}`,
    },
};

// Configuración base de Axios para la API de Laravel
const api = axios.create({
    baseURL: API_URL.baseURL,
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
    (config) => {
        const isLoginRequest = config.url?.includes(API_URL.auth.login);
        const token = localStorage.getItem("auth_token");
        if (token && !isLoginRequest) {
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
    login: (email, password) =>
        api.post(API_URL.auth.login, new URLSearchParams({ email, password }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }),

    logout: () => api.post(API_URL.auth.logout),

    me: () => api.get(API_URL.auth.me),
};

export const reservasAPI = {
    getAll: () => api.get(API_URL.reservas.base),

    getById: (id) => api.get(API_URL.reservas.byId(id)),

    create: (data) => api.post(API_URL.reservas.base, data),

    update: (id, data) => api.put(API_URL.reservas.byId(id), data),

    delete: (id) => api.delete(API_URL.reservas.byId(id)),

    cancel: (id) => api.post(`/reservas/${id}/cancel`),

    devolver: (id) => api.post(API_URL.reservas.devolver(id)),
};

export const materialAPI = {
    getAll: () => api.get(API_URL.material.base),

    getById: (id) => api.get(API_URL.material.byId(id)),

    search: (query) => api.get(API_URL.material.search(query)),

    getByBarcode: (barcode) => api.get(API_URL.material.byBarcode(barcode)),

    create: (data) => api.post(API_URL.material.base, data),

    update: (id, data) => api.put(API_URL.material.byId(id), data),

    delete: (id) => api.delete(API_URL.material.byId(id)),
};

export const aulasAPI = {
    getAll: () => api.get(API_URL.aulas.base),

    getById: (id) => api.get(API_URL.aulas.byId(id)),

    create: (data) => api.post(API_URL.aulas.base, data),

    update: (id, data) => api.put(API_URL.aulas.byId(id), data),

    delete: (id) => api.delete(API_URL.aulas.byId(id)),
};

export const usersAPI = {
    getAll: () => api.get(API_URL.users.base),

    getById: (id) => api.get(API_URL.users.byId(id)),

    create: (data) => api.post(API_URL.users.base, data),

    update: (id, data) => api.put(API_URL.users.byId(id), data),

    delete: (id) => api.delete(API_URL.users.byId(id)),
};

export default api;
