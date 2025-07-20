import api from './api';

// ✅ Get all test assignments
export const getAllTestAssignmentsApi = async () => {
  const res = await api.get('/test-assignments');
  return res.data;
};

// ✅ Get test assignment by ID
export const getTestAssignmentByIdApi = async (id) => {
  const res = await api.get(`/test-assignments/${id}`);
  return res.data;
};

// ✅ Create test assignment
export const createTestAssignmentApi = async (data) => {
  const res = await api.post('/test-assignments', data);
  return res.data;
};

// ✅ Update test assignment
export const updateTestAssignmentApi = async (id, data) => {
  const res = await api.put(`/test-assignments/${id}`, data);
  return res.data;
};

// ✅ Update test schedule assignment
export const updateTestScheduleApi = async (id, data) => {
  const res = await api.put(`/test-assignments/${id}/schedule`, data);
  return res.data;
};

// ✅ Delete test assignment
export const deleteTestAssignmentApi = async (id) => {
  const res = await api.delete(`/test-assignments/${id}`);
  return res.data;
};

export const cancelTestAssignmentApi = async (id) => {
  const res = await api.put(`/test-assignments/${id}/cancel`);
  return res.data;
};

// ✅ Get test assignment detail by ID
export const getTestAssignmentDetailApi = async (id) => {
  const res = await api.get(`/test-assignments/${id}/detail`);
  return res.data;
};

// ✅ Update test result (status, feedback, scores, attachment)
export const updateTestResultApi = async (id, formData) => {
  const res = await api.put(`/test-assignments/${id}/result`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};
