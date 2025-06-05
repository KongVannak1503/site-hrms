import axios from "axios";
import { API_URL, TOKEN } from "./mainApi";

export const getRolesApi = async () => {
    const response = await axios.get(`${API_URL}roles`, {
        headers: {
            Authorization: TOKEN,
        },
    });
    return response.data;
};
export const getRoleApi = async (id) => {
    const response = await axios.get(`${API_URL}roles/${id}`, {
        headers: {
            Authorization: TOKEN,
        },
    });
    return response.data;
};

export const createRoleApi = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}roles`, userData, {
            headers: {
                Authorization: TOKEN,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
};

export const updateRoleApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}roles/${id}`, formData, {
            headers: {
                Authorization: TOKEN
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
};

export const deleteRoleApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}roles/${id}`, {
            headers: {
                Authorization: TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting role with ID ${id}:`, error);
        throw error;
    }
};