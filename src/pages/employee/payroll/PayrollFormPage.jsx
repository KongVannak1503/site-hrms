import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Select } from 'antd';
import { useAuth } from '../../../contexts/AuthContext';
import { getEmployeesApi } from '../../../services/employeeApi';
import { getDepartmentsApi } from '../../../services/departmentApi';
import { typePayrollOptions } from '../../../data/Type';

const PayrollFormPage = ({ Form, form }) => {
    const { content } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        form.resetFields();
        const fetchData = async () => {
            try {
                const resEmployees = await getEmployeesApi();
                setEmployees(resEmployees);

                const resDepartments = await getDepartmentsApi();
                setDepartments(resDepartments);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [content]);

    return (
        <>
            <Form.Item
                name="payDate"
                label={content['date']}
                rules={[{
                    required: true,
                    message: `${content['selectA']}${content['date']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <DatePicker picker="year" style={{ width: '100%' }} />
            </Form.Item>
        </>
    );
};

export default PayrollFormPage;
