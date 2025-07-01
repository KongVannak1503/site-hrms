
import api from "./api";

export const getEducationLevelsApi = async () => {
    const res = await api.get('/education-level');
    return res.data;
};

export const getEducationLevelViewApi = async () => {
    const res = await api.get('/education-level/view');
    return res.data;
};

export const getEducationLevelApi = async (id) => {
    const res = await api.get(`/education-level/${id}`);
    return res.data;
};

export const createEducationLevelApi = async (userData) => {
    const res = await api.post(`/education-level`, userData);
    return res.data;
};

export const updateEducationLevelApi = async (id, formData) => {
    const res = await api.put(`/education-level/${id}`, formData);
    return res.data;
};

// export const existNameRoleApi = async (name) => {
//     const res = await api.get(`/education-level/check/${name}`);
//     return res;
// };

export const deleteEducationLevelApi = async (id) => {
    const res = await api.delete(`/education-level/${id}`);
    return res.data;
};
