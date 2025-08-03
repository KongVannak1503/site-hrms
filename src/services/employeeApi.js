
import api from "./api";

export const getEmployeesApi = async () => {
    const res = await api.get('/employees');
    return res.data;
};

export const getAllEmployeesApi = async () => {
    const res = await api.get('/employees/all');
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

export const assignEmployeeApi = async (id, formData) => {
    const res = await api.put(`/employees/assign/${id}`, formData);
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
    const res = await api.post(`/employees/upload/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const getEpmUploadApi = async (employeeId) => {
    const res = await api.get(`/employees/upload/${employeeId}`);
    return res.data;
};

export const deleteEpmUploadApi = async (id) => {
    const res = await api.delete(`/employees/upload/${id}`);
    return res.data;
};
// ===== labor law (API service) =====
export const createEpmLaborLawsApi = async (id, formData) => {
    const res = await api.post(`/employees/laborLaw/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const getEpmUploadLaborLawApi = async (employeeId) => {
    const res = await api.get(`/employees/laborLaw/${employeeId}`);
    return res.data;
};

export const deleteEpmLaborLawApi = async (id) => {
    const res = await api.delete(`/employees/laborLaw/${id}`);
    return res.data;
};

// Books
export const getEpmBooksApi = async (employeeId) => {
    const res = await api.get(`/employees/book/${employeeId}`);
    return res.data;
};

export const getEpmHealthBooksApi = async (employeeId) => {
    const res = await api.get(`/employees/healthBook/${employeeId}`);
    return res.data;
};
export const getEpmBodyBooksApi = async (employeeId) => {
    const res = await api.get(`/employees/bodyBook/${employeeId}`);

    return res.data;
};

export const createEpmBookApi = async (id, formData) => {

    const res = await api.post(`/employees/book/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const deleteEpmBookApi = async (id) => {
    const res = await api.delete(`/employees/book/${id}`);
    return res.data;
};
export const deleteEpmHealthBookApi = async (id) => {
    const res = await api.delete(`/employees/healthBook/${id}`);
    return res.data;
};
export const deleteEpmBodyBookApi = async (id) => {
    const res = await api.delete(`/employees/bodyBook/${id}`);
    return res.data;
};
// Language
export const getLanguagesApi = async () => {
    const res = await api.get(`/employees/language`);
    return res.data;
};

export const getLanguageApi = async (id) => {
    const res = await api.get(`/employees/language/${id}`);
    return res.data;
};

export const updateLanguageApi = async (id, formData) => {
    const res = await api.put(`/employees/language/${id}`, formData);
    return res.data;
};
export const createLanguageApi = async (userData) => {
    const res = await api.post(`/employees/language/`, userData);
    return res.data;
};

// ===== NSSF (API service) =====
export const createEpmNssfApi = async (id, formData) => {
    const res = await api.post(`/employees/nssf/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const getEpmUploadNssfApi = async (employeeId) => {
    const res = await api.get(`/employees/nssf/${employeeId}`);
    return res.data;
};

export const deleteEpmNssfApi = async (id) => {
    const res = await api.delete(`/employees/nssf/${id}`);
    return res.data;
};

export const getEpmUploadNssfDocApi = async (employeeId) => {
    const res = await api.get(`/employees/nssf/doc/${employeeId}`);
    return res.data;
};

export const deleteEpmNssfDocApi = async (id) => {
    const res = await api.delete(`/employees/nssf/doc/${id}`);
    return res.data;
};

// position

export const createEpmPositionApi = async (id, formData) => {
    const res = await api.post(`/employees/position/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const updateEpmPositionApi = async (id, formData) => {
    const res = await api.put(`/employees/position/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};


export const getEpmPositionsApi = async (employeeId) => {
    const res = await api.get(`/employees/position/${employeeId}`);
    return res.data;
};