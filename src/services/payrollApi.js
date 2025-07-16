
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


// bonuses


export const getBonusesApi = async () => {
    const res = await api.get('/payroll/bonus');
    return res.data;
};
export const getBonusViewApi = async () => {
    const res = await api.get('/payroll/bonus/view');
    return res.data;
};
export const getBonusApi = async (id) => {
    const res = await api.get(`/payroll/bonus/${id}`);
    return res.data;
};

export const createBonusApi = async (userData) => {
    const res = await api.post(`/payroll/bonus`, userData);
    return res.data;
};

export const updateBonusApi = async (id, formData) => {
    const res = await api.put(`/payroll/bonus/${id}`, formData);
    return res.data;
};

export const deleteBonusApi = async (id) => {
    const res = await api.delete(`/payroll/bonus/${id}`);
    return res.data;
};


// sub payroll

export const createSubBonusApi = async (id, userData) => {
    const res = await api.post(`/payroll/bonus/sub/${id}`, userData);
    return res.data;
};