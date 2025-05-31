import axios from 'axios';
import { API_URL, TOKEN } from './mainApi';
import { decodeToken } from '../components/utils/auth';

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
    const decoded = decodeToken();
    const id = decoded.id;

    const response = await axios.get(`${API_URL}users/access/${id}`, {
        headers: {
            Authorization: TOKEN,
        },
    });
    return response;
};

