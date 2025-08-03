import api from './api';

// Create job application (apply)
export const applyToJobApi = async ({ applicant_id, job_id }) => {
  const res = await api.post('/job-applications', { applicant_id, job_id });
  return res.data;
};

// Get all job applications by job ID
export const getJobApplicationsByJob = async (jobId) => {
  const res = await api.get(`/job-applications/job/${jobId}`);
  return res.data;
};

// Get a single job application by ID
export const getJobApplicationById = async (id) => {
  const res = await api.get(`/job-applications/${id}`);
  return res.data;
};

export const updateJobApplicationApi = async (id, data) => {
  const res = await api.put(`/job-applications/${id}`, data);
  return res.data;
};

//Update job application status
export const updateJobApplicationStatus = async (id, status, notes = '') => {
  const res = await api.patch(`/job-applications/${id}/status`, { status, notes });
  return res.data;
};

