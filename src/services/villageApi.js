
import api from "./api";

export const getVillagesApi = async () => {
    const res = await api.get('/villages');
    return res.data;
};
export const getVillagesViewApi = async () => {
    const res = await api.get('/villages/view');
    return res.data;
};
export const getVillageApi = async (id) => {
    const res = await api.get(`/villages/${id}`);
    return res.data;
};

export const createVillageApi = async (userData) => {
    const res = await api.post(`/villages`, userData);
    return res.data;
};

export const updateVillageApi = async (id, formData) => {
    const res = await api.put(`/villages/${id}`, formData);
    return res.data;
};

export const deleteVillageApi = async (id) => {
    const res = await api.delete(`/villages/${id}`);
    return res.data;
};
