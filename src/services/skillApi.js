
import api from "./api";

export const getSkillsApi = async () => {
    const res = await api.get('/skills');
    return res.data;
};
export const getSkillApi = async (id) => {
    const res = await api.get(`/skills/${id}`);
    return res.data;
};

export const createSkillApi = async (userData) => {
    const res = await api.post(`/skills`, userData);
    return res.data;
};

export const updateSkillApi = async (id, formData) => {
    const res = await api.put(`/skills/${id}`, formData);
    return res.data;
};

// export const existNameRoleApi = async (name) => {
//     const res = await api.get(`/skills/check/${name}`);
//     return res;
// };

export const deleteSkillApi = async (id) => {
    const res = await api.delete(`/skills/${id}`);
    return res.data;
};
