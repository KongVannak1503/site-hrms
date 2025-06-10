import api from "./api";

export const LoginUser = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    return res;
};

export const logoutUser = async () => {
    return await api.post('/auth/logout', null, { withCredentials: true });
};

