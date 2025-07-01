
import api from "./api";

export const getDistrictsApi = async () => {
    const res = await api.get('/districts');
    return res.data;
};
export const getDistrictsViewApi = async () => {
    const res = await api.get('/districts/view');
    return res.data;
};
export const getDistrictApi = async (id) => {
    const res = await api.get(`/districts/${id}`);
    return res.data;
};

export const createDistrictApi = async (userData) => {
    const res = await api.post(`/districts`, userData);
    return res.data;
};

export const updateDistrictApi = async (id, formData) => {
    const res = await api.put(`/districts/${id}`, formData);
    return res.data;
};

export const deleteDistrictApi = async (id) => {
    const res = await api.delete(`/districts/${id}`);
    return res.data;
};
