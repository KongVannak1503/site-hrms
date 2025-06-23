
import api from "./api";

export const getPositionsApi = async () => {
    const res = await api.get('/positions');
    return res.data;
};
export const getPositionApi = async (id) => {
    const res = await api.get(`/positions/${id}`);
    return res.data;
};

export const createPositionApi = async (userData) => {
    const res = await api.post(`/positions`, userData);
    return res.data;
};

export const updatePositionApi = async (id, formData) => {
    const res = await api.put(`/positions/${id}`, formData);
    return res.data;
};

// export const existNameRoleApi = async (name) => {
//     const res = await api.get(`/positions/check/${name}`);
//     return res;
// };

export const deletePositionApi = async (id) => {
    const res = await api.delete(`/positions/${id}`);
    return res.data;
};
