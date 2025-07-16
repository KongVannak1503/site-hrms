import api from './api';

// ✅ Get all applicants
export const getApplicantsApi = async () => {
  const res = await api.get('/applicants');
  return res.data;
};

// ✅ Get single applicant by ID
export const getApplicantApi = async (id) => {
  const res = await api.get(`/applicants/${id}`);
  return res.data;
};

// ✅ Create new applicant (multipart/form-data)
export const createApplicantApi = async (formData) => {
  const res = await api.post('/applicants', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// ✅ Update applicant (multipart/form-data)
export const updateApplicantApi = async (id, formData) => {
  const res = await api.put(`/applicants/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// ✅ Delete applicant
export const deleteApplicantApi = async (id) => {
  const res = await api.delete(`/applicants/${id}`);
  return res.data;
};
