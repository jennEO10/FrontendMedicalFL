import axios from 'axios';

const API_URL = 'https://graphic-brook-404722.uc.r.appspot.com';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token en cada request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
