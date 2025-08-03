import React, { useEffect, useState } from 'react';
import { Form, Select, message } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { assignDepartmentApi, getDepartmentApi } from '../../../services/departmentApi';
import { getEmployeesApi } from '../../../services/employeeApi';

const DepartmentAssigneePage = ({ dataId, onCancel, onUserUpdated }) => {
    const { content } = useAuth();
    const [form] = Form.useForm();
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const resEmployees = await getEmployeesApi();
                setEmployees(resEmployees);

                const response = await getDepartmentApi(dataId);

                form.setFieldsValue({
                    manager: response.manager || []
                });
            } catch (error) {
                console.error("Error fetching department:", error);
                message.error("Failed to load department data");
            }
        };
        fetchInitialData();
    }, [dataId, content]);

    const handleFinish = async (values) => {
        try {
            const formData = {
                manager: values.manager
            };

            const response = await assignDepartmentApi(dataId, formData);
            message.success('Updated successfully!');
            onUserUpdated(response.data);
        } catch (error) {
            console.error('Error updating Department:', error);
            message.error('Failed to update Department');
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleFinish}
            layout="vertical"
            autoComplete="off"
        >
            {/* Manager Multi-Select */}
            <Form.Item
                name="manager"
                label={content['manager']}
                rules={[{
                    required: true,
                    message: `${content['selectA']}${content['manager']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    filterOption={(input, option) =>
                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {employees.map((employee) => (
                        <Select.Option key={employee._id} value={employee._id}>
                            {`${employee.last_name_kh} ${employee.first_name_kh}`}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            {/* Employee Multi-Select */}


            <div className="text-end mt-3">
                <button type="button" onClick={onCancel} className={Styles.btnCancel}>
                    Cancel
                </button>
                <button type="submit" className={Styles.btnUpdate}>
                    Update
                </button>
            </div>
        </Form>
    );
};

export default DepartmentAssigneePage;
