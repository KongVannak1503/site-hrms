import api from './api';

// Get all test types
export const getAllTestTypesApi = async () => {
  const res = await api.get('/test-types');
  return res.data;
};

// Get a single test type 
export const getTestTypeByIdApi = async (id) => {
  const res = await api.get(`/test-types/${id}`);
  return res.data;
};

// Create a test type
export const createTestTypeApi = async (data) => {
  const res = await api.post('/test-types', data);
  return res.data;
};

// Update a test type
export const updateTestTypeApi = async (id, data) => {
  const res = await api.put(`/test-types/${id}`, data);
  return res.data;
};

// Delete a test type
export const deleteTestTypeApi = async (id) => {
  const res = await api.delete(`/test-types/${id}`);
  return res.data;
};
