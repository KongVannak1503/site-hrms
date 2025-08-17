import api from './api';

export const getDashboardStatsApi = async () => {
  const res = await api.get('/dashboard');
  return res.data;
};
