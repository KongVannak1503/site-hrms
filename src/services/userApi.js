import api from "./api";

export const getUsersApi = async () => {
    const res = await api.get('/users');
    return res.data;
};

export const getUserApi = async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
};

export const deleteUserApi = async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
};

export const createUserApi = async (userData) => {
    const res = await api.post(`/users`, userData);
    return res.data;
};

export const updateUserApi = async (id, formData) => {
    const res = await api.put(`/users/${id}`, formData);
    return res.data;
};