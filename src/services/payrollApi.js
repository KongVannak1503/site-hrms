
import api from "./api";

export const getPayrollsApi = async () => {
    const res = await api.get('/payroll');
    return res.data;
};
export const getPayrollViewApi = async () => {
    const res = await api.get('/payroll/view');
    return res.data;
};
export const getPayrollApi = async (id) => {
    const res = await api.get(`/payroll/${id}`);
    return res.data;
};

export const createPayrollApi = async (userData) => {
    const res = await api.post(`/payroll`, userData);
    return res.data;
};

export const updatePayrollApi = async (id, formData) => {
    const res = await api.put(`/payroll/${id}`, formData);
    return res.data;
};

export const deletePayrollApi = async (id) => {
    const res = await api.delete(`/payroll/${id}`);
    return res.data;
};
