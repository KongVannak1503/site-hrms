import api from "./api";

export const getUsersApi = async () => {
    const res = await api.get('/users');
    return res.data;
};