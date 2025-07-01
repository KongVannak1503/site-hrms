
import api from "./api";

export const getCitiesApi = async () => {
    const res = await api.get('/cities');
    return res.data;
};

export const getCitiesViewApi = async () => {
    const res = await api.get('/cities/view');
    return res.data;
};

export const getCityApi = async (id) => {
    const res = await api.get(`/cities/${id}`);
    return res.data;
};

export const createCityApi = async (userData) => {
    const res = await api.post(`/cities`, userData);
    return res.data;
};

export const updateCityApi = async (id, formData) => {
    const res = await api.put(`/cities/${id}`, formData);
    return res.data;
};

// export const existNameRoleApi = async (name) => {
//     const res = await api.get(`/cities/check/${name}`);
//     return res;
// };

export const deleteCityApi = async (id) => {
    const res = await api.delete(`/cities/${id}`);
    return res.data;
};
