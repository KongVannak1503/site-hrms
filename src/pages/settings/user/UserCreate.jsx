import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { getRolesApi } from '../../../services/roleApi';
import { createUserApi } from '../../../services/userApi';
import { getEmployeesApi } from '../../../services/employeeApi';

const UserCreate = ({ onCancel, onUserCreated }) => {
    const { content } = useAuth();
    const [roles, setRoles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [form] = Form.useForm();
    useEffect(() => {

        form.resetFields();
        const fetchData = async () => {
            try {
                const resEmployees = await getEmployeesApi();
                setEmployees(resEmployees);
                const resRoles = await getRolesApi();
                setRoles(resRoles);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [content]);

    const handleFinish = async (values) => {
        try {
            const { username, employeeId, password, email, role, isActive } = values;
            const formData = {
                username,
                employeeId,
                password,
                email,
                role,
                isActive,
            };

            const response = await createUserApi(formData);
            message.success(content['createSuccessFully']);

            onUserCreated(response.data);
            form.resetFields();
        } catch (error) {
            console.error('Error creating User:', error);
            message.error(content['failedToCreate']);
        }
    };


    return (
        <Form
            form={form}
            onFinish={handleFinish}
            layout="vertical"
            name="userForm"
            autoComplete="off"
            initialValues={{
                isActive: true
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                    name="username"
                    label={content['username']}
                    rules={[{
                        required: true,
                        message: `${content['please']}${content['enter']}${content['username']}`
                            .toLowerCase()
                            .replace(/^./, str => str.toUpperCase())
                    }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label={content['email']}
                    rules={[{
                        required: true,
                        message: `${content['please']}${content['enter']}${content['email']}`
                            .toLowerCase()
                            .replace(/^./, str => str.toUpperCase())
                    }]}
                >
                    <Input />
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        style={{ width: '100%' }}
                        filterOption={(input, option) =>
                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {employees.map((employee) => (
                            <Select.Option key={employee._id || employee.id} value={employee._id}>
                                {`${employee.last_name_kh} ${employee.first_name_kh} `}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                    name="password"
                    label={content['password']}
                    rules={[{
                        required: true,
                        message: `${content['please']}${content['enter']}${content['password']}`
                            .toLowerCase()
                            .replace(/^./, str => str.toUpperCase())
                    }]}
                >
                    <Input type="password" />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: `${content['confirm']}${content['password']}`.toLowerCase()
                                .replace(/^./, str => str.toUpperCase())
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match!'));
                            },
                        }),
                    ]}
                    label={content['confirm']}
                >
                    <Input type="password" />
                </Form.Item>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className='border-yellow-500'>
                    <Form.Item
                        name="role"
                        label={content['role']}
                        rules={[{
                            required: true,
                            message: `${content['selectA']}${content['role']}`
                                .toLowerCase()
                                .replace(/^./, str => str.toUpperCase())
                        }]}
                    >
                        <Select>
                            {roles.map((role) => (
                                <Select.Option key={role._id} value={role._id}>
                                    {role.role}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label={content['status']} name="isActive" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Card>
            </div>

            <div className="text-end mt-3">
                <button type="button" onClick={onCancel} className={Styles.btnCancel}>
                    {content['cancel']}
                </button>
                <button type="submit" className={Styles.btnCreate} >
                    {content['save']}
                </button>
            </div>
        </Form>
    );
};

export default UserCreate;
