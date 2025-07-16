import api from './api';

// ✅ Create job application (apply)
export const applyToJobApi = async ({ applicant_id, job_id }) => {
  const res = await api.post('/job-applications', { applicant_id, job_id });
  return res.data;
};

// ✅ Get all job applications by job ID
export const getJobApplicationsByJob = async (jobId) => {
  const res = await api.get(`/job-applications/job/${jobId}`);
  return res.data;
};

// ✅ Get a single job application by ID
export const getJobApplicationById = async (id) => {
  const res = await api.get(`/job-applications/${id}`);
  return res.data;
};

// ✅ Update job application status
export const updateJobApplicationStatus = async (id, status, notes = '') => {
  const res = await api.patch(`/job-applications/${id}/status`, { status, notes });
  return res.data;
};

// ✅ Update test score
export const updateTestScoreApi = async (id, test_score) => {
  const res = await api.patch(`/job-applications/${id}/test-score`, { test_score });
  return res.data;
};

// ✅ Update interview score
export const updateInterviewScoreApi = async (id, interview_score) => {
  const res = await api.patch(`/job-applications/${id}/interview-score`, { interview_score });
  return res.data;
};

// ✅ Update final score
export const updateFinalScoreApi = async (id, final_score) => {
  const res = await api.patch(`/job-applications/${id}/final-score`, { final_score });
  return res.data;
};
