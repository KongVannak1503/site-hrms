
import api from "./api";

export const getEmployeesApi = async () => {
    const res = await api.get('/employees');
    return res.data;
};
export const getEmployeeApi = async (id) => {
    const res = await api.get(`/employees/${id}`);
    return res.data;
};

export const createEmployeeApi = async (userData) => {
    const res = await api.post(`/employees`, userData);
    return res.data;
};

export const updateEmployeeApi = async (id, formData) => {
    const res = await api.put(`/employees/${id}`, formData);
    return res.data;
};

// export const existNameRoleApi = async (name) => {
//     const res = await api.get(`/employees/check/${name}`);
//     return res;
// };

export const deleteEmployeeApi = async (id) => {
    const res = await api.delete(`/employees/${id}`);
    return res.data;
};
