import api from './api';

// Get questions by test type ID
export const getQuestionsByTestTypeApi = async (testTypeId) => {
  const res = await api.get(`/questions/by-type/${testTypeId}`);
  return res.data;
};

// Create a question
export const createQuestionApi = async (data) => {
  const res = await api.post('/questions', data);
  return res.data;
};

// Update a question
export const updateQuestionApi = async (id, data) => {
  const res = await api.put(`/questions/${id}`, data);
  return res.data;
};

// Delete a question
export const deleteQuestionApi = async (id) => {
  const res = await api.delete(`/questions/${id}`);
  return res.data;
};
