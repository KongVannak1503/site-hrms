
import api from "./api";

export const getCommunesApi = async () => {
    const res = await api.get('/communes');
    return res.data;
};
export const getCommunesViewApi = async () => {
    const res = await api.get('/communes/view');
    return res.data;
};
export const getCommuneApi = async (id) => {
    const res = await api.get(`/communes/${id}`);
    return res.data;
};

export const createCommuneApi = async (userData) => {
    const res = await api.post(`/communes`, userData);
    return res.data;
};

export const updateCommuneApi = async (id, formData) => {
    const res = await api.put(`/communes/${id}`, formData);
    return res.data;
};

export const deleteCommuneApi = async (id) => {
    const res = await api.delete(`/communes/${id}`);
    return res.data;
};
