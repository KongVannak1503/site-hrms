
import api from "./api";

export const getEmployeesApi = async () => {
    const res = await api.get('/employees');
    return res.data;
};
export const getEmployeeApi = async (id) => {
    const res = await api.get(`/employees/${id}`);
    return res.data;
};

export const createEmployeeApi = async (userData) => {

    const res = await api.post(`/employees`, userData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const updateEmployeeApi = async (id, formData) => {
    const res = await api.put(`/employees/${id}`, formData);
    return res.data;
};

// export const existNameRoleApi = async (name) => {
//     const res = await api.get(`/employees/check/${name}`);
//     return res;
// };

export const deleteEmployeeApi = async (id) => {
    const res = await api.delete(`/employees/${id}`);
    return res.data;
};

// General Education

export const getEducationApi = async (id) => {
    const res = await api.get(`/employees/education/${id}`);
    return res.data;
};

export const createEducationApi = async (id, userData) => {
    const res = await api.post(`/employees/education/${id}`, userData);
    return res.data;
};


// General History

export const getHistoryApi = async (id) => {
    const res = await api.get(`/employees/history/${id}`);
    return res.data;
};


export const createHistoryApi = async (id, userData) => {
    const res = await api.post(`/employees/history/${id}`, userData);
    return res.data;
};

// ===== employeeApi.js (API service) =====
export const createEpmUploadApi = async (id, formData) => {
    console.log(id);

    const res = await api.post(`/employees/upload/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const getEpmUploadApi = async (employeeId) => {
    const res = await api.get(`/employees/upload/${employeeId}`);
    console.log(res);

    return res.data;
};

export const deleteEpmUploadApi = async (id) => {
    const res = await api.delete(`/employees/upload/${id}`);
    return res.data;
};