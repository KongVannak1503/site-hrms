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
                name="departmentId"
                label={content['department']}
                rules={[{
                    required: true,
                    message: `${content['selectA']}${content['department']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {departments.map((dept) => (
                        <Select.Option key={dept._id} value={dept._id}>
                            {dept.title}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="employeeId"
                label={content['employee']}
                rules={[{
                    required: true,
                    message: `${content['selectA']}${content['employee']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {employees.map((emp) => (
                        <Select.Option key={emp._id} value={emp._id}>
                            {emp.name_kh}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

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
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="status" label={content['type']} rules={[{ required: true, message: `${content['please']}${content['select']}${content['gender']}` }]}>
                <Select>
                    {typePayrollOptions.map(option => (
                        <Select.Option key={option.name_kh} value={option.id}>
                            {option.name_kh}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </>
    );
};

export default PayrollFormPage;
