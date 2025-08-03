// utils/auth.js
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import { logoutUser } from '../services/authApi';


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

export const logout = async () => {
    try {
        await logoutUser();
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');
        return window.location.href = '/login';
    } catch (err) {
        console.error('Logout failed', err);
    }
};
