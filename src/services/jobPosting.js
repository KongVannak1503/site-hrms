import api from "./api";

export const getJobPostingsApi = async () => {
    const res = await api.get('/job-postings');
    return res.data;
};
export const getJobPostingApi = async (id) => {
    const res = await api.get(`/job-postings/${id}`);
    return res.data;
};

export const createJobPostingApi = async (userData) => {
    const res = await api.post(`/job-postings`, userData);
    return res.data;
};

export const updateJobPostingApi = async (id, formData) => {
    const res = await api.put(`/job-postings/${id}`, formData);
    return res.data;
};

export const deleteJobPostingApi = async (id) => {
    const res = await api.delete(`/job-postings/${id}`);
    return res.data;
};
