import api from "./api";

export const getDashboardCountEmpApi = async () => {
    const res = await api.get('/dashboards/count-emp');
    return res.data;
};