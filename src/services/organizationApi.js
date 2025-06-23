
import api from "./api";

export const getOrganizationsApi = async () => {
    const res = await api.get('/organizations');
    return res.data;
};
export const getOrganizationApi = async (id) => {
    const res = await api.get(`/organizations/${id}`);
    return res.data;
};

export const createOrganizationApi = async (userData) => {
    const res = await api.post(`/organizations`, userData);
    return res.data;
};

export const updateOrganizationApi = async (id, formData) => {
    const res = await api.put(`/organizations/${id}`, formData);
    return res.data;
};

// export const existNameRoleApi = async (name) => {
//     const res = await api.get(`/organizations/check/${name}`);
//     return res;
// };

export const deleteOrganizationApi = async (id) => {
    const res = await api.delete(`/organizations/${id}`);
    return res.data;
};
