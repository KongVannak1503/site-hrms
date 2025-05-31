// utils/auth.js
import { jwtDecode } from 'jwt-decode';


export const getToken = () => {
    return localStorage.getItem('token');
};

export const decodeToken = () => {
    const token = getToken();
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch (err) {
        console.error('❌ Invalid token:', err);
        return null;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};
