
import api from "./api";

export const getEmployeeDocumentsApi = async () => {
    const res = await api.get('/employee-document')
        .populate('employeeId', 'first_name_kh last_name_kh')
        .populate('file_urls') // This assumes your files are in a separate collection
        .sort({ updatedAt: -1 });
    return res.data;
};

export const getEmployeeDocumentsViewApi = async () => {
    const res = await api.get('/employee-document/view');
    return res.data;
};

export const getEmployeeDocumentApi = async (id) => {
    const res = await api.get(`/employee-document/${id}`);
    return res.data;
};

export const createEmployeeDocumentApi = async (userData) => {
    const res = await api.post(`/employee-document`, userData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const updateEmployeeDocumentApi = async (id, formData) => {
    const res = await api.put(`/employee-document/${id}`, formData);
    return res.data;
};

// export const existNameRoleApi = async (name) => {
//     const res = await api.get(`/employee-document/check/${name}`);
//     return res;
// };

export const deleteEmployeeDocumentApi = async (id) => {
    const res = await api.delete(`/employee-document/${id}`);
    return res.data;
};
