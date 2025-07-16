
import api from "./api";

export const getDepartmentsApi = async () => {
    const res = await api.get('/departments');
    return res.data;
};
export const getDepartmentsViewApi = async () => {
    const res = await api.get('/departments/view');
    return res.data;
};
export const getDepartmentApi = async (id) => {
    const res = await api.get(`/departments/${id}`);
    return res.data;
};

export const createDepartmentApi = async (userData) => {
    const res = await api.post(`/departments`, userData);
    return res.data;
};

export const updateDepartmentApi = async (id, formData) => {
    const res = await api.put(`/departments/${id}`, formData);
    return res.data;
};
export const assignDepartmentApi = async (id, formData) => {
    const res = await api.put(`/departments/assignee/${id}`, formData);
    return res.data;
};
// export const existNameRoleApi = async (name) => {
//     const res = await api.get(`/departments/check/${name}`);
//     return res;
// };

export const deleteDepartmentApi = async (id) => {
    const res = await api.delete(`/departments/${id}`);
    return res.data;
};
