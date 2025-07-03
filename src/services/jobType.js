import api from "./api";

export const getJobTypesApi = async () => {
    const res = await api.get('/job-types');
    return res.data;
};
export const getJobTypeApi = async (id) => {
    const res = await api.get(`/job-types/${id}`);
    return res.data;
};

export const createJobTypeApi = async (userData) => {
    const res = await api.post(`/job-types`, userData);
    return res.data;
};

export const updateJobTypeApi = async (id, formData) => {
    const res = await api.put(`/job-types/${id}`, formData);
    return res.data;
};

export const deleteJobTypeApi = async (id) => {
    const res = await api.delete(`/job-types/${id}`);
    return res.data;
};
