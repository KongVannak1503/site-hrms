
import api from "./api";

export const getCategoriesApi = async () => {
    const res = await api.get('/categories');
    return res.data;
};
export const getCategoryApi = async (id) => {
    const res = await api.get(`/categories/${id}`);
    return res.data;
};

export const createCategoryApi = async (userData) => {
    const res = await api.post(`/categories`, userData);
    return res.data;
};

export const updateCategoryApi = async (id, formData) => {
    const res = await api.put(`/categories/${id}`, formData);
    return res.data;
};

// export const existNameRoleApi = async (name) => {
//     const res = await api.get(`/categories/check/${name}`);
//     return res;
// };

export const deleteCategoryApi = async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
};
