import axios from 'axios';
import { API_URL, TOKEN } from './mainApi';
import { decodeToken } from '../components/utils/auth';
import { message } from 'antd';

export const loginUser = async (username, password) => {
    return axios.post(`${API_URL}users/login`, { username, password });
};

export const TestApi = async () => {
    const response = await axios.get(`${API_URL}users/test`, {
        headers: {
            Authorization: TOKEN,
        },
    });
    return response.data;
};

export const AccessTokenApi = async () => {
    try {
        const decoded = decodeToken();
        const id = decoded.id;

        const response = await axios.get(`${API_URL}users/access/${id}`, {
            headers: {
                Authorization: TOKEN,
            },
        });
        return response;
    } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 404)) {
            localStorage.removeItem('token'); // Clear token
            message.warning('Session expired or user not found. Please log in again.');
            window.location.href = '/login'; // Redirect to login
        } else {
            // message.error('Something went wrong. Please try again.');
            console.error('AccessTokenApi error:', error);
        }
        return null;
    }
};

