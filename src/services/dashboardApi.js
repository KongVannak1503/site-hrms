import api from "./api";

export const getDashboardApi = async () => {
    const res = await api.get('/dashboard');
    return res.data;
};
export const getDashboardDepartmentChartApi = async () => {
    const res = await api.get('/dashboard/department-chart');
    return res.data;
};

export const getDashboardRecentlyAppraisalApi = async () => {
    const res = await api.get('/dashboard/recently-appraisal');
    return res.data;
};