
import api from "./api";

export const getPositionsApi = async () => {
    const res = await api.get('/positions');
    return res.data;
};
export const getPositionsViewApi = async () => {
    const res = await api.get('/positions/view');
    return res.data;
};
export const getPositionApi = async (id) => {
    const res = await api.get(`/positions/${id}`);
    return res.data;
};

export const getPositionsByDepartmentApi = async (departmentId) => {
    const res = await api.get(`/positions/by-department/${departmentId}`);
    return res.data;
};

export const createPositionApi = async (userData) => {
    const res = await api.post(`/positions`, userData);
    return res.data;
};

export const updatePositionApi = async (id, formData) => {
    const res = await api.put(`/positions/${id}`, formData);
    return res.data;
};

export const deletePositionApi = async (id) => {
    const res = await api.delete(`/positions/${id}`);
    return res.data;
};
