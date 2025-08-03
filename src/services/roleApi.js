
import { API_URL, TOKEN } from "./mainApi";
import api from "./api";


export const getRolesApi = async () => {
    const res = await api.get('/roles');
    return res.data;
};

export const getRolesByNameApi = async (action) => {
    const res = await api.get(`/roles/action/${action}`);
    return res.data;
};

export const getRolesCountNameApi = async (name) => {
    const res = await api.get(`/roles/count/${name}`);
    return res.data;
};

export const getRoleApi = async (id) => {
    const res = await api.get(`/roles/${id}`);
    return res.data;
};

export const createRoleApi = async (userData) => {
    const res = await api.post(`/roles`, userData);
    return res.data;
};

export const updateRoleApi = async (id, formData) => {
    const res = await api.put(`/roles/${id}`, formData);
    return res.data;
};

export const existNameRoleApi = async (name) => {
    const res = await api.get(`/roles/check/${name}`);
    return res;
};

export const deleteRoleApi = async (id) => {
    const res = await api.delete(`/roles/${id}`);
    return res.data;
};
