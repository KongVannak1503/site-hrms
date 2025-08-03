
import api from "./api";

export const getAllKpiApi = async () => {
    const res = await api.get('/kpi');
    return res.data;
};

export const getActiveKpiTemplatesApi = async () => {
    const res = await api.get('/kpi/active');
    return res.data;
};

export const getKpiApi = async (id) => {
    const res = await api.get(`/kpi/${id}`);
    return res.data;
};

export const createKpiApi = async (userData) => {
    const res = await api.post(`/kpi`, userData);
    return res.data;
};

export const duplicateKpiApi = async (id) => {
    const res = await api.post(`/kpi/duplicate/${id}`);
    return res.data;
};

export const updateKpiApi = async (id, formData) => {
    const res = await api.put(`/kpi/${id}`, formData);
    return res.data;
};

export const deleteKpiApi = async (id) => {
    const res = await api.delete(`/kpi/${id}`);
    return res.data;
};

// month

export const getAllMonthKpiApi = async () => {
    const res = await api.get('/kpi/month');
    return res.data;
};

export const getMonthKpiApi = async (id) => {
    const res = await api.get(`/kpi/month/${id}`);
    return res.data;
};

export const createMonthKpiApi = async (userData) => {
    const res = await api.post(`/kpi/month`, userData);
    return res.data;
};

export const duplicateMonthKpiApi = async (id) => {
    const res = await api.post(`/kpi/month/duplicate/${id}`);
    return res.data;
};

export const updateMonthKpiApi = async (id, formData) => {
    const res = await api.put(`/kpi/month/${id}`, formData);
    return res.data;
};

export const deleteMonthKpiApi = async (id) => {
    const res = await api.delete(`/kpi/month/${id}`);
    return res.data;
};
// end month


// Days

export const getAllDayKpiApi = async () => {
    const res = await api.get('/kpi/day');
    return res.data;
};

export const getDayKpiApi = async (id) => {
    const res = await api.get(`/kpi/day/${id}`);
    return res.data;
};

export const createDayKpiApi = async (userData) => {
    const res = await api.post(`/kpi/day`, userData);
    return res.data;
};

export const duplicateDayKpiApi = async (id) => {
    const res = await api.post(`/kpi/day/duplicate/${id}`);
    return res.data;
};

export const updateDayKpiApi = async (id, formData) => {
    const res = await api.put(`/kpi/day/${id}`, formData);
    return res.data;
};

export const deleteDayKpiApi = async (id) => {
    const res = await api.delete(`/kpi/day/${id}`);
    return res.data;
};
// end Days

// Individual
export const createKpiIndividualApi = async (userData) => {
    const res = await api.post(`/kpi/individual`, userData);
    return res.data;
};
export const updateKpiIndividualApi = async (id, userData) => {
    const res = await api.put(`/kpi/individual/${id}`, userData);
    return res.data;
};
export const getKpiIndividualThisMonthApi = async (id) => {
    const res = await api.get(`/kpi/individual/${id}`);
    return res.data;
};

export const getKpiIndividualThisYearApi = async (employee, templateId) => {
    const res = await api.get(`/kpi/individual/year/${employee}/form/${templateId}`);
    return res.data;
};

export const createKpiIndividualYearEmpApi = async (userData) => {
    const res = await api.post(`/kpi/individual/year/emp`, userData);
    return res.data;
};
export const updateKpiIndividualYearEmpApi = async (id, userData) => {
    const res = await api.put(`/kpi/individual/year/emp/${id}`, userData);
    return res.data;
};

export const getKpiIndividualYearEmpApi = async (employee, templateId) => {
    const res = await api.get(`/kpi/individual/year/emp/${employee}/form/${templateId}`);
    return res.data;
};

// Month
export const createKpiIndividualMonthApi = async (userData) => {
    const res = await api.post(`/kpi/individual/month`, userData);
    return res.data;
};
export const updateKpiIndividualMonthApi = async (id, userData) => {
    const res = await api.put(`/kpi/individual/month/${id}`, userData);
    return res.data;
};

export const getKpiIndividualMonthApi = async (employee, templateId) => {
    const res = await api.get(`/kpi/individual/month/${employee}/form/${templateId}`);
    return res.data;
};
// end month


// Day
export const createKpiIndividualDayApi = async (userData) => {
    const res = await api.post(`/kpi/individual/day`, userData);
    return res.data;
};
export const updateKpiIndividualDayApi = async (id, userData) => {
    const res = await api.put(`/kpi/individual/day/${id}`, userData);
    return res.data;
};

export const getKpiIndividualDayApi = async (employee, templateId) => {
    const res = await api.get(`/kpi/individual/day/${employee}/form/${templateId}`);
    return res.data;
};
// end day