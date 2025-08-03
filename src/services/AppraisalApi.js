
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
