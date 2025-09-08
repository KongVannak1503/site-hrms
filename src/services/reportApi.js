import api from "./api";

export const getReportEmployeesApi = async () => {
    const res = await api.get('/reports');
    return res.data;
};
export const getReportRecruitmentApi = async () => {
    const res = await api.get('/reports/recruitment');
    return res.data;
};
export const getReportEmployeeGenderStatsApi = async () => {
    const res = await api.get('/reports/employee-gender');
    return res.data;
};
// export const getJobTypeApi = async (id) => {
//     const res = await api.get(`/reports/${id}`);
//     return res.data;
// };

// export const createJobTypeApi = async (userData) => {
//     const res = await api.post(`/reports`, userData);
//     return res.data;
// };

// export const updateJobTypeApi = async (id, formData) => {
//     const res = await api.put(`/reports/${id}`, formData);
//     return res.data;
// };

// export const deleteJobTypeApi = async (id) => {
//     const res = await api.delete(`/reports/${id}`);
//     return res.data;
// };
