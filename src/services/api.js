// api.js example
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export const attachTokenToApi = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};
api.interceptors.response.use(
    response => response,
    error => {
        const status = error?.response?.status;
        const currentPath = window.location.pathname;

        if (status === 401) {
            sessionStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                if (currentPath !== '/login') {
                    window.location.href = '/login';
                }
            }
        }

        if (status === 403) {
            // Prevent redirect loop
            if (currentPath !== '/unauthorized') {
                window.location.href = '/unauthorized';
            }
        }

        return Promise.reject(error);
    }
);


export default api;
