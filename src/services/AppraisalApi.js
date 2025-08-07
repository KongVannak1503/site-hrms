
import api from "./api";

export const getAppraisalsApi = async () => {
    const res = await api.get('/appraisals');
    return res.data;
};


export const getAppraisalApi = async (id) => {
    const res = await api.get(`/appraisals/${id}`);
    return res.data;
};

export const createAppraisalApi = async (userData) => {
    const res = await api.post(`/appraisals`, userData);
    return res.data;
};

export const updateAppraisalApi = async (id, formData) => {
    const res = await api.put(`/appraisals/${id}`, formData);
    return res.data;
};

// export const existNameRoleApi = async (name) => {
//     const res = await api.get(`/appraisals/check/${name}`);
//     return res;
// };

export const deleteAppraisalApi = async (id) => {
    const res = await api.delete(`/appraisals/${id}`);
    return res.data;
};

// department
export const getAppraisalsByDepartmentApi = async (department) => {
    const res = await api.get(`/appraisals/view-by-department/${department}`);
    return res.data;
};

export const createAppraisalIndividualDayApi = async (userData) => {
    const res = await api.post(`/appraisals/individual/day`, userData);
    return res.data;
};
export const updateAppraisalIndividualDayApi = async (id, userData) => {
    const res = await api.put(`/appraisals/individual/day/${id}`, userData);
    return res.data;
};

export const getAppraisalIndividualDayApi = async (employee, dayId, templateId) => {
    const res = await api.get(`/appraisals/individual/${employee}/day/${dayId}/form/${templateId}`);
    return res.data;
};

export const createAppraisalIndividualEmpDayApi = async (userData) => {
    const res = await api.post(`/appraisals/individual/day/employee`, userData);
    return res.data;
};
export const updateAppraisalIndividualEmpDayApi = async (id, userData) => {
    const res = await api.put(`/appraisals/individual/day/employee/${id}`, userData);
    return res.data;
};

export const getAppraisalIndividualEmpDayApi = async (employee, dayId, templateId) => {
    const res = await api.get(`/appraisals/individual/employee/${employee}/day/${dayId}/form/${templateId}`);
    return res.data;
};

export const createAppraisalIndividualManagerDayApi = async (userData) => {
    const res = await api.post(`/appraisals/individual/day/manager`, userData);
    return res.data;
};
export const updateAppraisalIndividualManagerDayApi = async (id, userData) => {
    const res = await api.put(`/appraisals/individual/day/manager/${id}`, userData);
    return res.data;
};

export const getAppraisalIndividualManagerDayApi = async (employee, dayId, templateId) => {
    const res = await api.get(`/appraisals/individual/manager/${employee}/day/${dayId}/form/${templateId}`);
    return res.data;
};


// Month
export const getAppraisalMonthsApi = async () => {
    const res = await api.get('/appraisals/month');
    return res.data;
};


export const getAppraisalMonthApi = async (id) => {
    const res = await api.get(`/appraisals/month/${id}`);
    return res.data;
};

export const createAppraisalMonthApi = async (userData) => {
    const res = await api.post(`/appraisals/month`, userData);
    return res.data;
};

export const updateAppraisalMonthApi = async (id, formData) => {
    const res = await api.put(`/appraisals/month/${id}`, formData);
    return res.data;
};

// export const existNameRoleApi = async (name) => {
//     const res = await api.get(`/appraisals/month/check/${name}`);
//     return res;
// };

export const deleteAppraisalMonthApi = async (id) => {
    const res = await api.delete(`/appraisals/month/${id}`);
    return res.data;
};
// Individual

export const createAppraisalIndividualMonthApi = async (userData) => {
    const res = await api.post(`/appraisals/individual/month`, userData);
    return res.data;
};
export const updateAppraisalIndividualMonthApi = async (id, userData) => {
    const res = await api.put(`/appraisals/individual/month/${id}`, userData);
    return res.data;
};

export const getAppraisalIndividualMonthApi = async (employee, dayId, templateId) => {
    const res = await api.get(`/appraisals/individual/${employee}/month/${dayId}/form/${templateId}`);
    return res.data;
};

export const createAppraisalIndividualEmpMonthApi = async (userData) => {
    const res = await api.post(`/appraisals/individual/month/employee`, userData);
    return res.data;
};
export const updateAppraisalIndividualEmpMonthApi = async (id, userData) => {
    const res = await api.put(`/appraisals/individual/month/employee/${id}`, userData);
    return res.data;
};

export const getAppraisalIndividualEmpMonthApi = async (employee, dayId, templateId) => {
    const res = await api.get(`/appraisals/individual/employee/${employee}/month/${dayId}/form/${templateId}`);
    return res.data;
};

export const createAppraisalIndividualManagerMonthApi = async (userData) => {
    const res = await api.post(`/appraisals/individual/month/manager`, userData);
    return res.data;
};
export const updateAppraisalIndividualManagerMonthApi = async (id, userData) => {
    const res = await api.put(`/appraisals/individual/month/manager/${id}`, userData);
    return res.data;
};

export const getAppraisalIndividualManagerMonthApi = async (employee, dayId, templateId) => {
    const res = await api.get(`/appraisals/individual/manager/${employee}/month/${dayId}/form/${templateId}`);
    return res.data;
};
