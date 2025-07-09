import api from './api';

// Get all applicants
export const getApplicantsApi = async () => {
  const res = await api.get('/applicants');
  return res.data;
};

// Get single applicant by ID
export const getApplicantApi = async (id) => {
  const res = await api.get(`/applicants/${id}`);
  return res.data;
};

// Get applicants by job posting ID
export const getApplicantsByJobApi = async (jobId) => {
  const res = await api.get(`/applicants/by-job/${jobId}`);
  return res.data;
};


// Create new applicant (use FormData)
export const createApplicantApi = async (formData) => {
  const res = await api.post('/applicants', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Update full applicant (use FormData)
export const updateApplicantApi = async (id, formData) => {
  const res = await api.put(`/applicants/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Delete applicant
export const deleteApplicantApi = async (id) => {
  const res = await api.delete(`/applicants/${id}`);
  return res.data;
};
